"use client"

import { AnimatedCircularProgress } from "@/components/animated-circular-progress"

type VariantMetricsProps = {
  refractionRate: number
  artClarity: number
  isHovered: boolean
}

export function VariantMetrics({ refractionRate, artClarity, isHovered }: VariantMetricsProps) {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground font-mono">REFRACTION RATE</span>
          </div>
          <AnimatedCircularProgress
            value={refractionRate}
            max={100}
            size={60}
            strokeWidth={6}
            className="mx-auto"
            showValue={true}
            suffix=""
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground font-mono">ART CLARITY</span>
          </div>
          <AnimatedCircularProgress
            value={artClarity}
            max={100}
            size={60}
            strokeWidth={6}
            className="mx-auto"
            showValue={true}
            suffix="%"
          />
        </div>
      </div>
    </div>
  )
}
