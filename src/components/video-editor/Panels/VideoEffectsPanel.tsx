'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Droplets, Eye, Film, Sparkles, Star, Trash2, Tv, Wind, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type Category = 'glitch' | 'chroma' | 'distortion' | 'light' | 'particle' | 'vintage' | 'cinematic';
interface EffectParam { name: string; type: 'number' | 'boolean' | 'color'; min?: number; max?: number; default: number | boolean | string }
interface Effect { id: string; name: string; category: Category; icon: React.ElementType; description: string; parameters: EffectParam[] }
interface EffectInstance { id: string; effectId: string; startTime: number; endTime: number; params: Record<string, number | boolean | string> }

const effects: Effect[] = [
  { id: 'glitch-digital', name: 'Digital Glitch', category: 'glitch', icon: Zap, description: 'تشويش رقمي', parameters: [{ name: 'intensity', type: 'number', min: 0, max: 1, default: 0.5 }] },
  { id: 'chroma-shift', name: 'RGB Shift', category: 'chroma', icon: Droplets, description: 'إزاحة لونية', parameters: [{ name: 'amount', type: 'number', min: 0, max: 1, default: 0.3 }] },
  { id: 'distortion-wave', name: 'Wave Distortion', category: 'distortion', icon: Wind, description: 'تشويه موجي', parameters: [{ name: 'frequency', type: 'number', min: 0, max: 2, default: 0.8 }] },
  { id: 'light-leak', name: 'Light Leak', category: 'light', icon: Sparkles, description: 'تسرب ضوء', parameters: [{ name: 'color', type: 'color', default: '#ff9900' }] },
  { id: 'particle-dust', name: 'Dust', category: 'particle', icon: Star, description: 'جسيمات غبار', parameters: [{ name: 'density', type: 'number', min: 0, max: 1, default: 0.4 }] },
  { id: 'vintage-vhs', name: 'VHS', category: 'vintage', icon: Tv, description: 'ستايل VHS', parameters: [{ name: 'tracking', type: 'number', min: 0, max: 1, default: 0.3 }] },
  { id: 'cinematic-vignette', name: 'Vignette', category: 'cinematic', icon: Eye, description: 'تظليل الأطراف', parameters: [{ name: 'intensity', type: 'number', min: 0, max: 1, default: 0.5 }] },
  { id: 'cinematic-grain', name: 'Film Grain', category: 'cinematic', icon: Film, description: 'حبيبات الفيلم', parameters: [{ name: 'amount', type: 'number', min: 0, max: 1, default: 0.35 }] },
];

