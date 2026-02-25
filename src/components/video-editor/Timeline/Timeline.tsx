'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import VideoEngine from '../VideoEngine';
import TimelineControls from './TimelineControls';
import TimelineRuler from './TimelineRuler';
import TimelineTrack from './TimelineTrack';
import { cn } from '@/lib/utils';

interface TimelineProps {
  engine: VideoEngine | null;
  zoom: number;
  onTimeChange: (time: number) => void;
  onSplitClip: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
  className?: string;
}

export function Timeline({ engine, zoom, onTimeChange, onSplitClip, onDeleteClip, className }: TimelineProps) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [tracks, setTracks] = useState<ReturnType<VideoEngine['getState']>['tracks']>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  useEffect(() => {
    if (!engine) return;
    engine.on('stateChange', (state) => {
      const s = state as ReturnType<VideoEngine['getState']>;
      setDuration(s.duration);
      setCurrentTime(s.currentTime);
      setTracks(s.tracks);
      setSelectedClipId(s.selectedClipId);
    });
  }, [engine]);

  const totalWidth = Math.max(400, duration * 100 * zoom);

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <TimelineControls
        zoom={zoom}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onSplit={() => selectedClipId && onSplitClip(selectedClipId)}
        onCopy={() => {}}
        onDelete={() => selectedClipId && onDeleteClip(selectedClipId)}
      />

      <ScrollArea className='flex-1'>
        <div className='relative min-w-full' style={{ width: totalWidth }}>
          <TimelineRuler duration={duration} currentTime={currentTime} zoom={zoom} onSeek={onTimeChange} />
          <div className='space-y-2 p-2'>
            {tracks.map((track) => (
              <TimelineTrack
                key={track.id}
                track={track}
                isSelected={false}
                zoom={zoom}
                duration={duration}
                onSelectClip={(clipId) => setSelectedClipId(clipId)}
                onTrimStart={() => {}}
                onTrimEnd={() => {}}
                onMoveClip={() => {}}
                onSplitClip={onSplitClip}
                onDeleteClip={onDeleteClip}
              />
            ))}

            {tracks.length === 0 && <div className='flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground'>اسحب الوسائط هنا لبدء التحرير</div>}
          </div>
        </div>
      </ScrollArea>

      <div className='border-t border-border p-2 font-mono text-xs text-muted-foreground'>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default Timeline;
