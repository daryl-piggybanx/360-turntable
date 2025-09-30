"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Filter, SortAsc, X, Menu } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import type { Variant } from "@/lib/data"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

type FilterSortProps = {
  variants: Variant[]
  onFilteredVariantsChange: (filteredVariants: Variant[]) => void
  hideCategory?: boolean
}

type SortOption = "refractionRate" | "artClarity" | "complexity"
type SortDirection = "asc" | "desc"

type ActiveFilter = {
  type: string
  value: string
  label: string
  color?: string
}

export function FilterSort({ variants, onFilteredVariantsChange, hideCategory = false }: FilterSortProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBaseColor, setSelectedBaseColor] = useState<string>("all")
  const [selectedRefractionType, setSelectedRefractionType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [filteredCount, setFilteredCount] = useState(variants.length)
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get unique values for filter options
  const categories = Array.from(new Set(variants.map((v) => v.category)))
  const baseColors = Array.from(
    new Set(variants.map((v) => ({ name: v.baseColor.name, hex: v.baseColor.hex }))),
  ).filter((color, index, self) => self.findIndex((c) => c.name === color.name) === index)

  const activeFilters: ActiveFilter[] = []

  if (!hideCategory && selectedCategory !== "all") {
    activeFilters.push({
      type: "category",
      value: selectedCategory,
      label: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1),
    })
  }

  if (selectedBaseColor !== "all") {
    const colorData = baseColors.find((c) => c.name === selectedBaseColor)
    activeFilters.push({
      type: "baseColor",
      value: selectedBaseColor,
      label: selectedBaseColor,
      color: colorData?.hex,
    })
  }

  if (selectedRefractionType !== "all") {
    activeFilters.push({
      type: "refractionType",
      value: selectedRefractionType,
      label: selectedRefractionType.charAt(0).toUpperCase() + selectedRefractionType.slice(1),
    })
  }

  useEffect(() => {
    const filtered = variants.filter((variant) => {
      const categoryMatch = hideCategory || selectedCategory === "all" || variant.category === selectedCategory
      const baseColorMatch = selectedBaseColor === "all" || variant.baseColor.name === selectedBaseColor
      const refractionTypeMatch = selectedRefractionType === "all" || variant.refractionType === selectedRefractionType

      return categoryMatch && baseColorMatch && refractionTypeMatch
    })

    // Sort the filtered results if sort is active
    if (sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]
        const comparison = aValue - bValue
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    onFilteredVariantsChange(filtered)
    setFilteredCount(filtered.length)
  }, [
    variants,
    selectedCategory,
    selectedBaseColor,
    selectedRefractionType,
    sortBy,
    sortDirection,
    onFilteredVariantsChange,
    hideCategory,
  ])

  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case "category":
        setSelectedCategory("all")
        break
      case "baseColor":
        setSelectedBaseColor("all")
        break
      case "refractionType":
        setSelectedRefractionType("all")
        break
    }
  }

  const removeSort = () => {
    setSortBy(null)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "category":
        setSelectedCategory(value)
        break
      case "baseColor":
        setSelectedBaseColor(value)
        break
      case "refractionType":
        setSelectedRefractionType(value)
        break
    }
  }

  const handleSortChange = (newSortBy: SortOption, newDirection?: SortDirection) => {
    setSortBy(newSortBy)
    if (newDirection) {
      setSortDirection(newDirection)
    }
  }
  

  if (isMobile) {
    const mobileButton = (
      <div className="fixed bottom-4 left-4 right-4 z-[9999]" style={{ position: 'fixed' }}>
        <div className="flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/80 rounded-lg p-4 shadow-2xl">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center w-full gap-1 px-2 py-2 bg-black/20 border border-white/10 rounded-lg text-white/90 hover:border-white/30 hover:bg-black/30 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              {/* <Menu className="w-4 h-4" /> */}
              <span className="font-mono text-sm">Filter & Sort</span>
              {(activeFilters.length > 0 || sortBy) && (
                <span className="bg-white/20 text-white/90 text-xs px-2 py-1 rounded-full">
                  {activeFilters.length + (sortBy ? 1 : 0)}
                </span>
              )}
            </div>
            {/* <p className="text-white/50 text-xs font-mono">
              {filteredCount} of {variants.length} variants
            </p> */}
          </button>
        </div>
      </div>
    )

    return (
      <>
        {isMounted && createPortal(mobileButton, document.body)}

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="bg-black/90 border-white/10 backdrop-blur-xl z-[9999]">
            <DrawerHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-xl font-mono text-white/90">Filter & Sort</DrawerTitle>
                <DrawerClose asChild>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
              {/* Sort Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SortAsc className="w-4 h-4 text-white/70" />
                  <h3 className="text-sm font-mono text-white/70 uppercase tracking-wider">Sort</h3>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <select
                      value={sortBy || ""}
                      onChange={(e) =>
                        e.target.value ? handleSortChange(e.target.value as SortOption) : setSortBy(null)
                      }
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 appearance-none cursor-pointer hover:border-white/40 transition-colors"
                    >
                      <option value="">No Sort</option>
                      <option value="refractionRate">Refraction Rate</option>
                      <option value="artClarity">Art Clarity</option>
                      <option value="complexity">Complexity</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>

                  {sortBy && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSortChange(sortBy, "asc")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortDirection === "asc"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        Low to High ↑
                      </button>
                      <button
                        onClick={() => handleSortChange(sortBy, "desc")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortDirection === "desc"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        High to Low ↓
                      </button>
                    </div>
                  )}
                </div>
              </div>

                  
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-white/70" />
                  <h3 className="text-sm font-mono text-white/70 uppercase tracking-wider">Filters</h3>
                </div>

                {!hideCategory && (
                  <div>
                  <label className="block text-sm text-white/60 mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFilterChange("category", "all")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === "all"
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleFilterChange("category", category)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Base Colors Filter */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Base Colors</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFilterChange("baseColor", "all")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedBaseColor === "all"
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                      }`}
                    >
                      All Colors
                    </button>
                    {baseColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleFilterChange("baseColor", color.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedBaseColor === color.name
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Refraction Type Filter */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Refraction Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilterChange("refractionType", "all")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedRefractionType === "all"
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      onClick={() => handleFilterChange("refractionType", "color")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedRefractionType === "color"
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                      }`}
                    >
                      Color
                    </button>
                    <button
                      onClick={() => handleFilterChange("refractionType", "monochrome")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedRefractionType === "monochrome"
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                      }`}
                    >
                      Mono
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      <div className="sticky top-4 z-30 mb-4 flex justify-start">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-start gap-1 px-4 py-3 bg-black/40 backdrop-blur-xl border border-white/80 rounded-lg text-white/90 hover:border-white/30 hover:bg-black/30 transition-all duration-200 pointer-events-auto cursor-pointer hover:opacity-80"
        >
          <div className="flex items-center gap-2">
            {/* <Menu className="w-4 h-4" /> */}
            <span className="font-mono text-sm">Filter & Sort</span>
            {(activeFilters.length > 0 || sortBy) && (
              <span className="bg-white/20 text-white/90 text-xs px-2 py-1 rounded-full">
                {activeFilters.length + (sortBy ? 1 : 0)}
              </span>
            )}
          </div>
            <p className="text-white/50 text-xs font-mono">
              {filteredCount} of {variants.length} variants
            </p>
        </button>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-96 bg-black/90 border-r border-white/10 backdrop-blur-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-mono text-white/90">Filter & Sort</h2>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>

                {/* Sort Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <SortAsc className="w-4 h-4 text-white/70" />
                    <h3 className="text-sm font-mono text-white/70 uppercase tracking-wider">Sort</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={sortBy || ""}
                        onChange={(e) =>
                          e.target.value ? handleSortChange(e.target.value as SortOption) : setSortBy(null)
                        }
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 appearance-none cursor-pointer hover:border-white/40 transition-colors"
                      >
                        <option value="">No Sort</option>
                        <option value="refractionRate">Refraction Rate</option>
                        <option value="artClarity">Art Clarity</option>
                        <option value="complexity">Complexity</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>

                    {sortBy && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSortChange(sortBy, "asc")}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            sortDirection === "asc"
                              ? "bg-white/20 text-white border border-white/30"
                              : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                          }`}
                        >
                          Low to High ↑
                        </button>
                        <button
                          onClick={() => handleSortChange(sortBy, "desc")}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            sortDirection === "desc"
                              ? "bg-white/20 text-white border border-white/30"
                              : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                          }`}
                        >
                          High to Low ↓
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-white/70" />
                    <h3 className="text-sm font-mono text-white/70 uppercase tracking-wider">Filters</h3>
                  </div>

                  {!hideCategory && (
                    <div>
                    <label className="block text-sm text-white/60 mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange("category", "all")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === "all"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleFilterChange("category", category)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category
                              ? "bg-white/20 text-white border border-white/30"
                              : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Base Colors Filter */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Base Colors</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange("baseColor", "all")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedBaseColor === "all"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        All Colors
                      </button>
                      {baseColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => handleFilterChange("baseColor", color.name)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedBaseColor === color.name
                              ? "bg-white/20 text-white border border-white/30"
                              : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Refraction Type Filter */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Refraction Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFilterChange("refractionType", "all")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedRefractionType === "all"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        All Types
                      </button>
                      <button
                        onClick={() => handleFilterChange("refractionType", "color")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedRefractionType === "color"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        Color
                      </button>
                      <button
                        onClick={() => handleFilterChange("refractionType", "monochrome")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedRefractionType === "monochrome"
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-black/40 text-white/70 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
