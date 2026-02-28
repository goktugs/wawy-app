import { cn } from "@/lib/cn";
import type { MouseEvent } from "react";

export function ErrorText({ message }: { message: string }) {
  return <p className="my-1 text-sm font-semibold text-red-400">{message}</p>;
}

export function Spinner({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`.trim()} />;
}

export function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
      <span>{label}</span>
    </div>
  );
}

export function Badge({ label, subtle = false }: { label: string; subtle?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs text-zinc-100",
        subtle ? "border-zinc-700 bg-zinc-900/70" : "border-cyan-700/70 bg-cyan-950/50"
      )}
    >
      {label}
    </span>
  );
}

export function handleTiltMove(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const rotateY = ((x / rect.width) - 0.5) * 2;
  const rotateX = (0.5 - (y / rect.height)) * 2;

  el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-0.5px)`;
}

export function handleTiltLeave(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
}
