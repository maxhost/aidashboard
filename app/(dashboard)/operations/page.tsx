import { OPERATIONS_BRIEF } from "@/lib/data/assistant-demo";
import { OperationsClient } from "./operations-client";

export default function OperationsPage() {
  return <OperationsClient brief={OPERATIONS_BRIEF} />;
}
