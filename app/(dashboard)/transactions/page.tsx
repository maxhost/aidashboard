import {
  TRANSACTIONS,
  TRANSACTION_PHASE_ORDER,
  type Transaction,
  type TransactionPhase,
} from "@/lib/data/assistant-demo";
import { TransactionsClient } from "./transactions-client";

export default function TransactionsPage() {
  // AT RISK / DELAYED first, ON TRACK after — within each phase.
  const statusOrder = { delayed: 0, "at-risk": 1, "on-track": 2 } as const;
  const grouped = Object.fromEntries(
    TRANSACTION_PHASE_ORDER.map((p) => [p, [] as Transaction[]])
  ) as Record<TransactionPhase, Transaction[]>;
  for (const t of TRANSACTIONS) grouped[t.phase].push(t);
  for (const p of TRANSACTION_PHASE_ORDER) {
    grouped[p].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }
  return <TransactionsClient grouped={grouped} />;
}
