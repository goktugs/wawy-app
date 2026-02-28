import type { GenerateBriefResponse } from "@/types/contracts";
import { cn } from "@/lib/cn";

import { Badge, ErrorText, LoadingRow, Spinner, handleTiltLeave, handleTiltMove } from "./ui";

type BriefPanelProps = {
  selectedCreatorId: string | null;
  onGenerateBrief: () => void;
  loading: boolean;
  error: string | null;
  payload: GenerateBriefResponse | null;
};

export function BriefPanel(props: BriefPanelProps) {
  return (
    <div
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      className="flex h-[calc(100vh-130px)] min-h-[420px] flex-col rounded-2xl border border-zinc-800/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.01)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur transition-transform duration-200 will-change-transform"
    >
      <h2 className="mb-3 text-2xl tracking-tight text-zinc-50">AI Brief</h2>

      <div className="mb-2 flex flex-wrap gap-2">
        <input
          value={props.selectedCreatorId ?? ""}
          readOnly
          placeholder="Select a creator from the left panel"
          className="min-w-[220px] rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
        />
        <button
          onClick={props.onGenerateBrief}
          disabled={props.loading || !props.selectedCreatorId}
          className={cn(
            "rounded-xl px-3.5 py-2 text-sm font-bold text-white transition",
            props.loading || !props.selectedCreatorId
              ? "cursor-not-allowed bg-zinc-700 text-zinc-300"
              : "bg-cyan-600 hover:bg-cyan-500"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {props.loading ? <Spinner /> : null}
            {props.loading ? "Generating..." : "Generate Brief"}
          </span>
        </button>
      </div>

      {props.error ? <ErrorText message={props.error} /> : null}

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {props.loading && !props.payload ? (
          <LoadingRow label="Generating AI brief..." />
        ) : props.payload ? (
          <>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge label={`creator: ${props.payload.creatorId}`} />
              <Badge
                label={`cached: ${props.payload.cached ? "true" : "false"}`}
                subtle={props.payload.cached}
              />
            </div>

            <article
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              className="rounded-xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.01)_100%)] p-2.5 text-left text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[transform,border-color] duration-150 will-change-transform hover:border-zinc-700"
            >
              <h3 className="text-base font-semibold text-zinc-100">Outreach</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {props.payload.brief.outreachMessage}
              </p>
            </article>

            <div className="mt-2 grid gap-2">
              <article
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="rounded-xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.01)_100%)] p-2.5 text-left text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[transform,border-color] duration-150 will-change-transform hover:border-zinc-700"
              >
                <h3 className="text-base font-semibold text-zinc-100">Content Ideas (5)</h3>
                <ol className="mt-2 grid list-decimal gap-1 pl-5 text-sm text-zinc-300">
                  {props.payload.brief.contentIdeas.map((idea, i) => (
                    <li key={`${i}-${idea}`}>{idea}</li>
                  ))}
                </ol>
              </article>

              <article
                onMouseMove={handleTiltMove}
                onMouseLeave={handleTiltLeave}
                className="rounded-xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.01)_100%)] p-2.5 text-left text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[transform,border-color] duration-150 will-change-transform hover:border-zinc-700"
              >
                <h3 className="text-base font-semibold text-zinc-100">Hook Suggestions (3)</h3>
                <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-zinc-300">
                  {props.payload.brief.hookSuggestions.map((hook, i) => (
                    <li key={`${i}-${hook}`}>{hook}</li>
                  ))}
                </ul>
              </article>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-400">Select a creator on the left and generate the brief.</p>
        )}
      </div>
    </div>
  );
}
