import { useState, useEffect } from 'react'
import {
  Flower2, Check, Crown, Sparkles, Download, Palette,
  Wand2, Camera, FileText, Layers, Zap, Eye, Package,
  TreeDeciduous, Sun, Droplets, Ruler
} from 'lucide-react'

// Demo plants matching realistic landscape designs
const DEMO_PLANTS = [
  { id: 1, icon: '🌲', name: 'Arborvitae', color: '#2E7D32', category: 'focal', size: 'Large' },
  { id: 2, icon: '🍁', name: 'Japanese Maple', color: '#C62828', category: 'focal', size: 'Medium' },
  { id: 3, icon: '💮', name: 'Hydrangea', color: '#AED581', category: 'middle', size: 'Medium' },
  { id: 4, icon: '🌲', name: 'Juniper', color: '#546E7A', category: 'front', size: 'Small' },
  { id: 5, icon: '🌿', name: 'Liriope', color: '#388E3C', category: 'ground', size: 'Ground' },
]

// Theme bundles to showcase (showing 6 of 25 available)
const THEME_BUNDLES = [
  { name: 'Augusta Classic', icon: '⛳', plants: 45, style: 'Southern Elegance', color: '#2E7D32' },
  { name: 'Tropical Paradise', icon: '🌴', plants: 38, style: 'Bold & Exotic', color: '#FF6F00' },
  { name: 'English Cottage', icon: '🏡', plants: 42, style: 'Romantic Layers', color: '#8E24AA' },
  { name: 'Japanese Zen', icon: '🎋', plants: 35, style: 'Minimalist Peace', color: '#5D4037' },
  { name: 'Modern Minimalist', icon: '🔲', plants: 28, style: 'Clean Lines', color: '#455A64' },
  { name: 'Desert Oasis', icon: '🌵', plants: 32, style: 'Drought-Smart', color: '#F4511E' },
]

// Plant positions for animation
const PLANT_POSITIONS = [
  { x: 50, y: 75 }, { x: 30, y: 55 }, { x: 70, y: 55 },
  { x: 20, y: 35 }, { x: 50, y: 30 }, { x: 80, y: 35 },
  { x: 35, y: 20 }, { x: 65, y: 20 },
]

// Scene definitions
const SCENES = [
  { id: 'design', label: 'Design', icon: Flower2 },
  { id: 'bundles', label: 'Bundles', icon: Package },
  { id: 'vision', label: 'AI Vision', icon: Wand2 },
  { id: 'analysis', label: 'Analysis', icon: Crown },
  { id: 'export', label: 'Export', icon: Download },
]

