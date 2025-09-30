"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

// Custom hook to dynamically load images from a directory
function useDirectoryImages(directory: string) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true)
        setError(null)
        
        // try to fetch a manifest file or use a known pattern
        // try to load images by attempting to fetch them in sequence
        const imagePromises: Promise<string | null>[] = []
        const maxImages = 25 // Based on the known range
        
        for (let i = 1; i <= maxImages; i++) {
          const imagePath = `${directory}/img${i.toString().padStart(2, '0')}.jpg`
          imagePromises.push(
            fetch(imagePath, { method: 'HEAD' })
              .then(response => response.ok ? imagePath : null)
              .catch(() => null)
          )
        }
        
        const results = await Promise.all(imagePromises)
        const validImages = results.filter((path): path is string => path !== null)
        
        if (validImages.length === 0) {
          throw new Error(`No images found in ${directory}`)
        }
        
        setImages(validImages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images')
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [directory])

  return { images, loading, error }
}

export default function Turntable360() {
  const [currentDirectory, setCurrentDirectory] = useState("/porsche")
  const { images, loading, error } = useDirectoryImages(currentDirectory)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(1) // 1 for forward (left), -1 for backward (right)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [isMagnifierEnabled, setIsMagnifierEnabled] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!isPlaying || isDragging) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + direction

        // check boundaries and reverse direction
        if (nextIndex >= images.length - 1) {
          setDirection(-1)
          return images.length - 1
        } else if (nextIndex <= 0) {
          setDirection(1)
          return 0
        }

        return nextIndex
      })
    }, 200) // adjust speed here

    return () => clearInterval(interval)
  }, [isPlaying, direction, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setIsPlaying(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartX
    const sensitivity = 5 // adjust sensitivity
    const imageChange = Math.floor(Math.abs(deltaX) / sensitivity)

    if (imageChange > 0) {
      const newDirection = deltaX > 0 ? 1 : -1
      const newIndex = Math.max(0, Math.min(images.length - 1, currentImageIndex + newDirection * imageChange))
      setCurrentImageIndex(newIndex)
      setDragStartX(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMagnifierMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnifierEnabled || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Only show magnifier if cursor is within image bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setMagnifierPosition({ x, y })
      setShowMagnifier(true)
    } else {
      setShowMagnifier(false)
    }
  }

  const handleMagnifierLeave = () => {
    setShowMagnifier(false)
  }

  const toggleMagnifier = () => {
    setIsMagnifierEnabled(!isMagnifierEnabled)
    setShowMagnifier(false)
  }
  
  const switchToPorsche = () => {
    setCurrentDirectory("/porsche")
    setCurrentImageIndex(0) // Reset to first image when switching
  }

  const switchToJobs = () => {
    setCurrentDirectory("/jobs")
    setCurrentImageIndex(0) // Reset to first image when switching
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading images</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No images found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div
          className="relative cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => {
            handleMouseMove(e)
            handleMagnifierMove(e)
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={(e) => {
            handleMouseUp()
            handleMagnifierLeave()
          }}
          style={{ cursor: isMagnifierEnabled && !isDragging ? "crosshair" : undefined }}
        >
          <img
            ref={imageRef}
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`Product view ${currentImageIndex + 1}`}
            className="w-full h-auto rounded-lg transition-opacity duration-75"
            draggable={false}
          />

          {/* Magnifier */}
          {isMagnifierEnabled && showMagnifier && imageRef.current && (
            <div
              className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full overflow-hidden"
              style={{
                width: "150px",
                height: "150px",
                left: `${magnifierPosition.x}px`,
                top: `${magnifierPosition.y}px`,
                transform: "translate(-50%, -50%)",
                backgroundImage: `url(${images[currentImageIndex]})`,
                backgroundSize: `${imageRef.current.width * 2}px ${imageRef.current.height * 2}px`,
                backgroundPosition: `-${magnifierPosition.x * 2 - 75}px -${magnifierPosition.y * 2 - 75}px`,
                backgroundRepeat: "no-repeat",
                zIndex: 50,
              }}
            >
              <div className="absolute inset-0 border-2 border-slate-400/50 rounded-full" />
            </div>
          )}

          {/* Rotation indicator */}
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">
              {Math.round(((currentImageIndex / (images.length - 1)) - 0.5) * 90)}°
            </span>
          </div>
        </div>
      </div>

      {/* Toggle between Porsche and Jobs */}
      <div className="flex items-center space-x-2 mb-4">
        <Button 
          onClick={switchToPorsche}
          variant={currentDirectory === "/porsche" ? "secondary" : "primary"}
        >
          Porsche
        </Button>
        <Button 
          onClick={switchToJobs}
          variant={currentDirectory === "/jobs" ? "secondary" : "primary"}
        >
          Jobs
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={togglePlayPause}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2 bg-transparent"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <Button
          onClick={toggleMagnifier}
          variant="outline"
          size="lg"
          className={`flex items-center space-x-2 ${isMagnifierEnabled ? "bg-white border-black text-black" : "bg-transparent"}`}
        >
          <ZoomIn className="w-5 h-5" />
          <span>Magnify</span>
        </Button>


        <div className="text-sm text-white/50">
          Frame {currentImageIndex + 1} of {images.length}
        </div>
      </div>

      {/* Progress bar */}
      {/* <div className="w-full max-w-lg">
        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-150 ease-out"
            style={{ width: `${(currentImageIndex / (images.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Right (0°)</span>
          <span>Left (45°)</span>
        </div>
      </div> */}

      <p className="text-sm text-white/50 text-center max-w-md">
      {isMagnifierEnabled
          ? "Hover over the image to magnify details • Click Magnify to disable"
          : "Drag the image to manually rotate • Click play/pause to control automatic rotation"}
      </p>
    </div>
  )
}
