'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Brain, ChevronRight, Gift, Layers, Lock, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target: number;
  reward: string;
  unlocked: boolean;
  progress: number;
}

export function MilestonePanel() {
  const { milestones: milestoneCounts, showNotification } = useAppStore();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 'basic-adjustments', key: 'basicAdjustments', title: 'تعديلات أساسية', description: 'قم بإجراء 10 تعديلات أساسية على الصور', icon: Star, target: 10, reward: 'فتح التعديلات المتقدمة', unlocked: false, progress: 0 },
    { id: 'filters', key: 'filters', title: 'فلاتر', description: 'طبق 5 فلاتر مختلفة على صورك', icon: Sparkles, target: 5, reward: 'فتح الفلاتر المخصصة', unlocked: false, progress: 0 },
    { id: 'projects', key: 'projects', title: 'مشاريع', description: 'أنشئ 5 مشاريع جديدة', icon: Target, target: 5, reward: 'فتح قوالب المشاريع', unlocked: false, progress: 0 },
    { id: 'exports', key: 'exports', title: 'تصديرات', description: 'قم بتصدير 10 مشاريع', icon: Zap, target: 10, reward: 'فتح إعدادات التصدير المسبقة', unlocked: false, progress: 0 },
    { id: 'layers', key: 'layers', title: 'طبقات', description: 'استخدم 10 طبقات في مشروع واحد', icon: Layers, target: 10, reward: 'فتح مجموعات الطبقات', unlocked: false, progress: 0 },
    { id: 'ai-features', key: 'aiFeatures', title: 'ميزات الذكاء الاصطناعي', description: 'استخدم 10 ميزات ذكاء اصطناعي', icon: Brain, target: 10, reward: 'فتح المعالجة المجمعة', unlocked: false, progress: 0 },
  ]);

  useEffect(() => {
    setMilestones((prev) =>
      prev.map((m) => {
        const currentCount = milestoneCounts[m.key] || 0;
        const progress = Math.min((currentCount / m.target) * 100, 100);
        const unlocked = progress >= 100;

        if (!m.unlocked && unlocked) {
          showNotification('success', `إنجاز مكتسب: ${m.title} - ${m.reward}`);
        }

        return { ...m, progress, unlocked };
      })
    );
  }, [milestoneCounts, showNotification]);

  const totalProgress = milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length;

  return (
    <div className='space-y-4'>
      <Card className='border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/20 to-transparent'>
        <CardContent className='p-4'>
          <div className='mb-3 flex items-center gap-3'>
            <Trophy className='h-5 w-5 text-[#D4AF37]' />
            <h3 className='font-bold'>التقدم العام</h3>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>الإنجازات المكتملة</span>
              <span className='font-bold'>{milestones.filter((m) => m.unlocked).length}/{milestones.length}</span>
            </div>
            <Progress value={totalProgress} className='h-2' />
          </div>
        </CardContent>
      </Card>

      <div className='space-y-3'>
        {milestones.map((milestone) => {
          const Icon = milestone.icon;
          const isSelected = selectedMilestone === milestone.id;

          return (
            <motion.div key={milestone.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }}>
              <Card
                className={cn('cursor-pointer overflow-hidden transition-all', milestone.unlocked ? 'border-[#D4AF37]/50' : 'border-border', isSelected && 'ring-2 ring-[#D4AF37]')}
                onClick={() => setSelectedMilestone(isSelected ? null : milestone.id)}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl transition-all', milestone.unlocked ? 'bg-[#D4AF37]' : 'bg-muted')}>
                      <Icon className={cn('h-6 w-6', milestone.unlocked ? 'text-[#2c1810]' : 'text-muted-foreground')} />
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <h4 className='truncate font-bold'>{milestone.title}</h4>
                        {milestone.unlocked && <Award className='h-4 w-4 text-[#D4AF37]' />}
                      </div>
                      <p className='line-clamp-1 text-xs text-muted-foreground'>{milestone.description}</p>

                      <div className='mt-2 flex items-center gap-2'>
                        <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-muted'>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${milestone.progress}%` }}
                            transition={{ duration: 0.4 }}
                            className={cn('h-full rounded-full', milestone.unlocked ? 'bg-[#D4AF37]' : 'bg-primary')}
                          />
                        </div>
                        <span className='text-xs font-mono'>{Math.round(milestone.progress)}%</span>
                      </div>
                    </div>

                    <ChevronRight className={cn('h-5 w-5 text-muted-foreground transition-transform', isSelected && 'rotate-90')} />
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='overflow-hidden'>
                        <div className='mt-3 border-t border-border/50 pt-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Gift className='h-4 w-4 text-[#D4AF37]' />
                              <span className='text-sm'>المكافأة:</span>
                            </div>
                            <span className='text-sm font-medium'>{milestone.reward}</span>
                          </div>

                          <div className='mt-2 flex items-center gap-2'>
                            <Target className='h-4 w-4 text-muted-foreground' />
                            <span className='text-xs text-muted-foreground'>
                              التقدم: {milestoneCounts[milestone.key] || 0}/{milestone.target}
                            </span>
                          </div>

                          {!milestone.unlocked && (
                            <Button variant='outline' size='sm' className='mt-3 w-full gap-2' disabled>
                              <Lock className='h-3 w-3' />
                              لم يتم الفتح بعد
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
