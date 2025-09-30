"use client"

import { Card } from "@/components/ui/card"
import { VariantHeader } from "./variant-header"
import { VariantProperties } from "./variant-properties"
import { VariantMetrics } from "./variant-metrics"
import { ComparisonBar } from "@/components/comparison-bar"
import { AnimatedHorizontalProgress } from "@/components/animated-horizontal-progress"
import { motion } from "motion/react"
import { useState } from "react"
import { Gem } from "lucide-react"
import type { Variant } from "~/lib/variants/data"

type VariantCardProps = {
  variant: Variant
  index?: number
}

export function VariantCard({ variant, index = 0 }: VariantCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleTouchStart = () => {
    setIsHovered(true)
  }

  const handleTouchEnd = () => {
    // small delay before removing hover state to allow for visual feedback
    setTimeout(() => setIsHovered(false), 150)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      once={true}
    >

      <Card
        className={`relative bg-black metallic-silver-border hover-invert-text hover-invert-progress transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-6">
          {variant.baseColor.name === "Specialty" && (
            <div className="absolute top-4 right-4">
              <Gem className={`w-5 h-5 transition-colors duration-300 ${isHovered ? "text-black" : "text-white"}`} />
            </div>
          )}

          <VariantHeader
            name={variant.name}
            baseColor={variant.baseColor}
            isHovered={isHovered}
          />

          <VariantProperties
            baseColor={variant.baseColor}
            pattern={variant.pattern}
            refractionType={variant.refractionType}
            isHovered={isHovered}
          />

          <VariantMetrics
            refractionRate={variant.refractionRate}
            artClarity={variant.artClarity}
            isHovered={isHovered}
          />

          <ComparisonBar value={variant.cleanVsBusy} leftLabel="CLEAN" rightLabel="BUSY" />

          <AnimatedHorizontalProgress
            value={variant.complexity}
            maxValue={1000}
            label="COMPLEXITY"
            isHovered={isHovered}
          />
        </div>
      </Card>
    </motion.div>
  )
}
