import { NextRequest, NextResponse } from "next/server";
import { generateMechaSvgPart } from "@/lib/ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { componentType, description, targetAnchorId } = await req.json();
    
    if (!componentType || !description || !targetAnchorId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const svgPart = await generateMechaSvgPart({ 
      componentType, 
      description, 
      targetAnchorId 
    });

    return NextResponse.json({
      success: true,
      svgPart
    });

  } catch (e: any) {
    console.error('SVG generation error:', e);
    return NextResponse.json({ 
      error: e.message ?? "SVG generation failed" 
    }, { status: 500 });
  }
}
