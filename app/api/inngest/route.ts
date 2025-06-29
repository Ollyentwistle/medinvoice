import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { monthlySummary } from "@/utils/inngest/monthlySummary";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [monthlySummary],
});
