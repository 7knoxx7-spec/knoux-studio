'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Filter {
  id: string;
  name: string;
  category: 'basic' | 'cinematic' | 'artistic' | 'retro';
}

function FilterPreset({ filter, isActive, onClick }: { filter: Filter; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={cn('relative h-16 overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-200 transition-all', isActive ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-background' : 'hover:ring-1 hover:ring-border')}>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-xs font-medium text-gray-800 drop-shadow-md'>{filter.name}</span>
      </div>
    </motion.button>
  );
}

export function FiltersPanel() {
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [activeCategory, setActiveCategory] = useState<'basic' | 'cinematic' | 'artistic' | 'retro'>('basic');

  const filters: Filter[] = [
    { id: 'none', name: 'بدون', category: 'basic' }, { id: 'vintage', name: 'قديم', category: 'basic' }, { id: 'bw', name: 'أبيض وأسود', category: 'basic' }, { id: 'sepia', name: 'سيبيا', category: 'basic' }, { id: 'warm', name: 'دافئ', category: 'basic' }, { id: 'cool', name: 'بارد', category: 'basic' }, { id: 'dramatic', name: 'درامي', category: 'basic' },
    { id: 'cinematic', name: 'سينمائي', category: 'cinematic' }, { id: 'hollywood', name: 'هوليوود', category: 'cinematic' }, { id: 'teal-orange', name: 'برتقالي-أزرق', category: 'cinematic' },
    { id: 'watercolor', name: 'ألوان مائية', category: 'artistic' }, { id: 'oil', name: 'زيتي', category: 'artistic' }, { id: 'sketch', name: 'رسم', category: 'artistic' },
    { id: '70s', name: 'السبعينات', category: 'retro' }, { id: '80s', name: 'الثمانينات', category: 'retro' }, { id: 'polaroid', name: 'بولارويد', category: 'retro' },
  ];

  const filteredFilters = filters.filter((f) => f.category === activeCategory);

  return (
    <div className='space-y-4'>
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='basic' className='text-xs'>أساسية</TabsTrigger>
          <TabsTrigger value='cinematic' className='text-xs'>سينمائية</TabsTrigger>
          <TabsTrigger value='artistic' className='text-xs'>فنية</TabsTrigger>
          <TabsTrigger value='retro' className='text-xs'>رجعية</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='grid grid-cols-2 gap-2'>
        {filteredFilters.map((filter) => (
          <FilterPreset key={filter.id} filter={filter} isActive={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)} />
        ))}
      </div>

      {activeFilter !== 'none' && (
        <Card className='bg-muted/30'>
          <CardContent className='p-3'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-xs text-muted-foreground'>كثافة</label>
                <span className='text-xs font-mono'>{filterIntensity}%</span>
              </div>
              <Slider value={[filterIntensity]} min={0} max={100} step={1} onValueChange={(v) => setFilterIntensity(v[0])} />
            </div>
          </CardContent>
        </Card>
      )}

      {activeFilter !== 'none' && (
        <Button variant='outline' size='sm' className='w-full' onClick={() => setActiveFilter('none')}>
          إزالة الفلتر
        </Button>
      )}
    </div>
  );
}

export default FiltersPanel;
