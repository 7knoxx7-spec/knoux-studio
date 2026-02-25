'use client';

import { Copy, Maximize2, Minimize2, Scissors, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSplit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function TimelineControls({ zoom, onZoomIn, onZoomOut, onSplit, onCopy, onDelete }: TimelineControlsProps) {
  return (
    <div className='flex items-center justify-between border-b border-border p-2'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onSplit}><Scissors className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onCopy}><Copy className='h-4 w-4' /></Button>
        <Button variant='ghost' size='icon' className='h-7 w-7 text-red-500' onClick={onDelete}><Trash2 className='h-4 w-4' /></Button>
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onZoomOut}><Minimize2 className='h-4 w-4' /></Button>
        <span className='text-sm text-white'>{Math.round(zoom * 100)}%</span>
        <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onZoomIn}><Maximize2 className='h-4 w-4' /></Button>
      </div>
    </div>
  );
}

export default TimelineControls;
