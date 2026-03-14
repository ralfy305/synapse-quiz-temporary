import OpenAI from "openai";
import { NextResponse } from "next/server";
import { PONZ_SYSTEM_PROMPT } from "@/lib/ponz-directive";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DR_PONZ_MODEL =
  process.env.OPENAI_MODEL_ID ||
  "ft:gpt-4.1-nano-2025-04-14:personal:drponz:Cuia45yO";
const FALLBACK_MODEL = "gpt-4o-mini";

export async function POST(req: Request) {
  try {
    let body: { messages?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Basic guards
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload: `messages` must be an array." },
        { status: 400 }
      );
    }

    const normalizedMessages = messages
      .filter((m: unknown): m is { role: "user" | "assistant"; content: string } => {
        if (
          m == null ||
          typeof m !== "object" ||
          !("role" in m) ||
          !("content" in m) ||
          typeof (m as { content: unknown }).content !== "string"
        )
          return false;
        const role = (m as { role: string }).role;
        return role === "user" || role === "assistant";
      })
      .map((m) => ({ role: m.role, content: m.content }));

    if (normalizedMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid chat messages provided." },
        { status: 400 }
      );
    }

    let response;

    try {
      response = await openai.chat.completions.create({
        model: DR_PONZ_MODEL,
        messages: [
          { role: "system", content: PONZ_SYSTEM_PROMPT },
          ...normalizedMessages,
        ],
        temperature: 0.6,
      });
    } catch (error: unknown) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof (error as { status?: unknown }).status === "number"
          ? (error as { status: number }).status
          : undefined;

      if (status !== 401 && status !== 403 && status !== 404) {
        throw error;
      }

      response = await openai.chat.completions.create({
        model: FALLBACK_MODEL,
        messages: [
          { role: "system", content: PONZ_SYSTEM_PROMPT },
          ...normalizedMessages,
        ],
        temperature: 0.6,
      });
    }

    const firstChoice = response.choices?.[0];
    const content = firstChoice?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response content returned from model." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("Neural Link Failure:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
