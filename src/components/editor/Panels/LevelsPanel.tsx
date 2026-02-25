'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface LevelsState {
  shadows: number;
  midtones: number;
  highlights: number;
  outputShadows: number;
  outputHighlights: number;
}

export function LevelsPanel() {
  const histogramRef = useRef<HTMLCanvasElement>(null);
  const [levels, setLevels] = useState<LevelsState>({ shadows: 0, midtones: 1.0, highlights: 255, outputShadows: 0, outputHighlights: 255 });
  const [histogram, setHistogram] = useState<number[]>([]);

  useEffect(() => {
    const data = Array.from({ length: 256 }, (_, i) => Math.exp(-Math.pow((i - 128) / 40, 2)) * 100 + Math.random() * 20);
    setHistogram(data);
  }, []);

  useEffect(() => {
    const canvas = histogramRef.current;
    if (!canvas || histogram.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    const max = Math.max(...histogram);
    const barWidth = width / histogram.length;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';

    histogram.forEach((value, i) => {
      const barHeight = (value / max) * height;
      ctx.fillRect(i * barWidth, height - barHeight, Math.max(1, barWidth - 1), barHeight);
    });

    const drawMarker = (x: number, color: string) => {
      const pos = (x / 255) * width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawMarker(levels.shadows, '#ef4444');
    drawMarker(levels.midtones * 128, '#22c55e');
    drawMarker(levels.highlights, '#3b82f6');
  }, [histogram, levels]);

  const handleReset = () => {
    setLevels({ shadows: 0, midtones: 1.0, highlights: 255, outputShadows: 0, outputHighlights: 255 });
  };

  return (
    <Card className='border-border/50 bg-card/50'>
      <CardContent className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-sm font-medium'>المستويات</h3>
          <Button variant='ghost' size='sm' onClick={handleReset} className='h-7 px-2'>
            <RotateCcw className='me-1 h-3 w-3' />
            إعادة تعيين
          </Button>
        </div>

        <div className='relative mb-6'>
          <canvas ref={histogramRef} width={256} height={100} className='h-24 w-full rounded-lg' />
          <div className='mt-1 flex justify-between text-[10px] text-muted-foreground'>
            <span>0</span>
            <span>{(levels.midtones * 128).toFixed(0)}</span>
            <span>255</span>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <div className='mb-1 flex justify-between'>
              <label className='text-xs text-muted-foreground'>الظلال</label>
              <span className='text-xs font-mono'>{levels.shadows}</span>
            </div>
            <Slider value={[levels.shadows]} min={0} max={255} step={1} onValueChange={(v) => setLevels({ ...levels, shadows: v[0] })} />
          </div>

          <div>
            <div className='mb-1 flex justify-between'>
              <label className='text-xs text-muted-foreground'>نصفي الألوان</label>
              <span className='text-xs font-mono'>{levels.midtones.toFixed(2)}</span>
            </div>
            <Slider value={[levels.midtones * 100]} min={10} max={200} step={1} onValueChange={(v) => setLevels({ ...levels, midtones: v[0] / 100 })} />
          </div>

          <div>
            <div className='mb-1 flex justify-between'>
              <label className='text-xs text-muted-foreground'>الإضاءات</label>
              <span className='text-xs font-mono'>{levels.highlights}</span>
            </div>
            <Slider value={[levels.highlights]} min={0} max={255} step={1} onValueChange={(v) => setLevels({ ...levels, highlights: v[0] })} />
          </div>
        </div>

        <div className='mt-6 border-t border-border/50 pt-4'>
          <h4 className='mb-3 text-xs font-medium'>مستويات الإخراج</h4>

          <div className='space-y-4'>
            <div>
              <div className='mb-1 flex justify-between'>
                <label className='text-xs text-muted-foreground'>الظلال</label>
                <span className='text-xs font-mono'>{levels.outputShadows}</span>
              </div>
              <Slider value={[levels.outputShadows]} min={0} max={255} step={1} onValueChange={(v) => setLevels({ ...levels, outputShadows: v[0] })} />
            </div>

            <div>
              <div className='mb-1 flex justify-between'>
                <label className='text-xs text-muted-foreground'>الإضاءات</label>
                <span className='text-xs font-mono'>{levels.outputHighlights}</span>
              </div>
              <Slider value={[levels.outputHighlights]} min={0} max={255} step={1} onValueChange={(v) => setLevels({ ...levels, outputHighlights: v[0] })} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LevelsPanel;
