import { useFontStore } from "@/stores/useFontStore";
import { CheckCircleIcon, InfoIcon } from "@phosphor-icons/react";

export default function Toast() {
  const toast = useFontStore((state) => state.toast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-down">
      <div className="rounded border border-border bg-card px-3 py-2 flex items-center gap-2.5 text-xs font-medium text-text select-none">
        {toast.type === "info" ? (
          <InfoIcon size={16} className="text-primary shrink-0" weight="fill" />
        ) : (
          <CheckCircleIcon size={16} className="text-success shrink-0" weight="fill" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
