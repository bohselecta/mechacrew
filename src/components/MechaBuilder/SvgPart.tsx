"use client";
import React from "react";
import type { MechaSvgPart } from "@/types/mecha-svg";

export function SvgPart({ part, className }: { part: MechaSvgPart; className?: string }) {
  const { canvas, layers } = part;
  return (
    <svg
      className={className}
      width={canvas.width} height={canvas.height} viewBox={canvas.viewBox}
      role="img" aria-label={part.name}
    >
      {layers.map(l => (
        <path 
          key={l.id} 
          d={l.d} 
          fill={l.fill} 
          stroke={l.stroke} 
          strokeWidth={l.strokeWidth} 
          opacity={l.opacity}
        />
      ))}
    </svg>
  );
}
