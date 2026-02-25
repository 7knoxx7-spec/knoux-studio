'use client';

import { useEffect, useState } from 'react';
import { Mic, MicOff, Music, Pause, Play, Plus, SkipBack, SkipForward, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioTrack {
  id: string;
  name: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  pan: number;
  eq: { bass: number; mid: number; treble: number };
}

export function AudioPanel() {
  const [tracks, setTracks] = useState<AudioTrack[]>([
    { id: 'track1', name: 'مسار 1', volume: 0.8, muted: false, solo: false, pan: 0, eq: { bass: 0, mid: 0, treble: 0 } },
    { id: 'track2', name: 'مسار 2', volume: 0.6, muted: false, solo: false, pan: 0, eq: { bass: 0, mid: 0, treble: 0 } },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0);
  const [duration] = useState(180);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    setWaveformData(Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2));
  }, []);

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className='space-y-4'>
      <Card className='border-border/50 bg-card/50'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-center gap-2'>
            <Button variant='ghost' size='icon' className='h-8 w-8'><SkipBack className='h-4 w-4' /></Button>
            <Button variant='default' size='icon' className='h-10 w-10 bg-[#D4AF37] text-[#2c1810]' onClick={() => setIsPlaying((p) => !p)}>
              {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
            </Button>
            <Button variant='ghost' size='icon' className='h-8 w-8'><SkipForward className='h-4 w-4' /></Button>
          </div>
          <div className='mt-2 text-center font-mono text-sm'>{formatTime(currentTime)} / {formatTime(duration)}</div>
        </CardContent>
      </Card>

      <Card className='border-border/50 bg-card/50'>
        <CardContent className='p-4'>
          <div className='mb-2 flex items-center gap-2'><BarChart3 className='h-4 w-4 text-[#D4AF37]' /><h4 className='text-xs font-medium'>الموجة الصوتية</h4></div>
          <div className='flex h-16 items-center gap-px'>
            {waveformData.map((value, i) => (
              <div key={i} className='flex-1 rounded-t bg-gradient-to-t from-[#D4AF37]/30 to-[#D4AF37]' style={{ height: `${value * 100}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>

      {tracks.map((track) => (
        <Card key={track.id} className='border-border/50 bg-card/50'>
          <CardContent className='space-y-3 p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'><Music className='h-4 w-4 text-[#D4AF37]' /><span className='text-sm font-medium'>{track.name}</span></div>
              <div className='flex items-center gap-1'>
                <button onClick={() => setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, muted: !t.muted } : t)))} className={cn('rounded p-1', track.muted ? 'bg-red-500/20 text-red-500' : 'hover:bg-muted')}>
                  {track.muted ? <MicOff className='h-3 w-3' /> : <Mic className='h-3 w-3' />}
                </button>
                <button onClick={() => setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, solo: !t.solo } : t)))} className={cn('rounded px-2 py-1 text-xs', track.solo ? 'bg-green-500/20 text-green-500' : 'hover:bg-muted')}>
                  Solo
                </button>
              </div>
            </div>

            <div>
              <div className='mb-1 flex items-center justify-between'><label className='text-xs text-muted-foreground'>مستوى الصوت</label><span className='font-mono text-xs'>{Math.round(track.volume * 100)}%</span></div>
              <Slider value={[track.volume * 100]} min={0} max={100} step={1} onValueChange={(v) => setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, volume: v[0] / 100 } : t)))} />
            </div>
            <div>
              <div className='mb-1 flex items-center justify-between'><label className='text-xs text-muted-foreground'>الاتجاه</label><span className='font-mono text-xs'>{track.pan > 0 ? 'يمين' : track.pan < 0 ? 'يسار' : 'وسط'}</span></div>
              <Slider value={[track.pan + 100]} min={0} max={200} step={1} onValueChange={(v) => setTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, pan: v[0] - 100 } : t)))} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant='outline' className='w-full gap-2'><Plus className='h-4 w-4' />إضافة مسار صوتي</Button>
    </div>
  );
}

export default AudioPanel;
