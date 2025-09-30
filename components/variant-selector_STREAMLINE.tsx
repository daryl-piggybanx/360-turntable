"use client"

import { useState } from "react"
import { getCategories } from "@/lib/data"
import type { Variant } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { VariantProperties } from "./variant-properties"
import { VariantMetrics } from "./variant-metrics"
import { ComparisonBar } from "./comparison-bar"
import { AnimatedHorizontalProgress } from "./animated-horizontal-progress"
import { Gem } from "lucide-react"

interface VariantSelectorProps {
  selectedVariant: Variant
  onVariantChange: (variant: Variant) => void
}

export default function VariantSelector({ selectedVariant, onVariantChange }: VariantSelectorProps) {
  const categories = getCategories()
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name)
  const [isHovered, setIsHovered] = useState(false)

  const currentCategory = categories.find((c) => c.name === selectedCategory)

  return (
    <div className="w-full space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category.name
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:scale-102"
              }`}
            >
              <span className="capitalize">{category.displayName}</span>
              <Badge variant="secondary" className={isActive ? "bg-white/20 text-white" : ""}>
                {category.variants.length}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Variant Grid */}
      <ScrollArea className="h-[400px] w-full rounded-lg border bg-white p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {currentCategory?.variants.map((variant) => {
            const isSelected = selectedVariant.name === variant.name
            return (
              <button
                key={variant.name}
                onClick={() => onVariantChange(variant)}
                className={`group relative p-4 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-105 ring-4 ring-blue-200"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:scale-102 hover:shadow-md"
                }`}
              >
                {/* Specialty Indicator */}
                {variant.baseColor.name === "Specialty" && (
                  <div className="absolute top-2 right-2">
                    <Gem className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-600"}`} />
                  </div>
                )}

                {/* Variant Name */}
                <div className="text-sm font-semibold text-center mb-2 leading-tight">{variant.name}</div>

                {/* Minimal Visual Indicators */}
                <div className="flex flex-col gap-1">
                  {/* Refraction Type Badge */}
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full text-center ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : variant.refractionType === "color"
                          ? "bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 text-slate-700"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {variant.refractionType === "color" ? "Color" : "Mono"}
                  </div>

                  {/* Base Color Indicator */}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: variant.baseColor.hex }}
                    />
                    <span className={`text-xs ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                      {variant.baseColor.name}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Detailed Selected Variant Info with Specialized Components */}
      <div 
        className="bg-white rounded-lg p-6 shadow-sm border transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header with Specialty Indicator */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-2xl text-slate-800 mb-1">{selectedVariant.name}</h3>
            <p className="text-sm text-slate-500 capitalize font-medium">{selectedVariant.category}</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedVariant.baseColor.name === "Specialty" && (
              <Gem className="w-5 h-5 text-slate-600" />
            )}
            <Badge
              variant="outline"
              className={
                selectedVariant.baseColor.name === "Specialty"
                  ? "bg-gradient-to-r from-red-50 to-red-100 border-red-300 text-red-700"
                  : ""
              }
            >
              {selectedVariant.baseColor.name}
            </Badge>
          </div>
        </div>

        {/* Pattern Description */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="text-sm font-medium text-slate-700 mb-1">{selectedVariant.pattern.name}</div>
          <div className="text-xs text-slate-500">{selectedVariant.pattern.description}</div>
        </div>

        {/* Variant Properties Component */}
        <VariantProperties
          baseColor={selectedVariant.baseColor}
          pattern={selectedVariant.pattern}
          refractionType={selectedVariant.refractionType}
          isHovered={isHovered}
        />

        {/* Variant Metrics Component */}
        <VariantMetrics
          refractionRate={selectedVariant.refractionRate}
          artClarity={selectedVariant.artClarity}
          isHovered={isHovered}
        />

        {/* Comparison Bar Component */}
        <ComparisonBar 
          value={selectedVariant.cleanVsBusy} 
          leftLabel="CLEAN" 
          rightLabel="BUSY" 
        />

        {/* Animated Horizontal Progress Component */}
        <AnimatedHorizontalProgress
          value={selectedVariant.complexity}
          maxValue={1000}
          label="COMPLEXITY"
          isHovered={isHovered}
        />
      </div>
    </div>
  )
}
