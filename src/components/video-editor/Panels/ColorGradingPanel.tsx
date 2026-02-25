'use client';

import { useState } from 'react';
import { Contrast, Droplets, Paintbrush, RotateCcw, Sun, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ColorGradingValues {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  temperature: number;
  tint: number;
  saturation: number;
  vibrance: number;
}

interface ColorWheel {
  hue: number;
  saturation: number;
  luminance: number;
}

interface ColorGradingState {
  shadows: ColorWheel;
  midtones: ColorWheel;
  highlights: ColorWheel;
  master: ColorWheel;
}

export function ColorGradingPanel() {
  const [activeTab, setActiveTab] = useState('basic');
  const [basic, setBasic] = useState<ColorGradingValues>({ exposure: 0, contrast: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0, temperature: 0, tint: 0, saturation: 0, vibrance: 0 });
  const [wheels, setWheels] = useState<ColorGradingState>({
    shadows: { hue: 0, saturation: 0, luminance: 0 },
    midtones: { hue: 0, saturation: 0, luminance: 0 },
    highlights: { hue: 0, saturation: 0, luminance: 0 },
    master: { hue: 0, saturation: 0, luminance: 0 },
  });
  const [activeWheel, setActiveWheel] = useState<'shadows' | 'midtones' | 'highlights' | 'master'>('master');

  const handleReset = () => {
    setBasic({ exposure: 0, contrast: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0, temperature: 0, tint: 0, saturation: 0, vibrance: 0 });
    setWheels({
      shadows: { hue: 0, saturation: 0, luminance: 0 },
      midtones: { hue: 0, saturation: 0, luminance: 0 },
      highlights: { hue: 0, saturation: 0, luminance: 0 },
      master: { hue: 0, saturation: 0, luminance: 0 },
    });
  };

  return (
    <Card className='border-border/50 bg-card/50'>
      <CardContent className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-sm font-medium'>تصحيح الألوان</h3>
          <Button variant='ghost' size='sm' onClick={handleReset} className='h-7 px-2'><RotateCcw className='me-1 h-3 w-3' />إعادة تعيين</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='basic' className='text-xs'>أساسي</TabsTrigger>
            <TabsTrigger value='wheels' className='text-xs'>عجلات ألوان</TabsTrigger>
          </TabsList>

          <TabsContent value='basic' className='mt-4 space-y-4'>
            {([
              ['exposure', 'تعريض', Sun, -200, 200, 100],
              ['contrast', 'تباين', Contrast, -100, 100, 1],
              ['temperature', 'حرارة اللون', Thermometer, -100, 100, 1],
              ['tint', 'لون', Paintbrush, -100, 100, 1],
              ['saturation', 'تشبع', Droplets, -100, 100, 1],
            ] as const).map(([key, label, Icon, min, max, multiplier]) => (
              <div key={key}>
                <div className='mb-1 flex items-center justify-between'>
                  <label className='flex items-center gap-1 text-xs text-muted-foreground'><Icon className='h-3 w-3' />{label}</label>
                  <span className='text-xs font-mono'>{basic[key as keyof ColorGradingValues]}</span>
                </div>
                <Slider
                  value={[Number(basic[key as keyof ColorGradingValues]) * (multiplier as number)]}
                  min={min as number}
                  max={max as number}
                  step={1}
                  onValueChange={(v) => setBasic((prev) => ({ ...prev, [key]: v[0] / (multiplier as number) }))}
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value='wheels' className='mt-4 space-y-4'>
            <div className='flex gap-1'>
              {(['shadows', 'midtones', 'highlights', 'master'] as const).map((wheel) => (
                <button
                  key={wheel}
                  onClick={() => setActiveWheel(wheel)}
                  className={cn('h-8 flex-1 rounded text-xs font-medium transition-all', activeWheel === wheel ? 'bg-[#D4AF37] text-[#2c1810]' : 'bg-muted/30 text-muted-foreground')}
                >
                  {wheel === 'shadows' ? 'ظلال' : wheel === 'midtones' ? 'نصفي' : wheel === 'highlights' ? 'إضاءات' : 'عام'}
                </button>
              ))}
            </div>

            <div className='relative aspect-square rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 p-4'>
              <div className='absolute inset-2 flex items-center justify-center rounded-full bg-black/50 text-center text-xs text-white'>
                <div>
                  <p>H: {wheels[activeWheel].hue}°</p>
                  <p>S: {wheels[activeWheel].saturation}%</p>
                  <p>L: {wheels[activeWheel].luminance}%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ColorGradingPanel;
