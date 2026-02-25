'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, Move, Sparkles, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Transition {
  id: string;
  name: string;
  category: 'basic' | 'cinematic' | 'glitch' | 'creative' | '3d';
  icon: React.ElementType;
  duration: number;
  description: string;
}

const transitions: Transition[] = [
  { id: 'fade', name: 'Fade', category: 'basic', icon: Layers, duration: 1, description: 'تلاشي سلس' },
  { id: 'slide-left', name: 'Slide Left', category: 'basic', icon: Move, duration: 1, description: 'انزلاق لليسار' },
  { id: 'cinematic-light', name: 'Light Leak', category: 'cinematic', icon: Sparkles, duration: 1.8, description: 'تسرب ضوء' },
  { id: 'glitch-digital', name: 'Digital Glitch', category: 'glitch', icon: Zap, duration: 1, description: 'Glitch رقمي' },
  { id: 'creative-star', name: 'Star', category: 'creative', icon: Star, duration: 1.2, description: 'انتقال نجمي' },
  { id: '3d-cube', name: 'Cube', category: '3d', icon: Box, duration: 2.2, description: 'مكعب ثلاثي الأبعاد' },
];

export function TransitionsPanel() {
  const [activeCategory, setActiveCategory] = useState<Transition['category']>('basic');
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-1'>
        {(['basic', 'cinematic', 'glitch', 'creative', '3d'] as const).map((cat) => (
          <Badge key={cat} variant={activeCategory === cat ? 'default' : 'outline'} className={cn('cursor-pointer px-3 py-1.5', activeCategory === cat && 'bg-[#D4AF37] text-[#2c1810]')} onClick={() => setActiveCategory(cat)}>
            {cat}
          </Badge>
        ))}
      </div>

      <div className='grid max-h-96 grid-cols-2 gap-2 overflow-y-auto'>
        {transitions.filter((t) => t.category === activeCategory).map((transition) => {
          const Icon = transition.icon;
          const isSelected = selectedTransition === transition.id;
          return (
            <motion.div key={transition.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className={cn('cursor-pointer transition-all', isSelected && 'ring-2 ring-[#D4AF37] bg-[#D4AF37]/5')} onClick={() => setSelectedTransition(transition.id)}>
                <CardContent className='p-3'>
                  <div className='mb-2 flex items-center gap-2'><div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', isSelected ? 'bg-[#D4AF37] text-[#2c1810]' : 'bg-muted')}><Icon className='h-4 w-4' /></div><div><p className='text-xs font-medium'>{transition.name}</p><p className='text-[9px] text-muted-foreground'>{transition.duration.toFixed(1)}s</p></div></div>
                  <div className='flex h-12 items-center justify-center rounded bg-gradient-to-r from-[#D4AF37]/30 to-[#FDB931]/30 text-[10px] text-muted-foreground'>{transition.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedTransition && (
        <Card className='border-[#D4AF37]/20 bg-[#D4AF37]/5'>
          <CardContent className='p-4'>
            <div className='mb-2 flex items-center justify-between'><label className='text-xs text-muted-foreground'>المدة</label><span className='font-mono text-xs'>{duration.toFixed(1)}s</span></div>
            <Slider value={[duration * 10]} min={3} max={30} step={1} onValueChange={(v) => setDuration(v[0] / 10)} />
            <Button className='mt-4 w-full bg-[#D4AF37] text-[#2c1810] hover:bg-[#FDB931]'>تطبيق الانتقال</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TransitionsPanel;
