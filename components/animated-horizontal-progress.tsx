"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

type AnimatedHorizontalProgressProps = {
  value: number // 0-1000
  maxValue?: number
  label?: string
  className?: string
  isHovered?: boolean
}

export function AnimatedHorizontalProgress({
  value,
  maxValue = 1000,
  label = "COMPLEXITY",
  className,
  isHovered = false,
}: AnimatedHorizontalProgressProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const duration = 1000 // 1 second
      const steps = 60 // 60fps
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setAnimatedValue(value)
          clearInterval(timer)
        } else {
          setAnimatedValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  const percentage = isVisible ? (value / maxValue) * 100 : 0

  return (
    <div ref={ref} className={cn("mb-4", className)}>
      <div className="flex justify-between text-xs text-muted-foreground font-mono mb-1">
        <span>{label}</span>
        <span>
          {animatedValue}/{maxValue}
        </span>
      </div>

      <div className={`w-full ${ isHovered ? "bg-muted" : "bg-black" } rounded-full h-2 relative overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isHovered ? "bg-black" : "bg-white drop-shadow-[0_0_6px_white]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="text-center mt-1">
        <span className="text-xs font-mono text-foreground">
          {animatedValue < maxValue * 0.3 ? "SIMPLE" : animatedValue > maxValue * 0.7 ? "COMPLEX" : "MODERATE"}
        </span>
      </div>
    </div>
  )
}
