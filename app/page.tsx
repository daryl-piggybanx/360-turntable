import Turntable360 from "@/components/turntable-360"

export default function Home() {
  return (
    <div className="min-h-screen bg-grid-pattern bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl font-bold mb-2">360° Product Turntable</h1>
          <p className="text-white/50">Interactive rotating view of your collectible</p> */}
        </div>
        <Turntable360 />
      </div>
    </div>
  )
}
