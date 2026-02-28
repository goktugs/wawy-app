import type { CampaignOption, MatchingResponse } from "@/types/contracts";
import { cn } from "@/lib/cn";

import { Badge, ErrorText, LoadingRow, Spinner, handleTiltLeave, handleTiltMove } from "./ui";

type CreatorsPanelProps = {
  campaigns: CampaignOption[];
  campaignId: string;
  onCampaignChange: (value: string) => void;
  onRunMatching: () => void;
  loading: boolean;
  error: string | null;
  payload: MatchingResponse | null;
  selectedCreatorId: string | null;
  onSelectCreator: (creatorId: string) => void;
};

export function CreatorsPanel(props: CreatorsPanelProps) {
  const rejectionPairs = props.payload?.summary?.rejectionStats
    ? Object.entries(props.payload.summary.rejectionStats)
    : [];

  return (
    <div
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      className="flex h-[calc(100vh-130px)] min-h-[420px] flex-col rounded-2xl border border-zinc-800/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.01)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur transition-transform duration-200 will-change-transform"
    >
      <h2 className="mb-3 text-2xl tracking-tight text-zinc-50">Creators</h2>

      <div className="mb-2 flex flex-wrap gap-2">
        <select
          value={props.campaignId}
          onChange={(e) => props.onCampaignChange(e.target.value)}
          className="min-w-[220px] rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
        >
          {props.campaigns.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.brand}
            </option>
          ))}
        </select>
        <button
          onClick={props.onRunMatching}
          disabled={props.loading}
          className={cn(
            "rounded-xl px-3.5 py-2 text-sm font-bold text-white transition",
            props.loading ? "cursor-not-allowed bg-zinc-700 text-zinc-300" : "bg-cyan-600 hover:bg-cyan-500"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {props.loading ? <Spinner /> : null}
            {props.loading ? "Matching..." : "Fetch Top Creators"}
          </span>
        </button>
      </div>

      {props.error ? <ErrorText message={props.error} /> : null}

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {props.loading && !props.payload ? (
          <LoadingRow label="Loading creator list..." />
        ) : props.payload ? (
          <>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge label={`campaign: ${props.payload.campaignId}`} />
              <Badge label={`count: ${props.payload.results.length}`} />
            </div>

            {rejectionPairs.length > 0 ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {rejectionPairs.map(([k, v]) => (
                  <Badge key={k} label={`${k}: ${v}`} subtle />
                ))}
              </div>
            ) : null}

            <div className="grid gap-2">
              {props.payload.results.map((row, idx) => {
                const active = props.selectedCreatorId === row.creatorId;
                return (
                  <button
                    key={row.creatorId}
                    onClick={() => props.onSelectCreator(row.creatorId)}
                    onMouseMove={handleTiltMove}
                    onMouseLeave={handleTiltLeave}
                    className={cn(
                      "rounded-xl border bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.01)_100%)] p-2.5 text-left text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[transform,border-color] duration-150 will-change-transform",
                      active ? "border-2 border-cyan-500" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong>
                        #{idx + 1} {row.creatorId}
                      </strong>
                      <strong>{row.totalScore}</strong>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-300">watch penalty: -{row.penalties.watchTimePenalty}</p>
                    <p className="mt-1.5 text-xs text-zinc-400">matched: {row.matchedSignals.join(", ") || "none"}</p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-400">Select a campaign and fetch top creators.</p>
        )}
      </div>
    </div>
  );
}
