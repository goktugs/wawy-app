import type { CampaignOption, MatchingResponse } from "@/types/contracts";

import { Badge, ErrorText, LoadingRow, Spinner, buttonClassName, cardClassName, inputClassName, panelClassName } from "./ui";

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
    <div className={panelClassName()}>
      <h2 className="mb-2 text-2xl tracking-tight">Creators</h2>

      <div className="mb-2 flex flex-wrap gap-2">
        <select value={props.campaignId} onChange={(e) => props.onCampaignChange(e.target.value)} className={inputClassName()}>
          {props.campaigns.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.brand}
            </option>
          ))}
        </select>
        <button onClick={props.onRunMatching} disabled={props.loading} className={buttonClassName(props.loading)}>
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
                  <button key={row.creatorId} onClick={() => props.onSelectCreator(row.creatorId)} className={cardClassName(active)}>
                    <div className="flex items-center justify-between gap-2">
                      <strong>
                        #{idx + 1} {row.creatorId}
                      </strong>
                      <strong>{row.totalScore}</strong>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-700">watch penalty: -{row.penalties.watchTimePenalty}</p>
                    <p className="mt-1.5 text-xs text-slate-600">matched: {row.matchedSignals.join(", ") || "none"}</p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">Select a campaign and fetch top creators.</p>
        )}
      </div>
    </div>
  );
}
