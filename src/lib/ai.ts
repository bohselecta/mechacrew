import { z } from "zod";
import { MechaSvgPartZ } from "@/types/mecha-svg";

// XAI/Grok API configuration
const XAI_API_KEY = process.env.XAI_API_KEY
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions'

export async function generateMechaSvgPart(args: {
  componentType: string;
  description: string;
  targetAnchorId: string;
}) {
  const { svgPartPrompt } = await import("./prompts");
  const prompt = svgPartPrompt(args);

  if (!XAI_API_KEY) {
    throw new Error('XAI API key not configured')
  }

  // Call XAI/Grok API directly
  const response = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${XAI_API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "grok-4-latest",
      stream: false,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`XAI API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices[0]?.message?.content

  if (!text) {
    throw new Error('No response from Grok')
  }

  // Strict JSON parse + validate
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch (e) { throw new Error("Grok did not return valid JSON"); }

  const result = MechaSvgPartZ.safeParse(parsed);
  if (!result.success) {
    throw new Error("JSON shape invalid: " + result.error.toString());
  }
  return result.data;
}
