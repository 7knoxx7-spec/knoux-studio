'use client';

import { useMemo, useState } from 'react';
import { Music, Play, Plus, Search, Sparkles, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AudioEffect {
  id: string;
  name: string;
  nameAr: string;
  category: 'transition' | 'whoosh' | 'impact' | 'ambient' | 'cinematic' | 'glitch';
  icon: string;
  duration: number;
  tags: string[];
}

interface AudioEffectInstance {
  effectId: string;
  startTime: number;
  volume: number;
}

interface AudioEffectsPanelProps {
  currentTime: number;
  onAddToTimeline: (effect: AudioEffectInstance) => void;
}

const allAudioEffects: AudioEffect[] = [
  { id: 'whoosh-fast', name: 'Fast Whoosh', nameAr: 'Whoosh سريع', category: 'whoosh', icon: '💨', duration: 0.8, tags: ['transition'] },
  { id: 'impact-heavy', name: 'Heavy Impact', nameAr: 'Impact ثقيل', category: 'impact', icon: '💥', duration: 0.5, tags: ['hit'] },
  { id: 'ambient-rain', name: 'Rain', nameAr: 'مطر', category: 'ambient', icon: '🌧️', duration: 10, tags: ['nature'] },
  { id: 'cinematic-boom', name: 'Cinematic Boom', nameAr: 'Boom سينمائي', category: 'cinematic', icon: '🎬', duration: 2, tags: ['cinematic'] },
  { id: 'glitch-digital', name: 'Digital Glitch', nameAr: 'Glitch رقمي', category: 'glitch', icon: '📟', duration: 1, tags: ['digital'] },
];

export function AudioEffectsPanel({ currentTime, onAddToTimeline }: AudioEffectsPanelProps) {
  const [tab, setTab] = useState('effects');
  const [search, setSearch] = useState('');
  const [volume, setVolume] = useState(70);
  const [timelineEffects, setTimelineEffects] = useState<AudioEffectInstance[]>([]);

  const filtered = useMemo(
    () => allAudioEffects.filter((e) => e.nameAr.includes(search) || e.name.includes(search) || e.tags.some((t) => t.includes(search))),
    [search]
  );

  return (
    <div className='space-y-4'>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='effects'>المؤثرات</TabsTrigger>
          <TabsTrigger value='timeline'>الجدول الزمني</TabsTrigger>
        </TabsList>

        <TabsContent value='effects' className='mt-4 space-y-4'>
          <div className='relative'>
            <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='ابحث عن تأثير صوتي...' className='pr-9' />
          </div>

          <div className='flex items-center gap-2'>
            <Volume2 className='h-4 w-4 text-muted-foreground' />
            <Slider value={[volume]} min={0} max={100} step={1} onValueChange={(v) => setVolume(v[0])} className='flex-1' />
          </div>

          <div className='space-y-2'>
            {filtered.map((effect) => (
              <Card key={effect.id} className='border-border hover:border-primary/40'>
                <CardContent className='flex items-center gap-3 p-3'>
                  <button className='rounded-full bg-primary/10 p-2'>
                    <Play className='h-4 w-4 text-primary' />
                  </button>
                  <span className='text-lg'>{effect.icon}</span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{effect.nameAr}</p>
                    <div className='mt-1 flex gap-1'>
                      <Badge variant='secondary' className='text-[10px]'>{effect.duration.toFixed(1)}s</Badge>
                      <Badge variant='outline' className='text-[10px]'>{effect.category}</Badge>
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => {
                      const instance = { effectId: effect.id, startTime: currentTime, volume: volume / 100 };
                      setTimelineEffects((prev) => [...prev, instance]);
                      onAddToTimeline(instance);
                    }}
                    className='gap-1'
                  >
                    <Plus className='h-3 w-3' />
                    إضافة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='timeline' className='mt-4 space-y-2'>
          {timelineEffects.length === 0 ? (
            <div className='rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground'>
              <Music className='mx-auto mb-2 h-6 w-6 opacity-60' />
              لا توجد تأثيرات صوتية في الجدول الزمني
            </div>
          ) : (
            timelineEffects.map((item, i) => (
              <Card key={`${item.effectId}-${i}`}>
                <CardContent className='flex items-center justify-between p-3 text-sm'>
                  <span>{item.effectId}</span>
                  <span className='text-muted-foreground'>{item.startTime.toFixed(2)}s</span>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Card className='border-primary/20 bg-primary/5'>
        <CardContent className='p-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-4 w-4 text-primary' />
            يدعم السحب والإفلات وإعدادات مسبقة للمؤثرات الصوتية.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AudioEffectsPanel;