export function VideoEffectsPanel({ selectedClipId, currentTime }: { selectedClipId: string | null; currentTime: number }) {
  const [activeCategory, setActiveCategory] = useState<Category>('glitch');
  const [appliedEffects, setAppliedEffects] = useState<EffectInstance[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const addEffect = (effect: Effect) => {
    const params = effect.parameters.reduce<Record<string, number | boolean | string>>((acc, p) => ({ ...acc, [p.name]: p.default }), {});
    setAppliedEffects((prev) => [...prev, { id: `effect-${Date.now()}`, effectId: effect.id, startTime: currentTime, endTime: currentTime + 5, params }]);
  };

  if (!selectedClipId) {
    return <Card className='border-border/50 bg-card/50'><CardContent className='p-8 text-center text-sm text-muted-foreground'>اختر مقطعاً لإضافة التأثيرات.</CardContent></Card>;
  }

  return (
    <div className='space-y-4'>
      {appliedEffects.length > 0 && (
        <Card className='border-border/50 bg-card/50'>
          <CardContent className='space-y-2 p-4'>
            {appliedEffects.map((instance) => {
              const def = effects.find((e) => e.id === instance.effectId);
              if (!def) return null;
              const Icon = def.icon;
              return (
                <div key={instance.id} className={cn('rounded-lg border p-2', selectedEffect === instance.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-border')} onClick={() => setSelectedEffect(instance.id)}>
                  <div className='flex items-center gap-2'>
                    <Icon className='h-4 w-4 text-[#D4AF37]' />
                    <span className='flex-1 text-sm'>{def.name}</span>
                    <Badge variant='outline' className='text-[10px]'>{instance.startTime.toFixed(1)}s-{instance.endTime.toFixed(1)}s</Badge>
                    <button className='rounded p-1 hover:bg-muted' onClick={(e) => { e.stopPropagation(); setAppliedEffects((prev) => [...prev, { ...instance, id: `effect-${Date.now()}` }]); }}><Copy className='h-3 w-3' /></button>
                    <button className='rounded p-1 text-destructive hover:bg-destructive/10' onClick={(e) => { e.stopPropagation(); setAppliedEffects((prev) => prev.filter((x) => x.id !== instance.id)); }}><Trash2 className='h-3 w-3' /></button>
                  </div>
                  {selectedEffect === instance.id && (
                    <div className='mt-2 space-y-2 border-t border-border/50 pt-2'>
                      {def.parameters.map((p) => (
                        <div key={p.name}>
                          {p.type === 'number' && (
                            <>
                              <div className='mb-1 flex justify-between text-[10px]'><span>{p.name}</span><span>{String(instance.params[p.name])}</span></div>
                              <Slider value={[Number(instance.params[p.name]) * 100]} min={(p.min ?? 0) * 100} max={(p.max ?? 1) * 100} step={1} onValueChange={(v) => setAppliedEffects((prev) => prev.map((x) => (x.id === instance.id ? { ...x, params: { ...x.params, [p.name]: v[0] / 100 } } : x)))} />
                            </>
                          )}
                          {p.type === 'color' && <input type='color' value={String(instance.params[p.name])} onChange={(e) => setAppliedEffects((prev) => prev.map((x) => (x.id === instance.id ? { ...x, params: { ...x.params, [p.name]: e.target.value } } : x)))} className='h-7 w-10 rounded' />}
                          {p.type === 'boolean' && <button className='rounded bg-muted px-2 py-0.5 text-[10px]' onClick={() => setAppliedEffects((prev) => prev.map((x) => (x.id === instance.id ? { ...x, params: { ...x.params, [p.name]: !x.params[p.name] } } : x)))}>{instance.params[p.name] ? 'نعم' : 'لا'}</button>}
                        </div>
                      ))}
                      <div className='grid grid-cols-2 gap-2'>
                        <Input type='number' value={instance.startTime} onChange={(e) => setAppliedEffects((prev) => prev.map((x) => (x.id === instance.id ? { ...x, startTime: Number(e.target.value) } : x)))} className='h-7 text-xs' step='0.1' />
                        <Input type='number' value={instance.endTime} onChange={(e) => setAppliedEffects((prev) => prev.map((x) => (x.id === instance.id ? { ...x, endTime: Number(e.target.value) } : x)))} className='h-7 text-xs' step='0.1' />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className='border-border/50 bg-card/50'>
        <CardContent className='p-4'>
          <div className='mb-4 flex flex-wrap gap-1'>
            {(['glitch', 'chroma', 'distortion', 'light', 'particle', 'vintage', 'cinematic'] as Category[]).map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={cn('rounded-lg px-3 py-1.5 text-xs', activeCategory === cat ? 'bg-[#D4AF37] text-[#2c1810]' : 'bg-muted/30 text-muted-foreground')}>{cat}</button>
            ))}
          </div>

          <div className='grid max-h-60 grid-cols-2 gap-2 overflow-y-auto'>
            {effects.filter((e) => e.category === activeCategory).map((effect) => {
              const Icon = effect.icon;
              return (
                <motion.div key={effect.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className='cursor-pointer hover:border-[#D4AF37]/30' onClick={() => addEffect(effect)}>
                    <CardContent className='p-2'>
                      <div className='flex items-center gap-2'><Icon className='h-4 w-4 text-[#D4AF37]' /><div><p className='text-xs font-medium'>{effect.name}</p><p className='text-[9px] text-muted-foreground'>{effect.description}</p></div></div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VideoEffectsPanel;
