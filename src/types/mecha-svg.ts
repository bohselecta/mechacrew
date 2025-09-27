import { z } from "zod";

export const AnchorZ = z.object({
  id: z.string(),              // e.g., "right_wrist_socket"
  x: z.number(),               // 0..width
  y: z.number(),               // 0..height
  type: z.enum(["male","female","flat"]).default("flat"),
});

export const SvgLayerZ = z.object({
  id: z.string(),
  d: z.string().min(1),        // SVG path data
  fill: z.string().default("#2E2E2E"),
  stroke: z.string().default("#101316"),
  strokeWidth: z.number().default(2),
  opacity: z.number().min(0).max(1).default(1),
});

export const MechaSvgPartZ = z.object({
  version: z.literal("1"),
  componentType: z.enum([
    "head","torso","left_arm","right_arm","left_leg","right_leg","weapon","sensor","backpack","shield"
  ]),
  name: z.string(),
  canvas: z.object({
    width: z.number().positive().default(256),
    height: z.number().positive().default(256),
    viewBox: z.string().default("0 0 256 256")
  }),
  style: z.object({
    palette: z.array(z.string()).min(3).max(6),
    shading: z.enum(["cel","flat"]).default("cel"),
    outline: z.boolean().default(true),
  }),
  anchors: z.array(AnchorZ).min(1),              // where this part connects
  bbox: z.object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() }),
  layers: z.array(SvgLayerZ).min(1),             // ordered paint stack
  massKg: z.number().optional(),
  powerWatts: z.number().optional(),
  durability: z.number().min(1).max(100).optional(),
});

export type MechaSvgPart = z.infer<typeof MechaSvgPartZ>;
export type Anchor = z.infer<typeof AnchorZ>;
export type SvgLayer = z.infer<typeof SvgLayerZ>;
