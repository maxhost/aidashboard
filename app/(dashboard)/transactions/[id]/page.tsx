import { notFound } from "next/navigation";
import { TRANSACTIONS } from "@/lib/data/assistant-demo";
import { TransactionDetailClient } from "./transaction-detail-client";

export default function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const transaction = TRANSACTIONS.find((t) => t.id === params.id);
  if (!transaction) notFound();
  return <TransactionDetailClient transaction={transaction} />;
}
