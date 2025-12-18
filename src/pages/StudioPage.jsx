import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Trees, Shrub, Leaf, LayoutGrid, ZoomIn, ZoomOut,
  RotateCcw, Download, Upload, Eye, Palette, Ruler, Check,
  X, ChevronRight, ChevronDown, Search, Package, Sparkles,
  Layers, Settings, Info, Move, Trash2, Copy, FlipHorizontal,
  Sun, CloudRain, Thermometer, Star, Crown, CircleDot, Home
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

export default function StudioPage() {
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
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingPlantId, setDraggingPlantId] = useState(null);

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
    const x = (e.clientX - rect.left) / (zoom * 4);
    const y = (e.clientY - rect.top) / (zoom * 4);

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
    setSelectedPlacedPlant(plant.id === selectedPlacedPlant ? null : plant.id);
  };

  // Handle drag start
  const handleDragStart = (e, plant) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggingPlantId(plant.id);
    setSelectedPlacedPlant(plant.id);

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (zoom * 4);
    const mouseY = (e.clientY - rect.top) / (zoom * 4);

    setDragOffset({
      x: mouseX - plant.x,
      y: mouseY - plant.y
    });
  };

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !draggingPlantId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (zoom * 4);
    const mouseY = (e.clientY - rect.top) / (zoom * 4);

    const newX = Math.max(5, Math.min(bedDimensions.width - 5, mouseX - dragOffset.x));
    const newY = Math.max(5, Math.min(bedDimensions.height - 5, mouseY - dragOffset.y));

    setPlacedPlants(prev => prev.map(p =>
      p.id === draggingPlantId
        ? { ...p, x: newX, y: newY }
        : p
    ));
  }, [isDragging, draggingPlantId, zoom, bedDimensions, dragOffset]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggingPlantId(null);
  }, []);

  // Add mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Delete selected plant
  const deleteSelectedPlant = () => {
    if (selectedPlacedPlant) {
      setPlacedPlants(placedPlants.filter(p => p.id !== selectedPlacedPlant));
      setSelectedPlacedPlant(null);
    }
  };

  // Apply bed bundle
  const applyBundle = (bundle) => {
    const newPlants = [];
    const baseWidth = bedDimensions.width;
    const baseHeight = bedDimensions.height;

    bundle.plants.forEach((bundlePlant, index) => {
      const plantData = ALL_PLANTS.find(p => p.id === bundlePlant.plantId);
      if (!plantData) return;

      const scaledQuantity = Math.round(bundlePlant.quantity * bundleScale);

      for (let i = 0; i < scaledQuantity; i++) {
        let x, y;

        // Position based on role
        switch (bundlePlant.role) {
          case 'focal':
            x = baseWidth * 0.5 + (i * 20);
            y = baseHeight * 0.85;
            break;
          case 'back':
            x = baseWidth * (0.2 + (i * 0.2));
            y = baseHeight * 0.8;
            break;
          case 'middle':
            x = baseWidth * (0.15 + (i * 0.12));
            y = baseHeight * 0.5;
            break;
          case 'front':
            x = baseWidth * (0.1 + (i * 0.06));
            y = baseHeight * 0.2;
            break;
          case 'edge':
            x = baseWidth * (0.05 + (i * 0.06));
            y = baseHeight * 0.1;
            break;
          default:
            x = Math.random() * baseWidth;
            y = Math.random() * baseHeight;
        }

        newPlants.push({
          id: `bundle-${Date.now()}-${index}-${i}`,
          plantId: bundlePlant.plantId,
          x: Math.max(10, Math.min(baseWidth - 10, x)),
          y: Math.max(10, Math.min(baseHeight - 10, y)),
          rotation: 0,
          scale: 1
        });
      }
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

  // Generate AI vision image
  const generateVisionImage = async (season) => {
    if (placedPlants.length === 0) {
      setGenerateError('Please add some plants to your design first.');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setSelectedSeason(season);

    try {
      // Build a description of the garden based on placed plants
      const plantCounts = placedPlants.reduce((acc, p) => {
        const plantData = ALL_PLANTS.find(pl => pl.id === p.plantId);
        if (plantData) {
          acc[plantData.name] = (acc[plantData.name] || 0) + 1;
        }
        return acc;
      }, {});

      const plantList = Object.entries(plantCounts)
        .map(([name, count]) => `${count} ${name}${count > 1 ? 's' : ''}`)
        .join(', ');

      // Simulate AI generation with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use a placeholder landscape image based on season
      const seasonImages = {
        spring: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=450&fit=crop',
        summer: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
        fall: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
        winter: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=450&fit=crop'
      };

      setGeneratedImage({
        url: seasonImages[season],
        season: season,
        description: `Disney-quality ${season} garden with ${plantList}`,
        plantCount: placedPlants.length,
        coverage: coveragePercent.toFixed(1)
      });
    } catch (error) {
      setGenerateError('Failed to generate vision. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset vision when modal closes
  const closeVisionModal = () => {
    setShowVisionPreview(false);
    setGeneratedImage(null);
    setGenerateError(null);
    setSelectedSeason(null);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-sage-900">
      {/* Header */}
      <header className="relative z-10 border-b border-sage-200 bg-white shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-lg hover:bg-sage-100 transition-colors" title="Back to Home">
                <Home className="w-5 h-5 text-sage-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-sage-500 p-3 rounded-xl shadow-lg shadow-sage-500/20">
                  <Flower2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-sage-800 tracking-tight">
                    Disney Imagineering
                  </h1>
                  <p className="text-sage-500 text-sm font-medium tracking-widest uppercase">
                    Landscape Studio
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="bg-cream-100 border border-sage-200 rounded-lg px-4 py-2 text-sage-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500 w-64"
                placeholder="Design Name"
              />
              <button
                onClick={exportBlueprint}
                className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-sage-500/20"
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
        <aside className="w-80 border-r border-sage-200 bg-white h-[calc(100vh-73px)] overflow-hidden flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-sage-200">
            <button
              onClick={() => setActiveTab('plants')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'plants'
                  ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50'
                  : 'text-sage-500 hover:text-sage-700'
              }`}
            >
              <Leaf className="w-4 h-4 inline mr-2" />
              Plants
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'bundles'
                  ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50'
                  : 'text-sage-500 hover:text-sage-700'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Bundles
            </button>
          </div>

          {activeTab === 'plants' && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-sage-100">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plants..."
                    className="w-full bg-cream-50 border border-sage-200 rounded-lg pl-10 pr-4 py-2 text-sm text-sage-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="px-4 py-3 border-b border-sage-100 flex flex-wrap gap-2">
                {['all', 'focal', 'topiary', 'back', 'middle', 'front', 'groundcover'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === cat
                        ? 'bg-sage-500 text-white'
                        : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
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
                        ? 'bg-sage-100 border-2 border-sage-500 ring-2 ring-sage-500/20'
                        : 'bg-cream-50 border border-sage-100 hover:bg-sage-50 hover:border-sage-200'
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
                        <div className="font-medium text-sage-900 truncate">{plant.name}</div>
                        <div className="text-xs text-sage-500 truncate">{plant.height}</div>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full ring-2 ring-sage-200"
                        style={{ backgroundColor: plant.color }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Plant Info */}
              {selectedPlant && (
                <div className="p-4 border-t border-sage-200 bg-sage-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{selectedPlant.icon}</span>
                    <div>
                      <div className="font-bold text-sage-800">{selectedPlant.name}</div>
                      <div className="text-xs text-sage-500">{selectedPlant.category}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2 border border-sage-100">
                      <div className="text-sage-500">Height</div>
                      <div className="text-sage-800">{selectedPlant.height}</div>
                    </div>
                    <div className="bg-white rounded p-2 border border-sage-100">
                      <div className="text-sage-500">Spread</div>
                      <div className="text-sage-800">{selectedPlant.spread}</div>
                    </div>
                    <div className="bg-white rounded p-2 border border-sage-100">
                      <div className="text-sage-500">Sun</div>
                      <div className="text-sage-800 flex items-center gap-1">
                        <Sun className="w-3 h-3 text-olive-500" />
                        {selectedPlant.sunReq}
                      </div>
                    </div>
                    <div className="bg-white rounded p-2 border border-sage-100">
                      <div className="text-sage-500">Water</div>
                      <div className="text-sage-800 flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-forest-500" />
                        {selectedPlant.waterReq}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-forest-600 bg-forest-50 rounded p-2 border border-forest-100">
                    <Star className="w-3 h-3 inline mr-1" />
                    {selectedPlant.disneyUse}
                  </div>
                  <div className="mt-3 text-center text-xs text-sage-500">
                    Click on the canvas to place
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bundles' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Scale Selector */}
              <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Bundle Scale Multiplier
                </label>
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2, 3].map(scale => (
                    <button
                      key={scale}
                      onClick={() => setBundleScale(scale)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        bundleScale === scale
                          ? 'bg-sage-500 text-white'
                          : 'bg-white text-sage-600 hover:bg-sage-100 border border-sage-200'
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
                  className="bg-white rounded-xl overflow-hidden border border-sage-200 hover:border-sage-300 hover:shadow-md transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{bundle.preview}</span>
                      <div>
                        <h3 className="font-bold text-sage-900">{bundle.name}</h3>
                        <p className="text-xs text-sage-500">{bundle.theme}</p>
                      </div>
                    </div>
                    <p className="text-sm text-sage-600 mb-3">{bundle.description}</p>

                    {/* Color Scheme Preview */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-sage-500">Colors:</span>
                      <div className="flex gap-1">
                        {bundle.colorScheme.map((color, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full ring-2 ring-sage-100"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Plant Count */}
                    <div className="text-xs text-sage-500 mb-3">
                      {bundle.plants.reduce((sum, p) => sum + Math.round(p.quantity * bundleScale), 0)} plants at {bundleScale}x scale
                    </div>

                    <button
                      onClick={() => applyBundle(bundle)}
                      className="w-full bg-sage-500 hover:bg-sage-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
          <div className="flex items-center justify-between px-6 py-3 border-b border-sage-200 bg-white">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                }`}
                title="Toggle Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowRuler(!showRuler)}
                className={`p-2 rounded-lg transition-colors ${
                  showRuler ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                }`}
                title="Toggle Ruler"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-sage-200 mx-2" />
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-sage-600 w-16 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-sage-200 mx-2" />
              <button
                onClick={clearCanvas}
                className="p-2 rounded-lg bg-sage-100 text-red-500 hover:bg-red-50 transition-colors"
                title="Clear Canvas"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {selectedPlacedPlant && (
                <button
                  onClick={deleteSelectedPlant}
                  className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Bed Dimensions */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sage-500">Bed Size:</span>
                <input
                  type="number"
                  value={bedDimensions.width}
                  onChange={(e) => setBedDimensions({...bedDimensions, width: parseInt(e.target.value) || 0})}
                  className="w-16 bg-cream-50 border border-sage-200 rounded px-2 py-1 text-center text-sage-900 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
                />
                <span className="text-sage-400">×</span>
                <input
                  type="number"
                  value={bedDimensions.height}
                  onChange={(e) => setBedDimensions({...bedDimensions, height: parseInt(e.target.value) || 0})}
                  className="w-16 bg-cream-50 border border-sage-200 rounded px-2 py-1 text-center text-sage-900 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
                />
                <span className="text-sage-500">in</span>
              </div>

              <button
                onClick={() => setShowVisionPreview(true)}
                className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Vision Preview
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-cream-100 p-8">
            <div
              className="relative mx-auto bg-gradient-to-b from-wood-200 to-wood-300 rounded-lg overflow-hidden shadow-xl border border-wood-400"
              style={{
                width: bedDimensions.width * zoom * 4,
                height: bedDimensions.height * zoom * 4,
                cursor: selectedPlant ? 'crosshair' : 'default'
              }}
              ref={canvasRef}
              onClick={handleCanvasClick}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundSize: `${12 * zoom * 4}px ${12 * zoom * 4}px`,
                    backgroundImage: 'linear-gradient(to right, rgba(103, 124, 86, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(103, 124, 86, 0.5) 1px, transparent 1px)'
                  }}
                />
              )}

              {/* Ruler Marks */}
              {showRuler && (
                <>
                  {/* Top Ruler */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-sage-800/90 flex">
                    {Array.from({ length: Math.floor(bedDimensions.width / 12) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-xs text-white transform -translate-x-1/2"
                        style={{ left: i * 12 * zoom * 4 }}
                      >
                        <div className="h-2 w-px bg-sage-300 mx-auto" />
                        {i * 12}"
                      </div>
                    ))}
                  </div>
                  {/* Left Ruler */}
                  <div className="absolute top-6 left-0 bottom-0 w-6 bg-sage-800/90">
                    {Array.from({ length: Math.floor(bedDimensions.height / 12) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-xs text-white transform -translate-y-1/2 flex items-center"
                        style={{ top: i * 12 * zoom * 4 }}
                      >
                        <span className="w-4 text-right pr-1">{i * 12}"</span>
                        <div className="w-2 h-px bg-sage-300" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Bed Edge Indicator */}
              <div className="absolute inset-2 border-2 border-dashed border-sage-500/30 rounded pointer-events-none" />

              {/* Placed Plants */}
              {placedPlants.map(plant => {
                const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
                const size = getPlantSize(plant.plantId);
                const isSelected = selectedPlacedPlant === plant.id;
                const isBeingDragged = draggingPlantId === plant.id;

                return (
                  <div
                    key={plant.id}
                    className={`absolute transition-all ${
                      isBeingDragged ? 'cursor-grabbing z-20' : 'cursor-grab'
                    } ${
                      isSelected ? 'ring-4 ring-sage-500 ring-opacity-50 z-10' : 'hover:brightness-110'
                    }`}
                    style={{
                      left: plant.x * zoom * 4 - (size * zoom) / 2,
                      top: plant.y * zoom * 4 - (size * zoom) / 2,
                      width: size * zoom,
                      height: size * zoom,
                      transform: `rotate(${plant.rotation}deg) scale(${plant.scale})`,
                    }}
                    onClick={(e) => handlePlantClick(e, plant)}
                    onMouseDown={(e) => handleDragStart(e, plant)}
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
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sage-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {plantData?.name}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty State */}
              {placedPlants.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sage-500">
                  <div className="text-center">
                    <Flower2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Select a plant or bundle to begin</p>
                    <p className="text-sm mt-2">Click on the canvas to place plants</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Disney Rules & Stats */}
        <aside className="w-72 border-l border-sage-200 bg-white h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Disney Quality Score */}
            <div className="bg-gradient-to-br from-sage-50 to-forest-50 rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-olive-500" />
                <h3 className="font-bold text-sage-800">Disney Quality Score</h3>
              </div>
              <div className="relative h-4 bg-sage-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    coveragePercent >= 95 ? 'bg-gradient-to-r from-sage-500 to-forest-500' :
                    coveragePercent >= 80 ? 'bg-gradient-to-r from-olive-400 to-olive-500' :
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${Math.min(100, coveragePercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sage-600">Coverage</span>
                <span className={`font-bold ${
                  coveragePercent >= 95 ? 'text-sage-600' :
                  coveragePercent >= 80 ? 'text-olive-600' : 'text-red-500'
                }`}>
                  {coveragePercent.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-sage-500 mt-1">
                Disney Standard: 95%+ living coverage
              </div>
            </div>

            {/* Design Stats */}
            <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
              <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Design Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-600">Total Plants</span>
                  <span className="text-sage-900 font-medium">{placedPlants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Bed Area</span>
                  <span className="text-sage-900 font-medium">{bedDimensions.width * bedDimensions.height} sq in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Applied Bundle</span>
                  <span className="text-sage-700 font-medium truncate ml-2">
                    {selectedBundle?.name || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Plant Breakdown */}
            <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
              <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
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
                      <span className="text-sage-600 capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-sage-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sage-500 transition-all"
                            style={{ width: `${Math.min(100, (count / Math.max(1, placedPlants.length)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sage-900 w-6 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Harmony */}
            <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
              <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Harmony
              </h3>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                colorHarmonyStatus.valid ? 'bg-sage-100' : 'bg-red-50'
              }`}>
                {colorHarmonyStatus.valid ? (
                  <Check className="w-4 h-4 text-sage-600" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className={colorHarmonyStatus.valid ? 'text-sage-700' : 'text-red-600'}>
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
                    className="w-8 h-8 rounded-lg ring-2 ring-sage-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Disney Rules Checklist */}
            <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
              <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
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
                      item.met ? 'bg-sage-500' : 'bg-sage-200'
                    }`}>
                      {item.met ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <CircleDot className="w-3 h-3 text-sage-400" />
                      )}
                    </div>
                    <span className={item.met ? 'text-sage-700' : 'text-sage-400'}>
                      {item.rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Schedule */}
            {placedPlants.length > 0 && (
              <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
                <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
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
                    <div key={name} className="flex justify-between py-1 border-b border-sage-100">
                      <span className="text-sage-700">{name}</span>
                      <span className="text-sage-600 font-medium">×{qty}</span>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-sage-200 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-sage-200">
              <h2 className="text-xl font-bold text-sage-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-forest-500" />
                Disney Vision Preview
              </h2>
              <button
                onClick={closeVisionModal}
                className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gradient-to-br from-sage-100 via-forest-50 to-cream-100 rounded-xl flex items-center justify-center border border-sage-200 overflow-hidden">
                {/* Loading State */}
                {isGenerating && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
                    <h3 className="text-xl font-bold text-sage-700 mb-2">Generating {selectedSeason} Vision...</h3>
                    <p className="text-sage-500">Creating your Disney-quality garden render</p>
                  </div>
                )}

                {/* Generated Image */}
                {!isGenerating && generatedImage && (
                  <div className="w-full h-full relative">
                    <img
                      src={generatedImage.url}
                      alt={`${generatedImage.season} garden vision`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-medium capitalize">{generatedImage.season} View</p>
                      <p className="text-white/80 text-sm">{generatedImage.description}</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {!isGenerating && generateError && (
                  <div className="text-center">
                    <X className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-bold text-red-600 mb-2">Generation Failed</h3>
                    <p className="text-sage-500">{generateError}</p>
                  </div>
                )}

                {/* Initial State */}
                {!isGenerating && !generatedImage && !generateError && (
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-sage-300" />
                    <h3 className="text-xl font-bold text-sage-700 mb-2">AI Vision Rendering</h3>
                    <p className="text-sage-500 max-w-md">
                      Your design with {placedPlants.length} plants would generate a photorealistic
                      rendering showing the completed Disney-quality garden at peak bloom.
                    </p>
                  </div>
                )}
              </div>

              {/* Generate Buttons */}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => generateVisionImage('spring')}
                  disabled={isGenerating}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isGenerating
                      ? 'bg-sage-300 text-white cursor-not-allowed'
                      : 'bg-sage-500 hover:bg-sage-600 text-white'
                  }`}
                >
                  <Flower2 className="w-4 h-4" />
                  Spring
                </button>
                <button
                  onClick={() => generateVisionImage('summer')}
                  disabled={isGenerating}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isGenerating
                      ? 'bg-olive-200 text-olive-400 cursor-not-allowed'
                      : 'bg-olive-500 hover:bg-olive-600 text-white'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Summer
                </button>
                <button
                  onClick={() => generateVisionImage('fall')}
                  disabled={isGenerating}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isGenerating
                      ? 'bg-wood-200 text-wood-400 cursor-not-allowed'
                      : 'bg-wood-500 hover:bg-wood-600 text-white'
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  Fall
                </button>
                <button
                  onClick={() => generateVisionImage('winter')}
                  disabled={isGenerating}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isGenerating
                      ? 'bg-sage-100 text-sage-400 cursor-not-allowed'
                      : 'bg-cream-100 border border-sage-200 text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  <CloudRain className="w-4 h-4" />
                  Winter
                </button>
              </div>

              <div className="mt-4 p-4 bg-cream-50 rounded-xl border border-sage-100">
                <h4 className="font-medium text-sage-700 mb-2">Rendering Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-sage-500">Plants:</span>
                    <span className="text-sage-800 ml-2">{placedPlants.length}</span>
                  </div>
                  <div>
                    <span className="text-sage-500">Coverage:</span>
                    <span className="text-sage-800 ml-2">{coveragePercent.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-sage-500">Theme:</span>
                    <span className="text-sage-800 ml-2">{selectedBundle?.theme || 'Custom'}</span>
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
