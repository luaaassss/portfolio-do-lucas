import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ToastNotification } from '../../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const ToastContainer = Toast;

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" aria-hidden="true" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-white text-emerald-950 shadow-md',
    warning: 'border-amber-200 bg-white text-amber-950 shadow-md',
    error: 'border-rose-200 bg-white text-rose-950 shadow-md',
    info: 'border-blue-200 bg-white text-blue-950 shadow-md',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border text-sm ${
        bgStyles[toast.type || 'info']
      }`}
      role="alert"
    >
      {icons[toast.type || 'info']}
      <div className="flex-1">
        {toast.title && (
          <p className="font-semibold text-xs tracking-wide uppercase mb-0.5">{toast.title}</p>
        )}
        {toast.message && <p className="leading-snug text-xs text-neutral-600">{toast.message}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-neutral-700 p-1 -mr-1 -mt-1 rounded focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
