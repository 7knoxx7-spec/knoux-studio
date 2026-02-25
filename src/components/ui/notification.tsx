'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const notificationIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const notificationStyles = {
  success: 'bg-green-500/10 border-green-500/30 text-green-500',
  error: 'bg-red-500/10 border-red-500/30 text-red-500',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
};

export function Notification() {
  const { notifications, hideNotification } = useAppStore();

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn(
                'flex min-w-[300px] items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
                notificationStyles[notification.type]
              )}
            >
              <Icon className='h-5 w-5 flex-shrink-0' />
              <p className='flex-1 text-sm'>{notification.message}</p>
              <button onClick={() => hideNotification(notification.id)} className='rounded p-1 hover:bg-white/10'>
                <X className='h-4 w-4' />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
