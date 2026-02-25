'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface HSLValues { hue: number; saturation: number; luminance: number }
interface HSLColorValues {
  red: HSLValues; orange: HSLValues; yellow: HSLValues; green: HSLValues;
  cyan: HSLValues; blue: HSLValues; purple: HSLValues; magenta: HSLValues;
}

export function HSLPanel() {
  const [activeColor, setActiveColor] = useState<keyof HSLColorValues>('red');
  const [values, setValues] = useState<HSLColorValues>({
    red: { hue: 0, saturation: 0, luminance: 0 }, orange: { hue: 0, saturation: 0, luminance: 0 }, yellow: { hue: 0, saturation: 0, luminance: 0 }, green: { hue: 0, saturation: 0, luminance: 0 },
    cyan: { hue: 0, saturation: 0, luminance: 0 }, blue: { hue: 0, saturation: 0, luminance: 0 }, purple: { hue: 0, saturation: 0, luminance: 0 }, magenta: { hue: 0, saturation: 0, luminance: 0 },
  });

  const colors: Array<{ id: keyof HSLColorValues; name: string; bg: string; range: [number, number] }> = [
    { id: 'red', name: 'أحمر', bg: 'bg-red-500', range: [0, 30] },
    { id: 'orange', name: 'برتقالي', bg: 'bg-orange-500', range: [30, 60] },
    { id: 'yellow', name: 'أصفر', bg: 'bg-yellow-500', range: [60, 90] },
    { id: 'green', name: 'أخضر', bg: 'bg-green-500', range: [90, 150] },
    { id: 'cyan', name: 'سماوي', bg: 'bg-cyan-500', range: [150, 210] },
    { id: 'blue', name: 'أزرق', bg: 'bg-blue-500', range: [210, 270] },
    { id: 'purple', name: 'بنفسجي', bg: 'bg-purple-500', range: [270, 330] },
    { id: 'magenta', name: 'أرجواني', bg: 'bg-pink-500', range: [330, 360] },
  ];

  const handleReset = () => {
    setValues({
      red: { hue: 0, saturation: 0, luminance: 0 }, orange: { hue: 0, saturation: 0, luminance: 0 }, yellow: { hue: 0, saturation: 0, luminance: 0 }, green: { hue: 0, saturation: 0, luminance: 0 },
      cyan: { hue: 0, saturation: 0, luminance: 0 }, blue: { hue: 0, saturation: 0, luminance: 0 }, purple: { hue: 0, saturation: 0, luminance: 0 }, magenta: { hue: 0, saturation: 0, luminance: 0 },
    });
  };

  const handleChange = (type: keyof HSLValues, value: number) => {
    setValues((prev) => ({ ...prev, [activeColor]: { ...prev[activeColor], [type]: value } }));
  };

  return (
    <Card className='border-border/50 bg-card/50'>
      <CardContent className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-sm font-medium'>HSL</h3>
          <Button variant='ghost' size='sm' onClick={handleReset} className='h-7 px-2'>
            <RotateCcw className='me-1 h-3 w-3' />
            إعادة تعيين
          </Button>
        </div>

        <div className='mb-4 grid grid-cols-4 gap-1'>
          {colors.map((color) => (
            <button key={color.id} onClick={() => setActiveColor(color.id)} className={cn('relative h-8 rounded-lg transition-all', color.bg, activeColor === color.id && 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-background')}>
              <span className='sr-only'>{color.name}</span>
            </button>
          ))}
        </div>

        <div className='mb-4 flex items-center gap-2'>
          <div className={cn('h-4 w-4 rounded', colors.find((c) => c.id === activeColor)?.bg)} />
          <span className='text-sm font-medium'>{colors.find((c) => c.id === activeColor)?.name}</span>
          <span className='text-xs text-muted-foreground'>{colors.find((c) => c.id === activeColor)?.range.join('° - ')}°</span>
        </div>

        <div className='mb-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs text-muted-foreground'>درجة اللون</label>
            <span className='text-xs font-mono'>{values[activeColor].hue}°</span>
          </div>
          <Slider value={[values[activeColor].hue]} min={-180} max={180} step={1} onValueChange={(v) => handleChange('hue', v[0])} className='w-full' />
        </div>

        <div className='mb-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs text-muted-foreground'>التشبع</label>
            <span className='text-xs font-mono'>{values[activeColor].saturation}</span>
          </div>
          <Slider value={[values[activeColor].saturation]} min={-100} max={100} step={1} onValueChange={(v) => handleChange('saturation', v[0])} className='w-full' />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs text-muted-foreground'>الإضاءة</label>
            <span className='text-xs font-mono'>{values[activeColor].luminance}</span>
          </div>
          <Slider value={[values[activeColor].luminance]} min={-100} max={100} step={1} onValueChange={(v) => handleChange('luminance', v[0])} className='w-full' />
        </div>
      </CardContent>
    </Card>
  );
}

export default HSLPanel;
