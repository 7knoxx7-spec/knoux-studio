import { fabric } from 'fabric';

export interface CanvasObject {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  data: fabric.Object;
}

export type AdjustmentValues = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  vibrance: number;
  temperature: number;
  tint: number;
  sharpness: number;
  noise: number;
  vignette: number;
};

export type FilterType = 'none' | 'vintage' | 'bw' | 'sepia' | 'warm' | 'cool' | 'dramatic' | 'fade' | 'vivid' | 'matte';

export type ToolType =
  | 'select' | 'move' | 'crop' | 'rotate' | 'brush' | 'eraser' | 'clone' | 'heal'
  | 'text' | 'shape' | 'gradient' | 'eyedropper' | 'zoom' | 'pan';

export interface ShapeOptions {
  type: 'rect' | 'circle' | 'triangle' | 'line';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  width?: number;
  height?: number;
}

export interface TextOptions {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  charSpacing?: number;
}

export class CanvasEngine {
  private canvas: fabric.Canvas | null = null;
  private history: string[] = [];
  private historyIndex = -1;
  private readonly maxHistorySize = 50;

  public adjustments: AdjustmentValues = {
    brightness: 0, contrast: 0, saturation: 0, hue: 0,
    exposure: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0,
    clarity: 0, vibrance: 0, temperature: 0, tint: 0,
    sharpness: 0, noise: 0, vignette: 0,
  };

  public activeFilter: FilterType = 'none';
  public activeTool: ToolType = 'select';
  public zoom = 1;
  public primaryColor = '#000000';
  public brushSize = 5;
  public brushOpacity = 1;

  public onSelectionChange: ((objects: fabric.Object[]) => void) | null = null;
  public onObjectsChange: ((objects: CanvasObject[]) => void) | null = null;
  public onHistoryChange: ((canUndo: boolean, canRedo: boolean) => void) | null = null;
  public onZoomChange: ((zoom: number) => void) | null = null;
  public onToolChange: ((tool: ToolType) => void) | null = null;

