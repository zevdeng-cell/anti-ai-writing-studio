import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, max_tokens = 4096 } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens,
      messages,
    });

    const text = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
add API route
