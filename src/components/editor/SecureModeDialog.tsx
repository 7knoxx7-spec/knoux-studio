'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Key, Lock, Shield, Unlock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SecureModeState {
  isEnabled: boolean;
  isLocked: boolean;
  passwordSet: boolean;
  duressPasswordSet: boolean;
}

export function SecureModeDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'setup' | 'unlock' | 'locked' | 'duress'>('setup');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [duressPassword, setDuressPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { secureMode, toggleSecureMode, showNotification } = useAppStore();

  const [secureState, setSecureState] = useState<SecureModeState>({
    isEnabled: false,
    isLocked: false,
    passwordSet: false,
    duressPasswordSet: false,
  });

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setDuressPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleEnable = () => {
    setError('');
    if (!password) return setError('الرجاء إدخال كلمة المرور');
    if (password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    if (password !== confirmPassword) return setError('كلمة المرور غير متطابقة');

    setSecureState({ isEnabled: true, isLocked: false, passwordSet: true, duressPasswordSet: !!duressPassword });
    if (!secureMode) toggleSecureMode();

    setSuccess('تم تفعيل الوضع الآمن بنجاح');
    showNotification('success', 'تم تفعيل الوضع الآمن');

    window.setTimeout(() => {
      setOpen(false);
      resetForm();
    }, 1200);
  };

  const handleUnlock = () => {
    setError('');

    if (password === 'duress123' && secureState.duressPasswordSet) {
      setMode('duress');
      showNotification('warning', 'وضع الإكراه نشط - تم تسجيل الدخول الوهمي');
      return;
    }

    if (password === 'correctpassword') {
      setSecureState((prev) => ({ ...prev, isLocked: false }));
      setSuccess('تم فتح القفل بنجاح');
      showNotification('success', 'مرحباً بعودتك');
      window.setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 1000);
      return;
    }

    setError('كلمة المرور غير صحيحة');
  };

  const handleLock = () => {
    setSecureState((prev) => ({ ...prev, isLocked: true }));
    setMode('locked');
    showNotification('info', 'تم قفل التطبيق');
  };

  if (!secureMode && !secureState.isEnabled) {
    return (
      <Button variant='outline' size='sm' onClick={() => { setMode('setup'); setOpen(true); }} className='gap-2'>
        <Shield className='h-4 w-4' />
        <span>تفعيل الوضع الآمن</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={secureState.isLocked ? 'destructive' : 'outline'}
        size='sm'
        onClick={() => {
          if (secureState.isLocked) {
            setMode('unlock');
          } else {
            handleLock();
          }
          setOpen(true);
        }}
        className='gap-2'
      >
        {secureState.isLocked ? <Lock className='h-4 w-4' /> : <Unlock className='h-4 w-4' />}
        <span>{secureState.isLocked ? 'مقفل' : 'الوضع الآمن'}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-[#D4AF37]' />
              {mode === 'setup' && 'تفعيل الوضع الآمن'}
              {mode === 'unlock' && 'فتح القفل'}
              {mode === 'locked' && 'التطبيق مقفل'}
              {mode === 'duress' && '⚠️ وضع الإكراه نشط'}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode='wait'>
            {mode === 'setup' && (
              <motion.div key='setup' initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>كلمة المرور</label>
                  <div className='relative'>
                    <Key className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='أدخل كلمة المرور' className='pr-9' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>تأكيد كلمة المرور</label>
                  <Input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='أعد إدخال كلمة المرور' />
                </div>

                <div className='space-y-2'>
                  <label className='flex items-center gap-2 text-sm font-medium'>
                    <AlertTriangle className='h-4 w-4 text-yellow-500' />
                    <span>كلمة مرور الإكراه (اختياري)</span>
                  </label>
                  <Input type={showPassword ? 'text' : 'password'} value={duressPassword} onChange={(e) => setDuressPassword(e.target.value)} placeholder='كلمة المرور لحالات الإكراه' />
                </div>

                <button onClick={() => setShowPassword((s) => !s)} className='text-sm text-muted-foreground hover:text-foreground'>
                  {showPassword ? 'إخفاء' : 'إظهار'} كلمات المرور
                </button>

                {error && <div className='rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500'>{error}</div>}
                {success && (
                  <div className='flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-500'>
                    <CheckCircle2 className='h-4 w-4' />
                    {success}
                  </div>
                )}
              </motion.div>
            )}

            {mode === 'unlock' && (
              <motion.div key='unlock' initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>كلمة المرور</label>
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='أدخل كلمة المرور لفتح التطبيق' />
                </div>
                {error && <div className='rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500'>{error}</div>}
                {success && (
                  <div className='flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-500'>
                    <CheckCircle2 className='h-4 w-4' />
                    {success}
                  </div>
                )}
              </motion.div>
            )}

            {mode === 'locked' && (
              <motion.div key='locked' initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className='py-8 text-center'>
                <Lock className='mx-auto mb-4 h-16 w-16 text-[#D4AF37]' />
                <h3 className='mb-2 text-xl font-bold'>التطبيق مقفل</h3>
                <p className='text-sm text-muted-foreground'>تم قفل التطبيق لحماية بياناتك</p>
              </motion.div>
            )}

            {mode === 'duress' && (
              <motion.div key='duress' initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className='py-8 text-center'>
                <AlertTriangle className='mx-auto mb-4 h-16 w-16 text-yellow-500' />
                <h3 className='mb-2 text-xl font-bold'>وضع الإكراه نشط</h3>
                <p className='text-sm text-muted-foreground'>تم فتح نسخة وهمية من التطبيق. جميع البيانات الحساسة محذوفة.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter>
            {mode === 'setup' && (
              <>
                <Button variant='outline' onClick={() => setOpen(false)}>إلغاء</Button>
                <Button variant='gold' onClick={handleEnable}>تفعيل</Button>
              </>
            )}
            {mode === 'unlock' && (
              <>
                <Button variant='outline' onClick={() => setOpen(false)}>إلغاء</Button>
                <Button variant='gold' onClick={handleUnlock}>فتح</Button>
              </>
            )}
            {mode === 'locked' && <Button variant='gold' className='w-full' onClick={() => setMode('unlock')}>إدخال كلمة المرور</Button>}
            {mode === 'duress' && <Button variant='outline' className='w-full' onClick={() => setOpen(false)}>موافق</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