  initialize(canvasElement: HTMLCanvasElement, width = 800, height = 600): fabric.Canvas {
    this.canvas = new fabric.Canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      renderOnAddRemove: true,
      imageSmoothingEnabled: true,
      allowTouchScrolling: true,
      stopContextMenu: true,
    });

    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = this.brushSize;
    this.canvas.freeDrawingBrush.color = this.primaryColor;

    this.setupEvents();
    this.saveToHistory();

    return this.canvas;
  }

  private setupEvents() {
    if (!this.canvas) return;

    this.canvas.on('selection:created', () => this.onSelectionChange?.(this.canvas?.getActiveObjects() || []));
    this.canvas.on('selection:updated', () => this.onSelectionChange?.(this.canvas?.getActiveObjects() || []));
    this.canvas.on('selection:cleared', () => this.onSelectionChange?.([]));

    this.canvas.on('object:added', () => this.updateObjects());
    this.canvas.on('object:removed', () => this.updateObjects());
    this.canvas.on('object:modified', () => {
      this.updateObjects();
      this.saveToHistory();
    });
  }

  private updateObjects() {
    if (!this.canvas) return;

    const objects = this.canvas.getObjects().map((obj: fabric.Object) => {
      const anyObj = obj as fabric.Object & { id?: string; name?: string };
      const id = anyObj.id || `obj-${Date.now()}-${Math.random()}`;
      anyObj.id = id;

      return {
        id,
        type: obj.type || 'object',
        name: anyObj.name || `${obj.type || 'Object'} ${Math.round(obj.left || 0)},${Math.round(obj.top || 0)}`,
        visible: obj.visible ?? true,
        locked: !!(obj.lockMovementX && obj.lockMovementY),
        opacity: obj.opacity || 1,
        data: obj,
      };
    });

    this.onObjectsChange?.(objects);
  }

  loadImage(url: string | File): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canvas) return reject(new Error('Canvas not initialized'));

      const loadImageFromUrl = (imageUrl: string) => {
        fabric.Image.fromURL(
          imageUrl,
          (img: fabric.Image | null) => {
            if (!img || !this.canvas) return reject(new Error('Failed to load image'));

            const canvasWidth = this.canvas.width || 800;
            const canvasHeight = this.canvas.height || 600;

            let scale = 1;
            if ((img.width || 0) > canvasWidth || (img.height || 0) > canvasHeight) {
              const scaleX = canvasWidth / (img.width || canvasWidth);
              const scaleY = canvasHeight / (img.height || canvasHeight);
              scale = Math.min(scaleX, scaleY) * 0.9;
            }

            img.scale(scale);
            img.set({
              left: (canvasWidth - (img.width || 0) * scale) / 2,
              top: (canvasHeight - (img.height || 0) * scale) / 2,
              cornerSize: 8,
              transparentCorners: false,
              cornerColor: '#D4AF37',
              cornerStrokeColor: '#ffffff',
              borderColor: '#D4AF37',
            });

            (img as fabric.Image & { id?: string; name?: string }).id = `image-${Date.now()}`;
            (img as fabric.Image & { name?: string }).name = 'Background';

            this.canvas.clear();
            this.canvas.add(img);
            this.canvas.renderAll();
            this.saveToHistory();
            resolve();
          },
          { crossOrigin: 'anonymous' }
        );
      };

      if (typeof url === 'string') {
        loadImageFromUrl(url);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => loadImageFromUrl(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(url);
      }
    });
  }

  exportImage(format: 'png' | 'jpeg' | 'webp' = 'png', quality = 0.9): string {
    if (!this.canvas) return '';
    return this.canvas.toDataURL({ format, quality, multiplier: 1 });
  }

  applyAdjustments(adjustments: Partial<AdjustmentValues>) {
    if (!this.canvas) return;

    this.adjustments = { ...this.adjustments, ...adjustments };

    const activeObject = this.canvas.getActiveObject();
    const targetImage =
      activeObject?.type === 'image'
        ? (activeObject as fabric.Image)
        : (this.canvas.getObjects().find((obj: fabric.Object) => obj.type === 'image') as fabric.Image | undefined);

    if (!targetImage) return;

    const filters: fabric.IBaseFilter[] = [];

    if (this.adjustments.brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: this.adjustments.brightness / 100 }));
    if (this.adjustments.contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast: this.adjustments.contrast / 100 }));
    if (this.adjustments.saturation !== 0) filters.push(new fabric.Image.filters.Saturation({ saturation: this.adjustments.saturation / 100 }));
    if (this.adjustments.hue !== 0) filters.push(new fabric.Image.filters.HueRotation({ rotation: this.adjustments.hue }));
    if (this.adjustments.exposure !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: this.adjustments.exposure / 200 }));

    targetImage.filters = filters as fabric.IBaseFilter[];
    targetImage.applyFilters();
    this.canvas.renderAll();
  }

  applyFilter(filter: FilterType) {
    if (!this.canvas) return;
    this.activeFilter = filter;

    const activeObject = this.canvas.getActiveObject();
    const targetImage =
      activeObject?.type === 'image'
        ? (activeObject as fabric.Image)
        : (this.canvas.getObjects().find((obj: fabric.Object) => obj.type === 'image') as fabric.Image | undefined);

    if (!targetImage) return;

    targetImage.filters = [];

    switch (filter) {
      case 'vintage':
        targetImage.filters.push(new fabric.Image.filters.Sepia(), new fabric.Image.filters.Brightness({ brightness: 0.1 }));
        break;
      case 'bw':
        targetImage.filters.push(new fabric.Image.filters.Grayscale());
        break;
      case 'sepia':
        targetImage.filters.push(new fabric.Image.filters.Sepia());
        break;
      case 'warm':
        targetImage.filters.push(new fabric.Image.filters.HueRotation({ rotation: 15 }), new fabric.Image.filters.Saturation({ saturation: 0.2 }));
        break;
      case 'cool':
        targetImage.filters.push(new fabric.Image.filters.HueRotation({ rotation: -15 }), new fabric.Image.filters.Saturation({ saturation: 0.1 }));
        break;
      case 'dramatic':
        targetImage.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.3 }), new fabric.Image.filters.Saturation({ saturation: 0.2 }));
        break;
      case 'fade':
        targetImage.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.1 }), new fabric.Image.filters.Saturation({ saturation: -0.3 }));
        break;
      case 'vivid':
        targetImage.filters.push(new fabric.Image.filters.Saturation({ saturation: 0.5 }), new fabric.Image.filters.Contrast({ contrast: 0.1 }));
        break;
      case 'matte':
        targetImage.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.05 }), new fabric.Image.filters.Saturation({ saturation: -0.2 }));
        break;
      default:
        break;
    }

    targetImage.applyFilters();
    this.canvas.renderAll();
    this.saveToHistory();
  }

  setActiveTool(tool: ToolType) {
    this.activeTool = tool;
    this.onToolChange?.(tool);
    if (!this.canvas) return;

    this.canvas.isDrawingMode = tool === 'brush' || tool === 'eraser';

    if (tool === 'brush' || tool === 'eraser') {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.width = this.brushSize;
      this.canvas.freeDrawingBrush.color = tool === 'eraser' ? '#ffffff' : this.primaryColor;
    }

    switch (tool) {
      case 'move':
      case 'pan':
        this.canvas.defaultCursor = 'grab';
        break;
      case 'crop':
        this.canvas.defaultCursor = 'crosshair';
        break;
      case 'text':
        this.canvas.defaultCursor = 'text';
        break;
      case 'eyedropper':
        this.canvas.defaultCursor = 'copy';
        break;
      default:
        this.canvas.defaultCursor = 'default';
    }
  }

  setBrushSize(size: number) {
    this.brushSize = size;
    if (this.canvas?.freeDrawingBrush) this.canvas.freeDrawingBrush.width = size;
  }

  setBrushColor(color: string) {
    this.primaryColor = color;
    if (this.canvas?.freeDrawingBrush && this.activeTool === 'brush') {
      this.canvas.freeDrawingBrush.color = color;
    }
  }

  setBrushOpacity(opacity: number) {
    this.brushOpacity = opacity;
    if (this.canvas?.freeDrawingBrush && this.activeTool === 'brush') {
    }
  }

  addText(options: TextOptions) {
    if (!this.canvas) return;

    const text = new fabric.Text(options.text, {
      left: (this.canvas.width || 800) / 2,
      top: (this.canvas.height || 600) / 2,
      fontSize: options.fontSize || 32,
      fontFamily: options.fontFamily || 'Arial',
      fontWeight: options.fontWeight || 'normal',
      fill: options.fill || this.primaryColor,
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
      textAlign: options.textAlign || 'left',
      lineHeight: options.lineHeight || 1.2,
      charSpacing: options.charSpacing || 0,
      originX: 'center',
      originY: 'center',
    });

    (text as fabric.Text & { id?: string; name?: string }).id = `text-${Date.now()}`;
    (text as fabric.Text & { name?: string }).name = `Text`;

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
    this.saveToHistory();
  }

  addShape(options: ShapeOptions) {
    if (!this.canvas) return;

    let shape: fabric.Object;

    switch (options.type) {
      case 'rect':
        shape = new fabric.Rect({ left: (this.canvas.width || 800) / 2, top: (this.canvas.height || 600) / 2, width: options.width || 100, height: options.height || 100, fill: options.fill || this.primaryColor, stroke: options.stroke, strokeWidth: options.strokeWidth, originX: 'center', originY: 'center' });
        break;
      case 'circle':
        shape = new fabric.Circle({ left: (this.canvas.width || 800) / 2, top: (this.canvas.height || 600) / 2, radius: options.radius || 50, fill: options.fill || this.primaryColor, stroke: options.stroke, strokeWidth: options.strokeWidth, originX: 'center', originY: 'center' });
        break;
      case 'triangle':
        shape = new fabric.Triangle({ left: (this.canvas.width || 800) / 2, top: (this.canvas.height || 600) / 2, width: options.width || 100, height: options.height || 100, fill: options.fill || this.primaryColor, stroke: options.stroke, strokeWidth: options.strokeWidth, originX: 'center', originY: 'center' });
        break;
      case 'line':
        shape = new fabric.Line([50, 50, 200, 200], { stroke: options.stroke || this.primaryColor, strokeWidth: options.strokeWidth || 2 });
        break;
      default:
        return;
    }

    (shape as fabric.Object & { id?: string; name?: string }).id = `shape-${Date.now()}`;
    (shape as fabric.Object & { name?: string }).name = options.type;

    this.canvas.add(shape);
    this.canvas.setActiveObject(shape);
    this.canvas.renderAll();
    this.saveToHistory();
  }

  setZoom(zoom: number) {
    this.zoom = Math.max(0.1, Math.min(10, zoom));
    this.onZoomChange?.(this.zoom);
  }
  zoomIn(step = 0.1) { this.setZoom(this.zoom + step); }
  zoomOut(step = 0.1) { this.setZoom(this.zoom - step); }
  fitToScreen() { this.setZoom(1); }

  rotate(angle: number) {
    if (!this.canvas) return;
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.rotate((activeObject.angle || 0) + angle);
    this.canvas.renderAll();
    this.saveToHistory();
  }

  flipHorizontal() {
    if (!this.canvas) return;
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.set('flipX', !activeObject.flipX);
    this.canvas.renderAll();
    this.saveToHistory();
  }

  flipVertical() {
    if (!this.canvas) return;
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.set('flipY', !activeObject.flipY);
    this.canvas.renderAll();
    this.saveToHistory();
  }

  saveToHistory() {
    if (!this.canvas) return;

    const state = JSON.stringify(this.canvas.toJSON());
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(state);
    this.historyIndex++;

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.historyIndex--;
    }

    this.onHistoryChange?.(this.canUndo(), this.canRedo());
  }

  canUndo() { return this.historyIndex > 0; }
  canRedo() { return this.historyIndex < this.history.length - 1; }

  undo() {
    if (!this.canvas || !this.canUndo()) return;
    this.historyIndex--;
    const state = JSON.parse(this.history[this.historyIndex]);
    this.canvas.loadFromJSON(state, () => {
      this.canvas?.renderAll();
      this.updateObjects();
      this.onHistoryChange?.(this.canUndo(), this.canRedo());
    });
  }

  redo() {
    if (!this.canvas || !this.canRedo()) return;
    this.historyIndex++;
    const state = JSON.parse(this.history[this.historyIndex]);
    this.canvas.loadFromJSON(state, () => {
      this.canvas?.renderAll();
      this.updateObjects();
      this.onHistoryChange?.(this.canUndo(), this.canRedo());
    });
  }

  clearHistory() {
    this.history = [];
    this.historyIndex = -1;
    this.saveToHistory();
  }

  getCanvas() { return this.canvas; }

  resize(width: number, height: number) {
    if (!this.canvas) return;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }

  dispose() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
  }
}

export default CanvasEngine;
