import { useEffect } from 'react';
import { Toast } from './Toast';
import { useToastState, setGlobalToast } from '../../hooks/useToast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, removeToast } = useToastState();

  useEffect(() => {
    setGlobalToast(addToast);
    return () => setGlobalToast(() => {});
  }, [addToast]);

  return (
    <>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </>
  );
}
