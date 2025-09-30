"use client"

import { cn } from "@/lib/utils"

type ComparisonBarProps = {
  value: number // 0-100 percentage
  leftLabel: string
  rightLabel: string
  className?: string
}

export function ComparisonBar({ value, leftLabel, rightLabel, className }: ComparisonBarProps) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="relative">
        <div className="flex justify-between text-xs text-muted-foreground font-mono mb-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>

        <div className="w-full bg-muted rounded-full h-2 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-900 to-red-400 rounded-full transition-all duration-300"
            style={{ width: `${value}%` }}
          />
          <div
            className="absolute top-0 w-3 h-3 bg-white border-2 border-gray-400 rounded-full transform -translate-y-0.5 transition-all duration-300"
            style={{ left: `calc(${value}% - 6px)` }}
          />
        </div>

        <div className="text-center mt-1">
          <span className="text-xs font-mono text-foreground">
            {value < 30 ? leftLabel : value > 70 ? rightLabel : "BALANCED"}
          </span>
        </div>
      </div>
    </div>
  )
}
