interface TopService {
  name: string;
  revenue: number;
  count: number;
  multiple: boolean;
}

export interface GenerateSummaryProps {
  totalEarnings: number;
  mostPopularService: TopService | null;
  mostProfitableService: TopService | null;
  unpaidCount: number;
  overdueCount: number;
}

export async function generateSummary(
  summaryData: GenerateSummaryProps
): Promise<string> {
  const response = await fetch("/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(summaryData),
  });

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  return await response.json();
}
