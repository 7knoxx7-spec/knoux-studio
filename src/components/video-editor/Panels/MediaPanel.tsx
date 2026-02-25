'use client';

import { useMemo, useState } from 'react';
import { Film, Image as ImageIcon, Music, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  duration?: number;
}

const library: MediaItem[] = [
  { id: 'm1', name: 'clip-001.mp4', type: 'video', duration: 12.4 },
  { id: 'm2', name: 'bg-track.wav', type: 'audio', duration: 92 },
  { id: 'm3', name: 'cover.png', type: 'image' },
];

export function MediaPanel() {
  const [tab, setTab] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => library.filter((m) => (tab === 'all' || m.type === tab) && m.name.toLowerCase().includes(query.toLowerCase())),
    [query, tab]
  );

  return (
    <div className='space-y-4'>
      <Card className='border-border/50 bg-card/50'>
        <CardContent className='p-4 space-y-3'>
          <Button className='w-full gap-2 bg-[#D4AF37] text-[#2c1810] hover:bg-[#FDB931]'><Upload className='h-4 w-4' />رفع وسائط</Button>
          <div className='relative'>
            <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='ابحث في المكتبة...' className='pr-9' />
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='all'>الكل</TabsTrigger>
          <TabsTrigger value='video'>فيديو</TabsTrigger>
          <TabsTrigger value='image'>صور</TabsTrigger>
          <TabsTrigger value='audio'>صوت</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className='mt-3 space-y-2'>
          {filtered.map((item) => (
            <Card key={item.id} className='hover:border-primary/40'>
              <CardContent className='flex items-center gap-3 p-3'>
                {item.type === 'video' ? <Film className='h-4 w-4 text-primary' /> : item.type === 'audio' ? <Music className='h-4 w-4 text-primary' /> : <ImageIcon className='h-4 w-4 text-primary' />}
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm'>{item.name}</p>
                  {item.duration !== undefined && <p className='text-xs text-muted-foreground'>{item.duration.toFixed(1)}s</p>}
                </div>
                <Button size='sm' variant='outline'>إضافة</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MediaPanel;
