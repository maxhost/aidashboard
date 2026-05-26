import { ACCESS_CREDENTIALS } from "@/lib/data/assistant-demo";
import { AccessClient } from "./access-client";

export default function AccessPage() {
  return <AccessClient credentials={ACCESS_CREDENTIALS} />;
}
