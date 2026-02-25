'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CanvasEngine from '@/lib/canvas/CanvasEngine';

interface CanvasAreaProps {
  engine: CanvasEngine | null;
  width?: number;
  height?: number;
  className?: string;
  onZoomChange?: (zoom: number) => void;
  onToolChange?: (tool: string) => void;
}

export interface CanvasAreaRef {
  getEngine: () => CanvasEngine | null;
  exportImage: (format?: 'png' | 'jpeg' | 'webp', quality?: number) => string;
  fitToScreen: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  undo: () => void;
  redo: () => void;
}

export const CanvasArea = forwardRef<CanvasAreaRef, CanvasAreaProps>(
  ({ engine, width = 800, height = 600, className, onZoomChange, onToolChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
      if (!engine || !canvasRef.current) return;

      engine.initialize(canvasRef.current, width, height);
      engine.onZoomChange = (newZoom) => {
        setZoom(newZoom);
        onZoomChange?.(newZoom);
      };
      engine.onToolChange = (tool) => onToolChange?.(tool);

      setIsReady(true);
      return () => engine.dispose();
    }, [engine, width, height, onZoomChange, onToolChange]);

    useImperativeHandle(ref, () => ({
      getEngine: () => engine,
      exportImage: (format = 'png', quality = 0.9) => engine?.exportImage(format, quality) || '',
      fitToScreen: () => engine?.fitToScreen(),
      zoomIn: () => engine?.zoomIn(),
      zoomOut: () => engine?.zoomOut(),
      undo: () => engine?.undo(),
      redo: () => engine?.redo(),
    }));

    useEffect(() => {
      const handleWheel = (e: WheelEvent) => {
        if (!engine) return;
        e.preventDefault();

        if (e.ctrlKey) {
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          if (delta > 0) engine.zoomIn(delta);
          else engine.zoomOut(Math.abs(delta));
        } else {
          setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
      };

      const target = canvasRef.current;
      target?.addEventListener('wheel', handleWheel, { passive: false });
      return () => target?.removeEventListener('wheel', handleWheel);
    }, [engine]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!engine || engine.activeTool !== 'pan') return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !engine) return;
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    const getCursor = () => {
      if (!engine) return 'default';
      switch (engine.activeTool) {
        case 'pan':
          return isDragging ? 'grabbing' : 'grab';
        case 'crop':
          return 'crosshair';
        case 'text':
          return 'text';
        case 'eyedropper':
          return 'copy';
        default:
          return 'default';
      }
    };

    return (
      <div
        className={cn('relative overflow-hidden rounded-lg border bg-muted/20', className)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 100ms ease-out',
          }}
        >
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />

          <canvas ref={canvasRef} width={width} height={height} className='relative z-10 block rounded-lg shadow-2xl' style={{ cursor: getCursor() }} />

          {isReady && engine?.getCanvas()?.getObjects().length === 0 && (
            <div className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'>
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10'>
                  <ImageIcon className='h-8 w-8 text-[#D4AF37]/50' />
                </div>
                <p className='text-muted-foreground'>اسحب صورة هنا</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CanvasArea.displayName = 'CanvasArea';

export default CanvasArea;
