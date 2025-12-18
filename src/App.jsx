import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Flower2, Trees, Shrub, Leaf, Grid, ZoomIn, ZoomOut, 
  RotateCcw, Download, Upload, Eye, Palette, Ruler, Check, 
  X, ChevronRight, ChevronDown, Search, Package, Sparkles,
  Layers, Settings, Info, Move, Trash2, Copy, FlipHorizontal,
  Sun, CloudRain, Thermometer, Star, Crown, CircleDot
} from 'lucide-react';

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
// DISNEY PLACEMENT ENGINE - Creative Pattern Generation
// ═══════════════════════════════════════════════════════════════════════════════

const DISNEY_PATTERNS = {
  // Golden ratio for natural aesthetics
  PHI: 1.618033988749,

  // Plant size mapping (in inches for collision detection)
  getPlantRadius: (category) => {
    const radii = {
      focal: 24,      // Large trees need big space
      topiary: 18,    // Medium formal shapes
      back: 15,       // Tall shrubs
      middle: 10,     // Mid-height plants
      front: 7,       // Edging plants
      groundcover: 5  // Low spreaders
    };
    return radii[category] || 10;
  },

  // Check if two plants would collide
  wouldCollide: (newPlant, existingPlants, allPlantsData) => {
    const newPlantData = allPlantsData.find(p => p.id === newPlant.plantId);
    const newRadius = DISNEY_PATTERNS.getPlantRadius(newPlantData?.category);

    for (const existing of existingPlants) {
      const existingData = allPlantsData.find(p => p.id === existing.plantId);
      const existingRadius = DISNEY_PATTERNS.getPlantRadius(existingData?.category);

      const minDistance = newRadius + existingRadius + 2; // 2 inch buffer
      const distance = Math.sqrt(
        Math.pow(newPlant.x - existing.x, 2) +
        Math.pow(newPlant.y - existing.y, 2)
      );

      if (distance < minDistance) return true;
    }
    return false;
  },

  // Find valid position with collision avoidance
  findValidPosition: (targetX, targetY, plantId, existingPlants, allPlantsData, bedWidth, bedHeight, maxAttempts = 50) => {
    const plantData = allPlantsData.find(p => p.id === plantId);
    const radius = DISNEY_PATTERNS.getPlantRadius(plantData?.category);

    // Try original position first
    let candidate = { x: targetX, y: targetY, plantId };
    if (!DISNEY_PATTERNS.wouldCollide(candidate, existingPlants, allPlantsData) &&
        targetX > radius && targetX < bedWidth - radius &&
        targetY > radius && targetY < bedHeight - radius) {
      return { x: targetX, y: targetY };
    }

    // Spiral outward to find valid spot
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const angle = attempt * 2.399963; // Golden angle in radians
      const distance = Math.sqrt(attempt) * 8;

      const newX = targetX + Math.cos(angle) * distance;
      const newY = targetY + Math.sin(angle) * distance;

      // Clamp to bed bounds
      const clampedX = Math.max(radius + 2, Math.min(bedWidth - radius - 2, newX));
      const clampedY = Math.max(radius + 2, Math.min(bedHeight - radius - 2, newY));

      candidate = { x: clampedX, y: clampedY, plantId };

      if (!DISNEY_PATTERNS.wouldCollide(candidate, existingPlants, allPlantsData)) {
        return { x: clampedX, y: clampedY };
      }
    }

    return null; // Could not find valid position
  },

  // Generate curved drift pattern (signature Disney look)
  generateDriftCurve: (startX, startY, endX, endY, count, variance = 0.3) => {
    const points = [];
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Create bezier-like curve with asymmetric bulge
    const curveOffset = (endX - startX) * 0.3 * (Math.random() > 0.5 ? 1 : -1);

    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) : 0.5;

      // Quadratic bezier with control point
      const controlX = midX + curveOffset;
      const controlY = midY - Math.abs(endY - startY) * 0.2;

      let x = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
      let y = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;

      // Add natural variance
      x += (Math.random() - 0.5) * variance * 20;
      y += (Math.random() - 0.5) * variance * 15;

      points.push({ x, y });
    }
    return points;
  },

  // Generate asymmetric cluster (odd numbers, golden ratio spacing)
  generateCluster: (centerX, centerY, count, baseRadius) => {
    const points = [];
    const PHI = DISNEY_PATTERNS.PHI;

    if (count === 1) {
      points.push({ x: centerX, y: centerY });
    } else if (count === 3) {
      // Triangle with golden ratio proportions
      points.push({ x: centerX, y: centerY - baseRadius * 0.6 });
      points.push({ x: centerX - baseRadius * 0.8, y: centerY + baseRadius * 0.5 });
      points.push({ x: centerX + baseRadius * 0.5, y: centerY + baseRadius * 0.3 });
    } else if (count === 5) {
      // Asymmetric pentagon
      points.push({ x: centerX, y: centerY }); // Center
      points.push({ x: centerX - baseRadius, y: centerY - baseRadius * 0.4 });
      points.push({ x: centerX + baseRadius * 0.8, y: centerY - baseRadius * 0.6 });
      points.push({ x: centerX - baseRadius * 0.6, y: centerY + baseRadius * 0.7 });
      points.push({ x: centerX + baseRadius * 0.9, y: centerY + baseRadius * 0.5 });
    } else {
      // Golden spiral for larger counts
      for (let i = 0; i < count; i++) {
        const angle = i * 2.399963; // Golden angle
        const r = baseRadius * Math.sqrt(i / count) * PHI;
        points.push({
          x: centerX + Math.cos(angle) * r * (0.8 + Math.random() * 0.4),
          y: centerY + Math.sin(angle) * r * (0.8 + Math.random() * 0.4)
        });
      }
    }
    return points;
  },

  // Generate sweeping wave pattern for mass plantings
  generateWavePattern: (bedWidth, bedHeight, yPosition, count) => {
    const points = [];
    const amplitude = bedHeight * 0.08;
    const frequency = 2 + Math.random();

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1 || 1);
      const x = bedWidth * 0.08 + t * bedWidth * 0.84;
      const wave = Math.sin(t * Math.PI * frequency) * amplitude;
      const y = yPosition + wave + (Math.random() - 0.5) * 10;
      points.push({ x, y });
    }
    return points;
  },

  // Disney's Rule of Thirds focal placement
  getFocalPoints: (bedWidth, bedHeight) => {
    return [
      { x: bedWidth * 0.33, y: bedHeight * 0.7, weight: 0.8 },   // Left third, back
      { x: bedWidth * 0.67, y: bedHeight * 0.75, weight: 1.0 },  // Right third, back (primary)
      { x: bedWidth * 0.5, y: bedHeight * 0.85, weight: 0.6 },   // Center back (secondary)
    ];
  },

  // Layer zones for proper depth staging
  getLayerZone: (role, bedHeight) => {
    const zones = {
      focal: { yMin: bedHeight * 0.7, yMax: bedHeight * 0.9 },
      back: { yMin: bedHeight * 0.6, yMax: bedHeight * 0.85 },
      topiary: { yMin: bedHeight * 0.5, yMax: bedHeight * 0.8 },
      middle: { yMin: bedHeight * 0.35, yMax: bedHeight * 0.6 },
      front: { yMin: bedHeight * 0.15, yMax: bedHeight * 0.4 },
      edge: { yMin: bedHeight * 0.05, yMax: bedHeight * 0.2 },
      groundcover: { yMin: bedHeight * 0.05, yMax: bedHeight * 0.25 }
    };
    return zones[role] || zones.middle;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISNEY PLANT DATABASE - Curated Species Collection
// ═══════════════════════════════════════════════════════════════════════════════

const PLANT_DATABASE = {
  // FOCAL POINTS - The "Weenies"
  focal: [
    { id: 'crape-myrtle', name: 'Crape Myrtle', height: '15-25ft', spread: '15-20ft', color: '#E91E63', bloomTime: 'Summer', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌸', category: 'focal', disneyUse: 'Main Street USA focal trees' },
    { id: 'japanese-maple', name: 'Japanese Maple', height: '15-25ft', spread: '15-20ft', color: '#C62828', bloomTime: 'Spring foliage', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🍁', category: 'focal', disneyUse: 'Japan Pavilion, Fantasyland' },
    { id: 'magnolia-south', name: 'Southern Magnolia', height: '60-80ft', spread: '30-40ft', color: '#FFFFFF', bloomTime: 'Spring-Summer', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌺', category: 'focal', disneyUse: 'Grand entrances, Southern theming' },
    { id: 'live-oak', name: 'Live Oak', height: '40-80ft', spread: '60-100ft', color: '#2E7D32', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌳', category: 'focal', disneyUse: 'Liberty Square, shade canopy' },
  ],
  
  // TOPIARIES - Disney Signature Shapes
  topiary: [
    { id: 'spiral-juniper', name: 'Spiral Juniper', height: '6-8ft', spread: '2-3ft', color: '#1B5E20', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌀', category: 'topiary', shape: 'spiral', disneyUse: 'Formal garden accents' },
    { id: 'ball-boxwood', name: 'Ball Boxwood', height: '2-4ft', spread: '2-4ft', color: '#33691E', bloomTime: 'Evergreen', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '⚫', category: 'topiary', shape: 'ball', disneyUse: 'EPCOT topiaries, formal beds' },
    { id: 'cone-arborvitae', name: 'Cone Arborvitae', height: '10-15ft', spread: '3-4ft', color: '#2E7D32', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🔺', category: 'topiary', shape: 'cone', disneyUse: 'Formal entrances, vertical accent' },
    { id: 'pom-pom-juniper', name: 'Pom Pom Juniper', height: '4-6ft', spread: '2-3ft', color: '#1B5E20', bloomTime: 'Evergreen', sunReq: 'Full Sun', waterReq: 'Low', icon: '🎄', category: 'topiary', shape: 'pom-pom', disneyUse: 'Whimsical gardens, Fantasyland' },
  ],
  
  // BACK ROW - Tall Structure
  back: [
    { id: 'holly-nellie', name: "Holly 'Nellie Stevens'", height: '15-25ft', spread: '8-12ft', color: '#1B5E20', bloomTime: 'Evergreen + berries', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '🌲', category: 'back', disneyUse: 'Privacy screening, winter interest' },
    { id: 'camellia', name: 'Camellia japonica', height: '6-12ft', spread: '6-10ft', color: '#E91E63', bloomTime: 'Winter-Spring', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🌷', category: 'back', disneyUse: 'Japan Pavilion, elegant blooms' },
    { id: 'azalea-encore', name: "Azalea 'Encore'", height: '4-5ft', spread: '4-5ft', color: '#EC407A', bloomTime: 'Spring + Fall', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '💮', category: 'back', disneyUse: 'Mass color, reblooming' },
    { id: 'loropetalum', name: 'Loropetalum', height: '6-10ft', spread: '6-10ft', color: '#880E4F', bloomTime: 'Spring', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '🌸', category: 'back', disneyUse: 'Purple foliage contrast' },
  ],
  
  // MIDDLE ROW - Color Workhorses
  middle: [
    { id: 'knockout-rose', name: 'Knockout Rose', height: '3-4ft', spread: '3-4ft', color: '#D32F2F', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌹', category: 'middle', disneyUse: 'Continuous color, low maintenance' },
    { id: 'blue-salvia', name: 'Blue Salvia', height: '2-3ft', spread: '2ft', color: '#1565C0', bloomTime: 'Summer-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '💜', category: 'middle', disneyUse: 'Vertical blue spikes' },
    { id: 'lantana', name: 'Lantana', height: '2-4ft', spread: '3-4ft', color: '#FF9800', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌼', category: 'middle', disneyUse: 'Heat tolerant color' },
    { id: 'pentas', name: 'Pentas', height: '2-3ft', spread: '2ft', color: '#E91E63', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '⭐', category: 'middle', disneyUse: 'Butterfly magnet, star flowers' },
    { id: 'rudbeckia', name: 'Black-Eyed Susan', height: '2-3ft', spread: '1-2ft', color: '#FFC107', bloomTime: 'Summer-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌻', category: 'middle', disneyUse: 'Native charm, golden blooms' },
    { id: 'daylily', name: 'Daylily', height: '1-3ft', spread: '1-2ft', color: '#FF5722', bloomTime: 'Summer', sunReq: 'Full-Part Sun', waterReq: 'Moderate', icon: '🌸', category: 'middle', disneyUse: 'Reliable perennial, many colors' },
  ],
  
  // FRONT ROW - Edging & Mass Color
  front: [
    { id: 'petunia', name: 'Petunia', height: '6-12in', spread: '12-18in', color: '#9C27B0', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Moderate', icon: '🌺', category: 'front', disneyUse: 'Mass annual color' },
    { id: 'begonia', name: 'Begonia', height: '8-12in', spread: '8-12in', color: '#F44336', bloomTime: 'Spring-Fall', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🌸', category: 'front', disneyUse: 'Shade tolerant color' },
    { id: 'impatiens', name: 'Impatiens', height: '8-12in', spread: '10-12in', color: '#E91E63', bloomTime: 'Spring-Fall', sunReq: 'Shade', waterReq: 'High', icon: '💐', category: 'front', disneyUse: 'Dense shade color' },
    { id: 'marigold', name: 'Marigold', height: '6-18in', spread: '6-12in', color: '#FF9800', bloomTime: 'Spring-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌼', category: 'front', disneyUse: 'Bold orange/yellow, pest deterrent' },
    { id: 'vinca', name: 'Vinca', height: '6-12in', spread: '12-18in', color: '#E91E63', bloomTime: 'Summer-Fall', sunReq: 'Full Sun', waterReq: 'Low', icon: '🌸', category: 'front', disneyUse: 'Heat/drought tolerant' },
    { id: 'coleus', name: 'Coleus', height: '12-24in', spread: '12-18in', color: '#880E4F', bloomTime: 'Foliage', sunReq: 'Part Shade', waterReq: 'Moderate', icon: '🍂', category: 'front', disneyUse: 'Dramatic foliage patterns' },
  ],
  
  // GROUND COVER - Full Coverage Heroes
  groundcover: [
    { id: 'liriope', name: 'Liriope', height: '10-12in', spread: '12-18in', color: '#4CAF50', bloomTime: 'Summer spikes', sunReq: 'Full-Part Sun', waterReq: 'Low', icon: '🌿', category: 'groundcover', disneyUse: 'Clean edging, tough' },
    { id: 'mondo-grass', name: 'Mondo Grass', height: '6-8in', spread: '8-12in', color: '#2E7D32', bloomTime: 'Evergreen', sunReq: 'Part-Full Shade', waterReq: 'Low', icon: '🌱', category: 'groundcover', disneyUse: 'Dense carpet, shade' },
    { id: 'asiatic-jasmine', name: 'Asiatic Jasmine', height: '6-12in', spread: 'spreading', color: '#388E3C', bloomTime: 'Evergreen', sunReq: 'Full-Part Sun', waterReq: 'Low', icon: '🌿', category: 'groundcover', disneyUse: 'Rapid coverage' },
    { id: 'pachysandra', name: 'Pachysandra', height: '6-8in', spread: 'spreading', color: '#43A047', bloomTime: 'Evergreen', sunReq: 'Shade', waterReq: 'Moderate', icon: '☘️', category: 'groundcover', disneyUse: 'Shade groundcover' },
  ]
};

// Flatten for easy access
const ALL_PLANTS = [
  ...PLANT_DATABASE.focal,
  ...PLANT_DATABASE.topiary,
  ...PLANT_DATABASE.back,
  ...PLANT_DATABASE.middle,
  ...PLANT_DATABASE.front,
  ...PLANT_DATABASE.groundcover
];

// ═══════════════════════════════════════════════════════════════════════════════
// BED BUNDLE TEMPLATES - Pre-Designed Disney-Quality Packages
// ═══════════════════════════════════════════════════════════════════════════════

const BED_BUNDLES = [
  {
    id: 'main-street-classic',
    name: 'Main Street USA Classic',
    description: 'Traditional American elegance with red, white & blue patriotic palette',
    theme: 'Classic Americana',
    colorScheme: ['#D32F2F', '#FFFFFF', '#1565C0'],
    baseSize: '100 sq ft',
    plants: [
      { plantId: 'crape-myrtle', quantity: 1, role: 'focal', position: 'center-back' },
      { plantId: 'holly-nellie', quantity: 3, role: 'back', position: 'back-row' },
      { plantId: 'knockout-rose', quantity: 5, role: 'middle', position: 'middle-row' },
      { plantId: 'blue-salvia', quantity: 7, role: 'middle', position: 'middle-front' },
      { plantId: 'petunia', quantity: 12, role: 'front', position: 'front-row' },
      { plantId: 'liriope', quantity: 15, role: 'edge', position: 'border' }
    ],
    scaleMultipliers: [0.5, 1, 1.5, 2, 3],
    preview: '🏛️'
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    description: 'Adventureland vibes with bold oranges, yellows, and lush greens',
    theme: 'Tropical Adventure',
    colorScheme: ['#FF9800', '#FFC107', '#4CAF50'],
    baseSize: '100 sq ft',
    plants: [
      { plantId: 'japanese-maple', quantity: 1, role: 'focal', position: 'off-center' },
      { plantId: 'loropetalum', quantity: 2, role: 'back', position: 'back-corners' },
      { plantId: 'lantana', quantity: 6, role: 'middle', position: 'middle-row' },
      { plantId: 'rudbeckia', quantity: 5, role: 'middle', position: 'middle-accent' },
      { plantId: 'marigold', quantity: 15, role: 'front', position: 'front-mass' },
      { plantId: 'asiatic-jasmine', quantity: 20, role: 'edge', position: 'spilling-edge' }
    ],
    scaleMultipliers: [0.5, 1, 1.5, 2, 3],
    preview: '🏝️'
  },
  {
    id: 'fantasy-garden',
    name: 'Fantasy Garden',
    description: 'Whimsical Fantasyland charm with pinks, purples, and magical shapes',
    theme: 'Enchanted Fantasy',
    colorScheme: ['#E91E63', '#9C27B0', '#F8BBD9'],
    baseSize: '100 sq ft',
    plants: [
      { plantId: 'pom-pom-juniper', quantity: 2, role: 'focal', position: 'flanking' },
      { plantId: 'azalea-encore', quantity: 4, role: 'back', position: 'back-row' },
      { plantId: 'pentas', quantity: 6, role: 'middle', position: 'middle-row' },
      { plantId: 'coleus', quantity: 8, role: 'front', position: 'front-accent' },
      { plantId: 'begonia', quantity: 15, role: 'front', position: 'front-mass' },
      { plantId: 'mondo-grass', quantity: 18, role: 'edge', position: 'clean-border' }
    ],
    scaleMultipliers: [0.5, 1, 1.5, 2, 3],
    preview: '🏰'
  },
  {
    id: 'future-modern',
    name: 'Future Modern',
    description: 'Tomorrowland sleekness with silver-greens, whites, and architectural forms',
    theme: 'Futuristic Minimal',
    colorScheme: ['#607D8B', '#FFFFFF', '#00BCD4'],
    baseSize: '100 sq ft',
    plants: [
      { plantId: 'spiral-juniper', quantity: 3, role: 'focal', position: 'geometric' },
      { plantId: 'ball-boxwood', quantity: 5, role: 'accent', position: 'rhythmic' },
      { plantId: 'cone-arborvitae', quantity: 2, role: 'vertical', position: 'punctuation' },
      { plantId: 'liriope', quantity: 25, role: 'mass', position: 'uniform-grid' },
      { plantId: 'mondo-grass', quantity: 30, role: 'base', position: 'carpet' }
    ],
    scaleMultipliers: [0.5, 1, 1.5, 2, 3],
    preview: '🚀'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DisneyLandscapeStudio() {
  // State Management
  const [activeTab, setActiveTab] = useState('plants');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [placedPlants, setPlacedPlants] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [bundleScale, setBundleScale] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [bedDimensions, setBedDimensions] = useState({ width: 120, height: 80 });
  const [showRuler, setShowRuler] = useState(false);
  const [selectedPlacedPlant, setSelectedPlacedPlant] = useState(null);
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [colorHarmonyStatus, setColorHarmonyStatus] = useState({ valid: true, scheme: 'ANALOGOUS' });
  const [showVisionPreview, setShowVisionPreview] = useState(false);
  const [designName, setDesignName] = useState('Untitled Disney Garden');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingPlantId, setDraggingPlantId] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Calculate coverage whenever plants change
  useEffect(() => {
    const totalBedArea = bedDimensions.width * bedDimensions.height;
    let coveredArea = 0;
    
    placedPlants.forEach(plant => {
      const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
      if (plantData) {
        const spreadMatch = plantData.spread.match(/(\d+)/);
        const spread = spreadMatch ? parseInt(spreadMatch[1]) : 12;
        coveredArea += Math.PI * Math.pow(spread / 2, 2);
      }
    });
    
    const coverage = Math.min(100, (coveredArea / totalBedArea) * 100);
    setCoveragePercent(coverage);
  }, [placedPlants, bedDimensions]);

  // Filter plants based on search and category
  const filteredPlants = ALL_PLANTS.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.disneyUse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || plant.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle plant placement on canvas
  const handleCanvasClick = (e) => {
    if (!selectedPlant || isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    // Validate placement within bed bounds
    if (x < 0 || x > bedDimensions.width || y < 0 || y > bedDimensions.height) return;
    
    const newPlant = {
      id: `placed-${Date.now()}`,
      plantId: selectedPlant.id,
      x,
      y,
      rotation: 0,
      scale: 1
    };
    
    setPlacedPlants([...placedPlants, newPlant]);
  };

  // Handle plant selection on canvas
  const handlePlantClick = (e, plant) => {
    e.stopPropagation();
    if (!isDragging) {
      setSelectedPlacedPlant(plant.id === selectedPlacedPlant ? null : plant.id);
    }
  };

  // Handle drag start on a placed plant
  const handleDragStart = (e, plant) => {
    e.stopPropagation();
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom / 4;
    const mouseY = (e.clientY - rect.top) / zoom / 4;
    
    setDraggingPlantId(plant.id);
    setSelectedPlacedPlant(plant.id);
    setDragOffset({
      x: mouseX - plant.x,
      y: mouseY - plant.y
    });
    setIsDragging(true);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging || !draggingPlantId) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom / 4;
    const mouseY = (e.clientY - rect.top) / zoom / 4;
    
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;
    
    // Clamp to bed bounds
    const clampedX = Math.max(5, Math.min(bedDimensions.width - 5, newX));
    const clampedY = Math.max(5, Math.min(bedDimensions.height - 5, newY));
    
    setPlacedPlants(prev => prev.map(p => 
      p.id === draggingPlantId 
        ? { ...p, x: clampedX, y: clampedY }
        : p
    ));
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggingPlantId(null);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Delete selected plant
  const deleteSelectedPlant = () => {
    if (selectedPlacedPlant) {
      setPlacedPlants(placedPlants.filter(p => p.id !== selectedPlacedPlant));
      setSelectedPlacedPlant(null);
    }
  };

  // Generate AI Vision image
  const generateVisionImage = async (season) => {
    if (placedPlants.length === 0) {
      setGenerateError('Add some plants to your design first');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedImage(null);

    // Build DETAILED spatial description of the layout
    const bedWidthFt = (bedDimensions.width / 12).toFixed(1);
    const bedHeightFt = (bedDimensions.height / 12).toFixed(1);

    // Group plants by their zone (back/middle/front based on Y position)
    const backPlants = [];
    const middlePlants = [];
    const frontPlants = [];

    placedPlants.forEach(placed => {
      const plantData = ALL_PLANTS.find(p => p.id === placed.plantId);
      if (!plantData) return;

      const yPercent = placed.y / bedDimensions.height;
      const xPercent = placed.x / bedDimensions.width;

      // Determine position description
      let xPos = xPercent < 0.33 ? 'left' : xPercent > 0.66 ? 'right' : 'center';

      const plantInfo = {
        name: plantData.name,
        color: plantData.color,
        category: plantData.category,
        height: plantData.height,
        xPos,
        icon: plantData.icon
      };

      if (yPercent > 0.6) {
        backPlants.push(plantInfo);
      } else if (yPercent > 0.3) {
        middlePlants.push(plantInfo);
      } else {
        frontPlants.push(plantInfo);
      }
    });

    // Build zone descriptions
    const describeZone = (plants, zoneName) => {
      if (plants.length === 0) return '';

      const grouped = plants.reduce((acc, p) => {
        const key = p.name;
        if (!acc[key]) acc[key] = { ...p, count: 0, positions: [] };
        acc[key].count++;
        acc[key].positions.push(p.xPos);
        return acc;
      }, {});

      const descriptions = Object.values(grouped).map(p => {
        const posText = [...new Set(p.positions)].join(' and ');
        return `${p.count} ${p.name}${p.count > 1 ? 's' : ''} (${p.height} tall) on the ${posText}`;
      });

      return `${zoneName}: ${descriptions.join(', ')}`;
    };

    const backDesc = describeZone(backPlants, 'BACK ROW');
    const middleDesc = describeZone(middlePlants, 'MIDDLE ROW');
    const frontDesc = describeZone(frontPlants, 'FRONT ROW');

    // Count total by category
    const categoryCounts = placedPlants.reduce((acc, p) => {
      const plantData = ALL_PLANTS.find(pd => pd.id === p.plantId);
      if (plantData) {
        acc[plantData.category] = (acc[plantData.category] || 0) + 1;
      }
      return acc;
    }, {});

    const categoryDesc = Object.entries(categoryCounts)
      .map(([cat, count]) => `${count} ${cat}`)
      .join(', ');

    // Build the precise prompt
    const layoutDescription = [backDesc, middleDesc, frontDesc].filter(Boolean).join('. ');

    const prompt = `EXACT LAYOUT - A rectangular ${bedWidthFt}ft wide x ${bedHeightFt}ft deep garden bed viewed from the front, looking toward the back.

PLANTS (${placedPlants.length} total - ${categoryDesc}):
${layoutDescription}

CRITICAL: Show ONLY these specific plants in these exact positions. The bed has ${coveragePercent.toFixed(0)}% coverage with visible mulch between plants.
Do NOT add extra plants. This is a sparse design with ${placedPlants.length} plants total.
Perspective: Eye-level view from front of bed looking back, plants arranged front-to-back with proper scale.`;

    try {
      const response = await fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, season }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage({
        url: data.imageUrl,
        revisedPrompt: data.revisedPrompt,
        season: season
      });
    } catch (error) {
      console.error('Generation error:', error);
      setGenerateError(error.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply bed bundle with Disney-style creative placement
  const applyBundle = (bundle) => {
    const newPlants = [];
    const baseWidth = bedDimensions.width;
    const baseHeight = bedDimensions.height;

    // Group plants by role for coordinated placement
    const plantsByRole = {};
    bundle.plants.forEach(bp => {
      const role = bp.role || 'middle';
      if (!plantsByRole[role]) plantsByRole[role] = [];
      plantsByRole[role].push(bp);
    });

    // Get focal points using rule of thirds
    const focalPoints = DISNEY_PATTERNS.getFocalPoints(baseWidth, baseHeight);
    let focalIndex = 0;

    // Process plants in order: focal → back → topiary → middle → front → edge/groundcover
    const roleOrder = ['focal', 'back', 'topiary', 'middle', 'front', 'edge', 'groundcover'];

    roleOrder.forEach(role => {
      const plantsInRole = plantsByRole[role] || [];

      plantsInRole.forEach((bundlePlant, plantTypeIndex) => {
        const plantData = ALL_PLANTS.find(p => p.id === bundlePlant.plantId);
        if (!plantData) return;

        const scaledQuantity = Math.round(bundlePlant.quantity * bundleScale);
        const zone = DISNEY_PATTERNS.getLayerZone(role, baseHeight);
        let positions = [];

        // Generate creative positions based on role
        switch (role) {
          case 'focal': {
            // Place focals at rule-of-thirds points with asymmetric offset
            for (let i = 0; i < scaledQuantity; i++) {
              const fp = focalPoints[focalIndex % focalPoints.length];
              focalIndex++;
              // Offset each focal slightly for asymmetry
              const offsetX = (Math.random() - 0.5) * baseWidth * 0.1;
              const offsetY = (Math.random() - 0.3) * baseHeight * 0.1;
              positions.push({ x: fp.x + offsetX, y: fp.y + offsetY });
            }
            break;
          }

          case 'back':
          case 'topiary': {
            // Use curved drift pattern for back row plants
            if (scaledQuantity >= 3) {
              positions = DISNEY_PATTERNS.generateDriftCurve(
                baseWidth * 0.15,
                zone.yMin + (zone.yMax - zone.yMin) * 0.5,
                baseWidth * 0.85,
                zone.yMax - (zone.yMax - zone.yMin) * 0.3,
                scaledQuantity,
                0.25
              );
            } else {
              // Small cluster for 1-2 plants
              const centerX = baseWidth * (0.3 + plantTypeIndex * 0.4);
              const centerY = (zone.yMin + zone.yMax) / 2;
              positions = DISNEY_PATTERNS.generateCluster(centerX, centerY, scaledQuantity, 25);
            }
            break;
          }

          case 'middle': {
            // Wave pattern with natural flow
            if (scaledQuantity >= 5) {
              const yPos = zone.yMin + (zone.yMax - zone.yMin) * (0.3 + plantTypeIndex * 0.25);
              positions = DISNEY_PATTERNS.generateWavePattern(baseWidth, baseHeight, yPos, scaledQuantity);
            } else {
              // Asymmetric clusters for smaller quantities
              const centerX = baseWidth * (0.25 + plantTypeIndex * 0.25);
              const centerY = (zone.yMin + zone.yMax) / 2;
              positions = DISNEY_PATTERNS.generateCluster(centerX, centerY, scaledQuantity, 20);
            }
            break;
          }

          case 'front': {
            // Sweeping curve along the front
            if (scaledQuantity >= 4) {
              positions = DISNEY_PATTERNS.generateDriftCurve(
                baseWidth * 0.1,
                zone.yMax,
                baseWidth * 0.9,
                zone.yMin,
                scaledQuantity,
                0.35
              );
            } else {
              // Scattered clusters
              for (let i = 0; i < scaledQuantity; i++) {
                const t = (i + 0.5) / scaledQuantity;
                positions.push({
                  x: baseWidth * (0.15 + t * 0.7) + (Math.random() - 0.5) * 15,
                  y: zone.yMin + (zone.yMax - zone.yMin) * (0.3 + Math.random() * 0.4)
                });
              }
            }
            break;
          }

          case 'edge':
          case 'groundcover': {
            // Dense wave patterns for ground-level plants
            if (scaledQuantity >= 6) {
              const row1 = DISNEY_PATTERNS.generateWavePattern(baseWidth, baseHeight, zone.yMin + 8, Math.ceil(scaledQuantity / 2));
              const row2 = DISNEY_PATTERNS.generateWavePattern(baseWidth, baseHeight, zone.yMax - 5, Math.floor(scaledQuantity / 2));
              positions = [...row1, ...row2];
            } else {
              // Spread evenly with variance
              for (let i = 0; i < scaledQuantity; i++) {
                const t = (i + 0.5) / scaledQuantity;
                positions.push({
                  x: baseWidth * (0.08 + t * 0.84) + (Math.random() - 0.5) * 12,
                  y: zone.yMin + (zone.yMax - zone.yMin) * Math.random()
                });
              }
            }
            break;
          }

          default: {
            // Fallback: golden spiral distribution
            const centerX = baseWidth / 2;
            const centerY = (zone.yMin + zone.yMax) / 2;
            positions = DISNEY_PATTERNS.generateCluster(centerX, centerY, scaledQuantity, baseWidth * 0.3);
          }
        }

        // Place plants at generated positions with collision avoidance
        positions.forEach((pos, i) => {
          const validPos = DISNEY_PATTERNS.findValidPosition(
            pos.x,
            pos.y,
            bundlePlant.plantId,
            newPlants,
            ALL_PLANTS,
            baseWidth,
            baseHeight
          );

          if (validPos) {
            newPlants.push({
              id: `bundle-${Date.now()}-${role}-${plantTypeIndex}-${i}`,
              plantId: bundlePlant.plantId,
              x: validPos.x,
              y: validPos.y,
              rotation: (Math.random() - 0.5) * 15, // Slight natural rotation
              scale: 0.9 + Math.random() * 0.2      // Slight size variance
            });
          }
        });
      });
    });

    setPlacedPlants([...placedPlants, ...newPlants]);
    setSelectedBundle(bundle);
  };

  // Clear all plants
  const clearCanvas = () => {
    setPlacedPlants([]);
    setSelectedPlacedPlant(null);
    setSelectedBundle(null);
  };

  // Export blueprint
  const exportBlueprint = () => {
    const blueprint = {
      name: designName,
      created: new Date().toISOString(),
      dimensions: bedDimensions,
      plants: placedPlants.map(p => {
        const plantData = ALL_PLANTS.find(pd => pd.id === p.plantId);
        return {
          ...p,
          species: plantData?.name,
          category: plantData?.category
        };
      }),
      coverage: coveragePercent,
      colorHarmony: colorHarmonyStatus,
      bundle: selectedBundle?.name || null
    };
    
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${designName.replace(/\s+/g, '-').toLowerCase()}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get plant size for rendering
  const getPlantSize = (plantId) => {
    const plant = ALL_PLANTS.find(p => p.id === plantId);
    if (!plant) return 20;
    
    const sizes = {
      focal: 40,
      topiary: 30,
      back: 28,
      middle: 22,
      front: 16,
      groundcover: 14
    };
    
    return sizes[plant.category] || 20;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-emerald-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl blur-sm opacity-75" />
                <div className="relative bg-slate-900 p-3 rounded-xl">
                  <Flower2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                  Disney Imagineering
                </h1>
                <p className="text-emerald-500 text-sm font-medium tracking-widest uppercase">
                  Landscape Studio
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="bg-slate-800/50 border border-emerald-900/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
                placeholder="Design Name"
              />
              <button
                onClick={exportBlueprint}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 rounded-lg font-medium transition-all"
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
        <aside className="w-80 border-r border-emerald-900/50 bg-slate-900/50 backdrop-blur-sm h-[calc(100vh-73px)] overflow-hidden flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-emerald-900/50">
            <button
              onClick={() => setActiveTab('plants')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'plants'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-900/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Leaf className="w-4 h-4 inline mr-2" />
              Plants
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'bundles'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-900/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Bundles
            </button>
          </div>

          {activeTab === 'plants' && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-emerald-900/30">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plants..."
                    className="w-full bg-slate-800/50 border border-emerald-900/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="px-4 py-3 border-b border-emerald-900/30 flex flex-wrap gap-2">
                {['all', 'focal', 'topiary', 'back', 'middle', 'front', 'groundcover'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === cat
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
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
                        ? 'bg-emerald-600/30 border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-800/30 border border-emerald-900/30 hover:bg-slate-800/50 hover:border-emerald-800/50'
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
                        <div className="font-medium text-white truncate">{plant.name}</div>
                        <div className="text-xs text-slate-400 truncate">{plant.height}</div>
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
                <div className="p-4 border-t border-emerald-900/50 bg-emerald-950/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{selectedPlant.icon}</span>
                    <div>
                      <div className="font-bold text-emerald-300">{selectedPlant.name}</div>
                      <div className="text-xs text-slate-400">{selectedPlant.category}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500">Height</div>
                      <div className="text-white">{selectedPlant.height}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500">Spread</div>
                      <div className="text-white">{selectedPlant.spread}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500">Sun</div>
                      <div className="text-white flex items-center gap-1">
                        <Sun className="w-3 h-3 text-yellow-400" />
                        {selectedPlant.sunReq}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500">Water</div>
                      <div className="text-white flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-400" />
                        {selectedPlant.waterReq}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-emerald-400/80 bg-emerald-900/20 rounded p-2">
                    <Star className="w-3 h-3 inline mr-1" />
                    {selectedPlant.disneyUse}
                  </div>
                  <div className="mt-3 text-center text-xs text-slate-500">
                    Click on the canvas to place
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bundles' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Scale Selector */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-emerald-900/30">
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Bundle Scale Multiplier
                </label>
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2, 3].map(scale => (
                    <button
                      key={scale}
                      onClick={() => setBundleScale(scale)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        bundleScale === scale
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
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
                  className="bg-slate-800/30 rounded-xl overflow-hidden border border-emerald-900/30 hover:border-emerald-700/50 transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{bundle.preview}</span>
                      <div>
                        <h3 className="font-bold text-white">{bundle.name}</h3>
                        <p className="text-xs text-slate-400">{bundle.theme}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{bundle.description}</p>
                    
                    {/* Color Scheme Preview */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-slate-500">Colors:</span>
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
                    <div className="text-xs text-slate-400 mb-3">
                      {bundle.plants.reduce((sum, p) => sum + Math.round(p.quantity * bundleScale), 0)} plants at {bundleScale}x scale
                    </div>

                    <button
                      onClick={() => applyBundle(bundle)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
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
          <div className="flex items-center justify-between px-6 py-3 border-b border-emerald-900/50 bg-slate-900/30">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowRuler(!showRuler)}
                className={`p-2 rounded-lg transition-colors ${
                  showRuler ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Ruler"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-emerald-900/50 mx-2" />
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-400 w-16 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-emerald-900/50 mx-2" />
              <button
                onClick={clearCanvas}
                className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-900/30 transition-colors"
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
                <span className="text-slate-500">Bed Size:</span>
                <input
                  type="number"
                  value={bedDimensions.width}
                  onChange={(e) => setBedDimensions({...bedDimensions, width: parseInt(e.target.value) || 0})}
                  className="w-16 bg-slate-800 border border-emerald-900/50 rounded px-2 py-1 text-center text-white"
                />
                <span className="text-slate-500">×</span>
                <input
                  type="number"
                  value={bedDimensions.height}
                  onChange={(e) => setBedDimensions({...bedDimensions, height: parseInt(e.target.value) || 0})}
                  className="w-16 bg-slate-800 border border-emerald-900/50 rounded px-2 py-1 text-center text-white"
                />
                <span className="text-slate-500">in</span>
              </div>

              <button
                onClick={() => setShowVisionPreview(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-lg font-medium transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Vision Preview
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-slate-950/50 p-8">
            <div 
              className="relative mx-auto bg-gradient-to-b from-amber-900/30 to-amber-950/50 rounded-lg overflow-hidden shadow-2xl"
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
                    backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 1px, transparent 1px)'
                  }}
                />
              )}

              {/* Ruler Marks */}
              {showRuler && (
                <>
                  {/* Top Ruler */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900/80 flex">
                    {Array.from({ length: Math.floor(bedDimensions.width / 12) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-xs text-slate-400 transform -translate-x-1/2"
                        style={{ left: i * 12 * zoom * 4 }}
                      >
                        <div className="h-2 w-px bg-slate-500 mx-auto" />
                        {i * 12}"
                      </div>
                    ))}
                  </div>
                  {/* Left Ruler */}
                  <div className="absolute top-6 left-0 bottom-0 w-6 bg-slate-900/80">
                    {Array.from({ length: Math.floor(bedDimensions.height / 12) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-xs text-slate-400 transform -translate-y-1/2 flex items-center"
                        style={{ top: i * 12 * zoom * 4 }}
                      >
                        <span className="w-4 text-right pr-1">{i * 12}"</span>
                        <div className="w-2 h-px bg-slate-500" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Bed Edge Indicator */}
              <div className="absolute inset-2 border-2 border-dashed border-emerald-600/30 rounded pointer-events-none" />

              {/* Placed Plants */}
              {placedPlants.map(plant => {
                const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
                const size = getPlantSize(plant.plantId);
                const isSelected = selectedPlacedPlant === plant.id;
                const isBeingDragged = draggingPlantId === plant.id;
                
                return (
                  <div
                    key={plant.id}
                    className={`absolute transition-shadow ${
                      isSelected ? 'ring-4 ring-emerald-400 ring-opacity-50 z-10' : 'hover:brightness-110'
                    } ${isBeingDragged ? 'z-20 scale-105' : ''}`}
                    style={{
                      left: plant.x * zoom * 4 - (size * zoom) / 2,
                      top: plant.y * zoom * 4 - (size * zoom) / 2,
                      width: size * zoom,
                      height: size * zoom,
                      transform: `rotate(${plant.rotation}deg) scale(${plant.scale})`,
                      cursor: isBeingDragged ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => handleDragStart(e, plant)}
                    onClick={(e) => handlePlantClick(e, plant)}
                  >
                    <div 
                      className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
                      style={{ 
                        backgroundColor: plantData?.color || '#4CAF50',
                        boxShadow: `0 4px 12px ${plantData?.color}40`
                      }}
                    >
                      <span style={{ fontSize: size * zoom * 0.5 }}>{plantData?.icon}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-xs whitespace-nowrap">
                        {plantData?.name}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty State */}
              {placedPlants.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Flower2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Select a plant or bundle to begin</p>
                    <p className="text-sm mt-2">Click to place • Drag to move • Click to select</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Disney Rules & Stats */}
        <aside className="w-72 border-l border-emerald-900/50 bg-slate-900/50 backdrop-blur-sm h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Disney Quality Score */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-xl p-4 border border-emerald-700/30">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-emerald-300">Disney Quality Score</h3>
              </div>
              <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div 
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    coveragePercent >= 95 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                    coveragePercent >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                    'bg-gradient-to-r from-red-500 to-orange-400'
                  }`}
                  style={{ width: `${Math.min(100, coveragePercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Coverage</span>
                <span className={`font-bold ${
                  coveragePercent >= 95 ? 'text-emerald-400' :
                  coveragePercent >= 80 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {coveragePercent.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Disney Standard: 95%+ living coverage
              </div>
            </div>

            {/* Design Stats */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-emerald-900/30">
              <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Design Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Plants</span>
                  <span className="text-white font-medium">{placedPlants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bed Area</span>
                  <span className="text-white font-medium">{bedDimensions.width * bedDimensions.height} sq in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applied Bundle</span>
                  <span className="text-emerald-400 font-medium truncate ml-2">
                    {selectedBundle?.name || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Plant Breakdown */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-emerald-900/30">
              <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
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
                      <span className="text-slate-400 capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.min(100, (count / Math.max(1, placedPlants.length)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-white w-6 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Harmony */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-emerald-900/30">
              <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Harmony
              </h3>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                colorHarmonyStatus.valid ? 'bg-emerald-900/30' : 'bg-red-900/30'
              }`}>
                {colorHarmonyStatus.valid ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
                <span className={colorHarmonyStatus.valid ? 'text-emerald-300' : 'text-red-300'}>
                  {colorHarmonyStatus.scheme} Scheme
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
            <div className="bg-slate-800/30 rounded-xl p-4 border border-emerald-900/30">
              <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Disney Rules Check
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { rule: '95%+ Plant Coverage', met: coveragePercent >= 95 },
                  { rule: 'Height Graduation', met: placedPlants.length >= 3 },
                  { rule: 'Color Harmony (≤3 hues)', met: colorHarmonyStatus.valid },
                  { rule: 'Edge Definition', met: placedPlants.some(p => ALL_PLANTS.find(pl => pl.id === p.plantId)?.category === 'groundcover') },
                  { rule: 'Focal Point Present', met: placedPlants.some(p => ALL_PLANTS.find(pl => pl.id === p.plantId)?.category === 'focal') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.met ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      {item.met ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <CircleDot className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                    <span className={item.met ? 'text-emerald-300' : 'text-slate-500'}>
                      {item.rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Schedule */}
            {placedPlants.length > 0 && (
              <div className="bg-slate-800/30 rounded-xl p-4 border border-emerald-900/30">
                <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
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
                    <div key={name} className="flex justify-between py-1 border-b border-emerald-900/20">
                      <span className="text-slate-300">{name}</span>
                      <span className="text-emerald-400 font-medium">×{qty}</span>
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
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-emerald-700/50">
            <div className="flex items-center justify-between p-4 border-b border-emerald-900/50">
              <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Disney Vision Preview
              </h2>
              <button
                onClick={() => {
                  setShowVisionPreview(false);
                  setGeneratedImage(null);
                  setGenerateError(null);
                }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="aspect-video bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30 rounded-xl flex items-center justify-center border border-emerald-800/30 overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    <h3 className="text-xl font-bold text-emerald-300 mb-2">Generating Vision...</h3>
                    <p className="text-slate-400">Creating your Disney-quality garden rendering</p>
                    <p className="text-slate-500 text-sm mt-2">This may take 15-30 seconds</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage.url}
                    alt={`${generatedImage.season} garden preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-emerald-400/50" />
                    <h3 className="text-xl font-bold text-emerald-300 mb-2">AI Vision Rendering</h3>
                    <p className="text-slate-400 max-w-md">
                      {placedPlants.length === 0
                        ? 'Add plants to your design to generate a preview'
                        : `Your design with ${placedPlants.length} plants will generate a photorealistic rendering showing the completed Disney-quality garden.`
                      }
                    </p>
                    {generateError && (
                      <p className="text-red-400 mt-4 text-sm">{generateError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Generate Buttons */}
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => generateVisionImage('spring')}
                  disabled={isGenerating || placedPlants.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isGenerating || placedPlants.length === 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                  }`}
                >
                  <Flower2 className="w-4 h-4" />
                  Generate Spring View
                </button>
                <button
                  onClick={() => generateVisionImage('summer')}
                  disabled={isGenerating || placedPlants.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isGenerating || placedPlants.length === 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Generate Summer View
                </button>
                <button
                  onClick={() => generateVisionImage('fall')}
                  disabled={isGenerating || placedPlants.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isGenerating || placedPlants.length === 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  Generate Fall View
                </button>
              </div>

              {/* Download button when image is generated */}
              {generatedImage && (
                <div className="mt-4 flex justify-center">
                  <a
                    href={generatedImage.url}
                    download={`disney-garden-${generatedImage.season}-${Date.now()}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </a>
                </div>
              )}

              <div className="mt-4 p-4 bg-slate-800/30 rounded-xl">
                <h4 className="font-medium text-emerald-300 mb-2">Rendering Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Plants:</span>
                    <span className="text-white ml-2">{placedPlants.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Coverage:</span>
                    <span className="text-white ml-2">{coveragePercent.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Theme:</span>
                    <span className="text-white ml-2">{selectedBundle?.theme || 'Custom'}</span>
                  </div>
                </div>
                {generatedImage?.revisedPrompt && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <span className="text-slate-500 text-xs">AI Interpretation:</span>
                    <p className="text-slate-400 text-xs mt-1">{generatedImage.revisedPrompt}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
