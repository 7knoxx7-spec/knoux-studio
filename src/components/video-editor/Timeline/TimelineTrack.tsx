'use client';

import { Lock, Unlock, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import TimelineClip from './TimelineClip';
import type { VideoTrack } from '../VideoEngine';

interface TimelineTrackProps {
  track: VideoTrack;
  isSelected: boolean;
  zoom: number;
  duration: number;
  onSelectClip: (clipId: string) => void;
  onTrimStart: (clipId: string, delta: number) => void;
  onTrimEnd: (clipId: string, delta: number) => void;
  onMoveClip: (clipId: string, deltaX: number, deltaY: number) => void;
  onSplitClip: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
  onToggleMute?: () => void;
  onToggleLock?: () => void;
}

export function TimelineTrack({ track, isSelected, zoom, onSelectClip, onTrimStart, onTrimEnd, onMoveClip, onSplitClip, onDeleteClip, onToggleMute, onToggleLock }: TimelineTrackProps) {
  return (
    <div className={cn('group relative h-14 rounded-lg border transition-colors', isSelected && 'ring-1 ring-primary', track.type === 'audio' ? 'border-green-500/30 bg-green-500/5' : 'border-purple-500/30 bg-purple-500/5')}>
      <div className='absolute bottom-0 left-0 top-0 z-20 flex w-16 flex-col items-center justify-center gap-1 rounded-l-lg border-r border-border bg-muted/50'>
        <span className='text-[10px] text-muted-foreground'>{track.name}</span>
        <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          {track.type === 'audio' && (
            <button onClick={onToggleMute} className='rounded p-0.5 hover:bg-muted'>
              {track.muted ? <VolumeX className='h-3 w-3' /> : <Volume2 className='h-3 w-3' />}
            </button>
          )}
          <button onClick={onToggleLock} className='rounded p-0.5 hover:bg-muted'>
            {track.locked ? <Lock className='h-3 w-3' /> : <Unlock className='h-3 w-3' />}
          </button>
        </div>
      </div>

      <div className='relative ml-16 h-full'>
        {track.clips.map((clip) => (
          <TimelineClip
            key={clip.id}
            clip={clip}
            isSelected={false}
            zoom={zoom}
            onSelect={() => onSelectClip(clip.id)}
            onTrimStart={onTrimStart}
            onTrimEnd={onTrimEnd}
            onMove={onMoveClip}
            onSplit={onSplitClip}
            onDelete={onDeleteClip}
          />
        ))}
      </div>
    </div>
  );
}

export default TimelineTrack;
