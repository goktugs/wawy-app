import type { GenerateBriefResponse } from "@/types/contracts";

import { Badge, ErrorText, LoadingRow, Spinner, buttonClassName, cardClassName, inputClassName, panelClassName } from "./ui";

type BriefPanelProps = {
  selectedCreatorId: string | null;
  onGenerateBrief: () => void;
  loading: boolean;
  error: string | null;
  payload: GenerateBriefResponse | null;
};

export function BriefPanel(props: BriefPanelProps) {
  return (
    <div className={panelClassName()}>
      <h2 className="mb-2 text-2xl tracking-tight">AI Brief</h2>

      <div className="mb-2 flex flex-wrap gap-2">
        <input value={props.selectedCreatorId ?? ""} readOnly placeholder="Select a creator from the left panel" className={inputClassName()} />
        <button
          onClick={props.onGenerateBrief}
          disabled={props.loading || !props.selectedCreatorId}
          className={buttonClassName(props.loading || !props.selectedCreatorId)}
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
              <Badge label={`cached: ${props.payload.cached ? "true" : "false"}`} subtle={props.payload.cached} />
            </div>

            <article className={cardClassName()}>
              <h3 className="text-base font-semibold">Outreach</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-800">{props.payload.brief.outreachMessage}</p>
            </article>

            <div className="mt-2 grid gap-2">
              <article className={cardClassName()}>
                <h3 className="text-base font-semibold">Content Ideas (5)</h3>
                <ol className="mt-2 grid list-decimal gap-1 pl-5 text-sm text-slate-800">
                  {props.payload.brief.contentIdeas.map((idea, i) => (
                    <li key={`${i}-${idea}`}>{idea}</li>
                  ))}
                </ol>
              </article>

              <article className={cardClassName()}>
                <h3 className="text-base font-semibold">Hook Suggestions (3)</h3>
                <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-slate-800">
                  {props.payload.brief.hookSuggestions.map((hook, i) => (
                    <li key={`${i}-${hook}`}>{hook}</li>
                  ))}
                </ul>
              </article>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">Select a creator on the left and generate the brief.</p>
        )}
      </div>
    </div>
  );
}
