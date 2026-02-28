export function ErrorText({ message }: { message: string }) {
  return <p className="my-1 text-sm font-semibold text-red-600">{message}</p>;
}

export function Spinner({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`.trim()} />;
}

export function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
      <span>{label}</span>
    </div>
  );
}

export function Badge({ label, subtle = false }: { label: string; subtle?: boolean }) {
  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-xs text-slate-900",
        subtle ? "border-slate-200 bg-slate-50" : "border-sky-200 bg-cyan-50"
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function panelClassName() {
  return "flex min-h-[420px] h-[calc(100vh-120px)] flex-col rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_12px_32px_rgba(2,132,199,0.12)]";
}

export function inputClassName() {
  return "min-w-[220px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-400 transition focus:ring-2";
}

export function buttonClassName(disabled: boolean) {
  return [
    "rounded-xl px-3.5 py-2 text-sm font-bold text-white transition",
    disabled ? "cursor-not-allowed bg-slate-400" : "bg-sky-600 hover:bg-sky-700"
  ].join(" ");
}

export function cardClassName(active = false) {
  return [
    "rounded-xl border bg-white p-2.5 text-left",
    active ? "border-2 border-sky-600" : "border-sky-200"
  ].join(" ");
}
