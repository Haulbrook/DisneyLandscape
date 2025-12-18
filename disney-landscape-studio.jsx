import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Flower2, Trees, Shrub, Leaf, Grid3X3, ZoomIn, ZoomOut, 
  RotateCcw, Download, Upload, Eye, Palette, Ruler, Check, 
  X, ChevronRight, ChevronDown, Search, Package, Sparkles,
  Layers, Settings, Info, Move, Trash2, Copy, FlipHorizontal,
  Sun, CloudRain, Thermometer, Star, Crown, CircleDot, Moon
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// CASTLE MAGIC THEMES - Day & Night
// ═══════════════════════════════════════════════════════════════════════════════

const THEMES = {
  night: {
    name: 'Castle Night',
    icon: '🌙',
    // Backgrounds
    pageBg: 'from-indigo-950 via-purple-950 to-slate-950',
    headerBg: 'bg-indigo-950/80',
    sidebarBg: 'bg-purple-950/50',
    canvasBg: 'bg-indigo-950/50',
    cardBg: 'bg-purple-900/30',
    inputBg: 'bg-indigo-900/50',
    // Borders
    borderColor: 'border-purple-800/50',
    borderAccent: 'border-purple-600',
    borderHover: 'hover:border-purple-500/50',
    // Text
    textPrimary: 'text-white',
    textSecondary: 'text-purple-200',
    textMuted: 'text-purple-400',
    textAccent: 'text-amber-400',
    textHighlight: 'text-purple-300',
    // Gradients
    gradientPrimary: 'from-purple-600 to-indigo-600',
    gradientHover: 'hover:from-purple-500 hover:to-indigo-500',
    gradientAccent: 'from-amber-500 via-yellow-400 to-amber-500',
    gradientTitle: 'from-purple-300 via-pink-200 to-amber-300',
    // Accents
    accentPrimary: 'bg-purple-600',
    accentHover: 'hover:bg-purple-500',
    accentMuted: 'bg-purple-900/20',
    accentSuccess: 'bg-purple-500',
    accentRing: 'ring-purple-500/20',
    focusRing: 'focus:ring-purple-500/50',
    // Special
    glowColor: 'from-purple-500 via-pink-500 to-amber-500',
    scoreGradient: 'from-purple-500 to-pink-400',
    gridColor: 'rgba(168, 85, 247, 0.5)',
    canvasGradient: 'from-purple-900/30 to-indigo-950/50',
  },
  day: {
    name: 'Castle Day',
    icon: '☀️',
    // Backgrounds
    pageBg: 'from-sky-100 via-purple-100 to-pink-100',
    headerBg: 'bg-white/80',
    sidebarBg: 'bg-white/50',
    canvasBg: 'bg-purple-50/50',
    cardBg: 'bg-white/60',
    inputBg: 'bg-white/70',
    // Borders
    borderColor: 'border-purple-200',
    borderAccent: 'border-purple-400',
    borderHover: 'hover:border-purple-300',
    // Text
    textPrimary: 'text-purple-900',
    textSecondary: 'text-purple-700',
    textMuted: 'text-purple-500',
    textAccent: 'text-amber-600',
    textHighlight: 'text-purple-600',
    // Gradients
    gradientPrimary: 'from-purple-500 to-pink-500',
    gradientHover: 'hover:from-purple-400 hover:to-pink-400',
    gradientAccent: 'from-amber-400 via-yellow-300 to-amber-400',
    gradientTitle: 'from-purple-600 via-pink-500 to-amber-500',
    // Accents
    accentPrimary: 'bg-purple-500',
    accentHover: 'hover:bg-purple-400',
    accentMuted: 'bg-purple-100',
    accentSuccess: 'bg-purple-400',
    accentRing: 'ring-purple-300/50',
    focusRing: 'focus:ring-purple-300/50',
    // Special
    glowColor: 'from-purple-400 via-pink-400 to-amber-400',
    scoreGradient: 'from-purple-400 to-pink-300',
    gridColor: 'rgba(168, 85, 247, 0.3)',
    canvasGradient: 'from-amber-100/50 to-purple-100/50',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISNEY LANDSCAPE RULES - The Non-Negotiable Standards
// ═══════════════════════════════════════════════════════════════════════════════

const DISNEY_RULES = {
  spacing: {
    FRONT_ROW: { min: 6, max: 8, label: 'Ground Cover / Edging' },
    MIDDLE_ROW: { min: 12, max: 18, label: 'Mid-Height Plants' },
    BACK_ROW: { min: 24, max: 36, label: 'Tall Shrubs' },
    FOCAL_POINT: { min: 48, max: 72, label: 'Specimen Trees' }
  },
  coverage: {
    MIN_LIVING: 0.95,
    MAX_MULCH: 0.05,
    EDGE_BUFFER: 2,
    OVERLAP_TOLERANCE: 0.15
  },
  colorSchemes: {
    ANALOGOUS: { name: 'Analogous', maxHues: 3, desc: 'Adjacent colors on wheel' },
    COMPLEMENTARY: { name: 'Complementary', maxHues: 2, desc: 'Opposite colors' },
    MONOCHROMATIC: { name: 'Monochromatic', maxHues: 1, desc: 'Single hue variations' },
    TRIADIC: { name: 'Triadic', maxHues: 3, desc: 'Equidistant on wheel' }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISNEY PLANT DATABASE - Curated Species Collection
// ═══════════════════════════════════════════════════════════════════════════════

const PLANT_DATABASE = {
  focal: [
    { id: 'crape-myrtle', name: 'Crape Myrtle', height: '15-25ft', spread: '15-20ft', color: '#E91E63', bloomTime: 'Summer', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌸', category: 'focal', disneyUse: 'Main Street USA focal trees' },
    { id: 'japanese-maple', name: 'Japanese Maple', height: '15-25ft', spread: '15-20ft', color: '#C62828', bloomTime: 'Spring foliage', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🍁', category: 'focal', disneyUse: 'Japan Pavilion, Fantasyland' },
    { id: 'magnolia-south', name: 'Southern Magnolia', height: '60-80ft', spread: '30-40ft', color: '#FFFFFF', bloomTime: 'Spring-Summer', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌺', category: 'focal', disneyUse: 'Grand entrances, Southern theming' },
    { id: 'live-oak', name: 'Live Oak', height: '40-80ft', spread: '60-100ft', color: '#2E7D32', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌳', category: 'focal', disneyUse: 'Liberty Square, shade canopy' },
  ],
  topiary: [
    { id: 'spiral-juniper', name: 'Spiral Juniper', height: '6-8ft', spread: '2-3ft', color: '#1B5E20', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌀', category: 'topiary', shape: 'spiral', disneyUse: 'Formal garden accents' },
    { id: 'ball-boxwood', name: 'Ball Boxwood', height: '2-4ft', spread: '2-4ft', color: '#33691E', bloomTime: 'Evergreen', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '⚫', category: 'topiary', shape: 'ball', disneyUse: 'EPCOT topiaries, formal beds' },
    { id: 'cone-arborvitae', name: 'Cone Arborvitae', height: '10-15ft', spread: '3-4ft', color: '#2E7D32', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🔺', category: 'topiary', shape: 'cone', disneyUse: 'Formal entrances, vertical accent' },
    { id: 'pom-pom-juniper', name: 'Pom Pom Juniper', height: '4-6ft', spread: '2-3ft', color: '#1B5E20', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Low', icon: '🎄', category: 'topiary', shape: 'pom-pom', disneyUse: 'Whimsical gardens, Fantasyland' },
  ],
  back: [
    { id: 'holly-nellie', name: "Holly 'Nellie Stevens'", height: '15-25ft', spread: '8-12ft', color: '#1B5E20', bloomTime: 'Evergreen + berries', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '🌲', category: 'back', disneyUse: 'Privacy screening, winter interest' },
    { id: 'camellia', name: 'Camellia japonica', height: '6-12ft', spread: '6-10ft', color: '#E91E63', bloomTime: 'Winter-Spring', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🌷', category: 'back', disneyUse: 'Japan Pavilion, elegant blooms' },
    { id: 'azalea-encore', name: "Azalea 'Encore'", height: '4-5ft', spread: '4-5ft', color: '#EC407A', bloomTime: 'Spring + Fall', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '💮', category: 'back', disneyUse: 'Mass color, reblooming' },
    { id: 'loropetalum', name: 'Loropetalum', height: '6-10ft', spread: '6-10ft', color: '#880E4F', bloomTime: 'Spring', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '🌸', category: 'back', disneyUse: 'Purple foliage contrast' },
  ],
  middle: [
    { id: 'knockout-rose', name: 'Knockout Rose', height: '3-4ft', spread: '3-4ft', color: '#D32F2F', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌹', category: 'middle', disneyUse: 'Continuous color, low maintenance' },
    { id: 'blue-salvia', name: 'Blue Salvia', height: '2-3ft', spread: '2ft', color: '#1565C0', bloomTime: 'Summer-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '💜', category: 'middle', disneyUse: 'Vertical blue spikes' },
    { id: 'lantana', name: 'Lantana', height: '2-4ft', spread: '3-4ft', color: '#FF9800', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌼', category: 'middle', disneyUse: 'Heat tolerant color' },
    { id: 'pentas', name: 'Pentas', height: '2-3ft', spread: '2ft', color: '#E91E63', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '⭐', category: 'middle', disneyUse: 'Butterfly magnet, star flowers' },
    { id: 'rudbeckia', name: 'Black-Eyed Susan', height: '2-3ft', spread: '1-2ft', color: '#FFC107', bloomTime: 'Summer-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌻', category: 'middle', disneyUse: 'Native charm, golden blooms' },
    { id: 'daylily', name: 'Daylily', height: '1-3ft', spread: '1-2ft', color: '#FF5722', bloomTime: 'Summer', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '🌸', category: 'middle', disneyUse: 'Reliable perennial, many colors' },
  ],
  front: [
    { id: 'petunia', name: 'Petunia', height: '6-12in', spread: '12-18in', color: '#9C27B0', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌺', category: 'front', disneyUse: 'Mass annual color' },
    { id: 'begonia', name: 'Begonia', height: '8-12in', spread: '8-12in', color: '#F44336', bloomTime: 'Spring-Fall', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🌸', category: 'front', disneyUse: 'Shade tolerant color' },
    { id: 'impatiens', name: 'Impatiens', height: '8-12in', spread: '10-12in', color: '#E91E63', bloomTime: 'Spring-Fall', sunReq: 'Shade', waterReq: 'High', icon: '💐', category: 'front', disneyUse: 'Dense shade color' },
    { id: 'marigold', name: 'Marigold', height: '6-18in', spread: '6-12in', color: '#FF9800', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌼', category: 'front', disneyUse: 'Bold orange/yellow, pest deterrent' },
    { id: 'vinca', name: 'Vinca', height: '6-12in', spread: '12-18in', color: '#E91E63', bloomTime: 'Summer-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌸', category: 'front', disneyUse: 'Heat/drought tolerant' },
    { id: 'coleus', name: 'Coleus', height: '12-24in', spread: '12-18in', color: '#880E4F', bloomTime: 'Foliage', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🍂', category: 'front', disneyUse: 'Dramatic foliage patterns' },
  ],
  groundcover: [
    { id: 'liriope', name: 'Liriope', height: '10-12in', spread: '12-18in', color: '#4CAF50', bloomTime: 'Summer spikes', sunReq: 'Full-Part Sun', waterReq: 'Low', icon: '🌿', category: 'groundcover', disneyUse: 'Clean edging, tough' },
    { id: 'mondo-grass', name: 'Mondo Grass', height: '6-8in', spread: '8-12in', color: '#2E7D32', bloomTime: 'Evergreen', sunReq: 'Part-Full Shade', waterReq: 'Low', icon: '🌱', category: 'groundcover', disneyUse: 'Dense carpet, shade' },
    { id: 'asiatic-jasmine', name: 'Asiatic Jasmine', height: '6-12in', spread: 'spreading', color: '#388E3C', bloomTime: 'Evergreen', sunReq: 'Full-Part Sun', waterReq: 'Low', icon: '🌿', category: 'groundcover', disneyUse: 'Rapid coverage' },
    { id: 'pachysandra', name: 'Pachysandra', height: '6-8in', spread: 'spreading', color: '#43A047', bloomTime: 'Evergreen', sunReq: 'Shade', waterReq: 'Moderate', icon: '☘️', category: 'groundcover', disneyUse: 'Shade groundcover' },
  ]
};

const ALL_PLANTS = [
  ...PLANT_DATABASE.focal,
  ...PLANT_DATABASE.topiary,
  ...PLANT_DATABASE.back,
  ...PLANT_DATABASE.middle,
  ...PLANT_DATABASE.front,
  ...PLANT_DATABASE.groundcover
];

// ═══════════════════════════════════════════════════════════════════════════════
// BED BUNDLES - Pre-designed Themed Collections
// ═══════════════════════════════════════════════════════════════════════════════

const BED_BUNDLES = [
  {
    id: 'main-street-usa',
    name: 'Main Street USA',
    theme: 'Classic Americana',
    preview: '🏛️',
    description: 'Red, white & pink roses with formal boxwood borders - quintessential Disney',
    colorScheme: ['#D32F2F', '#FFFFFF', '#E91E63', '#33691E'],
    plants: [
      { plantId: 'ball-boxwood', quantity: 4, row: 'edge' },
      { plantId: 'knockout-rose', quantity: 6, row: 'middle' },
      { plantId: 'petunia', quantity: 8, row: 'front' },
      { plantId: 'liriope', quantity: 6, row: 'groundcover' },
      { plantId: 'crape-myrtle', quantity: 1, row: 'focal' }
    ]
  },
  {
    id: 'fantasyland-garden',
    name: 'Fantasyland Magic',
    theme: 'Whimsical Enchantment',
    preview: '🏰',
    description: 'Pastel blooms with spiral topiaries - storybook charm',
    colorScheme: ['#E91E63', '#9C27B0', '#EC407A', '#1B5E20'],
    plants: [
      { plantId: 'spiral-juniper', quantity: 2, row: 'focal' },
      { plantId: 'azalea-encore', quantity: 4, row: 'back' },
      { plantId: 'impatiens', quantity: 10, row: 'front' },
      { plantId: 'mondo-grass', quantity: 8, row: 'groundcover' }
    ]
  },
  {
    id: 'tomorrowland-modern',
    name: 'Tomorrowland Future',
    theme: 'Sleek & Contemporary',
    preview: '🚀',
    description: 'Clean lines with architectural plants and bold accents',
    colorScheme: ['#1565C0', '#FFC107', '#2E7D32', '#9C27B0'],
    plants: [
      { plantId: 'cone-arborvitae', quantity: 2, row: 'focal' },
      { plantId: 'blue-salvia', quantity: 6, row: 'middle' },
      { plantId: 'rudbeckia', quantity: 4, row: 'middle' },
      { plantId: 'asiatic-jasmine', quantity: 10, row: 'groundcover' }
    ]
  },
  {
    id: 'adventureland-tropical',
    name: 'Adventureland Exotic',
    theme: 'Tropical Paradise',
    preview: '🌴',
    description: 'Bold tropical colors with lush layering',
    colorScheme: ['#FF9800', '#E91E63', '#FF5722', '#4CAF50'],
    plants: [
      { plantId: 'japanese-maple', quantity: 1, row: 'focal' },
      { plantId: 'loropetalum', quantity: 3, row: 'back' },
      { plantId: 'lantana', quantity: 6, row: 'middle' },
      { plantId: 'marigold', quantity: 8, row: 'front' },
      { plantId: 'liriope', quantity: 6, row: 'groundcover' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DisneyLandscapeStudio() {
  // Theme State
  const [theme, setTheme] = useState('night');
  const t = THEMES[theme];
  
  // UI State
  const [activeTab, setActiveTab] = useState('plants');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showVisionPreview, setShowVisionPreview] = useState(false);
  
  // Design State
  const [placedPlants, setPlacedPlants] = useState([]);
  const [selectedPlacedPlant, setSelectedPlacedPlant] = useState(null);
  const [bedDimensions, setBedDimensions] = useState({ width: 120, height: 72 });
  const [designName, setDesignName] = useState('Untitled Disney Garden');
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [bundleScale, setBundleScale] = useState(1);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPlantId, setDraggingPlantId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  
  // Filter plants
  const filteredPlants = ALL_PLANTS.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.disneyUse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || plant.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate coverage
  const coveragePercent = useCallback(() => {
    if (placedPlants.length === 0) return 0;
    const bedArea = bedDimensions.width * bedDimensions.height;
    let plantArea = 0;
    placedPlants.forEach(p => {
      const plantData = ALL_PLANTS.find(pl => pl.id === p.plantId);
      if (plantData) {
        const spread = parseInt(plantData.spread) || 12;
        plantArea += Math.PI * Math.pow(spread / 2, 2);
      }
    });
    return Math.min(100, (plantArea / bedArea) * 100 * (1 - DISNEY_RULES.coverage.OVERLAP_TOLERANCE));
  }, [placedPlants, bedDimensions]);
  
  // Color harmony check
  const colorHarmonyStatus = useCallback(() => {
    const colors = new Set();
    placedPlants.forEach(p => {
      const plant = ALL_PLANTS.find(pl => pl.id === p.plantId);
      if (plant) colors.add(plant.color);
    });
    const uniqueHues = colors.size;
    if (uniqueHues <= 1) return { valid: true, scheme: 'Monochromatic' };
    if (uniqueHues <= 2) return { valid: true, scheme: 'Complementary' };
    if (uniqueHues <= 3) return { valid: true, scheme: 'Analogous' };
    return { valid: false, scheme: `${uniqueHues} Hues (Too Many)` };
  }, [placedPlants]);
  
  // Canvas click handler
  const handleCanvasClick = (e) => {
    if (isDragging) return;
    if (!selectedPlant) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom * 4);
    const y = (e.clientY - rect.top) / (zoom * 4);
    
    if (x < 0 || x > bedDimensions.width || y < 0 || y > bedDimensions.height) return;
    
    const newPlant = {
      id: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      plantId: selectedPlant.id,
      x,
      y
    };
    
    setPlacedPlants(prev => [...prev, newPlant]);
  };
  
  // Drag handlers
  const handleDragStart = (e, plantId) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const plant = placedPlants.find(p => p.id === plantId);
    if (!plant) return;
    
    setDraggingPlantId(plantId);
    setIsDragging(true);
    setSelectedPlacedPlant(plantId);
    setDragOffset({
      x: (e.clientX - rect.left) / (zoom * 4) - plant.x,
      y: (e.clientY - rect.top) / (zoom * 4) - plant.y
    });
  };
  
  const handleDragMove = (e) => {
    if (!isDragging || !draggingPlantId) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(bedDimensions.width, (e.clientX - rect.left) / (zoom * 4) - dragOffset.x));
    const newY = Math.max(0, Math.min(bedDimensions.height, (e.clientY - rect.top) / (zoom * 4) - dragOffset.y));
    
    setPlacedPlants(prev => prev.map(p =>
      p.id === draggingPlantId ? { ...p, x: newX, y: newY } : p
    ));
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggingPlantId(null);
  };
  
  // Apply bundle
  const applyBundle = (bundle) => {
    const newPlants = [];
    bundle.plants.forEach(({ plantId, quantity, row }) => {
      const scaledQty = Math.round(quantity * bundleScale);
      for (let i = 0; i < scaledQty; i++) {
        const rowY = row === 'focal' ? 10 : row === 'back' ? 20 : row === 'middle' ? 40 : row === 'front' ? 55 : 65;
        newPlants.push({
          id: `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          plantId,
          x: 10 + (i * (bedDimensions.width - 20) / Math.max(1, scaledQty - 1)),
          y: rowY + (Math.random() - 0.5) * 8
        });
      }
    });
    setPlacedPlants(newPlants);
    setSelectedBundle(bundle);
  };
  
  // Clear canvas
  const clearCanvas = () => {
    setPlacedPlants([]);
    setSelectedBundle(null);
    setSelectedPlacedPlant(null);
  };
  
  // Delete selected plant
  const deleteSelectedPlant = () => {
    if (!selectedPlacedPlant) return;
    setPlacedPlants(prev => prev.filter(p => p.id !== selectedPlacedPlant));
    setSelectedPlacedPlant(null);
  };
  
  // Export blueprint
  const exportBlueprint = () => {
    const blueprint = {
      name: designName,
      dimensions: bedDimensions,
      plants: placedPlants.map(p => ({
        ...p,
        plantData: ALL_PLANTS.find(pl => pl.id === p.plantId)
      })),
      coverage: coveragePercent(),
      colorHarmony: colorHarmonyStatus(),
      bundle: selectedBundle?.name,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${designName.replace(/\s+/g, '-').toLowerCase()}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Get plant visual size
  const getPlantSize = (plantId) => {
    const plant = ALL_PLANTS.find(p => p.id === plantId);
    const sizes = { focal: 24, topiary: 18, back: 16, middle: 12, front: 8, groundcover: 6 };
    return sizes[plant?.category] || 10;
  };

  const coverage = coveragePercent();
  const harmony = colorHarmonyStatus();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.pageBg} ${theme === 'night' ? 'text-white' : t.textPrimary}`}>
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme === 'night' ? 'ffffff' : '7c3aed'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b ${t.borderColor} ${t.headerBg} backdrop-blur-xl`}>
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${t.glowColor} rounded-xl blur-sm opacity-75`} />
                <div className={`relative ${theme === 'night' ? 'bg-indigo-950' : 'bg-white'} p-3 rounded-xl`}>
                  <Flower2 className={`w-8 h-8 ${t.textAccent}`} />
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${t.gradientTitle} bg-clip-text text-transparent tracking-tight`}>
                  Disney Imagineering
                </h1>
                <p className={`${t.textMuted} text-sm font-medium tracking-widest uppercase`}>
                  Landscape Studio
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}
                className={`p-3 rounded-xl ${theme === 'night' ? 'bg-indigo-800/50 hover:bg-indigo-700/50' : 'bg-purple-200/50 hover:bg-purple-300/50'} transition-all`}
                title={`Switch to ${theme === 'night' ? 'Day' : 'Night'} Mode`}
              >
                {theme === 'night' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-600" />
                )}
              </button>
              
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className={`${t.inputBg} border ${t.borderColor} rounded-lg px-4 py-2 ${theme === 'night' ? 'text-white placeholder-purple-400' : 'text-purple-900 placeholder-purple-400'} focus:outline-none focus:ring-2 ${t.focusRing} w-64`}
                placeholder="Design Name"
              />
              <button
                onClick={exportBlueprint}
                className={`flex items-center gap-2 bg-gradient-to-r ${t.gradientPrimary} ${t.gradientHover} px-4 py-2 rounded-lg font-medium transition-all text-white`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex max-w-[1800px] mx-auto">
        {/* Left Sidebar - Plant Library & Bundles */}
        <aside className={`w-80 border-r ${t.borderColor} ${t.sidebarBg} backdrop-blur-sm h-[calc(100vh-73px)] overflow-hidden flex flex-col`}>
          {/* Tab Navigation */}
          <div className={`flex border-b ${t.borderColor}`}>
            <button
              onClick={() => setActiveTab('plants')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'plants'
                  ? `${t.textAccent} border-b-2 ${t.borderAccent} ${t.accentMuted}`
                  : `${t.textMuted} hover:${theme === 'night' ? 'text-white' : 'text-purple-700'}`
              }`}
            >
              <Leaf className="w-4 h-4 inline mr-2" />
              Plants
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'bundles'
                  ? `${t.textAccent} border-b-2 ${t.borderAccent} ${t.accentMuted}`
                  : `${t.textMuted} hover:${theme === 'night' ? 'text-white' : 'text-purple-700'}`
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Bundles
            </button>
          </div>

          {activeTab === 'plants' && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Search */}
              <div className={`p-4 border-b ${t.borderColor}`}>
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plants..."
                    className={`w-full ${t.inputBg} border ${t.borderColor} rounded-lg pl-10 pr-4 py-2 text-sm ${theme === 'night' ? 'text-white placeholder-purple-400' : 'text-purple-900 placeholder-purple-400'} focus:outline-none focus:ring-2 ${t.focusRing}`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className={`px-4 py-3 border-b ${t.borderColor} flex flex-wrap gap-2`}>
                {['all', 'focal', 'topiary', 'back', 'middle', 'front', 'groundcover'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === cat
                        ? `${t.accentPrimary} text-white`
                        : `${t.cardBg} ${t.textMuted} ${t.accentHover}`
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Plant List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredPlants.map(plant => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedPlant?.id === plant.id
                        ? `${theme === 'night' ? 'bg-purple-600/30' : 'bg-purple-200/60'} border-2 ${t.borderAccent} ring-2 ${t.accentRing}`
                        : `${t.cardBg} border ${t.borderColor} ${t.borderHover}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: plant.color + '30' }}
                      >
                        {plant.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${theme === 'night' ? 'text-white' : 'text-purple-900'} truncate`}>{plant.name}</div>
                        <div className={`text-xs ${t.textMuted} truncate`}>{plant.height}</div>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full ring-2 ring-white/20"
                        style={{ backgroundColor: plant.color }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Plant Info */}
              {selectedPlant && (
                <div className={`p-4 border-t ${t.borderColor} ${theme === 'night' ? 'bg-purple-950/30' : 'bg-purple-100/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{selectedPlant.icon}</span>
                    <div>
                      <div className={`font-bold ${t.textHighlight}`}>{selectedPlant.name}</div>
                      <div className={`text-xs ${t.textMuted}`}>{selectedPlant.category}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`${t.cardBg} rounded p-2`}>
                      <div className={t.textMuted}>Height</div>
                      <div className={theme === 'night' ? 'text-white' : 'text-purple-900'}>{selectedPlant.height}</div>
                    </div>
                    <div className={`${t.cardBg} rounded p-2`}>
                      <div className={t.textMuted}>Spread</div>
                      <div className={theme === 'night' ? 'text-white' : 'text-purple-900'}>{selectedPlant.spread}</div>
                    </div>
                    <div className={`${t.cardBg} rounded p-2`}>
                      <div className={t.textMuted}>Sun</div>
                      <div className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} flex items-center gap-1`}>
                        <Sun className="w-3 h-3 text-amber-400" />
                        {selectedPlant.sunReq}
                      </div>
                    </div>
                    <div className={`${t.cardBg} rounded p-2`}>
                      <div className={t.textMuted}>Water</div>
                      <div className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} flex items-center gap-1`}>
                        <CloudRain className="w-3 h-3 text-sky-400" />
                        {selectedPlant.waterReq}
                      </div>
                    </div>
                  </div>
                  <div className={`mt-2 text-xs ${t.textAccent} ${t.accentMuted} rounded p-2`}>
                    <Star className="w-3 h-3 inline mr-1" />
                    {selectedPlant.disneyUse}
                  </div>
                  <div className={`mt-3 text-center text-xs ${t.textMuted}`}>
                    Click on the canvas to place
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bundles' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Scale Selector */}
              <div className={`${t.cardBg} rounded-xl p-4 border ${t.borderColor}`}>
                <label className={`block text-sm font-medium ${t.textHighlight} mb-2`}>
                  Bundle Scale Multiplier
                </label>
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2, 3].map(scale => (
                    <button
                      key={scale}
                      onClick={() => setBundleScale(scale)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        bundleScale === scale
                          ? `${t.accentPrimary} text-white`
                          : `${t.cardBg} ${t.textMuted} ${t.accentHover}`
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Bundle Cards */}
              {BED_BUNDLES.map(bundle => (
                <div
                  key={bundle.id}
                  className={`${t.cardBg} rounded-xl overflow-hidden border ${t.borderColor} ${t.borderHover} transition-all`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{bundle.preview}</span>
                      <div>
                        <h3 className={`font-bold ${theme === 'night' ? 'text-white' : 'text-purple-900'}`}>{bundle.name}</h3>
                        <p className={`text-xs ${t.textMuted}`}>{bundle.theme}</p>
                      </div>
                    </div>
                    <p className={`text-sm ${t.textSecondary} mb-3`}>{bundle.description}</p>
                    
                    {/* Color Scheme Preview */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs ${t.textMuted}`}>Colors:</span>
                      <div className="flex gap-1">
                        {bundle.colorScheme.map((color, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full ring-2 ring-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Plant Count */}
                    <div className={`text-xs ${t.textMuted} mb-3`}>
                      {bundle.plants.reduce((sum, p) => sum + Math.round(p.quantity * bundleScale), 0)} plants at {bundleScale}x scale
                    </div>

                    <button
                      onClick={() => applyBundle(bundle)}
                      className={`w-full bg-gradient-to-r ${t.gradientPrimary} ${t.gradientHover} text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2`}
                    >
                      <Package className="w-4 h-4" />
                      Apply Bundle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-73px)]">
          {/* Canvas Toolbar */}
          <div className={`flex items-center justify-between px-6 py-3 border-b ${t.borderColor} ${theme === 'night' ? 'bg-indigo-950/30' : 'bg-white/30'}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? `${t.accentPrimary} text-white` : `${t.cardBg} ${t.textMuted} hover:${theme === 'night' ? 'text-white' : 'text-purple-700'}`
                }`}
                title="Toggle Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowRuler(!showRuler)}
                className={`p-2 rounded-lg transition-colors ${
                  showRuler ? `${t.accentPrimary} text-white` : `${t.cardBg} ${t.textMuted} hover:${theme === 'night' ? 'text-white' : 'text-purple-700'}`
                }`}
                title="Toggle Ruler"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <div className={`w-px h-6 ${t.borderColor} mx-2`} />
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className={`p-2 rounded-lg ${t.cardBg} ${t.textMuted} hover:${theme === 'night' ? 'text-white' : 'text-purple-700'} transition-colors`}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className={`text-sm ${t.textMuted} w-16 text-center`}>{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className={`p-2 rounded-lg ${t.cardBg} ${t.textMuted} hover:${theme === 'night' ? 'text-white' : 'text-purple-700'} transition-colors`}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className={`w-px h-6 ${t.borderColor} mx-2`} />
              <button
                onClick={clearCanvas}
                className={`p-2 rounded-lg ${t.cardBg} text-red-400 hover:bg-red-900/30 transition-colors`}
                title="Clear Canvas"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {selectedPlacedPlant && (
                <button
                  onClick={deleteSelectedPlant}
                  className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Bed Dimensions */}
              <div className="flex items-center gap-2 text-sm">
                <span className={t.textMuted}>Bed Size:</span>
                <input
                  type="number"
                  value={bedDimensions.width}
                  onChange={(e) => setBedDimensions({...bedDimensions, width: parseInt(e.target.value) || 0})}
                  className={`w-16 ${t.cardBg} border ${t.borderColor} rounded px-2 py-1 text-center ${theme === 'night' ? 'text-white' : 'text-purple-900'}`}
                />
                <span className={t.textMuted}>×</span>
                <input
                  type="number"
                  value={bedDimensions.height}
                  onChange={(e) => setBedDimensions({...bedDimensions, height: parseInt(e.target.value) || 0})}
                  className={`w-16 ${t.cardBg} border ${t.borderColor} rounded px-2 py-1 text-center ${theme === 'night' ? 'text-white' : 'text-purple-900'}`}
                />
                <span className={t.textMuted}>in</span>
              </div>

              <button
                onClick={() => setShowVisionPreview(true)}
                className={`flex items-center gap-2 bg-gradient-to-r ${theme === 'night' ? 'from-pink-600 to-amber-600 hover:from-pink-500 hover:to-amber-500' : 'from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400'} px-4 py-2 rounded-lg font-medium transition-all text-white`}
              >
                <Sparkles className="w-4 h-4" />
                Vision Preview
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className={`flex-1 overflow-auto ${t.canvasBg} p-8`}>
            <div 
              className={`relative mx-auto bg-gradient-to-b ${t.canvasGradient} rounded-lg overflow-hidden shadow-2xl`}
              style={{
                width: bedDimensions.width * zoom * 4,
                height: bedDimensions.height * zoom * 4,
                cursor: isDragging ? 'grabbing' : selectedPlant ? 'crosshair' : 'default'
              }}
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundSize: `${12 * zoom * 4}px ${12 * zoom * 4}px`,
                    backgroundImage: `linear-gradient(to right, ${t.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${t.gridColor} 1px, transparent 1px)`
                  }}
                />
              )}

              {/* Ruler Marks */}
              {showRuler && (
                <>
                  <div className={`absolute top-0 left-0 right-0 h-6 ${theme === 'night' ? 'bg-indigo-950/80' : 'bg-purple-100/80'} flex`}>
                    {Array.from({ length: Math.floor(bedDimensions.width / 12) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className={`absolute text-xs ${t.textMuted} transform -translate-x-1/2`}
                        style={{ left: i * 12 * zoom * 4 }}
                      >
                        <div className={`h-2 w-px ${theme === 'night' ? 'bg-purple-400' : 'bg-purple-500'} mx-auto`} />
                        {i * 12}"
                      </div>
                    ))}
                  </div>
                  <div className={`absolute top-6 left-0 bottom-0 w-6 ${theme === 'night' ? 'bg-indigo-950/80' : 'bg-purple-100/80'}`}>
                    {Array.from({ length: Math.floor(bedDimensions.height / 12) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className={`absolute text-xs ${t.textMuted} transform -translate-y-1/2 flex items-center`}
                        style={{ top: i * 12 * zoom * 4 }}
                      >
                        <span className="w-4 text-right pr-1">{i * 12}"</span>
                        <div className={`w-2 h-px ${theme === 'night' ? 'bg-purple-400' : 'bg-purple-500'}`} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Bed Edge Indicator */}
              <div className={`absolute inset-2 border-2 border-dashed ${theme === 'night' ? 'border-purple-600/30' : 'border-purple-400/30'} rounded pointer-events-none`} />

              {/* Placed Plants */}
              {placedPlants.map(plant => {
                const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
                const size = getPlantSize(plant.plantId);
                const isSelected = selectedPlacedPlant === plant.id;
                const isBeingDragged = draggingPlantId === plant.id;
                
                return (
                  <div
                    key={plant.id}
                    className={`absolute rounded-full cursor-grab active:cursor-grabbing transition-all ${
                      isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent z-20' : 
                      isBeingDragged ? 'scale-110 z-30' : 'hover:scale-105 z-10'
                    }`}
                    style={{
                      left: plant.x * zoom * 4 - (size * zoom * 2),
                      top: plant.y * zoom * 4 - (size * zoom * 2),
                      width: size * zoom * 4,
                      height: size * zoom * 4,
                      backgroundColor: plantData?.color || '#4CAF50',
                      boxShadow: isSelected 
                        ? `0 0 20px ${plantData?.color}80, 0 4px 12px rgba(0,0,0,0.3)`
                        : '0 4px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.2)'
                    }}
                    onMouseDown={(e) => handleDragStart(e, plant.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlacedPlant(plant.id);
                    }}
                    title={`${plantData?.name}\nDrag to move • Click to select`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded-full text-xs">
                      {plantData?.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Validation & Stats */}
        <aside className={`w-72 border-l ${t.borderColor} ${t.sidebarBg} backdrop-blur-sm h-[calc(100vh-73px)] overflow-y-auto`}>
          <div className="p-4 space-y-4">
            {/* Disney Quality Score */}
            <div className={`bg-gradient-to-br ${theme === 'night' ? 'from-purple-900/40 to-pink-900/40' : 'from-purple-200/60 to-pink-200/60'} rounded-xl p-4 border ${theme === 'night' ? 'border-purple-700/30' : 'border-purple-300/50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className={`font-bold ${t.textHighlight}`}>Disney Quality Score</h3>
              </div>
              <div className={`relative h-4 ${theme === 'night' ? 'bg-indigo-900' : 'bg-purple-200'} rounded-full overflow-hidden mb-2`}>
                <div 
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    coverage >= 95 ? `bg-gradient-to-r ${t.scoreGradient}` :
                    coverage >= 80 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-500 to-orange-400'
                  }`}
                  style={{ width: `${Math.min(100, coverage)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className={t.textMuted}>Coverage</span>
                <span className={`font-bold ${
                  coverage >= 95 ? t.textAccent :
                  coverage >= 80 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {coverage.toFixed(1)}%
                </span>
              </div>
              <div className={`text-xs ${t.textMuted} mt-1`}>
                Disney Standard: 95%+ living coverage
              </div>
            </div>

            {/* Design Stats */}
            <div className={`${t.cardBg} rounded-xl p-4 border ${t.borderColor}`}>
              <h3 className={`font-bold ${t.textHighlight} mb-3 flex items-center gap-2`}>
                <Layers className="w-4 h-4" />
                Design Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={t.textMuted}>Total Plants</span>
                  <span className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} font-medium`}>{placedPlants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={t.textMuted}>Bed Area</span>
                  <span className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} font-medium`}>{bedDimensions.width * bedDimensions.height} sq in</span>
                </div>
                <div className="flex justify-between">
                  <span className={t.textMuted}>Applied Bundle</span>
                  <span className={`${t.textAccent} font-medium truncate ml-2`}>
                    {selectedBundle?.name || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Plant Breakdown */}
            <div className={`${t.cardBg} rounded-xl p-4 border ${t.borderColor}`}>
              <h3 className={`font-bold ${t.textHighlight} mb-3 flex items-center gap-2`}>
                <Flower2 className="w-4 h-4" />
                Plant Breakdown
              </h3>
              <div className="space-y-2">
                {['focal', 'topiary', 'back', 'middle', 'front', 'groundcover'].map(category => {
                  const count = placedPlants.filter(p => {
                    const plant = ALL_PLANTS.find(pl => pl.id === p.plantId);
                    return plant?.category === category;
                  }).length;
                  
                  return (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <span className={`${t.textMuted} capitalize`}>{category}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-24 h-2 ${theme === 'night' ? 'bg-indigo-900' : 'bg-purple-200'} rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${t.accentSuccess} transition-all`}
                            style={{ width: `${Math.min(100, (count / Math.max(1, placedPlants.length)) * 100)}%` }}
                          />
                        </div>
                        <span className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} w-6 text-right`}>{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Harmony */}
            <div className={`${t.cardBg} rounded-xl p-4 border ${t.borderColor}`}>
              <h3 className={`font-bold ${t.textHighlight} mb-3 flex items-center gap-2`}>
                <Palette className="w-4 h-4" />
                Color Harmony
              </h3>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                harmony.valid 
                  ? (theme === 'night' ? 'bg-purple-900/30' : 'bg-purple-200/50') 
                  : 'bg-red-900/30'
              }`}>
                {harmony.valid ? (
                  <Check className={`w-4 h-4 ${t.textAccent}`} />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
                <span className={harmony.valid ? t.textHighlight : 'text-red-300'}>
                  {harmony.scheme} Scheme
                </span>
              </div>
              
              {/* Color Swatches */}
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Set(placedPlants.map(p => {
                  const plant = ALL_PLANTS.find(pl => pl.id === p.plantId);
                  return plant?.color;
                }).filter(Boolean))).slice(0, 6).map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg ring-2 ring-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Disney Rules Checklist */}
            <div className={`${t.cardBg} rounded-xl p-4 border ${t.borderColor}`}>
              <h3 className={`font-bold ${t.textHighlight} mb-3 flex items-center gap-2`}>
                <Star className="w-4 h-4" />
                Disney Rules Check
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { rule: '95%+ Plant Coverage', met: coverage >= 95 },
                  { rule: 'Height Graduation', met: placedPlants.length >= 3 },
                  { rule: 'Color Harmony (≤3 hues)', met: harmony.valid },
                  { rule: 'Edge Definition', met: placedPlants.some(p => ALL_PLANTS.find(pl => pl.id === p.plantId)?.category === 'groundcover') },
                  { rule: 'Focal Point Present', met: placedPlants.some(p => ALL_PLANTS.find(pl => pl.id === p.plantId)?.category === 'focal') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.met ? t.accentSuccess : (theme === 'night' ? 'bg-indigo-800' : 'bg-purple-200')
                    }`}>
                      {item.met ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <CircleDot className={`w-3 h-3 ${t.textMuted}`} />
                      )}
                    </div>
                    <span className={item.met ? t.textHighlight : t.textMuted}>
                      {item.rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Schedule */}
            {placedPlants.length > 0 && (
              <div className={`${t.cardBg} rounded-xl p-4 border ${t.borderColor}`}>
                <h3 className={`font-bold ${t.textHighlight} mb-3 flex items-center gap-2`}>
                  <Info className="w-4 h-4" />
                  Plant Schedule
                </h3>
                <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
                  {Object.entries(
                    placedPlants.reduce((acc, p) => {
                      const plant = ALL_PLANTS.find(pl => pl.id === p.plantId);
                      if (plant) {
                        acc[plant.name] = (acc[plant.name] || 0) + 1;
                      }
                      return acc;
                    }, {})
                  ).map(([name, qty]) => (
                    <div key={name} className={`flex justify-between py-1 border-b ${t.borderColor}`}>
                      <span className={t.textSecondary}>{name}</span>
                      <span className={`${t.textAccent} font-medium`}>×{qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Vision Preview Modal */}
      {showVisionPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className={`${theme === 'night' ? 'bg-indigo-950' : 'bg-white'} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border ${t.borderColor}`}>
            <div className={`flex items-center justify-between p-4 border-b ${t.borderColor}`}>
              <h2 className={`text-xl font-bold ${t.textHighlight} flex items-center gap-2`}>
                <Sparkles className="w-5 h-5" />
                Disney Vision Preview
              </h2>
              <button
                onClick={() => setShowVisionPreview(false)}
                className={`p-2 ${theme === 'night' ? 'hover:bg-indigo-800' : 'hover:bg-purple-100'} rounded-lg transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className={`aspect-video bg-gradient-to-br ${theme === 'night' ? 'from-purple-900/30 via-pink-900/30 to-amber-900/30' : 'from-purple-200/50 via-pink-200/50 to-amber-200/50'} rounded-xl flex items-center justify-center border ${t.borderColor}`}>
                <div className="text-center">
                  <Sparkles className={`w-16 h-16 mx-auto mb-4 ${t.textAccent} opacity-50`} />
                  <h3 className={`text-xl font-bold ${t.textHighlight} mb-2`}>AI Vision Rendering</h3>
                  <p className={`${t.textMuted} max-w-md`}>
                    Your design with {placedPlants.length} plants would generate a photorealistic 
                    rendering showing the completed Disney-quality garden at peak bloom.
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <button className={`px-6 py-3 bg-gradient-to-r ${t.gradientPrimary} rounded-lg font-medium ${t.gradientHover} transition-all text-white`}>
                      Generate Spring View
                    </button>
                    <button className={`px-6 py-3 ${t.cardBg} rounded-lg font-medium ${t.accentHover} transition-all`}>
                      Generate Summer View
                    </button>
                  </div>
                </div>
              </div>
              <div className={`mt-4 p-4 ${t.cardBg} rounded-xl`}>
                <h4 className={`font-medium ${t.textHighlight} mb-2`}>Rendering Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={t.textMuted}>Plants:</span>
                    <span className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} ml-2`}>{placedPlants.length}</span>
                  </div>
                  <div>
                    <span className={t.textMuted}>Coverage:</span>
                    <span className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} ml-2`}>{coverage.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className={t.textMuted}>Theme:</span>
                    <span className={`${theme === 'night' ? 'text-white' : 'text-purple-900'} ml-2`}>{selectedBundle?.theme || 'Custom'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
