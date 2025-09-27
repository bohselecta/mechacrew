import { z } from "zod";
import { MechaSvgPartZ } from "@/types/mecha-svg";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateMechaSvgPart(args: {
  componentType: string;
  description: string;
  targetAnchorId: string;
}) {
  const { svgPartPrompt } = await import("./prompts");
  const prompt = svgPartPrompt(args);

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),                  // TEMP: replace with grok-3 when wired
    // model: grok("grok-3"), // example when provider available
    temperature: 0.7,
    maxTokens: 1200,
    prompt,
  });

  // Strict JSON parse + validate
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch (e) { throw new Error("AI did not return valid JSON"); }

  const result = MechaSvgPartZ.safeParse(parsed);
  if (!result.success) {
    throw new Error("JSON shape invalid: " + result.error.toString());
  }
  return result.data;
}
