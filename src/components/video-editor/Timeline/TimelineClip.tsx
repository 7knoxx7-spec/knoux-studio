'use client';

import { useState } from 'react';
import { GripVertical, Image, Music, Scissors, Trash2, Type, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VideoClip } from '../VideoEngine';

interface TimelineClipProps {
  clip: VideoClip;
  isSelected: boolean;
  zoom: number;
  onSelect: () => void;
  onTrimStart: (clipId: string, delta: number) => void;
  onTrimEnd: (clipId: string, delta: number) => void;
  onMove: (clipId: string, deltaX: number, deltaY: number) => void;
  onSplit: (clipId: string) => void;
  onDelete: (clipId: string) => void;
}

export function TimelineClip({ clip, isSelected, zoom, onSelect, onTrimStart, onTrimEnd, onMove, onSplit, onDelete }: TimelineClipProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isTrimmingStart, setIsTrimmingStart] = useState(false);
  const [isTrimmingEnd, setIsTrimmingEnd] = useState(false);

  const Icon = clip.type === 'video' ? Video : clip.type === 'audio' ? Music : clip.type === 'image' ? Image : Type;
  const left = clip.startTime * 100 * zoom;
  const width = Math.max(30, clip.trimmedDuration * 100 * zoom);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    onSelect();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isTrimmingStart && !isTrimmingEnd) return;
    const deltaX = e.clientX - dragStartX;
    if (isTrimmingStart) onTrimStart(clip.id, deltaX);
    else if (isTrimmingEnd) onTrimEnd(clip.id, deltaX);
    else onMove(clip.id, deltaX, 0);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsTrimmingStart(false);
    setIsTrimmingEnd(false);
  };

  return (
    <div
      className={cn('group absolute top-1 h-12 cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/80 to-purple-600/80 transition-all', isSelected && 'ring-2 ring-white/60', isDragging && 'z-50 scale-105 shadow-2xl')}
      style={{ left: `${left}px`, width: `${width}px` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onSelect}
    >
      <div className='flex h-full items-center gap-2 px-2'>
        <GripVertical className='h-4 w-4 text-white/60' />
        <Icon className='h-4 w-4 text-white' />
        <span className='truncate text-xs font-medium text-white'>{clip.name}</span>
      </div>

      {isSelected && (
        <>
          <div className='absolute bottom-0 left-0 top-0 w-2 cursor-ew-resize hover:bg-white/20' onMouseDown={(e) => { e.stopPropagation(); setIsTrimmingStart(true); setDragStartX(e.clientX); }} />
          <div className='absolute bottom-0 right-0 top-0 w-2 cursor-ew-resize hover:bg-white/20' onMouseDown={(e) => { e.stopPropagation(); setIsTrimmingEnd(true); setDragStartX(e.clientX); }} />
        </>
      )}

      <div className='absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
        <button onClick={(e) => { e.stopPropagation(); onSplit(clip.id); }} className='rounded bg-black/50 p-1 hover:bg-black/70'>
          <Scissors className='h-3 w-3 text-white' />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(clip.id); }} className='rounded bg-red-500/50 p-1 hover:bg-red-500/70'>
          <Trash2 className='h-3 w-3 text-white' />
        </button>
      </div>
    </div>
  );
}

export default TimelineClip;
