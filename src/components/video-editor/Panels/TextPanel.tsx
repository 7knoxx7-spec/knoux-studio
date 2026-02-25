'use client';

import { useState } from 'react';
import { Type } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function TextPanel() {
  const [text, setText] = useState('نص جديد');
  const [activeTab, setActiveTab] = useState('style');
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [color, setColor] = useState('#ffffff');
  const [strokeEnabled, setStrokeEnabled] = useState(false);
  const [x, setX] = useState(960);
  const [y, setY] = useState(540);
  const [rotation, setRotation] = useState(0);

  return (
    <div className='space-y-4'>
      <Card className='border-border/50 bg-card/50'>
        <CardContent className='p-4'>
          <label className='mb-2 block text-xs text-muted-foreground'>النص</label>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder='أدخل النص هنا...' />
        </CardContent>
      </Card>

      <Card className='border-border/50 bg-card/50'>
        <CardContent className='p-4'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='style' className='text-xs'>تنسيق</TabsTrigger>
              <TabsTrigger value='transform' className='text-xs'>تحويل</TabsTrigger>
              <TabsTrigger value='animation' className='text-xs'>حركة</TabsTrigger>
            </TabsList>

            <TabsContent value='style' className='mt-4 space-y-4'>
              <div className='mb-1 flex items-center justify-between'><label className='text-xs text-muted-foreground'>الحجم</label><span className='font-mono text-xs'>{fontSize}px</span></div>
              <Slider value={[fontSize]} min={8} max={200} step={1} onValueChange={(v) => setFontSize(v[0])} />

              <div className='flex gap-2'>
                <button onClick={() => setFontWeight('normal')} className={cn('h-8 flex-1 rounded text-xs', fontWeight === 'normal' ? 'bg-[#D4AF37] text-[#2c1810]' : 'bg-muted/30')}>عادي</button>
                <button onClick={() => setFontWeight('bold')} className={cn('h-8 flex-1 rounded text-xs font-bold', fontWeight === 'bold' ? 'bg-[#D4AF37] text-[#2c1810]' : 'bg-muted/30')}>عريض</button>
              </div>

              <div className='flex gap-2'>
                <input type='color' value={color} onChange={(e) => setColor(e.target.value)} className='h-8 w-10 rounded' />
                <Input value={color} onChange={(e) => setColor(e.target.value)} className='h-8 font-mono' />
              </div>

              <div className='flex items-center justify-between border-t border-border/50 pt-2'>
                <span className='text-xs'>حدود</span>
                <Switch checked={strokeEnabled} onCheckedChange={setStrokeEnabled} />
              </div>
            </TabsContent>

            <TabsContent value='transform' className='mt-4 space-y-3'>
              <div><div className='mb-1 flex justify-between text-xs'><span className='text-muted-foreground'>X</span><span className='font-mono'>{x}</span></div><Slider value={[x]} min={0} max={1920} step={1} onValueChange={(v) => setX(v[0])} /></div>
              <div><div className='mb-1 flex justify-between text-xs'><span className='text-muted-foreground'>Y</span><span className='font-mono'>{y}</span></div><Slider value={[y]} min={0} max={1080} step={1} onValueChange={(v) => setY(v[0])} /></div>
              <div><div className='mb-1 flex justify-between text-xs'><span className='text-muted-foreground'>الدوران</span><span className='font-mono'>{rotation}°</span></div><Slider value={[rotation + 180]} min={0} max={360} step={1} onValueChange={(v) => setRotation(v[0] - 180)} /></div>
            </TabsContent>

            <TabsContent value='animation' className='mt-4'>
              <div className='rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground'>
                إعدادات الحركة المتقدمة سيتم ربطها مع المحرك لاحقاً.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className='border-primary/20 bg-primary/5'>
        <CardContent className='p-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'><Type className='h-4 w-4 text-primary' />معاينة سريعة لطبقة النص جاهزة للربط مع VideoEngine.</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TextPanel;
