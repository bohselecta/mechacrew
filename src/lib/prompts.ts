export const svgPartPrompt = (opts: {
  componentType: string;
  description: string;
  targetAnchorId: string; // where on the mecha it will snap
}) => `
You are a senior mecha concept artist and SVG engineer from a 1970s–80s anime studio.
Design a **${opts.componentType}** as a clean, cel-shaded SVG composed ONLY of path layers.

CONSTRAINTS
- Output **STRICT JSON** that conforms to MechaSvgPartZ (no backticks, no commentary).
- canvas.width/height = 256 each; viewBox "0 0 256 256".
- Use 3–6 colors max. Preferred palette: ["#E6322B","#08B0D5","#F9D648","#3F4A4F","#2E2E2E","#101316"].
- All visible shapes must be in "layers" as path "d" commands.
- Provide at least one anchor named "${opts.targetAnchorId}" aligned where this part connects to the body.
- Style: bold silhouettes, thick outlines, subtle cel shadows (one darker tone per fill if needed).
- No external images, filters, masks, or gradients. Paths only.

GUIDANCE
- For weapon/sensor parts, emphasize readable silhouettes and mounting plates.
- Add small greebles (vents, screws) as separate layers for depth.
- Keep anchors near sensible mechanical joints.

FIELDS
- version: "1"
- componentType: "${opts.componentType}"
- name: short string
- canvas: { width, height, viewBox }
- style: { palette, shading, outline }
- anchors: array with at least "${opts.targetAnchorId}"
- bbox: tight bounds of the visible geometry within 0..256
- layers: ordered path stack (back → front)
- optional: massKg, powerWatts, durability

Return ONLY the JSON object.`;
