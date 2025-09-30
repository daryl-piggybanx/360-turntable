"use client"

type VariantHeaderProps = {
  name: string
  baseColor: {
    name: string
    hex: string
  }
  isHovered: boolean
}

export function VariantHeader({ name, baseColor, isHovered }: VariantHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground font-mono">{name}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
