import {
  OPERATIONS_BRIEF,
  PIPELINE_CLIENTS,
  PIPELINE_STAGE_ORDER,
  TRANSACTIONS,
  computePipelineSnapshot,
  type PipelineClient,
  type PipelineStage,
} from "@/lib/data/assistant-demo";
import { OperationsClient } from "./operations-client";

export default function OperationsPage() {
  const byStage = Object.fromEntries(
    PIPELINE_STAGE_ORDER.map((s) => [s, [] as PipelineClient[]])
  ) as Record<PipelineStage, PipelineClient[]>;
  for (const c of PIPELINE_CLIENTS) byStage[c.stage].push(c);

  const snapshot = computePipelineSnapshot(PIPELINE_CLIENTS, TRANSACTIONS);

  return (
    <OperationsClient
      brief={OPERATIONS_BRIEF}
      snapshot={snapshot}
      byStage={byStage}
    />
  );
}
