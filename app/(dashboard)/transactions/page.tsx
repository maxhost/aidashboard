import { TRANSACTIONS } from "@/lib/data/assistant-demo";
import { TransactionsClient } from "./transactions-client";

export default function TransactionsPage() {
  // AT RISK / DELAYED first, ON TRACK after.
  const order = { delayed: 0, "at-risk": 1, "on-track": 2 } as const;
  const sorted = [...TRANSACTIONS].sort(
    (a, b) => order[a.status] - order[b.status]
  );
  return <TransactionsClient transactions={sorted} />;
}
