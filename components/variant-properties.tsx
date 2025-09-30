"use client"

import { Badge } from "@/components/ui/badge"
import type { RefractionType } from "@/lib/data"

type VariantPropertiesProps = {
  baseColor: {
    name: string
    hex: string
  }
  pattern: {
    name: string
    description: string
  }
  refractionType: RefractionType
  isHovered: boolean
}

export function VariantProperties({ baseColor, pattern, refractionType, isHovered }: VariantPropertiesProps) {
  return (
    <div className="mb-4 space-y-3 flex items-start gap-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-muted-foreground font-mono">BASE COLOR</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-gray-400" style={{ backgroundColor: baseColor.hex }} />
          <Badge variant="outline" className="text-xs font-mono">
            {baseColor.name}
          </Badge>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-muted-foreground font-mono">REFRACTION</span>
        </div>
        <Badge variant={refractionType === "color" ? "default" : "secondary"} className="font-mono text-xs text-muted-foreground">
          {refractionType.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}
