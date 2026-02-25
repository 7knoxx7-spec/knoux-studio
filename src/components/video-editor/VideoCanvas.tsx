'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Play } from 'lucide-react';
import VideoEngine from './VideoEngine';
import { cn } from '@/lib/utils';

interface VideoCanvasProps {
  engine: VideoEngine | null;
  width?: number;
  height?: number;
  className?: string;
  onTimeUpdate?: (time: number) => void;
}

export interface VideoCanvasRef {
  captureFrame: () => string;
  getCanvas: () => HTMLCanvasElement | null;
}

export const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
  ({ engine, width = 1920, height = 1080, className, onTimeUpdate }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!engine || !canvasRef.current) return;
      engine.attachCanvas(canvasRef.current);
      engine.on('stateChange', (state) => {
        const s = state as { currentTime: number };
        onTimeUpdate?.(s.currentTime);
      });
      return () => engine.dispose();
    }, [engine, onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      captureFrame: () => (canvasRef.current ? canvasRef.current.toDataURL('image/jpeg', 0.9) : ''),
      getCanvas: () => canvasRef.current,
    }));

    const isPlaying = engine?.getState().isPlaying;

    return (
      <div className={cn('relative flex items-center justify-center overflow-hidden rounded-lg bg-[#0a0a0a]', className)}>
        <canvas ref={canvasRef} width={width} height={height} className='max-h-full max-w-full object-contain' style={{ width: '100%', height: '100%' }} />
        {!isPlaying && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
              <Play className='h-10 w-10 text-white' />
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoCanvas.displayName = 'VideoCanvas';

export default VideoCanvas;
