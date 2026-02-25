'use client';

import { useEffect, useRef } from 'react';

interface TimelineRulerProps {
  duration: number;
  currentTime: number;
  zoom: number;
  onSeek: (time: number) => void;
}

export function TimelineRuler({ duration, currentTime, zoom, onSeek }: TimelineRulerProps) {
  const rulerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = Math.max(1, duration * 100 * zoom);
    canvas.width = width;
    canvas.height = 30;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, 30);
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const step = Math.max(1, Math.floor(5 / zoom));
    const subStep = step / 5;

    for (let t = 0; t <= duration; t += subStep) {
      const x = t * 100 * zoom;
      if (Math.round(t * 1000) % Math.round(step * 1000) === 0) {
        ctx.strokeStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 30);
        ctx.stroke();
        ctx.fillStyle = '#888';
        ctx.fillText(formatTime(t), x, 17);
      } else {
        ctx.strokeStyle = '#444';
        ctx.beginPath();
        ctx.moveTo(x, 25);
        ctx.lineTo(x, 30);
        ctx.stroke();
      }
    }
  }, [duration, zoom]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + rulerRef.current.scrollLeft;
    const time = x / (100 * zoom);
    onSeek(Math.max(0, Math.min(time, duration)));
  };

  return (
    <div ref={rulerRef} className='relative h-8 overflow-x-auto overflow-y-hidden border-b border-border' onClick={handleClick}>
      <canvas ref={canvasRef} style={{ height: '30px', width: `${duration * 100 * zoom}px` }} />
      <div className='pointer-events-none absolute bottom-0 top-0 z-10 w-0.5 bg-[#D4AF37]' style={{ left: `${currentTime * 100 * zoom}px` }}>
        <div className='absolute -left-[5px] -top-1 h-3 w-3 rounded-full bg-[#D4AF37]' />
      </div>
    </div>
  );
}

export default TimelineRuler;
