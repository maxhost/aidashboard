import { notFound } from "next/navigation";
import {
  TRANSACTIONS,
  TRANSACTION_OPS_DETAILS,
} from "@/lib/data/assistant-demo";
import { TransactionDetailClient } from "./transaction-detail-client";

export default function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const transaction = TRANSACTIONS.find((t) => t.id === params.id);
  if (!transaction) notFound();
  const ops = TRANSACTION_OPS_DETAILS[params.id];
  const enriched = ops
    ? { ...transaction, health: ops.health, opsTasks: ops.opsTasks }
    : transaction;
  return <TransactionDetailClient transaction={enriched} />;
}
