import { CheckCircleIcon, InfoIcon } from '@phosphor-icons/react';

import { useFontStore } from '@/lib/store/useFontStore';

export default function Toast() {
  const toast = useFontStore((state) => state.toast);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast border-border bg-card/95 text-text pointer-events-auto fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-xs font-medium shadow-lg shadow-black/20 backdrop-blur-md select-none"
    >
      {toast.type === 'info' ? (
        <InfoIcon size={16} className="text-primary shrink-0" weight="fill" />
      ) : (
        <CheckCircleIcon size={16} className="text-success shrink-0" weight="fill" />
      )}
      <span className="leading-tight">{toast.message}</span>
    </div>
  );
}