export default function AnimatedDemo() {
  const [currentScene, setCurrentScene] = useState(0)
  const [sceneProgress, setSceneProgress] = useState(0)
  const [placedPlants, setPlacedPlants] = useState([])
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [coverage, setCoverage] = useState(0)
  const [selectedBundle, setSelectedBundle] = useState(null)
  const [visionProgress, setVisionProgress] = useState(0)
  const [showRendered, setShowRendered] = useState(false)
  const [analysisItems, setAnalysisItems] = useState([])
  const [exportProgress, setExportProgress] = useState(0)

  // Main animation controller
  useEffect(() => {
    const sceneDurations = [8000, 5000, 6000, 5000, 4000] // Duration per scene
    const totalScenes = SCENES.length

    const runScene = async (sceneIndex) => {
      setCurrentScene(sceneIndex)
      setSceneProgress(0)

      // Reset scene-specific states
      if (sceneIndex === 0) {
        // Design scene
        setPlacedPlants([])
        setSelectedPlant(null)
        setCoverage(0)
        await animateDesignScene()
      } else if (sceneIndex === 1) {
        // Bundles scene
        setSelectedBundle(null)
        await animateBundleScene()
      } else if (sceneIndex === 2) {
        // Vision scene
        setVisionProgress(0)
        setShowRendered(false)
        await animateVisionScene()
      } else if (sceneIndex === 3) {
        // Analysis scene
        setAnalysisItems([])
        await animateAnalysisScene()
      } else if (sceneIndex === 4) {
        // Export scene
        setExportProgress(0)
        await animateExportScene()
      }
    }

    const animateDesignScene = async () => {
      const steps = [
        () => setSelectedPlant(DEMO_PLANTS[0]),
        () => { setPlacedPlants([{ ...DEMO_PLANTS[0], ...PLANT_POSITIONS[0] }]); setCoverage(15) },
        () => setSelectedPlant(DEMO_PLANTS[1]),
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[1], ...PLANT_POSITIONS[1] }]); setCoverage(30) },
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[1], ...PLANT_POSITIONS[2] }]); setCoverage(45) },
        () => setSelectedPlant(DEMO_PLANTS[3]),
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[3], ...PLANT_POSITIONS[3] }]); setCoverage(58) },
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[3], ...PLANT_POSITIONS[4] }]); setCoverage(70) },
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[3], ...PLANT_POSITIONS[5] }]); setCoverage(82) },
        () => setSelectedPlant(DEMO_PLANTS[4]),
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[4], ...PLANT_POSITIONS[6] }]); setCoverage(91) },
        () => { setPlacedPlants(p => [...p, { ...DEMO_PLANTS[4], ...PLANT_POSITIONS[7] }]); setCoverage(97); setSelectedPlant(null) },
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 500))
        steps[i]()
        setSceneProgress((i + 1) / steps.length * 100)
      }
      await new Promise(r => setTimeout(r, 1500))
    }

    const animateBundleScene = async () => {
      for (let i = 0; i < THEME_BUNDLES.length; i++) {
        await new Promise(r => setTimeout(r, 800))
        setSelectedBundle(i)
        setSceneProgress((i + 1) / THEME_BUNDLES.length * 100)
      }
      await new Promise(r => setTimeout(r, 1500))
    }

    const animateVisionScene = async () => {
      // Show "processing" animation
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(r => setTimeout(r, 100))
        setVisionProgress(i)
        setSceneProgress(i * 0.7)
      }
      await new Promise(r => setTimeout(r, 300))
      setShowRendered(true)
      setSceneProgress(100)
      await new Promise(r => setTimeout(r, 2000))
    }

    const animateAnalysisScene = async () => {
      const items = [
        { label: 'Color Harmony', score: 95, icon: '🎨' },
        { label: 'Layering Balance', score: 88, icon: '📊' },
        { label: 'Coverage Quality', score: 97, icon: '✅' },
        { label: 'Spacing Optimal', score: 92, icon: '📐' },
      ]
      for (let i = 0; i < items.length; i++) {
        await new Promise(r => setTimeout(r, 700))
        setAnalysisItems(prev => [...prev, items[i]])
        setSceneProgress((i + 1) / items.length * 100)
      }
      await new Promise(r => setTimeout(r, 1500))
    }

    const animateExportScene = async () => {
      const formats = ['PDF Blueprint', 'PNG Image', 'Plant List']
      for (let i = 0; i <= 100; i += 4) {
        await new Promise(r => setTimeout(r, 80))
        setExportProgress(i)
        setSceneProgress(i)
      }
      await new Promise(r => setTimeout(r, 1500))
    }

    // Run all scenes in sequence
    let cancelled = false
    const runAllScenes = async () => {
      while (!cancelled) {
        for (let i = 0; i < totalScenes; i++) {
          if (cancelled) break
          await runScene(i)
        }
      }
    }

    runAllScenes()
    return () => { cancelled = true }
  }, [])

  // Scene renderers
  const renderDesignScene = () => (
    <div className="flex h-full">
      {/* Left sidebar - Plant list */}
      <div className="w-44 bg-cream-50 border-r border-sage-200 p-3 flex flex-col">
        <div className="text-xs font-semibold text-sage-700 mb-2 flex items-center gap-1">
          <Flower2 className="w-3 h-3" />
          Plant Library
        </div>
        <div className="space-y-1.5 flex-1 overflow-hidden">
          {DEMO_PLANTS.map((plant) => (
            <div
              key={plant.id}
              className={`flex items-center gap-2 p-1.5 rounded-lg text-xs transition-all duration-300 ${
                selectedPlant?.id === plant.id
                  ? 'bg-sage-500 text-white ring-2 ring-sage-400 ring-offset-1 scale-105'
                  : 'bg-white border border-sage-100 text-sage-700'
              }`}
            >
              <span className="text-sm">{plant.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="truncate font-medium block text-[10px]">{plant.name}</span>
                <span className={`text-[8px] ${selectedPlant?.id === plant.id ? 'text-white/70' : 'text-sage-400'}`}>
                  {plant.size}
                </span>
              </div>
            </div>
          ))}
        </div>
        {selectedPlant && (
          <div className="mt-2 p-2 bg-sage-100 rounded-lg text-xs text-sage-600 text-center animate-pulse">
            Click canvas to place
          </div>
        )}
      </div>

      {/* Main canvas */}
      <div className="flex-1 bg-cream-100 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-sage-300 flex items-center justify-center">
              <Layers className="w-3 h-3 text-sage-600" />
            </div>
            <div className="w-5 h-5 rounded bg-sage-300 flex items-center justify-center">
              <Ruler className="w-3 h-3 text-sage-600" />
            </div>
          </div>
          <div className="text-[10px] text-sage-500 bg-white px-2 py-0.5 rounded">120" × 80"</div>
        </div>

        <div className="flex-1 relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg border-2 border-amber-300 overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundSize: '16px 16px',
            backgroundImage: 'linear-gradient(to right, rgba(120, 100, 70, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 100, 70, 0.4) 1px, transparent 1px)'
          }} />
          <div className="absolute inset-2 border-2 border-dashed border-sage-500/40 rounded" />

          {placedPlants.map((plant, index) => (
            <div
              key={`${plant.id}-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${plant.x}%`,
                top: `${plant.y}%`,
                animation: 'plantPop 0.4s ease-out'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50"
                style={{
                  width: plant.category === 'focal' ? 36 : plant.category === 'ground' ? 18 : 26,
                  height: plant.category === 'focal' ? 36 : plant.category === 'ground' ? 18 : 26,
                  backgroundColor: plant.color,
                  boxShadow: `0 4px 12px ${plant.color}50`
                }}
              >
                <span style={{ fontSize: plant.category === 'focal' ? 18 : plant.category === 'ground' ? 9 : 13 }}>
                  {plant.icon}
                </span>
              </div>
            </div>
          ))}

          {selectedPlant && placedPlants.length < 8 && (
            <div
              className="absolute w-7 h-7 pointer-events-none animate-bounce"
              style={{
                left: `${PLANT_POSITIONS[placedPlants.length]?.x || 50}%`,
                top: `${PLANT_POSITIONS[placedPlants.length]?.y || 50}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-full h-full rounded-full border-2 border-sage-500 border-dashed opacity-60 bg-sage-500/10" />
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar - Stats */}
      <div className="w-36 bg-cream-50 border-l border-sage-200 p-2.5">
        <div className="bg-white rounded-lg p-2 border border-sage-100 mb-2">
          <div className="flex items-center gap-1 mb-1.5">
            <Crown className="w-3 h-3 text-olive-500" />
            <span className="text-[10px] font-semibold text-sage-700">Coverage</span>
          </div>
          <div className="h-2 bg-sage-200 rounded-full overflow-hidden mb-1">
            <div
              className={`h-full transition-all duration-500 ${
                coverage >= 95 ? 'bg-green-500' : coverage >= 80 ? 'bg-olive-400' : 'bg-orange-400'
              }`}
              style={{ width: `${coverage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-sage-500">Quality</span>
            <span className={`font-bold ${coverage >= 95 ? 'text-green-600' : 'text-sage-600'}`}>
              {coverage}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 border border-sage-100 mb-2">
          <div className="text-[10px] text-sage-500">Plants Placed</div>
          <div className="text-xl font-bold text-sage-800">{placedPlants.length}</div>
        </div>

        <div className="bg-white rounded-lg p-2 border border-sage-100">
          <div className="text-[10px] font-semibold text-sage-700 mb-1.5">Checklist</div>
          <div className="space-y-1">
            {[
              { label: 'Focal point', done: placedPlants.some(p => p.category === 'focal') },
              { label: 'Color balance', done: placedPlants.length >= 3 },
              { label: '95% coverage', done: coverage >= 95 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px]">
                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  item.done ? 'bg-green-500' : 'bg-sage-200'
                }`}>
                  {item.done && <Check className="w-2 h-2 text-white" />}
                </div>
                <span className={item.done ? 'text-sage-700' : 'text-sage-400'}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderBundlesScene = () => (
    <div className="flex h-full">
      {/* Bundle selector */}
      <div className="w-56 bg-cream-50 border-r border-sage-200 p-3">
        <div className="text-xs font-semibold text-sage-700 mb-3 flex items-center gap-1">
          <Package className="w-3.5 h-3.5" />
          Theme Bundles
        </div>
        <div className="space-y-2">
          {THEME_BUNDLES.map((bundle, i) => (
            <div
              key={bundle.name}
              className={`p-2.5 rounded-xl border-2 transition-all duration-500 cursor-pointer ${
                selectedBundle === i
                  ? 'border-sage-500 bg-sage-50 shadow-lg scale-105'
                  : 'border-sage-200 bg-white hover:border-sage-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{bundle.icon}</span>
                <div>
                  <div className="font-semibold text-sage-800 text-xs">{bundle.name}</div>
                  <div className="text-[10px] text-sage-500">{bundle.style}</div>
                </div>
              </div>
              {selectedBundle === i && (
                <div className="mt-2 pt-2 border-t border-sage-200">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-sage-600">{bundle.plants} plants included</span>
                    <span className="text-sage-500 bg-sage-100 px-1.5 py-0.5 rounded">Pro</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-cream-100 p-4 flex flex-col">
        <div className="text-center mb-3">
          <span className="text-xs text-sage-500 bg-white px-3 py-1 rounded-full">
            {selectedBundle !== null ? `Previewing: ${THEME_BUNDLES[selectedBundle].name}` : 'Select a bundle'}
          </span>
        </div>
        <div className="flex-1 relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl border-2 border-amber-300 overflow-hidden">
          {selectedBundle !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="text-6xl mb-3 animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  {THEME_BUNDLES[selectedBundle].icon}
                </div>
                <div
                  className="text-lg font-bold mb-1"
                  style={{ color: THEME_BUNDLES[selectedBundle].color }}
                >
                  {THEME_BUNDLES[selectedBundle].name}
                </div>
                <div className="text-xs text-sage-600">
                  {THEME_BUNDLES[selectedBundle].plants} curated plants
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  {['🌸', '🌿', '🌺', '🌳', '💐'].slice(0, 4).map((e, i) => (
                    <span
                      key={i}
                      className="text-2xl animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 bg-sage-500 text-white px-4 py-2 rounded-lg text-xs font-medium">
            <Zap className="w-3 h-3" />
            One-Click Apply Bundle
          </div>
        </div>
      </div>

      {/* Bundle info */}
      <div className="w-40 bg-cream-50 border-l border-sage-200 p-3">
        <div className="text-xs font-semibold text-sage-700 mb-2">25 Bundles Include</div>
        <div className="space-y-2">
          {[
            { icon: '✓', text: 'Pre-designed combos' },
            { icon: '✓', text: 'Color coordinated' },
            { icon: '✓', text: 'Zone-matched plants' },
            { icon: '✓', text: '200+ plants total' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-sage-600 bg-white p-1.5 rounded">
              <span className="text-green-500">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
        <div className="mt-3 text-[9px] text-sage-400 text-center">
          Showing 6 of 25 bundles
        </div>
      </div>
    </div>
  )

  const renderVisionScene = () => (
    <div className="flex h-full">
      {/* Before */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="text-center mb-2">
          <span className="text-xs font-semibold text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
            Your Design
          </span>
        </div>
        <div className="flex-1 relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl border-2 border-amber-300 overflow-hidden">
          {/* Simple plant representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-24">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-xl">🌸</div>
              <div className="absolute top-6 left-2 w-7 h-7 bg-red-400 rounded-full flex items-center justify-center text-sm">🌹</div>
              <div className="absolute top-6 right-2 w-7 h-7 bg-red-400 rounded-full flex items-center justify-center text-sm">🌹</div>
              <div className="absolute bottom-2 left-0 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center text-xs">🌺</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center text-xs">🌺</div>
              <div className="absolute bottom-2 right-0 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center text-xs">🌺</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow with AI Processing */}
      <div className="w-32 flex flex-col items-center justify-center p-2">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg mb-2">
          <Wand2 className={`w-6 h-6 text-white ${visionProgress < 100 ? 'animate-pulse' : ''}`} />
        </div>
        <div className="text-xs font-semibold text-sage-700 mb-2">AI Vision</div>
        {visionProgress < 100 ? (
          <div className="w-full">
            <div className="h-1.5 bg-sage-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                style={{ width: `${visionProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-sage-500 text-center">Processing...</div>
          </div>
        ) : (
          <div className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            <Check className="w-3 h-3" /> Complete
          </div>
        )}
      </div>

      {/* After - Rendered */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="text-center mb-2">
          <span className="text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
            Photorealistic Render
          </span>
        </div>
        <div className={`flex-1 relative rounded-xl border-2 overflow-hidden transition-all duration-500 ${
          showRendered
            ? 'border-green-400 shadow-lg'
            : 'bg-sage-100 border-sage-200'
        }`}>
          {showRendered ? (
            <div className="absolute inset-0">
              {/* Real garden photo - elevated angle view matching AI output style */}
              {/* Shows foundation planting with evergreens, hydrangeas, and layered shrubs */}
              <img
                src="https://images.unsplash.com/photo-1598902108854-10e335adac99?w=800&q=80"
                alt="AI Generated Garden Render"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient for polish */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {/* Sparkle effects */}
              <Sparkles className="absolute top-3 right-3 w-5 h-5 text-yellow-300 animate-pulse drop-shadow-lg" />
              <Sparkles className="absolute bottom-3 left-3 w-4 h-4 text-yellow-300 animate-pulse drop-shadow-lg" style={{ animationDelay: '500ms' }} />
              {/* AI badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wand2 className="w-2.5 h-2.5" />
                AI Generated
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sage-400 text-xs">Waiting for render...</div>
            </div>
          )}
        </div>
        {showRendered && (
          <div className="mt-2 text-center">
            <span className="text-[10px] text-sage-500">HD render ready for export</span>
          </div>
        )}
      </div>
    </div>
  )

  const renderAnalysisScene = () => (
    <div className="flex h-full">
      {/* Analysis Results */}
      <div className="w-52 bg-cream-50 border-r border-sage-200 p-3">
        <div className="text-xs font-semibold text-sage-700 mb-3 flex items-center gap-1">
          <Crown className="w-3.5 h-3.5 text-olive-500" />
          Design Analysis
        </div>
        <div className="space-y-2">
          {analysisItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-2.5 border border-sage-100 shadow-sm"
              style={{ animation: 'slideIn 0.3s ease-out' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  <span className="text-xs font-medium text-sage-700">{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${
                  item.score >= 90 ? 'text-green-600' : item.score >= 80 ? 'text-olive-600' : 'text-orange-600'
                }`}>
                  {item.score}%
                </span>
              </div>
              <div className="h-1.5 bg-sage-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.score >= 90 ? 'bg-green-500' : item.score >= 80 ? 'bg-olive-400' : 'bg-orange-400'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
          {analysisItems.length === 0 && (
            <div className="text-xs text-sage-400 text-center py-4">
              Analyzing design...
            </div>
          )}
        </div>
      </div>

      {/* Main display */}
      <div className="flex-1 bg-cream-100 p-4 flex flex-col">
        <div className="flex-1 relative bg-white rounded-xl border border-sage-200 overflow-hidden">
          {/* Overall score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xs text-sage-500 mb-2">Overall Design Score</div>
            <div className={`text-6xl font-bold transition-all duration-500 ${
              analysisItems.length >= 4 ? 'text-green-500' : 'text-sage-300'
            }`}>
              {analysisItems.length >= 4 ? '93' : '--'}
            </div>
            <div className="text-sm text-sage-600 mt-1">
              {analysisItems.length >= 4 ? 'Excellent!' : 'Calculating...'}
            </div>
            {analysisItems.length >= 4 && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-xs text-sage-500">Pro Quality</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="w-44 bg-cream-50 border-l border-sage-200 p-3">
        <div className="text-xs font-semibold text-sage-700 mb-2">Recommendations</div>
        <div className="space-y-2 text-[10px]">
          {analysisItems.length >= 2 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-green-700">
              ✓ Great focal placement
            </div>
          )}
          {analysisItems.length >= 3 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-green-700">
              ✓ Colors complement well
            </div>
          )}
          {analysisItems.length >= 4 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-blue-700">
              💡 Consider liriope edging
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderExportScene = () => (
    <div className="flex h-full items-center justify-center bg-cream-100 p-6">
      <div className="text-center max-w-md">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl shadow-lg mb-3">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-sage-800">Export Your Design</h3>
          <p className="text-xs text-sage-500 mt-1">Professional formats ready to share</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: FileText, label: 'PDF Blueprint', color: 'red' },
            { icon: Camera, label: 'PNG Image', color: 'blue' },
            { icon: Layers, label: 'Plant List', color: 'green' },
          ].map((format, i) => (
            <div
              key={format.label}
              className={`bg-white rounded-xl p-3 border-2 transition-all duration-300 ${
                exportProgress >= (i + 1) * 33 ? 'border-sage-400 shadow-md' : 'border-sage-200'
              }`}
            >
              <format.icon className={`w-6 h-6 mx-auto mb-1 ${
                exportProgress >= (i + 1) * 33 ? 'text-sage-600' : 'text-sage-300'
              }`} />
              <div className="text-[10px] text-sage-600">{format.label}</div>
            </div>
          ))}
        </div>

        {exportProgress < 100 ? (
          <div className="w-full max-w-xs mx-auto">
            <div className="h-2 bg-sage-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-sage-500 transition-all duration-100"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="text-xs text-sage-500">Preparing exports...</div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">All formats ready!</span>
          </div>
        )}
      </div>
    </div>
  )

  const sceneRenderers = [
    renderDesignScene,
    renderBundlesScene,
    renderVisionScene,
    renderAnalysisScene,
    renderExportScene,
  ]

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-sage-200">
      {/* Scene tabs */}
      <div className="flex border-b border-sage-200 bg-cream-50">
        {SCENES.map((scene, i) => (
          <button
            key={scene.id}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium transition-all ${
              currentScene === i
                ? 'bg-white text-sage-800 border-b-2 border-sage-500 -mb-px'
                : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            <scene.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{scene.label}</span>
          </button>
        ))}
      </div>

      {/* Scene content */}
      <div className="h-[360px]">
        {sceneRenderers[currentScene]()}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-sage-100">
        <div
          className="h-full bg-sage-500 transition-all duration-200"
          style={{ width: `${sceneProgress}%` }}
        />
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes plantPop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes slideIn {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
