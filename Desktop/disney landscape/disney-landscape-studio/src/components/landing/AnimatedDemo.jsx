import { useState, useEffect } from 'react'
import { Flower2, Check, Crown } from 'lucide-react'

// Demo plants that will be "placed"
const DEMO_PLANTS = [
  { id: 1, icon: '🌸', name: 'Crape Myrtle', color: '#E91E63', category: 'focal' },
  { id: 2, icon: '🌹', name: 'Knockout Rose', color: '#D32F2F', category: 'middle' },
  { id: 3, icon: '💜', name: 'Blue Salvia', color: '#1565C0', category: 'middle' },
  { id: 4, icon: '🌺', name: 'Petunia', color: '#9C27B0', category: 'front' },
  { id: 5, icon: '🌿', name: 'Liriope', color: '#4CAF50', category: 'ground' },
]

// Positions where plants will be placed on canvas (percentage based)
const PLANT_POSITIONS = [
  { x: 50, y: 75 },  // Focal point back center
  { x: 30, y: 55 },  // Middle left
  { x: 70, y: 55 },  // Middle right
  { x: 20, y: 35 },  // Front left
  { x: 50, y: 30 },  // Front center
  { x: 80, y: 35 },  // Front right
  { x: 35, y: 20 },  // Ground cover
  { x: 65, y: 20 },  // Ground cover
]

