"use client"

import { useState } from "react"
import Turntable360 from "@/components/turntable-360"
import VariantSelector from "@/components/variant-selector"
import { variants } from "@/lib/data"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function Home() {
  const [selectedVariant, setSelectedVariant] = useState(variants[0])
  const [showTurntable, setShowTurntable] = useState(false)

  return (
    <div className="min-h-screen bg-grid-pattern bg-black text-white justify-center p-4 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center py-6 md:py-8 space-y-2">
          {/* <h1 className="text-2xl md:text-3xl font-mono tracking-wider">{">> VARIANT ANALYSIS <<"}</h1> */}
          <p className="text-sm text-muted-foreground">{variants.length} total variants across 4 categories</p>
        </div>

        <div className="px-4 md:px-8 lg:px-6 lg:pb-6">
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Desktop Turntable - Hidden on mobile */}
            <div className="hidden lg:block lg:w-[40%] lg:sticky lg:top-6 lg:self-start">
              <div
                className="border border-white/20 rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden"
                style={{ height: "calc(100vh - 12rem)" }}
              >
                <Turntable360 variant={selectedVariant} />
              </div>
            </div>

            {/* Variant Selector - Full width on mobile, right side on desktop */}
            <div className="lg:flex-1">
              <VariantSelector
                selectedVariant={selectedVariant}
                onVariantChange={(variant) => {
                  setSelectedVariant(variant)
                  if (window.innerWidth < 1024) {
                    setShowTurntable(true)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showTurntable} onOpenChange={setShowTurntable}>
        <DialogContent className="max-w-4xl bg-black border-white/20">
          <Turntable360 variant={selectedVariant} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
