import { useFontStore } from "@/stores/useFontStore";
import { CheckCircleIcon, InfoIcon } from "@phosphor-icons/react";

export default function Toast() {
  const toast = useFontStore((state) => state.toast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-toast pointer-events-auto">
      <div className="rounded-md border border-border/80 bg-card/95 backdrop-blur-md px-3.5 py-2.5 flex items-center gap-2.5 text-xs font-medium text-text select-none shadow-lg shadow-black/20">
        {toast.type === "info" ? (
          <InfoIcon size={16} className="text-primary shrink-0" weight="fill" />
        ) : (
          <CheckCircleIcon size={16} className="text-success shrink-0" weight="fill" />
        )}
        <span className="leading-tight">{toast.message}</span>
      </div>
    </div>
  );
}
