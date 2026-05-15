import { MorningBriefClient } from "./morning-brief-client";
import { ASSISTANT_FIRST_NAME, MORNING_BRIEF } from "@/lib/data/assistant-demo";

export default function MorningBriefPage() {
  return (
    <MorningBriefClient
      firstName={ASSISTANT_FIRST_NAME}
      brief={MORNING_BRIEF}
    />
  );
}
