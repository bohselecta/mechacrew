import type { MechaSvgPart } from "@/types/mecha-svg";

export type WorldPos = { x: number; y: number }; // canvas/world coords in your builder

export function computeSnapTransform(
  part: MechaSvgPart,
  targetWorld: WorldPos,
  anchorId: string
) {
  const a = part.anchors.find(a => a.id === anchorId);
  if (!a) return { translateX: 0, translateY: 0, scale: 1 };

  // Translate so anchor aligns to world position
  const translateX = targetWorld.x - a.x;
  const translateY = targetWorld.y - a.y;

  return { translateX, translateY, scale: 1 };
}
