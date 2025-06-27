import { GenerateSummaryProps } from "@/app/(app)/dashboard/dashboard.queries";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const {
    totalEarnings,
    mostPopularService,
    mostProfitableService,
    unpaidCount,
    overdueCount,
  }: GenerateSummaryProps = data;

  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });

  try {
    const prompt = `
        Generate a concise monthly summary for a clinic for the month of ${monthName} with the following data:
        - Total earnings: £${totalEarnings}
        - Most popular service: ${
          mostPopularService
            ? mostPopularService.multiple
              ? `${mostPopularService.name} with £${mostPopularService.revenue} total revenue from ${mostPopularService.count} treatments combined`
              : `${mostPopularService.name} with £${mostPopularService.revenue} from ${mostPopularService.count} treatments`
            : "No data"
        }
        - Most profitable service: ${
          mostProfitableService
            ? mostProfitableService.multiple
              ? `${mostProfitableService.name} with £${mostProfitableService.revenue} total revenue from ${mostProfitableService.count} treatments combined`
              : `${mostProfitableService.name} with £${mostProfitableService.revenue} from ${mostProfitableService.count} treatments`
            : "No data"
        }
        - Unpaid invoices: ${unpaidCount}
        - Overdue invoices: ${overdueCount}

        Please provide only 2-3 sentences in plain text without any markdown, bullet points, or special formatting. Include any useful insights and recommendations if deemed necessary.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const summary =
      response.choices[0].message?.content?.trim() ??
      "Failed to generate summary, please try again...";

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "OpenAI API request failed" },
      { status: 500 }
    );
  }
}
