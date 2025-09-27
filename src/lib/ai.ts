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

  // Check if Grok returned an error message instead of JSON
  if (text.includes('An error occurred') || text.includes('I cannot') || text.includes('I\'m sorry')) {
    throw new Error('Grok returned an error: ' + text)
  }

  // Strict JSON parse + validate
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch (e) { 
    console.error('Grok response:', text)
    throw new Error("Grok did not return valid JSON. Response: " + text.substring(0, 100))
  }

  const result = MechaSvgPartZ.safeParse(parsed);
  if (!result.success) {
    console.error('Grok JSON validation failed:', result.error)
    // Return a fallback SVG part
    return {
      version: "1" as const,
      componentType: args.componentType as any,
      name: `${args.componentType} Component`,
      canvas: { width: 256, height: 256, viewBox: "0 0 256 256" },
      style: { palette: ["#E6322B", "#08B0D5", "#F9D648", "#3F4A4F", "#2E2E2E"], shading: "cel" as const, outline: true },
      anchors: [{ id: args.targetAnchorId, x: 128, y: 128, type: "flat" as const }],
      bbox: { x: 50, y: 50, width: 156, height: 156 },
      layers: [
        { id: "base", d: "M50 50 L206 50 L206 206 L50 206 Z", fill: "#3F4A4F", stroke: "#101316", strokeWidth: 2, opacity: 1 },
        { id: "accent", d: "M70 70 L186 70 L186 186 L70 186 Z", fill: "#E6322B", stroke: "#101316", strokeWidth: 2, opacity: 1 }
      ],
      massKg: 100,
      powerWatts: 50000,
      durability: 85
    }
  }
  return result.data;
}