export default function AnimatedDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [placedPlants, setPlacedPlants] = useState([])
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [coverage, setCoverage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  // Animation sequence
  useEffect(() => {
    if (!isAnimating) return

    const sequence = [
      // Step 0: Initial state
      { delay: 1000, action: () => setSelectedPlant(DEMO_PLANTS[0]) },
      // Step 1: Select first plant
      { delay: 800, action: () => {
        setPlacedPlants([{ ...DEMO_PLANTS[0], ...PLANT_POSITIONS[0] }])
        setCoverage(15)
      }},
      // Step 2: Place more plants
      { delay: 600, action: () => setSelectedPlant(DEMO_PLANTS[1]) },
      { delay: 500, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[1], ...PLANT_POSITIONS[1] }])
        setCoverage(30)
      }},
      { delay: 500, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[1], ...PLANT_POSITIONS[2] }])
        setCoverage(45)
      }},
      // Step 3: Add front row
      { delay: 600, action: () => setSelectedPlant(DEMO_PLANTS[3]) },
      { delay: 400, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[3], ...PLANT_POSITIONS[3] }])
        setCoverage(58)
      }},
      { delay: 400, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[3], ...PLANT_POSITIONS[4] }])
        setCoverage(70)
      }},
      { delay: 400, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[3], ...PLANT_POSITIONS[5] }])
        setCoverage(82)
      }},
      // Step 4: Add ground cover
      { delay: 600, action: () => setSelectedPlant(DEMO_PLANTS[4]) },
      { delay: 400, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[4], ...PLANT_POSITIONS[6] }])
        setCoverage(91)
      }},
      { delay: 400, action: () => {
        setPlacedPlants(prev => [...prev, { ...DEMO_PLANTS[4], ...PLANT_POSITIONS[7] }])
        setCoverage(97)
        setSelectedPlant(null)
      }},
      // Step 5: Pause to show complete design
      { delay: 2500, action: () => {
        // Reset for loop
        setPlacedPlants([])
        setSelectedPlant(null)
        setCoverage(0)
        setCurrentStep(0)
      }},
    ]

    let timeoutId
    let totalDelay = 0

    sequence.forEach((step, index) => {
      totalDelay += step.delay
      timeoutId = setTimeout(() => {
        step.action()
        setCurrentStep(index)
      }, totalDelay)
    })

    return () => clearTimeout(timeoutId)
  }, [isAnimating, currentStep === 0 && placedPlants.length === 0])

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-sage-200">
      {/* Mini app mockup */}
      <div className="flex h-[400px]">
        {/* Left sidebar - Plant list */}
        <div className="w-48 bg-cream-50 border-r border-sage-200 p-3 flex flex-col">
          <div className="text-xs font-semibold text-sage-700 mb-2 flex items-center gap-1">
            <Flower2 className="w-3 h-3" />
            Plant Library
          </div>

          <div className="space-y-1.5 flex-1">
            {DEMO_PLANTS.map((plant) => (
              <div
                key={plant.id}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all duration-300 ${
                  selectedPlant?.id === plant.id
                    ? 'bg-sage-500 text-white ring-2 ring-sage-400 ring-offset-1'
                    : 'bg-white border border-sage-100 text-sage-700'
                }`}
              >
                <span className="text-base">{plant.icon}</span>
                <span className="truncate font-medium">{plant.name}</span>
              </div>
            ))}
          </div>

          {/* Selected indicator */}
          {selectedPlant && (
            <div className="mt-2 p-2 bg-sage-100 rounded-lg text-xs text-sage-600 text-center animate-pulse">
              Click to place
            </div>
          )}
        </div>

        {/* Main canvas area */}
        <div className="flex-1 bg-cream-100 p-4 flex flex-col">
          {/* Mini toolbar */}
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-sage-200" />
              <div className="w-6 h-6 rounded bg-sage-200" />
              <div className="w-6 h-6 rounded bg-sage-200" />
            </div>
            <div className="text-xs text-sage-500">120" × 80"</div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative bg-gradient-to-b from-wood-200 to-wood-300 rounded-lg border border-wood-400 overflow-hidden">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundSize: '20px 20px',
                backgroundImage: 'linear-gradient(to right, rgba(103, 124, 86, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(103, 124, 86, 0.5) 1px, transparent 1px)'
              }}
            />

            {/* Bed edge */}
            <div className="absolute inset-2 border-2 border-dashed border-sage-500/30 rounded" />

            {/* Placed plants with animations */}
            {placedPlants.map((plant, index) => (
              <div
                key={`${plant.id}-${index}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                style={{
                  left: `${plant.x}%`,
                  top: `${plant.y}%`,
                  animation: 'plantPop 0.4s ease-out'
                }}
              >
                <div
                  className="rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    width: plant.category === 'focal' ? 40 : plant.category === 'ground' ? 20 : 28,
                    height: plant.category === 'focal' ? 40 : plant.category === 'ground' ? 20 : 28,
                    backgroundColor: plant.color,
                    boxShadow: `0 4px 12px ${plant.color}40`
                  }}
                >
                  <span style={{ fontSize: plant.category === 'focal' ? 20 : plant.category === 'ground' ? 10 : 14 }}>
                    {plant.icon}
                  </span>
                </div>
              </div>
            ))}

            {/* Cursor animation when placing */}
            {selectedPlant && placedPlants.length < 8 && (
              <div
                className="absolute w-8 h-8 pointer-events-none animate-bounce"
                style={{
                  left: `${PLANT_POSITIONS[placedPlants.length]?.x || 50}%`,
                  top: `${PLANT_POSITIONS[placedPlants.length]?.y || 50}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-sage-500 border-dashed opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Stats */}
        <div className="w-40 bg-cream-50 border-l border-sage-200 p-3">
          {/* Quality Score */}
          <div className="bg-white rounded-lg p-2 border border-sage-100 mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Crown className="w-3 h-3 text-olive-500" />
              <span className="text-xs font-semibold text-sage-700">Quality</span>
            </div>
            <div className="h-2 bg-sage-200 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  coverage >= 95 ? 'bg-sage-500' : coverage >= 80 ? 'bg-olive-400' : 'bg-orange-400'
                }`}
                style={{ width: `${coverage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-sage-500">Coverage</span>
              <span className={`font-bold ${coverage >= 95 ? 'text-sage-600' : 'text-sage-500'}`}>
                {coverage}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg p-2 border border-sage-100 mb-3">
            <div className="text-xs text-sage-500 mb-1">Plants</div>
            <div className="text-lg font-bold text-sage-800">{placedPlants.length}</div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-lg p-2 border border-sage-100">
            <div className="text-xs font-semibold text-sage-700 mb-2">Checklist</div>
            <div className="space-y-1">
              {[
                { label: 'Focal point', done: placedPlants.some(p => p.category === 'focal') },
                { label: 'Color harmony', done: placedPlants.length >= 3 },
                { label: '95% coverage', done: coverage >= 95 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    item.done ? 'bg-sage-500' : 'bg-sage-200'
                  }`}>
                    {item.done && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span className={item.done ? 'text-sage-700' : 'text-sage-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              Math.floor(currentStep / 2) >= step ? 'bg-sage-500' : 'bg-sage-200'
            }`}
          />
        ))}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes plantPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
