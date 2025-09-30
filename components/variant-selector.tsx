"use client"

import { useState } from "react"
import { getCategories } from "@/lib/data"
import type { Variant } from "@/lib/data"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown, ChevronUp, Diamond } from "lucide-react"
import { FilterSort } from "@/components/filter-sort"
import { AnimatedHorizontalProgress } from "@/components/animated-horizontal-progress"
import { ComparisonBar } from "@/components/comparison-bar"
import { AnimatedCircularProgress } from "@/components/animated-circular-progress"
import { VariantProperties } from "@/components/variant-properties"

interface VariantSelectorProps {
  selectedVariant: Variant
  onVariantChange: (variant: Variant) => void
}

export default function VariantSelector({ selectedVariant, onVariantChange }: VariantSelectorProps) {
  const categories = getCategories()
  const [openCategory, setOpenCategory] = useState(categories[0].name)
  const [categoryFilteredVariants, setCategoryFilteredVariants] = useState<Record<string, Variant[]>>({})

  const handleCategoryFilterChange = (categoryName: string, filteredVariants: Variant[]) => {
    setCategoryFilteredVariants(prev => ({
      ...prev,
      [categoryName]: filteredVariants
    }))
  }

  return (
    <div className="space-y-4">
      {/* Category Sections */}
      {categories.map((category) => {
        const isOpen = openCategory === category.name
        const filteredVariants = categoryFilteredVariants[category.name] || category.variants

        return (
          <Collapsible
            key={category.name}
            open={isOpen}
            onOpenChange={() => setOpenCategory(isOpen ? "" : category.name)}
          >
            <div className="border border-white/20 rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold capitalize">{category.displayName}</h2>
                    <span className="text-sm text-muted-foreground">
                      {filteredVariants.length} of {category.variants.length} variants
                    </span>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-white/10">
                  {/* Filter and Sort Component for this category */}
                  <div className="p-4 border-b border-white/10">
                    <FilterSort
                      variants={category.variants}
                      onFilteredVariantsChange={(filtered) => handleCategoryFilterChange(category.name, filtered)}
                      hideCategory={true}
                    />
                  </div>

                  {/* Variants Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredVariants.map((variant) => {
                        const isSpecialty = variant.baseColor.name === "Specialty"

                        return (
                          <button
                            key={variant.name}
                            onClick={() => onVariantChange(variant)}
                            className="relative border border-white/20 rounded-lg p-4 text-left hover:bg-white/5 transition-all group"
                          >
                            {isSpecialty && <Diamond className="absolute top-3 right-3 w-5 h-5 text-white" />}

                            {/* Variant Name */}
                            <h3 className="text-lg font-bold mb-3">{variant.name}</h3>

                            <div className="space-y-3">
                              {/* Base Color & Refraction Type - Using VariantProperties */}
                              <VariantProperties
                                baseColor={variant.baseColor}
                                pattern={variant.pattern}
                                refractionType={variant.refractionType}
                                isHovered={false}
                              />

                              <div className="flex items-center justify-between">
                                {/* Refraction Rate - Using AnimatedCircularProgress */}
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Refraction Rate
                                  </span>
                                  <AnimatedCircularProgress
                                    value={variant.refractionRate}
                                    max={100}
                                    size={64}
                                    strokeWidth={4}
                                    className="text-white"
                                    showValue={true}
                                    suffix=""
                                  />
                                </div>

                                {/* Art Clarity - Using AnimatedCircularProgress */}
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Art Clarity
                                  </span>
                                  <AnimatedCircularProgress
                                    value={variant.artClarity}
                                    max={100}
                                    size={64}
                                    strokeWidth={4}
                                    className="text-white"
                                    showValue={true}
                                    suffix="%"
                                  />
                                </div>
                              </div>

                              {/* Clean vs Busy - Using ComparisonBar */}
                              <ComparisonBar
                                value={variant.cleanVsBusy}
                                leftLabel="CLEAN"
                                rightLabel="BUSY"
                                className="mb-2"
                              />

                              {/* Complexity - Using AnimatedHorizontalProgress */}
                              <AnimatedHorizontalProgress
                                value={variant.complexity}
                                maxValue={1000}
                                label="COMPLEXITY"
                                className="mb-2"
                              />
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}
    </div>
  )
}
