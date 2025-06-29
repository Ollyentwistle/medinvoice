import { NextRequest, NextResponse } from "next/server";
import { generateNewSummary } from "./summary.funcs";

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const summary = await generateNewSummary(data);

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "OpenAI API request failed" },
      { status: 500 }
    );
  }
}
