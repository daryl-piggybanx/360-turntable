"use client"

import { useState } from "react"
import { VariantCard } from "@/components/variants/variant-card"
import { FilterSort } from "@/components/filter-sort"
import type { Variant } from "~/lib/variants/data"

interface VariantCategoryProps {
  category: {
    name: string
    displayName: string
    variants: Variant[]
  }
  index: number
}

export function VariantCategory({ category, index }: VariantCategoryProps) {
  const [filteredVariants, setFilteredVariants] = useState<Variant[]>(category.variants)

  return (
    <>
    <div className="space-y-6">
        <div className="mt-4">
          <FilterSort variants={category.variants} onFilteredVariantsChange={setFilteredVariants} hideCategory={true} />
        </div>

      <div className="text-center">
        <p className="text-white/50 text-sm font-mono">
          {filteredVariants.length} of {category.variants.length} variants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVariants.map((variant, variantIndex) => (
          <VariantCard key={`${category.name}-${variantIndex}`} variant={variant} index={variantIndex} />
        ))}
      </div>

      {filteredVariants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg font-mono">No variants match your filters</p>
          <p className="text-white/30 text-sm font-mono mt-2">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
    </>
  )
}
