"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { BriefPanel } from "@/components/campaign-flow/BriefPanel";
import { CreatorsPanel } from "@/components/campaign-flow/CreatorsPanel";
import type { CampaignOption, GenerateBriefResponse, MatchingResponse, TrpcEnvelope } from "@/types/contracts";

export default function HomePage() {
  const {
    data: campaigns,
    isPending: isCampaignsPending,
    error: campaignsError
  } = useQuery<CampaignOption[], Error>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/v1/trpc/campaign.listCampaigns");
      const data = (await res.json()) as TrpcEnvelope<CampaignOption[]>;

      if (!res.ok || data.error) {
        throw new Error(data.error?.json?.message ?? "Failed to fetch campaigns");
      }

      const json = data.result?.data?.json;
      if (!json) {
        throw new Error("Invalid campaigns response payload");
      }

      return json;
    }
  });

  const [campaignId, setCampaignId] = useState("");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  const matchingMutation = useMutation<MatchingResponse, Error, string>({
    mutationFn: async (selectedCampaignId) => {
      const input = encodeURIComponent(JSON.stringify({ json: { campaignId: selectedCampaignId } }));
      const res = await fetch(`/api/v1/trpc/campaign.getTopCreators?input=${input}`);
      const data = (await res.json()) as TrpcEnvelope<MatchingResponse>;

      if (!res.ok || data.error) {
        throw new Error(data.error?.json?.message ?? "Failed to fetch matching results");
      }

      const json = data.result?.data?.json;
      if (!json) {
        throw new Error("Invalid matching response payload");
      }

      return json;
    }
  });
  const briefMutation = useMutation<GenerateBriefResponse, Error, { campaignId: string; creatorId: string }>({
    mutationFn: async (params) => {
      const res = await fetch("/api/v1/trpc/campaign.generateBrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: params })
      });

      const data = (await res.json()) as TrpcEnvelope<GenerateBriefResponse>;

      if (!res.ok || data.error) {
        throw new Error(data.error?.json?.message ?? "Failed to generate brief");
      }

      const json = data.result?.data?.json;
      if (!json) {
        throw new Error("Invalid brief response payload");
      }

      return json;
    }
  });

  useEffect(() => {
    if (!campaignId && campaigns && campaigns.length > 0) {
      setCampaignId(campaigns[0].id);
    }
  }, [campaignId, campaigns]);

  async function runMatching() {
    if (!campaignId) return;

    briefMutation.reset();
    setSelectedCreatorId(null);

    try {
      const payload = await matchingMutation.mutateAsync(campaignId);
      setSelectedCreatorId(payload.results[0]?.creatorId ?? null);
    } catch {
      // Error is exposed by mutation state.
    }
  }

  async function runBrief() {
    if (!selectedCreatorId || !campaignId) {
      return;
    }

    try {
      await briefMutation.mutateAsync({
        campaignId,
        creatorId: selectedCreatorId
      });
    } catch {
      // Error is exposed by mutation state.
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,#164e63_0%,transparent_35%),radial-gradient(circle_at_85%_85%,#4c1d95_0%,transparent_35%),linear-gradient(140deg,#09090b_0%,#111827_45%,#020617_100%)] p-4 font-sans text-zinc-100">
      <h1 className="mb-3 text-3xl tracking-tight text-zinc-50">Campaign Flow</h1>

      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-3">
        <CreatorsPanel
          campaigns={campaigns ?? []}
          campaignId={campaignId}
          onCampaignChange={setCampaignId}
          onRunMatching={runMatching}
          loading={isCampaignsPending || matchingMutation.isPending}
          error={campaignsError?.message ?? matchingMutation.error?.message ?? null}
          payload={matchingMutation.data ?? null}
          selectedCreatorId={selectedCreatorId}
          onSelectCreator={setSelectedCreatorId}
        />

        <BriefPanel
          selectedCreatorId={selectedCreatorId}
          onGenerateBrief={runBrief}
          loading={briefMutation.isPending}
          error={briefMutation.error?.message ?? null}
          payload={briefMutation.data ?? null}
        />
      </section>
    </main>
  );
}
