'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CurvePoint { x: number; y: number }
interface CurveChannel { points: CurvePoint[]; color: string; visible: boolean }

export function CurvesPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeChannel, setActiveChannel] = useState<'rgb' | 'red' | 'green' | 'blue'>('rgb');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [curves, setCurves] = useState<Record<'rgb' | 'red' | 'green' | 'blue', CurveChannel>>({
    rgb: { points: [{ x: 0, y: 0 }, { x: 64, y: 64 }, { x: 128, y: 128 }, { x: 192, y: 192 }, { x: 255, y: 255 }], color: '#ffffff', visible: true },
    red: { points: [{ x: 0, y: 0 }, { x: 255, y: 255 }], color: '#ef4444', visible: false },
    green: { points: [{ x: 0, y: 0 }, { x: 255, y: 255 }], color: '#22c55e', visible: false },
    blue: { points: [{ x: 0, y: 0 }, { x: 255, y: 255 }], color: '#3b82f6', visible: false },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i <= 4; i++) {
      const x = (i / 4) * width;
      const y = (i / 4) * height;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, height); ctx.lineTo(width, 0); ctx.stroke();
    ctx.setLineDash([]);

    const drawCurve = (channel: CurveChannel) => {
      if (!channel.visible) return;
      const points = [...channel.points].sort((a, b) => a.x - b.x);
      const canvasPoints = points.map((p) => ({ x: (p.x / 255) * width, y: height - (p.y / 255) * height }));

      ctx.strokeStyle = channel.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
      for (let i = 1; i < canvasPoints.length; i++) {
        const xc = (canvasPoints[i].x + canvasPoints[i - 1].x) / 2;
        const yc = (canvasPoints[i].y + canvasPoints[i - 1].y) / 2;
        ctx.quadraticCurveTo(canvasPoints[i - 1].x, canvasPoints[i - 1].y, xc, yc);
      }
      ctx.stroke();

      canvasPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = channel.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    };

    if (activeChannel === 'rgb') {
      drawCurve(curves.red);
      drawCurve(curves.green);
      drawCurve(curves.blue);
    }
    drawCurve(curves[activeChannel]);
  }, [curves, activeChannel]);

  const getMousePoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 255;
    const y = 255 - ((e.clientY - rect.top) / rect.height) * 255;
    return { x: Math.max(0, Math.min(255, x)), y: Math.max(0, Math.min(255, y)) };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return;
    const { x, y } = getMousePoint(e);
    setCurves((prev) => ({
      ...prev,
      [activeChannel]: {
        ...prev[activeChannel],
        points: [...prev[activeChannel].points, { x, y }].sort((a, b) => a.x - b.x),
      },
    }));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: mouseX, y: mouseY } = getMousePoint(e);
    const points = curves[activeChannel].points;
    let minDist = 20;
    let selectedIndex = -1;

    points.forEach((point, index) => {
      const dist = Math.hypot(point.x - mouseX, point.y - mouseY);
      if (dist < minDist) {
        minDist = dist;
        selectedIndex = index;
      }
    });

    if (selectedIndex !== -1) {
      setSelectedPoint(selectedIndex);
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedPoint === null) return;
    const { x, y } = getMousePoint(e);

    setCurves((prev) => {
      const nextPoints = [...prev[activeChannel].points];
      nextPoints[selectedPoint] = { x, y };
      nextPoints.sort((a, b) => a.x - b.x);

      return {
        ...prev,
        [activeChannel]: { ...prev[activeChannel], points: nextPoints },
      };
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setSelectedPoint(null);
  };

  const handleReset = () => {
    setCurves({
      rgb: { points: [{ x: 0, y: 0 }, { x: 64, y: 64 }, { x: 128, y: 128 }, { x: 192, y: 192 }, { x: 255, y: 255 }], color: '#ffffff', visible: true },
      red: { points: [{ x: 0, y: 0 }, { x: 255, y: 255 }], color: '#ef4444', visible: false },
      green: { points: [{ x: 0, y: 0 }, { x: 255, y: 255 }], color: '#22c55e', visible: false },
      blue: { points: [{ x: 0, y: 0 }, { x: 255, y: 255 }], color: '#3b82f6', visible: false },
    });
  };

  return (
    <Card className='border-border/50 bg-card/50'>
      <CardContent className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-sm font-medium'>المنحنيات</h3>
          <Button variant='ghost' size='sm' onClick={handleReset} className='h-7 px-2'>
            <RotateCcw className='me-1 h-3 w-3' />
            إعادة تعيين
          </Button>
        </div>

        <div className='mb-4 flex gap-1'>
          {(['rgb', 'red', 'green', 'blue'] as const).map((channel) => (
            <Button
              key={channel}
              variant={activeChannel === channel ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveChannel(channel)}
              className={cn('h-7 px-2 text-xs', activeChannel === channel && channel !== 'rgb' && 'text-white')}
              style={{
                backgroundColor: activeChannel === channel && channel !== 'rgb' ? curves[channel].color : undefined,
                borderColor: activeChannel === channel && channel !== 'rgb' ? curves[channel].color : undefined,
              }}
            >
              {channel.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className='relative aspect-square overflow-hidden rounded-lg bg-black/50'>
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className='h-full w-full cursor-crosshair'
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
        </div>

        <div className='mt-4 flex gap-2'>
          {(['red', 'green', 'blue'] as const).map((channel) => (
            <button
              key={channel}
              onClick={() => setCurves((prev) => ({ ...prev, [channel]: { ...prev[channel], visible: !prev[channel].visible } }))}
              className={cn('h-6 flex-1 rounded text-xs font-medium transition-colors', curves[channel].visible ? 'text-white' : 'bg-muted/30 text-muted-foreground')}
              style={{ backgroundColor: curves[channel].visible ? curves[channel].color : undefined }}
            >
              {channel}
            </button>
          ))}
        </div>

        <Button variant='outline' size='sm' className='mt-4 w-full gap-2'>
          <Sparkles className='h-4 w-4' />
          تلقائي
        </Button>
      </CardContent>
    </Card>
  );
}

export default CurvesPanel;
