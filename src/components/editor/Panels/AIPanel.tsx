'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Cloud, Eraser, Focus, Image as ImageIcon, Loader2, Maximize2, Palette, Sparkles, User, Wand2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'enhance' | 'creative' | 'practical';
  processingTime: string;
  premium?: boolean;
}

interface AIPanelProps {
  onProcess: (toolId: string) => Promise<void>;
  isProcessing: boolean;
  progress: number;
}

export function AIPanel({ onProcess, isProcessing, progress }: AIPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'enhance' | 'creative' | 'practical'>('all');
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const tools: AITool[] = [
    { id: 'enhance', name: 'تحسين تلقائي', description: 'ضبط الإضاءة والألوان تلقائياً', icon: Wand2, category: 'enhance', processingTime: '2-3 ثواني' },
    { id: 'portrait', name: 'تحسين البورتريه', description: 'تنعيم البشرة وتفتيح العيون', icon: User, category: 'enhance', processingTime: '3-4 ثواني' },
    { id: 'denoise', name: 'إزالة التشويش', description: 'تقليل الضوضاء مع الحفاظ على التفاصيل', icon: Focus, category: 'enhance', processingTime: '2-3 ثواني' },
    { id: 'style', name: 'تحويل النمط', description: 'تطبيق أنماط فنية على الصورة', icon: Palette, category: 'creative', processingTime: '5-7 ثواني' },
    { id: 'colorize', name: 'تلوين', description: 'تلوين الصور بالأبيض والأسود', icon: Palette, category: 'creative', processingTime: '4-6 ثواني' },
    { id: 'sky', name: 'تغيير السماء', description: 'استبدال السماء بخلفيات مختلفة', icon: Cloud, category: 'creative', processingTime: '3-4 ثواني', premium: true },
    { id: 'background', name: 'إزالة الخلفية', description: 'عزل العنصر الرئيسي', icon: Eraser, category: 'practical', processingTime: '2-3 ثواني' },
    { id: 'upscale', name: 'تكبير الصورة', description: 'تكبير حتى 4x بدون فقدان الجودة', icon: Maximize2, category: 'practical', processingTime: '3-5 ثواني' },
    { id: 'restore', name: 'ترميم الصور', description: 'إصلاح الصور القديمة والمتهالكة', icon: ImageIcon, category: 'practical', processingTime: '5-8 ثواني', premium: true },
  ];

  const categories = [
    { id: 'all', name: 'الكل', icon: Sparkles },
    { id: 'enhance', name: 'تحسين', icon: Zap },
    { id: 'creative', name: 'إبداعي', icon: Palette },
    { id: 'practical', name: 'عملي', icon: Eraser },
  ] as const;

  const filteredTools = selectedCategory === 'all' ? tools : tools.filter((t) => t.category === selectedCategory);

  return (
    <div className='space-y-4'>
      <Card className='border-primary/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10'>
        <CardContent className='p-4'>
          <button onClick={() => setShowPrompt((s) => !s)} className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-4 w-4 text-[#D4AF37]' />
              <span className='text-sm font-medium'>ماذا تريد أن تفعل؟</span>
            </div>
          </button>

          <AnimatePresence>
            {showPrompt && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='overflow-hidden'>
                <div className='pt-4'>
                  <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='مثال: اجعل الصورة بإضاءة دافئة...' className='mb-2' />
                  <div className='flex gap-2'>
                    <Button size='sm' className='flex-1 gap-2' disabled={!prompt.trim() || isProcessing}><Sparkles className='h-4 w-4' />إنشاء</Button>
                    <Button size='sm' variant='outline' className='flex-1' onClick={() => setShowPrompt(false)}>إلغاء</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className='flex gap-1'>
        {categories.map((cat) => (
          <Button key={cat.id} variant={selectedCategory === cat.id ? 'default' : 'ghost'} size='sm' onClick={() => setSelectedCategory(cat.id)} className='h-8 flex-1 gap-1 text-xs'>
            <cat.icon className='h-3.5 w-3.5' />
            {cat.name}
          </Button>
        ))}
      </div>

      <div className='space-y-2'>
        {filteredTools.map((tool) => (
          <motion.div key={tool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card className={cn('cursor-pointer transition-all hover:border-primary/30', tool.premium && 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent')} onClick={() => onProcess(tool.id)}>
              <CardContent className='p-3'>
                <div className='flex items-center gap-3'>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tool.premium ? 'bg-amber-500/20' : 'bg-[#D4AF37]/10')}>
                    <tool.icon className={cn('h-5 w-5', tool.premium ? 'text-amber-500' : 'text-[#D4AF37]')} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-medium'>{tool.name}</p>
                      {tool.premium && <Badge variant='secondary' className='h-4 border-amber-500/30 bg-amber-500/20 text-[8px] text-amber-500'>Pro</Badge>}
                    </div>
                    <p className='truncate text-xs text-muted-foreground'>{tool.description}</p>
                    <p className='mt-0.5 text-[10px] text-muted-foreground/70'>{tool.processingTime}</p>
                  </div>
                  {isProcessing && <Loader2 className='h-4 w-4 animate-spin text-[#D4AF37]' />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Card className='border-primary/30 bg-primary/10'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/20'>
                    <Loader2 className='h-5 w-5 animate-spin text-[#D4AF37]' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>جاري المعالجة...</p>
                    <Progress value={progress} className='mt-2 h-1' />
                    <p className='mt-1 text-xs text-muted-foreground'>{progress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className='border-green-500/20 bg-green-500/10'>
        <CardContent className='p-3'>
          <div className='flex items-start gap-2'>
            <CheckCircle2 className='mt-0.5 h-4 w-4 text-green-500' />
            <div>
              <p className='text-xs font-medium text-green-500'>معالجة محلية</p>
              <p className='mt-1 text-[10px] text-muted-foreground'>جميع عمليات الذكاء الاصطناعي تتم على جهازك، لا ترسل بياناتك للخارج</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIPanel;
