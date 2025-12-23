import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Trees, Shrub, Leaf, LayoutGrid, ZoomIn, ZoomOut,
  RotateCcw, Download, Upload, Eye, Palette, Ruler, Check,
  X, ChevronRight, ChevronDown, ChevronUp, Search, Package, Sparkles,
  Layers, Settings, Info, Move, Trash2, Copy, FlipHorizontal,
  Sun, CloudRain, Thermometer, Star, Crown, CircleDot, Home,
  PenTool, Square, User, LogOut, Lock
} from 'lucide-react';

// Import auth and subscription hooks
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useDemoMode } from '../hooks/useDemoMode';
import { AuthModal } from '../components/auth/AuthModal';
import { UpgradePrompt } from '../components/subscription/UpgradePrompt';
import { DemoModeIndicator } from '../components/studio/DemoModeIndicator';

// Import plant database with size variants
import {
  ALL_PLANTS,
  SIZE_MULTIPLIERS,
  getPlantSizes,
  getSizeMultiplier,
  GRASSES,
  GROUND_COVERS,
  PERENNIALS,
  SHRUBS,
  TREES
} from '../data/plantDatabase';

// Import plant bundles/packages
import {
  PLANT_BUNDLES,
  INVASIVE_WARNINGS,
  getBundleById,
  getBundlePlants,
  getInvasiveWarning,
  PLANT_ROLES
} from '../data/plantBundles';

// Import Disney Design System
import {
  HEIGHT_TIERS,
  MONTHS,
  SEASONS,
  PLANT_FORMS,
  PLANT_TEXTURES,
  analyzeBloomSequence,
  analyzeHeightLayering,
  analyzeMassPlanting,
  validateFormVariety,
  validateTextureVariety,
  calculateShowReadyScore,
  SHOW_READY_CRITERIA
} from '../data/disneyDesignSystem';

// Import Residential Design System - Home Landscape Training Boost
import {
  YARD_ZONES,
  FOUNDATION_RULES,
  STRUCTURE_EDGE_RULES,
  CANOPY_RULES,
  SMALL_BED_RULES,
  BED_DEPTH_RULES,
  SPACING_FORMULAS,
  CURB_APPEAL_RULES,
  PRIVACY_SCREENING_RULES,
  RESIDENTIAL_DESIGN_PRINCIPLES,
  RESIDENTIAL_BUNDLE_TEMPLATES,
  RESIDENTIAL_BUNDLES,
  RESIDENTIAL_CRITERIA,
  calculateIdealBedDepth,
  calculateLayerCount,
  calculateLayerDepths,
  calculatePlantQuantity,
  validateResidentialPlacement,
  analyzeResidentialLayering,
  analyzeResidentialSpacing,
  analyzeOddGroupings,
  analyzeZoneCompliance,
  calculateResidentialScore
} from '../data/residentialDesignSystem';

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

// USDA Hardiness Zones reference
const HARDINESS_ZONES = [
  { zone: 3, minTemp: '-40 to -30°F', label: 'Zone 3' },
  { zone: 4, minTemp: '-30 to -20°F', label: 'Zone 4' },
  { zone: 5, minTemp: '-20 to -10°F', label: 'Zone 5' },
  { zone: 6, minTemp: '-10 to 0°F', label: 'Zone 6' },
  { zone: 7, minTemp: '0 to 10°F', label: 'Zone 7' },
  { zone: 8, minTemp: '10 to 20°F', label: 'Zone 8' },
  { zone: 9, minTemp: '20 to 30°F', label: 'Zone 9' },
  { zone: 10, minTemp: '30 to 40°F', label: 'Zone 10' },
  { zone: 11, minTemp: '40 to 50°F', label: 'Zone 11' },
];

// Plant categories mapped from new database
const PLANT_DATABASE = {
  grasses: GRASSES,
  groundcovers: GROUND_COVERS,
  perennials: PERENNIALS,
  shrubs: SHRUBS,
  trees: TREES
};

// BED_BUNDLES is now imported from plantBundles.js as PLANT_BUNDLES
// Legacy alias for backward compatibility
const BED_BUNDLES = PLANT_BUNDLES;

// ═══════════════════════════════════════════════════════════════════════════════
// BED ORIENTATION SYSTEM - Define what each edge faces
// ═══════════════════════════════════════════════════════════════════════════════

const BED_EDGE_OPTIONS = [
  { id: 'front', label: 'Front (Viewing)', icon: '👁️', color: '#4CAF50', description: 'Primary viewing angle' },
  { id: 'back', label: 'Back (House/Fence)', icon: '🏠', color: '#795548', description: 'Against structure' },
  { id: 'street', label: 'Street Side', icon: '🛣️', color: '#607D8B', description: 'Faces road/curb' },
  { id: 'walkway', label: 'Walkway/Path', icon: '🚶', color: '#FF9800', description: 'Along path' },
  { id: 'neighbor', label: 'Neighbor Side', icon: '🏘️', color: '#9C27B0', description: 'Property line' },
  { id: 'patio', label: 'Patio/Deck', icon: '🪑', color: '#00BCD4', description: 'Outdoor living' },
  { id: 'entry', label: 'Entry/Door', icon: '🚪', color: '#F44336', description: 'Near entrance' },
  { id: 'side', label: 'Side', icon: '➡️', color: '#9E9E9E', description: 'Secondary view' },
];

const BED_ORIENTATION_PRESETS = [
  {
    id: 'foundation-front',
    name: 'Foundation (Front Yard)',
    icon: '🏠',
    orientation: { top: 'back', bottom: 'street', left: 'side', right: 'side' },
    description: 'House behind, street in front'
  },
  {
    id: 'foundation-side',
    name: 'Foundation (Side Yard)',
    icon: '🏡',
    orientation: { top: 'back', bottom: 'walkway', left: 'neighbor', right: 'entry' },
    description: 'House behind, walkway access'
  },
  {
    id: 'island-bed',
    name: 'Island Bed',
    icon: '🏝️',
    orientation: { top: 'front', bottom: 'front', left: 'front', right: 'front' },
    description: 'Viewable from all sides'
  },
  {
    id: 'border-privacy',
    name: 'Privacy Border',
    icon: '🌲',
    orientation: { top: 'neighbor', bottom: 'front', left: 'side', right: 'side' },
    description: 'Screen neighbor, view from yard'
  },
  {
    id: 'patio-surround',
    name: 'Patio Surround',
    icon: '🪴',
    orientation: { top: 'back', bottom: 'patio', left: 'side', right: 'side' },
    description: 'Frame outdoor living space'
  },
  {
    id: 'entry-path',
    name: 'Entry Walkway',
    icon: '🚶',
    orientation: { top: 'back', bottom: 'walkway', left: 'entry', right: 'side' },
    description: 'Along path to front door'
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function StudioPage() {
  // Auth & Subscription Hooks
  const { user, isAuthenticated, signOut } = useAuth();
  const { hasFullAccess, getStatusMessage } = useSubscription();
  const demoMode = useDemoMode();

  // Auth & Demo Mode UI State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState('default');

  // State Management
  const [activeTab, setActiveTab] = useState('plants');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [placedPlants, setPlacedPlants] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [bundleScale, setBundleScale] = useState(1);
  const [bundleTypeFilter, setBundleTypeFilter] = useState('disney'); // 'disney' | 'residential'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(0.15); // Lower default zoom for large beds
  const [bedDimensions, setBedDimensions] = useState({ width: 100, height: 100 }); // In FEET
  const [showRuler, setShowRuler] = useState(false);
  const [showPlantInfo, setShowPlantInfo] = useState(true);
  const [selectedPlacedPlant, setSelectedPlacedPlant] = useState(null);
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [colorHarmonyStatus, setColorHarmonyStatus] = useState({ valid: true, scheme: 'ANALOGOUS' });
  const [showVisionPreview, setShowVisionPreview] = useState(false);
  const [designName, setDesignName] = useState('Untitled Garden');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingPlantId, setDraggingPlantId] = useState(null);

  // Freehand bed drawing state
  const [bedType, setBedType] = useState('rectangle'); // 'rectangle' | 'custom'
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isDrawingBed, setIsDrawingBed] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [customBedPath, setCustomBedPath] = useState([]);

  // Bed Orientation & Sides - defines what each edge faces
  const [bedOrientation, setBedOrientation] = useState({
    top: 'back',      // What the top edge represents
    bottom: 'front',  // What the bottom edge represents (viewing side)
    left: 'side',     // Left edge
    right: 'side',    // Right edge
  });
  const [showBedLabels, setShowBedLabels] = useState(true);
  const [selectedEdge, setSelectedEdge] = useState(null); // For editing edge labels

  // Hardiness zone filter
  const [selectedZone, setSelectedZone] = useState(7); // Default to Zone 7

  // Size variant selection - tracks selected size for each plant that has multiple sizes
  const [plantSizeSelections, setPlantSizeSelections] = useState({});

  // Plant attribute filters
  const [sunFilter, setSunFilter] = useState('all'); // 'all', 'Full Sun', 'Part Shade', 'Shade', 'Full-Part Sun'
  const [waterFilter, setWaterFilter] = useState('all'); // 'all', 'Low', 'Moderate', 'High'
  const [colorFilter, setColorFilter] = useState('all'); // 'all' or specific hex color
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Disney Design System Analysis State
  const [showReadyScore, setShowReadyScore] = useState(null);
  const [bloomAnalysis, setBloomAnalysis] = useState(null);
  const [heightAnalysis, setHeightAnalysis] = useState(null);
  const [massPlantingAnalysis, setMassPlantingAnalysis] = useState(null);
  const [formAnalysis, setFormAnalysis] = useState(null);
  const [textureAnalysis, setTextureAnalysis] = useState(null);
  const [showBloomCalendar, setShowBloomCalendar] = useState(false);

  // Residential Design System - Home Plant Trainer State
  const [designMode, setDesignMode] = useState('hybrid'); // 'disney' | 'residential' | 'hybrid'
  const [selectedYardZone, setSelectedYardZone] = useState('FRONT_FOUNDATION');
  const [residentialScore, setResidentialScore] = useState(null);
  const [residentialAnalysis, setResidentialAnalysis] = useState(null);
  const [layerAnalysis, setLayerAnalysis] = useState(null);
  const [spacingAnalysis, setSpacingAnalysis] = useState(null);
  const [placementWarnings, setPlacementWarnings] = useState([]); // Warnings for placement rule violations

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Calculate coverage whenever plants change
  // Uses actual bed area (custom path or rectangle), not canvas size
  useEffect(() => {
    let totalBedArea;

    // Use custom bed area if drawn, otherwise use canvas dimensions
    if (bedType === 'custom' && customBedPath.length > 2) {
      // getPolygonArea returns sq inches
      totalBedArea = getPolygonArea(customBedPath);
    } else {
      // Canvas dimensions are in feet, convert to sq inches
      totalBedArea = (bedDimensions.width * 12) * (bedDimensions.height * 12);
    }

    // Avoid division by zero
    if (totalBedArea === 0) {
      setCoveragePercent(0);
      return;
    }

    let coveredArea = 0;

    placedPlants.forEach(plant => {
      const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
      if (plantData) {
        const spreadMatch = plantData.spread.match(/(\d+)/);
        let spreadInches = spreadMatch ? parseInt(spreadMatch[1]) : 12;
        // Check if spread is in feet (ft) and convert to inches
        if (plantData.spread.toLowerCase().includes('ft')) {
          spreadInches = spreadInches * 12;
        }
        coveredArea += Math.PI * Math.pow(spreadInches / 2, 2);
      }
    });

    const coverage = Math.min(100, (coveredArea / totalBedArea) * 100);
    setCoveragePercent(coverage);
  }, [placedPlants, bedDimensions, bedType, customBedPath]);

  // Calculate Disney Design System analysis whenever plants change
  useEffect(() => {
    if (placedPlants.length === 0) {
      setShowReadyScore(null);
      setBloomAnalysis(null);
      setHeightAnalysis(null);
      setMassPlantingAnalysis(null);
      setFormAnalysis(null);
      setTextureAnalysis(null);
      return;
    }

    // Get plant data for all placed plants
    const plantsWithData = placedPlants.map(placed => {
      const plantData = ALL_PLANTS.find(p => p.id === placed.plantId);
      return { ...placed, ...plantData };
    }).filter(p => p.id);

    // Run all analyses
    const bloom = analyzeBloomSequence(placedPlants, ALL_PLANTS);
    const height = analyzeHeightLayering(placedPlants, ALL_PLANTS, bedDimensions);
    const mass = analyzeMassPlanting(placedPlants, ALL_PLANTS);
    const form = validateFormVariety(plantsWithData);
    const texture = validateTextureVariety(plantsWithData);

    setBloomAnalysis(bloom);
    setHeightAnalysis(height);
    setMassPlantingAnalysis(mass);
    setFormAnalysis(form);
    setTextureAnalysis(texture);

    // Calculate overall Show Ready Score
    const score = calculateShowReadyScore({
      coveragePercent,
      bloomSequence: bloom,
      heightLayering: height,
      formVariety: form,
      textureVariety: texture,
      massPlanting: mass,
      colorHarmony: colorHarmonyStatus
    });

    setShowReadyScore(score);
  }, [placedPlants, coveragePercent, colorHarmonyStatus, bedDimensions]);

  // Calculate Residential Design System analysis - Home Plant Trainer Boost
  useEffect(() => {
    if (placedPlants.length === 0) {
      setResidentialScore(null);
      setResidentialAnalysis(null);
      setLayerAnalysis(null);
      setSpacingAnalysis(null);
      return;
    }

    // Run residential analyses
    const layering = analyzeResidentialLayering(placedPlants, ALL_PLANTS, bedDimensions);
    const spacing = analyzeResidentialSpacing(placedPlants, ALL_PLANTS);
    const oddGroups = analyzeOddGroupings(placedPlants, ALL_PLANTS);
    const zoneCheck = analyzeZoneCompliance(placedPlants, ALL_PLANTS, selectedYardZone, bedDimensions);

    // Use bloom analysis for four-season (reuse Disney's analysis)
    const fourSeason = bloomAnalysis ? { score: bloomAnalysis.coverageScore || 50 } : { score: 50 };

    // Curb appeal score based on form variety and visual balance
    const curbAppeal = formAnalysis ? { score: formAnalysis.valid ? 85 : 60 } : { score: 70 };

    setLayerAnalysis(layering);
    setSpacingAnalysis(spacing);

    // Calculate overall residential score
    const resScore = calculateResidentialScore({
      layering,
      spacing,
      oddGroupings: oddGroups,
      zoneCompliance: zoneCheck,
      fourSeason,
      curbAppeal,
    });

    setResidentialScore(resScore);
    setResidentialAnalysis({
      layering,
      spacing,
      oddGroupings: oddGroups,
      zoneCompliance: zoneCheck,
      fourSeason,
      curbAppeal,
    });
  }, [placedPlants, bedDimensions, selectedYardZone, bloomAnalysis, formAnalysis]);

  // Helper function to get selected size for a plant
  const getSelectedSize = (plantId) => {
    return plantSizeSelections[plantId] || (ALL_PLANTS.find(p => p.id === plantId)?.sizes?.[0]) || '3gal';
  };

  // Helper to update size selection for a plant
  const handleSizeChange = (plantId, newSize) => {
    setPlantSizeSelections(prev => ({ ...prev, [plantId]: newSize }));
  };

  // Filter plants based on search, category, hardiness zone, and attributes
  const filteredPlants = ALL_PLANTS.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (plant.botanicalName && plant.botanicalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (plant.description && plant.description.toLowerCase().includes(searchQuery.toLowerCase()));
    // Match against dbCategory for new plants (grasses, groundcovers, perennials, shrubs, trees)
    const matchesCategory = categoryFilter === 'all' ||
                           plant.dbCategory === categoryFilter ||
                           plant.category === categoryFilter;
    const matchesZone = !plant.zones || plant.zones.includes(selectedZone);
    const matchesSun = sunFilter === 'all' || (plant.sunReq && plant.sunReq.includes(sunFilter));
    const matchesWater = waterFilter === 'all' || plant.waterReq === waterFilter;
    const matchesColor = colorFilter === 'all' || isColorMatch(plant.color, colorFilter);
    return matchesSearch && matchesCategory && matchesZone && matchesSun && matchesWater && matchesColor;
  });

  // Rainbow color palette for filtering - covers full spectrum
  const RAINBOW_COLORS = [
    { hex: '#FF0000', name: 'Red' },
    { hex: '#FF4500', name: 'Orange-Red' },
    { hex: '#FF8C00', name: 'Orange' },
    { hex: '#FFD700', name: 'Gold' },
    { hex: '#FFFF00', name: 'Yellow' },
    { hex: '#9ACD32', name: 'Yellow-Green' },
    { hex: '#32CD32', name: 'Lime Green' },
    { hex: '#228B22', name: 'Forest Green' },
    { hex: '#008080', name: 'Teal' },
    { hex: '#1E90FF', name: 'Blue' },
    { hex: '#4B0082', name: 'Indigo' },
    { hex: '#9400D3', name: 'Violet' },
    { hex: '#FF1493', name: 'Pink' },
    { hex: '#FFFFFF', name: 'White' },
    { hex: '#8B4513', name: 'Brown' },
  ];

  // Function to find closest rainbow color for filtering
  const getColorDistance = (color1, color2) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  };

  const isColorMatch = (plantColor, filterColor) => {
    if (!plantColor || !filterColor) return false;
    // Match if plant color is within a threshold distance of the filter color
    return getColorDistance(plantColor, filterColor) < 120;
  };

  // Handle plant placement on canvas (coordinates in inches internally)
  const handleCanvasClick = (e) => {
    // Don't place plants if in drawing mode
    if (isDrawingMode) return;
    if (!selectedPlant || isDragging) return;

    // DEMO MODE: Check plant limit
    if (demoMode.isDemoMode && !demoMode.canPlacePlant(placedPlants.length)) {
      setUpgradeContext('plantLimit');
      setShowUpgradePrompt(true);
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom * 4); // x in inches
    const y = (e.clientY - rect.top) / (zoom * 4); // y in inches

    // Validate placement within bed bounds (bedDimensions in feet, convert to inches)
    const widthInches = bedDimensions.width * 12;
    const heightInches = bedDimensions.height * 12;

    if (bedType === 'rectangle') {
      if (x < 0 || x > widthInches || y < 0 || y > heightInches) return;
    } else if (bedType === 'custom' && customBedPath.length > 0) {
      // Check if point is inside custom bed path
      if (!isPointInPath(x, y, customBedPath)) return;
    }

    const selectedSize = getSelectedSize(selectedPlant.id);
    const sizeMultiplier = getSizeMultiplier(selectedSize);

    const newPlant = {
      id: `placed-${Date.now()}`,
      plantId: selectedPlant.id,
      x,
      y,
      rotation: 0,
      scale: 1,
      size: selectedSize, // Store the selected container size
      sizeMultiplier: sizeMultiplier // Store the size multiplier for rendering
    };

    // Validate placement against residential rules (structure edges, canopy, small beds)
    if (designMode === 'residential' || designMode === 'hybrid') {
      const warnings = validatePlantPlacement(selectedPlant, x, y, widthInches, heightInches);
      if (warnings.length > 0) {
        setPlacementWarnings(prev => [...prev.slice(-4), ...warnings]); // Keep last 5 warnings
        // Auto-dismiss warnings after 8 seconds
        setTimeout(() => {
          setPlacementWarnings(prev => prev.filter(w => !warnings.includes(w)));
        }, 8000);
      }
    }

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

  // Handle drag move (coordinates in inches)
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !draggingPlantId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / (zoom * 4);
    const mouseY = (e.clientY - rect.top) / (zoom * 4);

    const widthInches = bedDimensions.width * 12;
    const heightInches = bedDimensions.height * 12;

    const newX = Math.max(5, Math.min(widthInches - 5, mouseX - dragOffset.x));
    const newY = Math.max(5, Math.min(heightInches - 5, mouseY - dragOffset.y));

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

  // Chaikin's smoothing algorithm - makes drawn paths smoother
  const smoothPath = (points, iterations = 3) => {
    if (points.length < 3) return points;

    let smoothed = [...points];
    for (let iter = 0; iter < iterations; iter++) {
      const newPoints = [];
      for (let i = 0; i < smoothed.length - 1; i++) {
        const p0 = smoothed[i];
        const p1 = smoothed[i + 1];
        newPoints.push({
          x: 0.75 * p0.x + 0.25 * p1.x,
          y: 0.75 * p0.y + 0.25 * p1.y
        });
        newPoints.push({
          x: 0.25 * p0.x + 0.75 * p1.x,
          y: 0.25 * p0.y + 0.75 * p1.y
        });
      }
      // Close the path
      if (smoothed.length > 2) {
        const p0 = smoothed[smoothed.length - 1];
        const p1 = smoothed[0];
        newPoints.push({
          x: 0.75 * p0.x + 0.25 * p1.x,
          y: 0.75 * p0.y + 0.25 * p1.y
        });
        newPoints.push({
          x: 0.25 * p0.x + 0.75 * p1.x,
          y: 0.25 * p0.y + 0.75 * p1.y
        });
      }
      smoothed = newPoints;
    }
    return smoothed;
  };

  // Simplify path by removing points that are too close together
  const simplifyPath = (points, minDistance = 5) => {
    if (points.length < 2) return points;
    const simplified = [points[0]];
    for (let i = 1; i < points.length; i++) {
      const last = simplified[simplified.length - 1];
      const dx = points[i].x - last.x;
      const dy = points[i].y - last.y;
      if (Math.sqrt(dx * dx + dy * dy) >= minDistance) {
        simplified.push(points[i]);
      }
    }
    return simplified;
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RESIDENTIAL PLACEMENT VALIDATION - Check plant placement against structure rules
  // ═══════════════════════════════════════════════════════════════════════════════
  const validatePlantPlacement = (plant, x, y, bedWidthInches, bedHeightInches) => {
    const warnings = [];

    // Get plant data
    const plantData = ALL_PLANTS.find(p => p.id === plant.id);
    if (!plantData) return warnings;

    // Parse plant dimensions
    const heightMatch = plantData.height?.match(/(\d+)/);
    let heightInches = heightMatch ? parseInt(heightMatch[1]) : 24;
    if (plantData.height?.toLowerCase().includes('ft')) heightInches *= 12;

    const spreadMatch = plantData.spread?.match(/(\d+)/);
    let spreadInches = spreadMatch ? parseInt(spreadMatch[1]) : 24;
    if (plantData.spread?.toLowerCase().includes('ft')) spreadInches *= 12;

    const canopyRadius = spreadInches / 2;
    const bedArea = (bedWidthInches * bedHeightInches) / 144; // sq ft

    // Define edge proximity thresholds
    const edgeBuffer = 24; // 2 feet from edge considered "near"
    const nearTop = y < edgeBuffer;
    const nearBottom = y > bedHeightInches - edgeBuffer;
    const nearLeft = x < edgeBuffer;
    const nearRight = x > bedWidthInches - edgeBuffer;

    // Check structure edge rules (back, entry = structure)
    const structureEdges = STRUCTURE_EDGE_RULES.STRUCTURE_EDGES;

    // Check each edge for structure proximity
    if (nearTop && structureEdges.includes(bedOrientation.top)) {
      // Plant is near a structure edge (top)
      if (STRUCTURE_EDGE_RULES.PROHIBITED_NEAR_STRUCTURE.includes(plant.id)) {
        warnings.push({
          type: 'error',
          message: `${plantData.name} is too large for placement against a structure. Consider columnar or dwarf varieties.`
        });
      } else if (heightInches > STRUCTURE_EDGE_RULES.MAX_HEIGHT_AGAINST_STRUCTURE) {
        warnings.push({
          type: 'warning',
          message: `${plantData.name} (${Math.round(heightInches/12)}ft) may be too tall near the house. Max recommended: 8ft.`
        });
      }
    }

    if (nearBottom && structureEdges.includes(bedOrientation.bottom)) {
      if (STRUCTURE_EDGE_RULES.PROHIBITED_NEAR_STRUCTURE.includes(plant.id)) {
        warnings.push({
          type: 'error',
          message: `${plantData.name} is too large for placement against a structure.`
        });
      } else if (heightInches > STRUCTURE_EDGE_RULES.MAX_HEIGHT_AGAINST_STRUCTURE) {
        warnings.push({
          type: 'warning',
          message: `${plantData.name} may be too tall near the structure.`
        });
      }
    }

    // Check canopy rules - trees can't overhang structure edges
    if (plantData.category === 'trees' || heightInches > 120) {
      const canopyResult = CANOPY_RULES.wouldCanopyHitStructure(
        x, y, spreadInches, bedWidthInches, bedHeightInches, bedOrientation
      );
      if (!canopyResult.valid) {
        canopyResult.issues.forEach(issue => {
          warnings.push({
            type: 'error',
            message: issue
          });
        });
      }
    }

    // Check small bed preferences
    if (bedArea < SMALL_BED_RULES.SMALL_BED_THRESHOLD) {
      const maxHeight = SMALL_BED_RULES.getMaxPlantHeight(bedArea);
      const maxSpread = SMALL_BED_RULES.getMaxPlantSpread(bedArea);

      if (heightInches > maxHeight) {
        warnings.push({
          type: 'warning',
          message: `This bed is small (${Math.round(bedArea)} sq ft). Consider dwarf varieties like ${plantData.name.includes('Dwarf') ? 'another compact plant' : 'a dwarf version'}.`
        });
      }
      if (spreadInches > maxSpread) {
        warnings.push({
          type: 'warning',
          message: `${plantData.name} may spread too wide for this small bed.`
        });
      }
    }

    return warnings;
  };

  // Handle bed drawing start
  const handleBedDrawStart = (e) => {
    if (!isDrawingMode) return;
    e.preventDefault();
    setIsDrawingBed(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom * 4);
    const y = (e.clientY - rect.top) / (zoom * 4);
    setDrawingPoints([{ x, y }]);
  };

  // Handle bed drawing move
  const handleBedDrawMove = useCallback((e) => {
    if (!isDrawingBed) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom * 4);
    const y = (e.clientY - rect.top) / (zoom * 4);
    setDrawingPoints(prev => [...prev, { x, y }]);
  }, [isDrawingBed, zoom]);

  // Handle bed drawing end
  const handleBedDrawEnd = useCallback(() => {
    if (!isDrawingBed) return;
    setIsDrawingBed(false);

    if (drawingPoints.length > 10) {
      // Simplify then smooth the path
      const simplified = simplifyPath(drawingPoints, 3);
      const smoothed = smoothPath(simplified, 3);
      setCustomBedPath(smoothed);
      setBedType('custom');
      setIsDrawingMode(false);
    }
    setDrawingPoints([]);
  }, [isDrawingBed, drawingPoints]);

  // Add mouse event listeners for bed drawing
  useEffect(() => {
    if (isDrawingBed) {
      window.addEventListener('mousemove', handleBedDrawMove);
      window.addEventListener('mouseup', handleBedDrawEnd);
      return () => {
        window.removeEventListener('mousemove', handleBedDrawMove);
        window.removeEventListener('mouseup', handleBedDrawEnd);
      };
    }
  }, [isDrawingBed, handleBedDrawMove, handleBedDrawEnd]);

  // Convert path points to SVG path string
  const pathToSvgString = (points) => {
    if (points.length < 2) return '';
    const scaleFactor = zoom * 4;
    let d = `M ${points[0].x * scaleFactor} ${points[0].y * scaleFactor}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x * scaleFactor} ${points[i].y * scaleFactor}`;
    }
    d += ' Z'; // Close the path
    return d;
  };

  // Check if a point is inside the custom bed path (ray casting algorithm)
  const isPointInPath = (x, y, path) => {
    if (path.length < 3) return true; // If no valid path, allow placement
    let inside = false;
    for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
      const xi = path[i].x, yi = path[i].y;
      const xj = path[j].x, yj = path[j].y;
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Reset to rectangle bed
  const resetToRectangleBed = () => {
    setBedType('rectangle');
    setCustomBedPath([]);
    setIsDrawingMode(false);
  };

  // Delete selected plant
  const deleteSelectedPlant = () => {
    if (selectedPlacedPlant) {
      setPlacedPlants(placedPlants.filter(p => p.id !== selectedPlacedPlant));
      setSelectedPlacedPlant(null);
    }
  };

  // Change size of a placed plant
  const changePlacedPlantSize = (plantId, newSize) => {
    const sizeMultiplier = getSizeMultiplier(newSize);
    setPlacedPlants(placedPlants.map(p =>
      p.id === plantId
        ? { ...p, size: newSize, sizeMultiplier: sizeMultiplier }
        : p
    ));
  };

  // Get available sizes for currently selected placed plant
  const getSelectedPlantSizes = () => {
    if (!selectedPlacedPlant) return [];
    const placed = placedPlants.find(p => p.id === selectedPlacedPlant);
    if (!placed) return [];
    const plantData = ALL_PLANTS.find(p => p.id === placed.plantId);
    return plantData?.sizes || ['3gal'];
  };

  // Get bounding box of custom bed path
  const getPathBounds = (path) => {
    if (!path || path.length === 0) return null;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    path.forEach(p => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY, centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2 };
  };

  // Calculate area of polygon using Shoelace formula (returns sq inches)
  const getPolygonArea = (path) => {
    if (!path || path.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < path.length; i++) {
      const j = (i + 1) % path.length;
      area += path[i].x * path[j].y;
      area -= path[j].x * path[i].y;
    }
    return Math.abs(area / 2);
  };

  // Get bed area in sq ft (custom path or rectangle)
  const getBedAreaSqFt = () => {
    if (bedType === 'custom' && customBedPath.length > 2) {
      const areaInSqInches = getPolygonArea(customBedPath);
      return (areaInSqInches / 144).toFixed(0); // Convert sq inches to sq ft
    }
    return bedDimensions.width * bedDimensions.height;
  };

  // Check if a position collides with existing plants
  // Parse spread string to get radius in inches (using max value)
  const getPlantSpreadRadius = (plantId) => {
    const plant = ALL_PLANTS.find(p => p.id === plantId);
    if (!plant || !plant.spread) return 12; // Default 12 inches radius

    const spreadStr = plant.spread.toLowerCase();
    const matches = spreadStr.match(/(\d+(?:\.\d+)?)/g);
    if (!matches) return 12;

    let maxSpread = Math.max(...matches.map(Number));
    // Convert feet to inches if needed
    if (spreadStr.includes('ft')) {
      maxSpread = maxSpread * 12;
    }
    return maxSpread / 2; // Return radius, not diameter
  };

  // Get plant height in inches
  const getPlantHeightInches = (plantId) => {
    const plant = ALL_PLANTS.find(p => p.id === plantId);
    if (!plant || !plant.height) return 24;

    const heightStr = plant.height.toLowerCase();
    const matches = heightStr.match(/(\d+(?:\.\d+)?)/g);
    if (!matches) return 24;

    let maxHeight = Math.max(...matches.map(Number));
    if (heightStr.includes('ft')) {
      maxHeight = maxHeight * 12;
    }
    return maxHeight;
  };

  // Check if plant is a canopy tree (>10ft tall)
  const isCanopyTree = (plantId) => {
    return getPlantHeightInches(plantId) > 120; // 10ft = 120 inches
  };

  // Get minimum spacing between two plants based on their roles/sizes
  // HEIGHT-BASED OVERLAP RULES:
  // - Small plants can fit UNDER tall trees (height diff > 6ft)
  // - Groundcover under trees, pixie loropetalum under dogwood, etc.
  const getMinSpacing = (plantId1, plantId2) => {
    const radius1 = getPlantSpreadRadius(plantId1);
    const radius2 = getPlantSpreadRadius(plantId2);
    const height1 = getPlantHeightInches(plantId1);
    const height2 = getPlantHeightInches(plantId2);

    // HEIGHT OVERLAP RULE: If height difference > 6ft (72 inches), allow overlap
    // Small plants can nestle under tall trees
    const heightDiff = Math.abs(height1 - height2);
    const tallerHeight = Math.max(height1, height2);
    const shorterHeight = Math.min(height1, height2);

    // Allow overlap when:
    // 1. Height difference is at least 72" (6ft) - clearly different layers
    // 2. The shorter plant is under 48" (4ft) - it's a small shrub/groundcover
    // 3. The taller plant is at least 96" (8ft) - it's a proper canopy tree
    if (heightDiff >= 72 && shorterHeight <= 48 && tallerHeight >= 96) {
      // Allow near-complete overlap - just keep them from being on exact same spot
      return 12; // Only 12 inch minimum - allows nesting under canopy
    }

    // Groundcover (under 18") can always go under anything taller than 60"
    if (shorterHeight <= 18 && tallerHeight >= 60) {
      return 6; // Minimal spacing for groundcovers under larger plants
    }

    // Base spacing is sum of radii
    let spacing = radius1 + radius2;

    // Trees need extra spacing from each other (at least 60% of combined spread)
    if (height1 > 72 && height2 > 72) {
      spacing = Math.max(spacing, (radius1 + radius2) * 1.2);
    }

    // Large trees (canopy) need even more space FROM EACH OTHER
    if (height1 > 120 && height2 > 120) {
      spacing = Math.max(spacing, Math.max(radius1, radius2) * 1.5);
    }

    return spacing + 6; // 6 inch buffer
  };

  const checkCollision = (x, y, plantId, existingPlants) => {
    for (const existing of existingPlants) {
      const minDistance = getMinSpacing(plantId, existing.plantId);
      const distance = Math.sqrt(Math.pow(x - existing.x, 2) + Math.pow(y - existing.y, 2));
      if (distance < minDistance) return true;
    }
    return false;
  };

  // Find valid position using spiral search - respects custom bed shape
  // canOverhang: true for canopy trees that can extend beyond bed edge
  const findValidPositionInBed = (targetX, targetY, plantId, existingPlants, bedBounds, customPath, canOverhang = false) => {
    const plantRadius = getPlantSpreadRadius(plantId);
    // Only canopy trees can overhang, others must stay inside with their full spread
    const padding = canOverhang ? 12 : plantRadius + 6;

    // Check if position is valid (inside bed and no collision)
    const isValidPosition = (x, y) => {
      // Check bounds
      if (x < bedBounds.minX + padding || x > bedBounds.maxX - padding ||
          y < bedBounds.minY + padding || y > bedBounds.maxY - padding) {
        return false;
      }
      // Check custom path if exists
      if (customPath && customPath.length > 2 && !isPointInPath(x, y, customPath)) {
        return false;
      }
      // Check collision
      return !checkCollision(x, y, plantId, existingPlants);
    };

    // Try original position first
    if (isValidPosition(targetX, targetY)) {
      return { x: targetX, y: targetY };
    }

    // Spiral outward to find valid position
    for (let attempt = 0; attempt < 150; attempt++) {
      const angle = attempt * 2.399963; // Golden angle
      const distance = Math.sqrt(attempt) * 8;

      const newX = targetX + Math.cos(angle) * distance;
      const newY = targetY + Math.sin(angle) * distance;

      if (isValidPosition(newX, newY)) {
        return { x: newX, y: newY };
      }
    }
    return null; // Could not find valid position
  };

  // Generate grid of valid points inside custom path for even distribution
  // BALANCED: 22px spacing for natural density, edge tracking for proper placement
  const generateValidGridPoints = (bedBounds, customPath, gridSpacing = 22) => {
    const validPoints = [];
    const padding = 8; // Small padding for edge access

    for (let x = bedBounds.minX + padding; x <= bedBounds.maxX - padding; x += gridSpacing) {
      for (let y = bedBounds.minY + padding; y <= bedBounds.maxY - padding; y += gridSpacing) {
        if (!customPath || customPath.length < 3 || isPointInPath(x, y, customPath)) {
          // Calculate distance from center for zone classification
          const distFromCenter = Math.sqrt(
            Math.pow(x - bedBounds.centerX, 2) +
            Math.pow(y - bedBounds.centerY, 2)
          );
          const maxDist = Math.max(bedBounds.width, bedBounds.height) / 2;
          const normalizedDist = distFromCenter / maxDist;

          // Calculate distance from nearest edge for edge planting
          const distFromEdgeX = Math.min(x - bedBounds.minX, bedBounds.maxX - x);
          const distFromEdgeY = Math.min(y - bedBounds.minY, bedBounds.maxY - y);
          const distFromEdge = Math.min(distFromEdgeX, distFromEdgeY);

          // Classify edge zones - only groundcover should go to very edge
          const isVeryEdge = distFromEdge < 20;  // Only groundcover here
          const isEdge = distFromEdge < 40;       // Small plants OK
          const isInnerEdge = distFromEdge < 80;  // Medium plants OK

          validPoints.push({ x, y, distFromCenter: normalizedDist, distFromEdge, isVeryEdge, isEdge, isInnerEdge });
        }
      }
    }

    return validPoints;
  };

  // Apply bed bundle with smart placement - Disney spacing standards
  const applyBundle = (bundle) => {
    // DEMO MODE: Bundles require Pro subscription
    if (demoMode.isDemoMode) {
      setUpgradeContext('bundles');
      setShowUpgradePrompt(true);
      return;
    }

    const newPlants = [];

    // Determine bed bounds
    let bedBounds;
    let useCustomPath = bedType === 'custom' && customBedPath.length > 2;

    if (useCustomPath) {
      bedBounds = getPathBounds(customBedPath);
    } else {
      const bedWidth = bedDimensions.width * 12;
      const bedHeight = bedDimensions.height * 12;
      bedBounds = {
        minX: 0, maxX: bedWidth,
        minY: 0, maxY: bedHeight,
        width: bedWidth, height: bedHeight,
        centerX: bedWidth / 2, centerY: bedHeight / 2
      };
    }

    if (!bedBounds) return;

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    // Handle both old flat array format and new object format
    const plantsList = Array.isArray(bundle.plants)
      ? bundle.plants
      : getBundlePlants(bundle);

    // Map role names
    const roleMapping = {
      'hero': 'focal',
      'structure': 'back',
      'seasonal': 'middle',
      'texture': 'middle',
      'carpet': 'groundcover'
    };

    // Calculate bed area for quantity scaling
    const bedArea = bedBounds.width * bedBounds.height;
    const baseArea = 150 * 144; // 150 sq ft in sq inches (bundle base size)
    const areaScale = Math.sqrt(bedArea / baseArea);

    // Process plants with quantity scaling for small plants
    const processedPlants = plantsList.map(bp => {
      const plantData = ALL_PLANTS.find(p => p.id === bp.plantId);
      if (!plantData) return null;

      const height = getPlantHeightInches(bp.plantId);
      const radius = getPlantSpreadRadius(bp.plantId);
      const role = roleMapping[bp.role] || bp.role;

      // Get plant size category
      const sizes = plantData.sizes || ['3gal'];
      const primarySize = sizes[0];
      const isSmallPlant = ['4in', 'flat', '1qt', '1gal'].includes(primarySize);
      const isMediumPlant = ['2gal', '3gal'].includes(primarySize);

      // Scale quantity based on plant size and bed area
      let quantity = Math.round(bp.quantity * bundleScale * areaScale);

      // Small plants (1gal or less) get significantly more quantity
      if (isSmallPlant) {
        quantity = Math.max(quantity * 2.5, 7); // At least 7, usually 2.5x more
      } else if (isMediumPlant) {
        quantity = Math.max(quantity * 1.5, 5); // At least 5
      }

      // Groundcover needs lots of plants
      if (role === 'groundcover' || role === 'front') {
        quantity = Math.max(quantity, Math.floor(bedArea / (radius * radius * 4)));
      }

      // Trees/focal limited by spacing
      if (role === 'focal' || height > 120) {
        const minTreeSpacing = radius * 2.5;
        const maxTrees = Math.floor(bedBounds.width / minTreeSpacing) * Math.floor(bedBounds.height / minTreeSpacing);
        quantity = Math.min(quantity, Math.max(1, maxTrees));
      }

      return {
        ...bp,
        plantData,
        role,
        height,
        radius,
        quantity,
        isSmallPlant,
        isCanopy: height > 120
      };
    }).filter(Boolean);

    // Sort: place large plants first, then fill with smaller ones
    processedPlants.sort((a, b) => {
      const order = ['focal', 'back', 'topiary', 'middle', 'front', 'edge', 'groundcover'];
      const orderDiff = order.indexOf(a.role) - order.indexOf(b.role);
      if (orderDiff !== 0) return orderDiff;
      return b.height - a.height; // Taller plants first within same role
    });

    // PHASE 1: Place focal/canopy trees with maximum spacing
    const focalPlants = processedPlants.filter(p => p.role === 'focal' || p.isCanopy);
    focalPlants.forEach(bundlePlant => {
      const minSpacing = bundlePlant.radius * 2.5; // Trees need 2.5x their radius apart

      for (let i = 0; i < bundlePlant.quantity; i++) {
        // Try to space trees evenly across interior
        let bestPos = null;
        let bestMinDist = 0;

        // Generate candidate positions in interior
        for (let attempt = 0; attempt < 50; attempt++) {
          // Keep trees away from edges (inset by their radius + buffer)
          const inset = bundlePlant.isCanopy ? 24 : bundlePlant.radius + 36;
          const x = bedBounds.minX + inset + Math.random() * (bedBounds.width - inset * 2);
          const y = bedBounds.minY + inset + Math.random() * (bedBounds.height - inset * 2);

          // Check if in custom path
          if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;

          // Check minimum distance from other trees
          const minDistToOthers = newPlants
            .filter(p => getPlantHeightInches(p.plantId) > 72)
            .reduce((min, p) => Math.min(min, Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2))), Infinity);

          if (minDistToOthers > minSpacing && minDistToOthers > bestMinDist) {
            if (!checkCollision(x, y, bundlePlant.plantId, newPlants)) {
              bestPos = { x, y };
              bestMinDist = minDistToOthers;
            }
          }
        }

        if (bestPos) {
          newPlants.push({
            id: `bundle-${Date.now()}-focal-${i}`,
            plantId: bundlePlant.plantId,
            x: bestPos.x,
            y: bestPos.y,
            rotation: (Math.random() - 0.5) * 5,
            scale: 0.95 + Math.random() * 0.1
          });
        }
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 2: Place structure/back plants in TIGHT CLUSTERS
    // Shrubs like loropetalum, hydrangea, camellias should be grouped, not spread
    // ═══════════════════════════════════════════════════════════════════════════════
    const structurePlants = processedPlants.filter(p => p.role === 'back' || p.role === 'topiary');
    structurePlants.forEach(bundlePlant => {
      // Find a cluster center position
      let clusterCenter = null;
      for (let attempt = 0; attempt < 50 && !clusterCenter; attempt++) {
        const inset = bundlePlant.radius * 2 + 24;
        const x = bedBounds.minX + inset + Math.random() * (bedBounds.width - inset * 2);
        const y = bedBounds.minY + inset + Math.random() * (bedBounds.height - inset * 2);

        if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;

        // Check distance from existing cluster centers (other plant types)
        const existingCenters = newPlants.filter(p => p.isClusterCenter);
        const minDist = existingCenters.reduce((min, p) =>
          Math.min(min, Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2))), Infinity);

        if (minDist > bundlePlant.radius * 3) {
          clusterCenter = { x, y };
        }
      }

      if (!clusterCenter) {
        clusterCenter = {
          x: bedBounds.centerX + (Math.random() - 0.5) * bedBounds.width * 0.5,
          y: bedBounds.centerY + (Math.random() - 0.5) * bedBounds.height * 0.5
        };
      }

      // Place all plants of this type in a cluster around center
      // Cluster spacing = 40% of spread (close but not overly jammed)
      const clusterSpacing = bundlePlant.radius * 0.8;

      for (let i = 0; i < bundlePlant.quantity; i++) {
        let placed = false;
        for (let attempt = 0; attempt < 40 && !placed; attempt++) {
          // Spiral outward from cluster center
          const angle = (i * 137.5 + attempt * 45) * Math.PI / 180; // Golden angle spiral
          const dist = clusterSpacing * (0.35 + Math.sqrt(i) * 0.55) + (attempt * clusterSpacing * 0.2);
          const x = clusterCenter.x + Math.cos(angle) * dist;
          const y = clusterCenter.y + Math.sin(angle) * dist;

          if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;
          if (x < bedBounds.minX + 6 || x > bedBounds.maxX - 6) continue;
          if (y < bedBounds.minY + 6 || y > bedBounds.maxY - 6) continue;

          // Check collision - with HEIGHT-BASED OVERLAP rules
          const tooClose = newPlants.some(p => {
            const d = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            const isSameType = p.plantId === bundlePlant.plantId;

            // Use height-based spacing for different plant types
            if (!isSameType) {
              const minDist = getMinSpacing(bundlePlant.plantId, p.plantId);
              return d < minDist;
            }

            // Same type: cluster tightly
            return d < clusterSpacing * 0.9;
          });

          if (!tooClose) {
            newPlants.push({
              id: `bundle-${Date.now()}-struct-${i}`,
              plantId: bundlePlant.plantId,
              x, y,
              rotation: (Math.random() - 0.5) * 10,
              scale: 0.95 + Math.random() * 0.1,
              isClusterCenter: i === 0
            });
            placed = true;
          }
        }
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 3: Place middle/seasonal plants in TIGHT CLUSTERS
    // Perennial shrubs should also cluster - hydrangeas together, azaleas together
    // ═══════════════════════════════════════════════════════════════════════════════
    const middlePlants = processedPlants.filter(p => p.role === 'middle');
    middlePlants.forEach(bundlePlant => {
      // Find cluster center - try to place between focal plants and edges
      let clusterCenter = null;
      for (let attempt = 0; attempt < 50 && !clusterCenter; attempt++) {
        const inset = bundlePlant.radius + 18;
        const x = bedBounds.minX + inset + Math.random() * (bedBounds.width - inset * 2);
        const y = bedBounds.minY + inset + Math.random() * (bedBounds.height - inset * 2);

        if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;

        // Keep away from other cluster centers
        const existingCenters = newPlants.filter(p => p.isClusterCenter);
        const minDist = existingCenters.reduce((min, p) =>
          Math.min(min, Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2))), Infinity);

        if (minDist > bundlePlant.radius * 2.5) {
          clusterCenter = { x, y };
        }
      }

      if (!clusterCenter) {
        clusterCenter = {
          x: bedBounds.centerX + (Math.random() - 0.5) * bedBounds.width * 0.6,
          y: bedBounds.centerY + (Math.random() - 0.5) * bedBounds.height * 0.6
        };
      }

      // Cluster for mid-size plants - slightly looser than structure
      const clusterSpacing = bundlePlant.radius * 0.7;

      for (let i = 0; i < bundlePlant.quantity; i++) {
        let placed = false;
        for (let attempt = 0; attempt < 40 && !placed; attempt++) {
          const angle = (i * 137.5 + attempt * 30) * Math.PI / 180;
          const dist = clusterSpacing * (0.25 + Math.sqrt(i) * 0.45) + (attempt * clusterSpacing * 0.15);
          const x = clusterCenter.x + Math.cos(angle) * dist;
          const y = clusterCenter.y + Math.sin(angle) * dist;

          if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;
          if (x < bedBounds.minX + 4 || x > bedBounds.maxX - 4) continue;
          if (y < bedBounds.minY + 4 || y > bedBounds.maxY - 4) continue;

          // Check collision - with HEIGHT-BASED OVERLAP rules
          const tooClose = newPlants.some(p => {
            const d = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            const isSameType = p.plantId === bundlePlant.plantId;

            // Use height-based spacing for different plant types
            if (!isSameType) {
              const minDist = getMinSpacing(bundlePlant.plantId, p.plantId);
              return d < minDist;
            }

            // Same type: cluster tightly
            return d < clusterSpacing * 0.8;
          });

          if (!tooClose) {
            newPlants.push({
              id: `bundle-${Date.now()}-mid-${i}`,
              plantId: bundlePlant.plantId,
              x, y,
              rotation: (Math.random() - 0.5) * 15,
              scale: 0.9 + Math.random() * 0.15,
              isClusterCenter: i === 0
            });
            placed = true;
          }
        }
      }
    });

    // PHASE 4: Place front/edge plants - prioritize edges
    const frontPlants = processedPlants.filter(p => p.role === 'front' || p.role === 'edge');
    frontPlants.forEach(bundlePlant => {
      for (let i = 0; i < bundlePlant.quantity; i++) {
        let placed = false;
        for (let attempt = 0; attempt < 40 && !placed; attempt++) {
          // Bias toward edges
          const edgeBias = Math.random() < 0.7;
          let x, y;

          if (edgeBias) {
            // Place near an edge
            const edge = Math.floor(Math.random() * 4);
            const inset = bundlePlant.radius + 6;
            switch (edge) {
              case 0: x = bedBounds.minX + inset + Math.random() * 30; y = bedBounds.minY + inset + Math.random() * (bedBounds.height - inset * 2); break;
              case 1: x = bedBounds.maxX - inset - Math.random() * 30; y = bedBounds.minY + inset + Math.random() * (bedBounds.height - inset * 2); break;
              case 2: x = bedBounds.minX + inset + Math.random() * (bedBounds.width - inset * 2); y = bedBounds.minY + inset + Math.random() * 30; break;
              case 3: x = bedBounds.minX + inset + Math.random() * (bedBounds.width - inset * 2); y = bedBounds.maxY - inset - Math.random() * 30; break;
            }
          } else {
            const inset = bundlePlant.radius + 8;
            x = bedBounds.minX + inset + Math.random() * (bedBounds.width - inset * 2);
            y = bedBounds.minY + inset + Math.random() * (bedBounds.height - inset * 2);
          }

          if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;

          const pos = findValidPositionInBed(x, y, bundlePlant.plantId, newPlants, bedBounds, useCustomPath ? customBedPath : null, false);
          if (pos) {
            newPlants.push({
              id: `bundle-${Date.now()}-front-${i}`,
              plantId: bundlePlant.plantId,
              x: pos.x,
              y: pos.y,
              rotation: (Math.random() - 0.5) * 20,
              scale: 0.85 + Math.random() * 0.2
            });
            placed = true;
          }
        }
      }
    });

    // PHASE 5: ORGANIC GROUNDCOVER - Flowing streams & drifts (not grid!)
    const groundcoverPlants = processedPlants.filter(p => p.role === 'groundcover');

    // Helper: Create organic bezier curve points
    const createFlowingPath = (startX, startY, endX, endY, waviness = 30) => {
      const points = [];
      const segments = 8 + Math.floor(Math.random() * 4);
      const dx = (endX - startX) / segments;
      const dy = (endY - startY) / segments;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Add organic waviness perpendicular to path direction
        const perpX = -dy * 0.3;
        const perpY = dx * 0.3;
        const wave = Math.sin(t * Math.PI * (2 + Math.random())) * waviness * (1 - Math.abs(t - 0.5) * 1.5);

        points.push({
          x: startX + dx * i + perpX * wave / Math.abs(perpX || 1),
          y: startY + dy * i + perpY * wave / Math.abs(perpY || 1)
        });
      }
      return points;
    };

    // Helper: Create drift around a focal point (like water around a rock)
    const createDriftAroundPlant = (centerX, centerY, innerRadius, outerRadius, arcStart, arcEnd) => {
      const points = [];
      const arcLength = arcEnd - arcStart;
      const numPoints = Math.floor(arcLength / 0.3);

      for (let i = 0; i < numPoints; i++) {
        const angle = arcStart + (arcLength * i / numPoints);
        // Vary the radius organically
        const radiusVariation = innerRadius + (outerRadius - innerRadius) * (0.3 + Math.random() * 0.7);
        const wobble = (Math.random() - 0.5) * 10;

        points.push({
          x: centerX + Math.cos(angle) * (radiusVariation + wobble),
          y: centerY + Math.sin(angle) * (radiusVariation + wobble)
        });
      }
      return points;
    };

    groundcoverPlants.forEach(bundlePlant => {
      const spacing = bundlePlant.radius * 2.2;
      let placedCount = 0;
      const targetQuantity = bundlePlant.quantity;
      const allFlowPoints = [];

      // PATTERN 1: Flowing streams along front edge (like a river border)
      const frontY = bedBounds.maxY - 25;
      const streamWidth = 40;
      for (let stream = 0; stream < 2; stream++) {
        const streamY = frontY - stream * spacing * 1.5;
        const pathPoints = createFlowingPath(
          bedBounds.minX + 20,
          streamY + (Math.random() - 0.5) * 15,
          bedBounds.maxX - 20,
          streamY + (Math.random() - 0.5) * 15,
          25
        );
        allFlowPoints.push(...pathPoints);
      }

      // PATTERN 2: Drifts wrapping around focal/large plants
      const focalPlants = newPlants.filter(p => {
        const plantData = ALL_PLANTS.find(pl => pl.id === p.plantId);
        return plantData && (plantData.category === 'focal' || plantData.category === 'back');
      });

      focalPlants.slice(0, 5).forEach(focal => {
        const plantData = ALL_PLANTS.find(pl => pl.id === focal.plantId);
        if (!plantData) return;

        const plantRadius = (plantData.spread || 36) / 2;
        // Create partial arc drift around plant (not full circle - more natural)
        const arcStart = Math.random() * Math.PI;
        const arcLength = Math.PI * (0.5 + Math.random() * 0.8);

        const driftPoints = createDriftAroundPlant(
          focal.x,
          focal.y,
          plantRadius + 15,
          plantRadius + 35,
          arcStart,
          arcStart + arcLength
        );
        allFlowPoints.push(...driftPoints);
      });

      // PATTERN 3: Organic veins through middle areas (like marble veins)
      const midY = (bedBounds.minY + bedBounds.maxY) / 2;
      const veinCount = Math.floor((bedBounds.maxX - bedBounds.minX) / 150);

      for (let v = 0; v < veinCount; v++) {
        const startX = bedBounds.minX + 50 + (v * 150) + (Math.random() - 0.5) * 40;
        const veinPoints = createFlowingPath(
          startX,
          bedBounds.maxY - 40,
          startX + (Math.random() - 0.5) * 80,
          midY + (Math.random() - 0.5) * 40,
          35
        );
        allFlowPoints.push(...veinPoints);
      }

      // PATTERN 4: Side edge flows (organic, not straight lines)
      const leftFlow = createFlowingPath(
        bedBounds.minX + 15,
        bedBounds.maxY - 30,
        bedBounds.minX + 20,
        bedBounds.minY + 50,
        20
      );
      const rightFlow = createFlowingPath(
        bedBounds.maxX - 15,
        bedBounds.maxY - 30,
        bedBounds.maxX - 20,
        bedBounds.minY + 50,
        20
      );
      allFlowPoints.push(...leftFlow, ...rightFlow);

      // Shuffle and place along flow points
      shuffle(allFlowPoints);

      for (const point of allFlowPoints) {
        if (placedCount >= targetQuantity) break;

        if (useCustomPath && !isPointInPath(point.x, point.y, customBedPath)) continue;
        if (point.x < bedBounds.minX + 5 || point.x > bedBounds.maxX - 5) continue;
        if (point.y < bedBounds.minY + 5 || point.y > bedBounds.maxY - 5) continue;

        // Check spacing from other plants (allow closer to non-groundcover)
        const tooClose = newPlants.some(p => {
          const dist = Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2));
          const otherPlant = ALL_PLANTS.find(pl => pl.id === p.plantId);
          const isOtherGroundcover = otherPlant?.category === 'groundcover' || otherPlant?.category === 'front';
          return dist < (isOtherGroundcover ? spacing * 0.7 : spacing * 0.4);
        });

        if (!tooClose) {
          newPlants.push({
            id: `bundle-${Date.now()}-gc-${placedCount}`,
            plantId: bundlePlant.plantId,
            x: point.x + (Math.random() - 0.5) * 8,
            y: point.y + (Math.random() - 0.5) * 8,
            rotation: (Math.random() - 0.5) * 40,
            scale: 0.75 + Math.random() * 0.3
          });
          placedCount++;
        }
      }
    });

    // PHASE 6: Minimal gap-fill - only fill very obvious holes, maintain organic feel
    const primaryGroundcover = groundcoverPlants[0];
    if (primaryGroundcover) {
      const gcSpacing = primaryGroundcover.radius * 3; // Larger spacing = less gap-fill

      // Only fill major gaps in front half of bed
      for (let x = bedBounds.minX + 40; x < bedBounds.maxX - 40; x += gcSpacing) {
        const y = bedBounds.maxY - 30 - Math.random() * 20; // Focus on front

        if (useCustomPath && !isPointInPath(x, y, customBedPath)) continue;

        const nearestDist = newPlants.reduce((min, p) => {
          return Math.min(min, Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)));
        }, Infinity);

        // Only fill really big gaps
        if (nearestDist > gcSpacing * 2) {
          newPlants.push({
            id: `bundle-${Date.now()}-fill-${x}`,
            plantId: primaryGroundcover.plantId,
            x: x + (Math.random() - 0.5) * 15,
            y: y + (Math.random() - 0.5) * 15,
            rotation: (Math.random() - 0.5) * 40,
            scale: 0.7 + Math.random() * 0.25
          });
        }
      }
    }

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
    // DEMO MODE: Export requires Pro subscription
    if (demoMode.isDemoMode) {
      setUpgradeContext('export');
      setShowUpgradePrompt(true);
      return;
    }

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

  // Parse spread value to inches (e.g., "6-8in" -> 7, "3-4ft" -> 42, "15-20ft" -> 210)
  const parseSpreadToInches = (spread) => {
    if (!spread) return 12;

    // Handle "spreading" or other non-numeric values
    if (spread.toLowerCase() === 'spreading') return 18;

    // Extract numbers and unit
    const match = spread.match(/(\d+)[-–]?(\d+)?\s*(in|ft)?/i);
    if (!match) return 12;

    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min;
    const avg = (min + max) / 2;
    const unit = (match[3] || 'in').toLowerCase();

    // Convert to inches
    return unit === 'ft' ? avg * 12 : avg;
  };

  // Get plant sizes for rendering - returns icon size and mature spread in inches
  const getPlantSizesWithMultiplier = (plantId, sizeMultiplier) => {
    const plant = ALL_PLANTS.find(p => p.id === plantId);
    if (!plant) return { iconSize: 20, matureSpread: 12 };

    const matureSpread = parseSpreadToInches(plant.spread);

    // Apply size multiplier from container size
    const spreadMultiplier = sizeMultiplier?.spreadMult || 0.5;
    const iconMultiplier = sizeMultiplier?.iconScale || 0.5;

    // Adjusted spread based on container size (smaller container = less mature)
    const adjustedSpread = matureSpread * spreadMultiplier;

    // Icon size is a fraction of adjusted spread for visual clarity
    const iconSize = Math.max(8, Math.min(60, adjustedSpread * 0.4 * (1 + iconMultiplier)));

    return { iconSize, matureSpread: adjustedSpread };
  };

  // Legacy function for backward compatibility
  const getPlantSizesLegacy = (plantId) => {
    const plant = ALL_PLANTS.find(p => p.id === plantId);
    if (!plant) return { iconSize: 20, matureSpread: 12 };

    const matureSpread = parseSpreadToInches(plant.spread);

    // Icon size is a fraction of mature spread for visual clarity
    // but with min/max bounds for usability
    const iconSize = Math.max(12, Math.min(50, matureSpread * 0.4));

    return { iconSize, matureSpread };
  };

  // Legacy function for backward compatibility
  const getPlantSize = (plantId) => {
    return getPlantSizes(plantId).iconSize;
  };

  // Export canvas as a simplified sketch image for ControlNet
  const exportCanvasAsSketch = () => {
    const canvas = document.createElement('canvas');
    const scale = 4; // Scale factor for detail
    const width = bedDimensions.width * 12 * scale; // Convert feet to inches, then scale
    const height = bedDimensions.height * 12 * scale;

    canvas.width = 512; // ControlNet works best with 512x512
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    const scaleX = 512 / width;
    const scaleY = 512 / height;
    const uniformScale = Math.min(scaleX, scaleY);

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 512);

    // Center the drawing
    const offsetX = (512 - width * uniformScale) / 2;
    const offsetY = (512 - height * uniformScale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(uniformScale, uniformScale);

    // Draw bed shape (brown/tan fill with black outline)
    ctx.fillStyle = '#8B7355'; // Brown mulch color
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 / uniformScale;

    if (bedType === 'custom' && customBedPath.length > 2) {
      // Draw custom bed path
      ctx.beginPath();
      ctx.moveTo(customBedPath[0].x * scale, customBedPath[0].y * scale);
      customBedPath.forEach((point, i) => {
        if (i > 0) ctx.lineTo(point.x * scale, point.y * scale);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Draw rectangle bed
      ctx.fillRect(0, 0, width, height);
      ctx.strokeRect(0, 0, width, height);
    }

    // Draw plants as circles with realistic colors based on bloom/foliage
    placedPlants.forEach(plant => {
      const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
      if (!plantData) return;

      const spreadMatch = plantData.spread.match(/(\d+)/);
      const spread = spreadMatch ? parseInt(spreadMatch[1]) : 12;
      const radius = (spread / 2) * scale;

      // Get realistic color based on bloom color or foliage
      let fillColor = '#4CAF50'; // Default green

      // Map bloom colors to actual colors
      const colorMap = {
        'white': '#F5F5F5',
        'pink': '#F8BBD9',
        'red': '#EF5350',
        'purple': '#9C27B0',
        'lavender': '#B39DDB',
        'blue': '#64B5F6',
        'yellow': '#FFEE58',
        'orange': '#FFB74D',
        'coral': '#FF8A65',
        'green': '#66BB6A',
        'chartreuse': '#C0CA33',
        'burgundy': '#7B1FA2',
        'magenta': '#E91E63',
      };

      // Use bloom color if available
      if (plantData.bloomColor) {
        const bloomLower = plantData.bloomColor.toLowerCase();
        for (const [colorName, hexColor] of Object.entries(colorMap)) {
          if (bloomLower.includes(colorName)) {
            fillColor = hexColor;
            break;
          }
        }
      }

      // Trees and large shrubs should be darker green
      if (plantData.category === 'focal' || plantData.category === 'back') {
        const heightMatch = plantData.height?.match(/(\d+)/);
        const height = heightMatch ? parseInt(heightMatch[1]) : 24;
        if (height > 60) { // Trees over 5ft
          fillColor = '#2E7D32'; // Dark green for tree canopy
        }
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 2 / uniformScale;

      ctx.beginPath();
      ctx.arc(plant.x * scale, plant.y * scale, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();

    // Return as base64 data URL
    return canvas.toDataURL('image/png');
  };

  // Generate AI vision image
  const generateVisionImage = async (season) => {
    // DEMO MODE: Vision rendering requires Pro subscription
    if (demoMode.isDemoMode) {
      setUpgradeContext('vision');
      setShowUpgradePrompt(true);
      return;
    }

    if (placedPlants.length === 0) {
      setGenerateError('Please add some plants to your design first.');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setSelectedSeason(season);

    try {
      // Get bed dimensions
      const bedWidthInches = bedDimensions.width * 12;
      const bedHeightInches = bedDimensions.height * 12;
      const bedSizeFt = `${bedDimensions.width}ft x ${bedDimensions.height}ft`;

      // Analyze spatial positions of each plant
      const getPosition = (x, y) => {
        const xPercent = x / bedWidthInches;
        const yPercent = y / bedHeightInches;

        // Horizontal position
        let hPos = 'center';
        if (xPercent < 0.33) hPos = 'left';
        else if (xPercent > 0.67) hPos = 'right';

        // Vertical/depth position (y=0 is back, y=max is front)
        let vPos = 'middle';
        if (yPercent < 0.33) vPos = 'back';
        else if (yPercent > 0.67) vPos = 'front';

        return { hPos, vPos, xPercent, yPercent };
      };

      // Group plants by spatial zones with clustering detection
      const spatialGroups = {
        'back-left': [],
        'back-center': [],
        'back-right': [],
        'middle-left': [],
        'middle-center': [],
        'middle-right': [],
        'front-left': [],
        'front-center': [],
        'front-right': []
      };

      // Also track plant counts for summary
      const plantCounts = {};

      placedPlants.forEach(p => {
        const plantData = ALL_PLANTS.find(pl => pl.id === p.plantId);
        if (!plantData) return;

        const pos = getPosition(p.x, p.y);
        const zoneKey = `${pos.vPos}-${pos.hPos}`;

        // Count total plants
        if (!plantCounts[plantData.name]) {
          plantCounts[plantData.name] = { count: 0, color: plantData.bloomColor || 'green foliage', height: plantData.height };
        }
        plantCounts[plantData.name].count++;

        // Add to spatial group
        if (!spatialGroups[zoneKey]) spatialGroups[zoneKey] = [];

        // Check if this plant type already exists in zone (for clustering description)
        const existing = spatialGroups[zoneKey].find(g => g.name === plantData.name);
        if (existing) {
          existing.count++;
        } else {
          spatialGroups[zoneKey].push({
            name: plantData.name,
            count: 1,
            height: plantData.height,
            color: plantData.bloomColor || 'green foliage',
            category: plantData.category
          });
        }
      });

      // Describe bed shape
      let bedShapeDescription = 'rectangular';
      if (bedType === 'custom' && customBedPath.length > 2) {
        const bounds = getPathBounds(customBedPath);
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;
        const aspectRatio = width / height;

        if (customBedPath.length <= 6) {
          bedShapeDescription = 'organic curved kidney-bean shaped';
        } else if (customBedPath.length <= 12) {
          bedShapeDescription = 'organic free-form curved';
        } else {
          bedShapeDescription = 'natural organic curved with flowing edges';
        }

        if (aspectRatio > 2) bedShapeDescription += ', elongated horizontal';
        else if (aspectRatio < 0.5) bedShapeDescription += ', elongated vertical';
      }

      // Build spatial layout description
      let promptParts = [];
      promptParts.push(`GARDEN BED: ${bedShapeDescription} mulch bed, ${bedSizeFt}, ${placedPlants.length} plants total`);
      promptParts.push('');
      promptParts.push('PRECISE PLANT LAYOUT (viewer looking at bed from front):');

      // Describe each zone that has plants
      const zoneDescriptions = {
        'back-left': 'BACK LEFT CORNER',
        'back-center': 'BACK CENTER (against house/fence)',
        'back-right': 'BACK RIGHT CORNER',
        'middle-left': 'MIDDLE LEFT SIDE',
        'middle-center': 'CENTER OF BED',
        'middle-right': 'MIDDLE RIGHT SIDE',
        'front-left': 'FRONT LEFT (near viewer)',
        'front-center': 'FRONT CENTER EDGE',
        'front-right': 'FRONT RIGHT (near viewer)'
      };

      Object.entries(spatialGroups).forEach(([zone, plants]) => {
        if (plants.length === 0) return;

        const zoneName = zoneDescriptions[zone];
        const plantDescriptions = plants.map(p => {
          if (p.count > 1) {
            return `cluster of ${p.count} ${p.name} (${p.color})`;
          }
          return `1 ${p.name} (${p.height}, ${p.color})`;
        });

        promptParts.push(`${zoneName}: ${plantDescriptions.join(', ')}`);
      });

      promptParts.push('');
      promptParts.push('PLANT SUMMARY:');
      Object.entries(plantCounts).forEach(([name, info]) => {
        promptParts.push(`- ${info.count}x ${name} (${info.height}, ${info.color})`);
      });

      const prompt = promptParts.join('\n');

      // Export canvas as sketch for ControlNet
      const sketchImage = exportCanvasAsSketch();

      console.log('Generating image with prompt:', prompt);
      console.log('Sketch image generated for ControlNet');

      let imageUrl;

      // Try Netlify function first (production), fall back to direct API call (dev)
      try {
        const response = await fetch('/.netlify/functions/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, season, sketchImage }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate image');
        }
        imageUrl = data.imageUrl;
      } catch (netlifyError) {
        console.log('Netlify function not available, trying direct API call...');

        // Check for API token in localStorage (dev mode fallback)
        const apiToken = localStorage.getItem('REPLICATE_API_TOKEN');
        if (!apiToken) {
          throw new Error('Vision Preview requires setup. Enter your Replicate API token in browser console: localStorage.setItem("REPLICATE_API_TOKEN", "your_token_here") - Get a free token at replicate.com/account/api-tokens');
        }

        // Call Replicate SDXL img2img API directly with sketch
        const replicateResponse = await fetch('https://api.replicate.com/v1/models/stability-ai/sdxl/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            input: {
              image: sketchImage,
              prompt: prompt + ", professional landscape photography, realistic plants and foliage, natural lighting, photorealistic",
              negative_prompt: "cartoon, anime, illustration, drawing, sketch, abstract, blurry",
              prompt_strength: 0.75,  // Keep 25% structure from sketch
              num_outputs: 1,
              guidance_scale: 7.5,
              num_inference_steps: 30,
            }
          }),
        });

        if (!replicateResponse.ok) {
          const errorData = await replicateResponse.json();
          throw new Error(errorData.detail || 'Replicate API error');
        }

        const prediction = await replicateResponse.json();

        // Poll for result
        let result = prediction;
        while (result.status !== 'succeeded' && result.status !== 'failed') {
          await new Promise(r => setTimeout(r, 1000));
          const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
          });
          result = await pollResponse.json();
        }

        if (result.status === 'failed') {
          throw new Error(result.error || 'Image generation failed');
        }

        imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      }

      const plantList = Object.entries(plantDetails)
        .map(([name, info]) => `${info.count} ${name}`)
        .join(', ');

      setGeneratedImage({
        url: imageUrl,
        season: season,
        description: `${season.charAt(0).toUpperCase() + season.slice(1)} garden with ${plantList}`,
        plantCount: placedPlants.length,
        coverage: coveragePercent.toFixed(1),
        revisedPrompt: prompt.substring(0, 200) + '...'
      });
    } catch (error) {
      console.error('Vision generation error:', error);
      setGenerateError(error.message || 'Failed to generate vision. Please try again.');
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
      {/* Demo Mode Indicator */}
      {demoMode.isDemoMode && (
        <DemoModeIndicator
          plantsPlaced={placedPlants.length}
          maxPlants={demoMode.maxPlants}
          onUpgrade={() => {
            setUpgradeContext('default');
            setShowUpgradePrompt(true);
          }}
        />
      )}

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
                    Imagine Design
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

              {/* Hardiness Zone Selector */}
              <div className="px-4 py-2 border-b border-sage-100 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sage-500" />
                <span className="text-xs font-medium text-sage-600">Zone:</span>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(Number(e.target.value))}
                  className="flex-1 bg-cream-50 border border-sage-200 rounded-lg px-2 py-1 text-sm text-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
                >
                  {HARDINESS_ZONES.map(z => (
                    <option key={z.zone} value={z.zone}>
                      Zone {z.zone} ({z.minTemp})
                    </option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="px-4 py-2 border-b border-sage-100">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 text-xs font-medium text-sage-600 hover:text-sage-800 transition-colors"
                >
                  <Settings className="w-3 h-3" />
                  <span>Advanced Filters</span>
                  {showAdvancedFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {(sunFilter !== 'all' || waterFilter !== 'all' || colorFilter !== 'all') && (
                    <span className="ml-1 px-1.5 py-0.5 bg-sage-500 text-white rounded-full text-[10px]">
                      {[sunFilter !== 'all', waterFilter !== 'all', colorFilter !== 'all'].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {showAdvancedFilters && (
                  <div className="mt-3 space-y-3">
                    {/* Sun Filter */}
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <select
                        value={sunFilter}
                        onChange={(e) => setSunFilter(e.target.value)}
                        className="flex-1 bg-cream-50 border border-sage-200 rounded-lg px-2 py-1 text-xs text-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
                      >
                        <option value="all">Any Sun</option>
                        <option value="Full Sun">Full Sun</option>
                        <option value="Part">Part Shade</option>
                        <option value="Shade">Shade</option>
                      </select>
                    </div>

                    {/* Water Filter */}
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      <select
                        value={waterFilter}
                        onChange={(e) => setWaterFilter(e.target.value)}
                        className="flex-1 bg-cream-50 border border-sage-200 rounded-lg px-2 py-1 text-xs text-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
                      >
                        <option value="all">Any Water</option>
                        <option value="Low">Low Water</option>
                        <option value="Moderate">Moderate Water</option>
                        <option value="High">High Water</option>
                      </select>
                    </div>

                    {/* Color Filter */}
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-pink-500" />
                      <div className="flex-1 flex flex-wrap gap-1">
                        <button
                          onClick={() => setColorFilter('all')}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                            colorFilter === 'all'
                              ? 'bg-sage-500 text-white'
                              : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                          }`}
                        >
                          All
                        </button>
                        {RAINBOW_COLORS.map(({ hex, name }) => (
                          <button
                            key={hex}
                            onClick={() => setColorFilter(colorFilter === hex ? 'all' : hex)}
                            className={`w-6 h-6 rounded border-2 transition-all ${
                              colorFilter === hex
                                ? 'border-sage-600 ring-2 ring-sage-500/50 scale-110'
                                : 'border-sage-200 hover:border-sage-400'
                            }`}
                            style={{
                              backgroundColor: hex,
                              boxShadow: hex === '#FFFFFF' ? 'inset 0 0 0 1px #e5e7eb' : 'none'
                            }}
                            title={name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {(sunFilter !== 'all' || waterFilter !== 'all' || colorFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSunFilter('all');
                          setWaterFilter('all');
                          setColorFilter('all');
                        }}
                        className="w-full text-xs text-sage-500 hover:text-sage-700 py-1"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="px-4 py-3 border-b border-sage-100 flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'trees', label: 'Trees' },
                  { key: 'shrubs', label: 'Shrubs' },
                  { key: 'perennials', label: 'Perennials' },
                  { key: 'grasses', label: 'Grasses' },
                  { key: 'groundcovers', label: 'Ground Cover' }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      categoryFilter === cat.key
                        ? 'bg-sage-500 text-white'
                        : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Plant List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredPlants.map(plant => {
                  const hasSizes = plant.sizes && plant.sizes.length > 1;
                  const selectedSize = getSelectedSize(plant.id);
                  const sizeMultiplier = getSizeMultiplier(selectedSize);

                  return (
                    <div
                      key={plant.id}
                      className={`w-full text-left rounded-xl transition-all ${
                        selectedPlant?.id === plant.id
                          ? 'bg-sage-100 border-2 border-sage-500 ring-2 ring-sage-500/20'
                          : 'bg-cream-50 border border-sage-100 hover:bg-sage-50 hover:border-sage-200'
                      }`}
                    >
                      {/* Main plant button */}
                      <button
                        onClick={() => setSelectedPlant(plant)}
                        className="w-full text-left p-3"
                      >
                        <div className="flex items-center gap-3">
                          {/* Plant icon - size scales with selected container size */}
                          <div
                            className="rounded-lg flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: plant.color + '30',
                              width: `${24 + (sizeMultiplier?.iconScale || 0.5) * 24}px`,
                              height: `${24 + (sizeMultiplier?.iconScale || 0.5) * 24}px`,
                              fontSize: `${12 + (sizeMultiplier?.iconScale || 0.5) * 12}px`
                            }}
                          >
                            {plant.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sage-900 truncate">{plant.name}</div>
                            <div className="text-xs text-sage-500 truncate">
                              {plant.height} {hasSizes && `• ${selectedSize}`}
                              {plant.zones && ` • Z${Math.min(...plant.zones)}-${Math.max(...plant.zones)}`}
                            </div>
                            {/* Form, Texture & Bloom badges */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {plant.form && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-forest-100 text-forest-700 rounded capitalize">
                                  {PLANT_FORMS[plant.form.toUpperCase()]?.icon || '●'} {plant.form}
                                </span>
                              )}
                              {plant.texture && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-olive-100 text-olive-700 rounded capitalize">
                                  {plant.texture}
                                </span>
                              )}
                              {plant.bloomMonths && plant.bloomMonths.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded">
                                  {MONTHS.find(m => m.id === plant.bloomMonths[0])?.abbr}-
                                  {MONTHS.find(m => m.id === plant.bloomMonths[plant.bloomMonths.length - 1])?.abbr}
                                </span>
                              )}
                              {plant.isEvergreen && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-sage-100 text-sage-700 rounded">
                                  Evergreen
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasSizes && (
                              <span className="text-xs bg-sage-200 text-sage-700 px-1.5 py-0.5 rounded-full">
                                {plant.sizes.length} sizes
                              </span>
                            )}
                            <div
                              className="w-3 h-3 rounded-full ring-2 ring-sage-200"
                              style={{ backgroundColor: plant.color }}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Size selector - shows for plants with multiple sizes */}
                      {hasSizes && (
                        <div
                          className="px-3 pb-3 pt-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1 bg-sage-50 rounded-lg p-1">
                            {plant.sizes.map((size, idx) => (
                              <button
                                key={size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSizeChange(plant.id, size);
                                }}
                                className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
                                  selectedSize === size
                                    ? 'bg-sage-500 text-white font-medium shadow-sm'
                                    : 'text-sage-600 hover:bg-sage-200'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected Plant Info - Collapsible */}
              {selectedPlant && (
                <div className="border-t border-sage-200 bg-sage-50">
                  {/* Header - Always visible, clickable to toggle */}
                  <button
                    onClick={() => setShowPlantInfo(!showPlantInfo)}
                    className="w-full flex items-center justify-between p-3 hover:bg-sage-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedPlant.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-sage-800 text-sm">{selectedPlant.name}</div>
                        <div className="text-xs text-sage-500">{selectedPlant.category}</div>
                      </div>
                    </div>
                    {showPlantInfo ? (
                      <ChevronDown className="w-4 h-4 text-sage-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-sage-400" />
                    )}
                  </button>

                  {/* Collapsible Content */}
                  {showPlantInfo && (
                    <div className="px-4 pb-4 max-h-[35vh] overflow-y-auto">
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
            </div>
          )}

          {activeTab === 'bundles' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Bundle Type Toggle */}
              <div className="flex gap-1 bg-sage-100 p-1 rounded-lg">
                <button
                  onClick={() => setBundleTypeFilter('disney')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    (bundleTypeFilter || 'disney') === 'disney'
                      ? 'bg-white text-sage-800 shadow-sm'
                      : 'text-sage-600 hover:text-sage-800'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  Disney Themes
                </button>
                <button
                  onClick={() => setBundleTypeFilter('residential')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    bundleTypeFilter === 'residential'
                      ? 'bg-white text-sage-800 shadow-sm'
                      : 'text-sage-600 hover:text-sage-800'
                  }`}
                >
                  <Home className="w-3 h-3" />
                  Home Landscape
                </button>
              </div>

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

              {/* Bundle Cards - Disney Bundles */}
              {(bundleTypeFilter || 'disney') === 'disney' && BED_BUNDLES.map(bundle => {
                // Handle both old flat array format and new object format
                const plantsList = Array.isArray(bundle.plants)
                  ? bundle.plants
                  : getBundlePlants(bundle);
                const totalPlants = plantsList.reduce((sum, p) => sum + Math.round((p.quantity || 1) * bundleScale), 0);
                const hasInvasiveWarnings = bundle.invasiveWarnings && bundle.invasiveWarnings.length > 0;

                return (
                  <div
                    key={bundle.id}
                    className="bg-white rounded-xl overflow-hidden border border-sage-200 hover:border-sage-300 hover:shadow-md transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{bundle.preview}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-sage-900">{bundle.name}</h3>
                          {bundle.subtitle && (
                            <p className="text-xs text-sage-600">{bundle.subtitle}</p>
                          )}
                          <p className="text-xs text-sage-400">{bundle.theme}</p>
                        </div>
                      </div>
                      <p className="text-sm text-sage-600 mb-3 line-clamp-2">{bundle.description}</p>

                      {/* Color Scheme Preview */}
                      <div className="flex items-center gap-2 mb-2">
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

                      {/* Package Info */}
                      <div className="flex items-center gap-3 text-xs text-sage-500 mb-2">
                        <span>{totalPlants} plants at {bundleScale}x</span>
                        {bundle.baseSize && <span>• {bundle.baseSize}</span>}
                        {bundle.defaultZone && <span>• Zone {bundle.defaultZone}</span>}
                      </div>

                      {/* Filters/Conditions */}
                      {bundle.filters && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {bundle.filters.light && (
                            <span className="text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">
                              {bundle.filters.light}
                            </span>
                          )}
                          {bundle.filters.moisture && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                              {bundle.filters.moisture}
                            </span>
                          )}
                          {bundle.filters.maintenance && (
                            <span className="text-[10px] bg-sage-50 text-sage-700 px-1.5 py-0.5 rounded">
                              {bundle.filters.maintenance}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Invasive Warning */}
                      {hasInvasiveWarnings && (
                        <div className="text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded mb-2 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>Contains flagged plants - review before install</span>
                        </div>
                      )}

                      <button
                        onClick={() => applyBundle(bundle)}
                        className="w-full bg-sage-500 hover:bg-sage-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Apply Bundle
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Bundle Cards - Residential Bundles */}
              {bundleTypeFilter === 'residential' && RESIDENTIAL_BUNDLES.map(bundle => {
                const plantsList = getBundlePlants(bundle);
                const totalPlants = plantsList.reduce((sum, p) => sum + Math.round((p.quantity || 1) * bundleScale), 0);
                const zoneInfo = YARD_ZONES[bundle.yardZone];

                return (
                  <div
                    key={bundle.id}
                    className="bg-white rounded-xl overflow-hidden border border-olive-200 hover:border-olive-300 hover:shadow-md transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{bundle.preview}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-sage-900">{bundle.name}</h3>
                          {bundle.subtitle && (
                            <p className="text-xs text-sage-600">{bundle.subtitle}</p>
                          )}
                          <p className="text-xs text-olive-600">{bundle.theme}</p>
                        </div>
                        <span className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full">
                          Home
                        </span>
                      </div>
                      <p className="text-sm text-sage-600 mb-3 line-clamp-2">{bundle.description}</p>

                      {/* Yard Zone Badge */}
                      {zoneInfo && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-sage-500">Best for:</span>
                          <span className="text-xs bg-olive-50 text-olive-700 px-2 py-0.5 rounded">
                            {zoneInfo.name}
                          </span>
                        </div>
                      )}

                      {/* Color Scheme Preview */}
                      <div className="flex items-center gap-2 mb-2">
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

                      {/* Package Info */}
                      <div className="flex items-center gap-3 text-xs text-sage-500 mb-2">
                        <span>{totalPlants} plants at {bundleScale}x</span>
                        {bundle.baseSize && <span>• {bundle.baseSize}</span>}
                        {bundle.defaultZone && <span>• Zone {bundle.defaultZone}</span>}
                      </div>

                      {/* Filters/Conditions */}
                      {bundle.filters && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {bundle.filters.light && (
                            <span className="text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">
                              {bundle.filters.light}
                            </span>
                          )}
                          {bundle.filters.moisture && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                              {bundle.filters.moisture}
                            </span>
                          )}
                          {bundle.filters.maintenance && (
                            <span className="text-[10px] bg-sage-50 text-sage-700 px-1.5 py-0.5 rounded">
                              {bundle.filters.maintenance}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Finish Notes */}
                      {bundle.finishNotes && (
                        <div className="text-[10px] bg-cream-50 text-sage-600 px-2 py-1 rounded mb-2 italic">
                          💡 {bundle.finishNotes}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          applyBundle(bundle);
                          // Auto-set yard zone when applying residential bundle
                          if (bundle.yardZone) {
                            setSelectedYardZone(bundle.yardZone);
                          }
                        }}
                        className="w-full bg-olive-500 hover:bg-olive-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Home className="w-4 h-4" />
                        Apply Bundle
                      </button>
                    </div>
                  </div>
                );
              })}
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
                onClick={() => setZoom(Math.max(0.05, zoom - (zoom > 0.25 ? 0.25 : 0.05)))}
                className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-sage-600 w-16 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + (zoom < 0.25 ? 0.05 : 0.25)))}
                className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-sage-200 mx-2" />
              {/* Bed Shape Tools */}
              <button
                onClick={() => {
                  setIsDrawingMode(!isDrawingMode);
                  setSelectedPlant(null);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isDrawingMode ? 'bg-forest-500 text-white' : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                }`}
                title="Draw Custom Bed Shape"
              >
                <PenTool className="w-4 h-4" />
              </button>
              {bedType === 'custom' && (
                <button
                  onClick={resetToRectangleBed}
                  className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
                  title="Reset to Rectangle Bed"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
              {/* Bed Orientation Selector */}
              <div className="relative">
                <button
                  onClick={() => setSelectedEdge(selectedEdge ? null : 'menu')}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-sm ${
                    selectedEdge
                      ? 'bg-gradient-to-r from-olive-500 to-forest-500 text-white shadow-md'
                      : 'bg-white text-sage-700 hover:bg-sage-50 border border-sage-200 shadow-sm'
                  }`}
                  title="Set Bed Orientation"
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Bed Sides</span>
                </button>
                {selectedEdge === 'menu' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-sage-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sage-50 to-olive-50 px-4 py-3 border-b border-sage-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sage-800">Bed Orientation</h4>
                        <button
                          onClick={() => setShowBedLabels(!showBedLabels)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                            showBedLabels
                              ? 'bg-olive-500 text-white shadow-sm'
                              : 'bg-white text-sage-600 border border-sage-200'
                          }`}
                        >
                          {showBedLabels ? '👁️ Visible' : '👁️ Hidden'}
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Visual Bed Diagram */}
                      <div className="relative w-48 h-32 mx-auto mb-4 bg-gradient-to-b from-wood-100 to-wood-200 rounded-lg border-2 border-wood-300">
                        {/* Top Edge Button */}
                        <button
                          onClick={() => {
                            const opts = BED_EDGE_OPTIONS.map(o => o.id);
                            const current = opts.indexOf(bedOrientation.top);
                            const next = opts[(current + 1) % opts.length];
                            setBedOrientation(prev => ({ ...prev, top: next }));
                          }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center gap-1"
                          style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.top)?.color }}
                          title="Click to change"
                        >
                          <span>{BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.top)?.icon}</span>
                          <span>{bedOrientation.top === 'front' ? 'FRONT' : bedOrientation.top.toUpperCase()}</span>
                        </button>
                        {/* Bottom Edge Button */}
                        <button
                          onClick={() => {
                            const opts = BED_EDGE_OPTIONS.map(o => o.id);
                            const current = opts.indexOf(bedOrientation.bottom);
                            const next = opts[(current + 1) % opts.length];
                            setBedOrientation(prev => ({ ...prev, bottom: next }));
                          }}
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center gap-1"
                          style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.bottom)?.color }}
                          title="Click to change"
                        >
                          <span>{BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.bottom)?.icon}</span>
                          <span>{bedOrientation.bottom === 'front' ? 'FRONT' : bedOrientation.bottom.toUpperCase()}</span>
                        </button>
                        {/* Left Edge Button */}
                        <button
                          onClick={() => {
                            const opts = BED_EDGE_OPTIONS.map(o => o.id);
                            const current = opts.indexOf(bedOrientation.left);
                            const next = opts[(current + 1) % opts.length];
                            setBedOrientation(prev => ({ ...prev, left: next }));
                          }}
                          className="absolute -left-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.left)?.color }}
                          title="Click to change"
                        >
                          <span>{BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.left)?.icon}</span>
                        </button>
                        {/* Right Edge Button */}
                        <button
                          onClick={() => {
                            const opts = BED_EDGE_OPTIONS.map(o => o.id);
                            const current = opts.indexOf(bedOrientation.right);
                            const next = opts[(current + 1) % opts.length];
                            setBedOrientation(prev => ({ ...prev, right: next }));
                          }}
                          className="absolute -right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.right)?.color }}
                          title="Click to change"
                        >
                          <span>{BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.right)?.icon}</span>
                        </button>
                        {/* Center Label */}
                        <div className="absolute inset-0 flex items-center justify-center text-wood-600 text-xs">
                          Click edges to change
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => {
                            setBedOrientation(prev => ({
                              ...prev,
                              top: prev.bottom,
                              bottom: prev.top
                            }));
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                          <FlipHorizontal className="w-4 h-4 rotate-90" />
                          Swap Front/Back
                        </button>
                        <button
                          onClick={() => {
                            setBedOrientation(prev => ({
                              ...prev,
                              left: prev.right,
                              right: prev.left
                            }));
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                          <FlipHorizontal className="w-4 h-4" />
                          Swap Left/Right
                        </button>
                      </div>

                      {/* Make Viewable Buttons */}
                      <div className="mb-4">
                        <div className="text-xs text-sage-500 mb-2 font-medium">Quick Set Viewable (Front)</div>
                        <div className="grid grid-cols-4 gap-2">
                          {['top', 'bottom', 'left', 'right'].map(edge => (
                            <button
                              key={edge}
                              onClick={() => setBedOrientation(prev => ({ ...prev, [edge]: 'front' }))}
                              className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                                bedOrientation[edge] === 'front'
                                  ? 'bg-green-500 text-white shadow-md'
                                  : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                              }`}
                            >
                              {edge.charAt(0).toUpperCase() + edge.slice(1)}
                              {bedOrientation[edge] === 'front' && ' 👁️'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="border-t border-sage-200 pt-3">
                        <div className="text-xs text-sage-500 mb-2 font-medium">Quick Presets</div>
                        <div className="grid grid-cols-3 gap-2">
                          {BED_ORIENTATION_PRESETS.slice(0, 6).map(preset => (
                            <button
                              key={preset.id}
                              onClick={() => setBedOrientation(preset.orientation)}
                              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-sage-50 transition-all hover:shadow-md border border-transparent hover:border-sage-200"
                            >
                              <span className="text-2xl">{preset.icon}</span>
                              <span className="text-[10px] text-sage-600 font-medium text-center leading-tight">{preset.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-sage-50 border-t border-sage-200">
                      <button
                        onClick={() => setSelectedEdge(null)}
                        className="w-full py-2.5 bg-gradient-to-r from-sage-600 to-olive-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowBedLabels(!showBedLabels)}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 font-medium text-sm ${
                  showBedLabels
                    ? 'bg-gradient-to-r from-olive-500 to-forest-500 text-white shadow-md'
                    : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-200 shadow-sm'
                }`}
                title={showBedLabels ? 'Hide Edge Labels' : 'Show Edge Labels'}
              >
                <Eye className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-sage-200 mx-2" />
              <button
                onClick={clearCanvas}
                className="p-2 rounded-lg bg-sage-100 text-red-500 hover:bg-red-50 transition-colors"
                title="Clear Canvas"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {selectedPlacedPlant && (() => {
                const availableSizes = getSelectedPlantSizes();
                const placedPlant = placedPlants.find(p => p.id === selectedPlacedPlant);
                const currentSize = placedPlant?.size || availableSizes[0];
                const plantData = ALL_PLANTS.find(p => p.id === placedPlant?.plantId);

                return (
                  <div className="flex items-center gap-2">
                    {/* Size selector for placed plant */}
                    {availableSizes.length > 1 && (
                      <div className="flex items-center gap-1 bg-sage-50 rounded-lg p-1">
                        <span className="text-xs text-sage-500 px-1">Size:</span>
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => changePlacedPlantSize(selectedPlacedPlant, size)}
                            className={`px-2 py-1 text-xs rounded-md transition-all ${
                              currentSize === size
                                ? 'bg-sage-500 text-white font-medium shadow-sm'
                                : 'text-sage-600 hover:bg-sage-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="w-px h-6 bg-sage-200 mx-1" />
                    <button
                      onClick={deleteSelectedPlant}
                      className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                      title="Delete Selected"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center gap-4">
              {/* Bed Shape Indicator */}
              {bedType === 'custom' && (
                <span className="text-xs text-forest-600 bg-forest-50 px-2 py-1 rounded-full">
                  Custom Bed
                </span>
              )}
              {isDrawingMode && (
                <span className="text-xs text-white bg-forest-500 px-2 py-1 rounded-full animate-pulse">
                  Drawing Mode - Click & Drag
                </span>
              )}
              {/* Canvas Dimensions */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sage-500">Canvas:</span>
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
                <span className="text-sage-500">ft</span>
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
            {/* Placement Warnings - Residential Rules Violations */}
            {placementWarnings.length > 0 && (
              <div className="max-w-2xl mx-auto mb-4 space-y-2">
                {placementWarnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-3 rounded-lg text-sm shadow-md animate-pulse ${
                      warning.type === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {warning.type === 'error' ? '🚫' : '⚠️'}
                    </span>
                    <span>{warning.message}</span>
                    <button
                      onClick={() => setPlacementWarnings(prev => prev.filter((_, i) => i !== idx))}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="relative mx-auto bg-gradient-to-b from-wood-200 to-wood-300 rounded-lg overflow-hidden shadow-xl border border-wood-400"
              style={{
                width: bedDimensions.width * 12 * zoom * 4, // feet * 12 = inches * zoom * 4 pixels
                height: bedDimensions.height * 12 * zoom * 4,
                cursor: isDrawingMode ? 'crosshair' : selectedPlant ? 'crosshair' : 'default'
              }}
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleBedDrawStart}
            >
              {/* Grid Overlay - 1 foot squares */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundSize: `${12 * zoom * 4}px ${12 * zoom * 4}px`, // 1 foot = 12 inches
                    backgroundImage: 'linear-gradient(to right, rgba(103, 124, 86, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(103, 124, 86, 0.5) 1px, transparent 1px)'
                  }}
                />
              )}

              {/* Ruler Marks - in feet */}
              {showRuler && (
                <>
                  {/* Top Ruler */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-sage-800/90 flex">
                    {Array.from({ length: bedDimensions.width + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-xs text-white transform -translate-x-1/2"
                        style={{ left: i * 12 * zoom * 4 }}
                      >
                        <div className="h-2 w-px bg-sage-300 mx-auto" />
                        {i}ft
                      </div>
                    ))}
                  </div>
                  {/* Left Ruler */}
                  <div className="absolute top-6 left-0 bottom-0 w-6 bg-sage-800/90">
                    {Array.from({ length: bedDimensions.height + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-xs text-white transform -translate-y-1/2 flex items-center"
                        style={{ top: i * 12 * zoom * 4 }}
                      >
                        <span className="w-4 text-right pr-1">{i}ft</span>
                        <div className="w-2 h-px bg-sage-300" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Bed Edge Indicator - Rectangle or Custom */}
              {bedType === 'rectangle' ? (
                <div className="absolute inset-2 border-2 border-dashed border-sage-500/30 rounded pointer-events-none" />
              ) : customBedPath.length > 0 && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width={bedDimensions.width * 12 * zoom * 4}
                  height={bedDimensions.height * 12 * zoom * 4}
                >
                  {/* Custom bed fill */}
                  <path
                    d={pathToSvgString(customBedPath)}
                    fill="rgba(103, 124, 86, 0.15)"
                    stroke="rgba(103, 124, 86, 0.6)"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                  />
                </svg>
              )}

              {/* Drawing Preview */}
              {isDrawingBed && drawingPoints.length > 1 && (
                <svg
                  className="absolute inset-0 pointer-events-none z-30"
                  width={bedDimensions.width * 12 * zoom * 4}
                  height={bedDimensions.height * 12 * zoom * 4}
                >
                  <path
                    d={pathToSvgString(drawingPoints)}
                    fill="rgba(85, 120, 82, 0.2)"
                    stroke="rgba(85, 120, 82, 0.8)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {/* Bed Edge Labels - Visual orientation indicators */}
              {showBedLabels && bedType === 'rectangle' && (
                <>
                  {/* Top Edge Label */}
                  {(() => {
                    const opt = BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.top);
                    return opt && (
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg pointer-events-none"
                        style={{ backgroundColor: opt.color }}
                      >
                        <span>{opt.icon}</span>
                        <span className="hidden sm:inline">{opt.label.split(' ')[0]}</span>
                      </div>
                    );
                  })()}
                  {/* Bottom Edge Label */}
                  {(() => {
                    const opt = BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.bottom);
                    return opt && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg pointer-events-none"
                        style={{ backgroundColor: opt.color }}
                      >
                        <span>{opt.icon}</span>
                        <span className="hidden sm:inline">{opt.label.split(' ')[0]}</span>
                      </div>
                    );
                  })()}
                  {/* Left Edge Label */}
                  {(() => {
                    const opt = BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.left);
                    return opt && (
                      <div
                        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg pointer-events-none"
                        style={{ backgroundColor: opt.color, writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                      >
                        <span style={{ writingMode: 'horizontal-tb' }}>{opt.icon}</span>
                      </div>
                    );
                  })()}
                  {/* Right Edge Label */}
                  {(() => {
                    const opt = BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.right);
                    return opt && (
                      <div
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg pointer-events-none"
                        style={{ backgroundColor: opt.color, writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                      >
                        <span style={{ writingMode: 'horizontal-tb' }}>{opt.icon}</span>
                      </div>
                    );
                  })()}
                  {/* Edge Color Bars */}
                  <div
                    className="absolute top-0 left-4 right-4 h-1 rounded-full pointer-events-none"
                    style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.top)?.color || '#9E9E9E' }}
                  />
                  <div
                    className="absolute bottom-0 left-4 right-4 h-1 rounded-full pointer-events-none"
                    style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.bottom)?.color || '#9E9E9E' }}
                  />
                  <div
                    className="absolute left-0 top-4 bottom-4 w-1 rounded-full pointer-events-none"
                    style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.left)?.color || '#9E9E9E' }}
                  />
                  <div
                    className="absolute right-0 top-4 bottom-4 w-1 rounded-full pointer-events-none"
                    style={{ backgroundColor: BED_EDGE_OPTIONS.find(o => o.id === bedOrientation.right)?.color || '#9E9E9E' }}
                  />
                </>
              )}

              {/* Placed Plants */}
              {placedPlants.map(plant => {
                const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
                // Use stored size multiplier if available, otherwise fall back to default
                const { iconSize, matureSpread } = plant.sizeMultiplier
                  ? getPlantSizesWithMultiplier(plant.plantId, plant.sizeMultiplier)
                  : getPlantSizesLegacy(plant.plantId);
                const isSelected = selectedPlacedPlant === plant.id;
                const isBeingDragged = draggingPlantId === plant.id;

                // Scale factor: 1 inch = 4 pixels at zoom 1
                const scaleFactor = zoom * 4;
                const iconPixels = iconSize * scaleFactor * 0.5; // Icon is smaller than spread
                const maturePixels = matureSpread * scaleFactor;

                return (
                  <div
                    key={plant.id}
                    className={`absolute transition-all pointer-events-none ${
                      isSelected ? 'z-10' : ''
                    }`}
                    style={{
                      left: plant.x * scaleFactor - maturePixels / 2,
                      top: plant.y * scaleFactor - maturePixels / 2,
                      width: maturePixels,
                      height: maturePixels,
                      transform: `rotate(${plant.rotation}deg) scale(${plant.scale})`,
                    }}
                  >
                    {/* Mature spread dotted circle */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `2px dashed ${plantData?.color || '#4CAF50'}60`,
                      }}
                    />

                    {/* Plant icon (centered, smaller than mature spread) - ONLY this is draggable */}
                    <div
                      className={`absolute rounded-full flex items-center justify-center shadow-lg pointer-events-auto ${
                        isBeingDragged ? 'cursor-grabbing' : 'cursor-grab'
                      } hover:brightness-110 transition-all`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: iconPixels,
                        height: iconPixels,
                        backgroundColor: plantData?.color || '#4CAF50',
                        boxShadow: `0 4px 12px ${plantData?.color}40`
                      }}
                      onClick={(e) => handlePlantClick(e, plant)}
                      onMouseDown={(e) => handleDragStart(e, plant)}
                    >
                      <span style={{ fontSize: iconPixels * 0.5 }}>{plantData?.icon}</span>
                    </div>

                    {/* Selection ring - now shows size info */}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-full ring-4 ring-sage-500 ring-opacity-50" />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sage-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                          {plantData?.name} {plant.size && `(${plant.size})`} - {Math.round(matureSpread)}" spread
                        </div>
                      </>
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

        {/* Right Sidebar - Quality Rules & Stats */}
        <aside className="w-72 border-l border-sage-200 bg-white h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Quality Score */}
            <div className="bg-gradient-to-br from-sage-50 to-forest-50 rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-olive-500" />
                <h3 className="font-bold text-sage-800">Quality Score</h3>
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
                Professional Standard: 95%+ living coverage
              </div>
            </div>

            {/* Design Mode Toggle - Home Plant Trainer */}
            <div className="bg-gradient-to-br from-olive-50 to-sage-50 rounded-xl p-4 border border-sage-200">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-olive-600" />
                <h3 className="font-bold text-sage-800">Design Mode</h3>
              </div>
              <div className="flex gap-1 mb-3">
                {[
                  { id: 'disney', label: 'Disney', icon: Crown },
                  { id: 'residential', label: 'Home', icon: Home },
                  { id: 'hybrid', label: 'Both', icon: Star },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setDesignMode(mode.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      designMode === mode.id
                        ? 'bg-olive-600 text-white shadow-sm'
                        : 'bg-white text-sage-600 hover:bg-sage-100 border border-sage-200'
                    }`}
                  >
                    <mode.icon className="w-3 h-3" />
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Yard Zone Selector - Residential Context */}
              {(designMode === 'residential' || designMode === 'hybrid') && (
                <div>
                  <label className="text-xs font-medium text-sage-600 block mb-1">Yard Zone</label>
                  <select
                    value={selectedYardZone}
                    onChange={(e) => setSelectedYardZone(e.target.value)}
                    className="w-full p-2 text-xs border border-sage-200 rounded-lg bg-white text-sage-800 focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
                  >
                    {Object.entries(YARD_ZONES).map(([key, zone]) => (
                      <option key={key} value={key}>{zone.name}</option>
                    ))}
                  </select>
                  {YARD_ZONES[selectedYardZone] && (
                    <div className="mt-2 p-2 bg-white rounded-lg border border-sage-100">
                      <div className="text-xs text-sage-600">{YARD_ZONES[selectedYardZone].description}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {YARD_ZONES[selectedYardZone].goals?.map((goal, i) => (
                          <span key={i} className="text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                  <span className="text-sage-600">Canvas Size</span>
                  <span className="text-sage-900 font-medium">{bedDimensions.width} x {bedDimensions.height} ft ({bedDimensions.width * bedDimensions.height} sq ft)</span>
                </div>
                {bedType === 'custom' && customBedPath.length > 2 && (
                  <div className="flex justify-between">
                    <span className="text-sage-600">Bed Area</span>
                    <span className="text-sage-900 font-medium">{getBedAreaSqFt()} sq ft</span>
                  </div>
                )}
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

            {/* Show Ready Score - Disney Quality Check */}
            {showReadyScore && (designMode === 'disney' || designMode === 'hybrid') && (
              <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
                <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Show Ready Score
                </h3>

                {/* Overall Score */}
                <div className="text-center mb-4">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold"
                    style={{ backgroundColor: showReadyScore.ratingColor }}
                  >
                    {showReadyScore.totalScore}
                  </div>
                  <div
                    className="mt-2 font-semibold"
                    style={{ color: showReadyScore.ratingColor }}
                  >
                    {showReadyScore.rating}
                  </div>
                </div>

                {/* Individual Scores */}
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Coverage', score: showReadyScore.scores.coverage, weight: 20 },
                    { label: 'Bloom Sequence', score: showReadyScore.scores.bloomSequence, weight: 20 },
                    { label: 'Height Layers', score: showReadyScore.scores.heightLayering, weight: 15 },
                    { label: 'Form Variety', score: showReadyScore.scores.formVariety, weight: 15 },
                    { label: 'Texture Mix', score: showReadyScore.scores.textureVariety, weight: 10 },
                    { label: 'Mass Planting', score: showReadyScore.scores.massPlanting, weight: 10 },
                    { label: 'Color Harmony', score: showReadyScore.scores.colorHarmony, weight: 10 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">{item.label}</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.score >= 80 ? '#4CAF50' : item.score >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(item.score)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Residential Score - Home Plant Trainer */}
            {residentialScore && (designMode === 'residential' || designMode === 'hybrid') && (
              <div className="bg-gradient-to-br from-olive-50 to-cream-50 rounded-xl p-4 border border-olive-200">
                <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-olive-600" />
                  Home Landscape Score
                </h3>

                {/* Overall Score */}
                <div className="text-center mb-4">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold"
                    style={{ backgroundColor: residentialScore.ratingColor }}
                  >
                    {residentialScore.totalScore}
                  </div>
                  <div
                    className="mt-2 font-semibold"
                    style={{ color: residentialScore.ratingColor }}
                  >
                    {residentialScore.rating}
                  </div>
                </div>

                {/* Individual Scores */}
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Layering', score: residentialScore.scores.layering, weight: 20 },
                    { label: 'Spacing', score: residentialScore.scores.spacing, weight: 20 },
                    { label: 'Odd Groups', score: residentialScore.scores.oddGroupings, weight: 15 },
                    { label: 'Zone Fit', score: residentialScore.scores.zoneCompliance, weight: 15 },
                    { label: '4-Season', score: residentialScore.scores.fourSeason, weight: 15 },
                    { label: 'Curb Appeal', score: residentialScore.scores.curbAppeal, weight: 15 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-20 text-sage-600">{item.label}</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.score >= 80 ? '#4CAF50' : item.score >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(item.score)}</div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                {residentialScore.recommendations && residentialScore.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-olive-200">
                    <div className="text-xs font-medium text-sage-700 mb-2">Tips:</div>
                    <ul className="space-y-1">
                      {residentialScore.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="text-xs text-sage-600 flex items-start gap-1">
                          <span className="text-olive-500 mt-0.5">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Bloom Calendar */}
            {bloomAnalysis && (
              <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
                <button
                  onClick={() => setShowBloomCalendar(!showBloomCalendar)}
                  className="w-full flex items-center justify-between font-bold text-sage-800 mb-2"
                >
                  <span className="flex items-center gap-2">
                    <Flower2 className="w-4 h-4" />
                    Bloom Calendar
                  </span>
                  {showBloomCalendar ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Seasonal Summary - Always Visible */}
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {Object.entries(SEASONS).map(([key, season]) => {
                    const coverage = bloomAnalysis.seasonalCoverage[season.id];
                    const percent = coverage ? Math.round(coverage.interestCoverage * 100) : 0;
                    return (
                      <div
                        key={key}
                        className="text-center p-1 rounded text-xs"
                        style={{
                          backgroundColor: `${season.color}40`,
                          borderLeft: `3px solid ${season.color}`
                        }}
                      >
                        <div className="font-medium text-sage-700">{season.name.slice(0, 2)}</div>
                        <div className={percent >= 100 ? 'text-sage-700 font-bold' : 'text-sage-500'}>
                          {percent}%
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Month-by-Month Calendar */}
                {showBloomCalendar && (
                  <div className="mt-3 space-y-1">
                    {MONTHS.map(month => {
                      const blooms = bloomAnalysis.monthlyBloom[month.id] || [];
                      const interest = bloomAnalysis.monthlyInterest[month.id] || [];
                      const hasBloom = blooms.length > 0;
                      const hasInterest = interest.length > 0;

                      return (
                        <div key={month.id} className="flex items-center gap-2 text-xs">
                          <div className="w-8 text-sage-600 font-medium">{month.abbr}</div>
                          <div className="flex-1 flex gap-1">
                            {hasBloom ? (
                              blooms.slice(0, 5).map((b, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full ring-1 ring-white"
                                  style={{ backgroundColor: b.color }}
                                  title={b.plant.name}
                                />
                              ))
                            ) : hasInterest ? (
                              <div className="flex items-center gap-1 text-sage-500">
                                <Leaf className="w-3 h-3" />
                                <span>Foliage</span>
                              </div>
                            ) : (
                              <div className="text-red-400 italic">Gap</div>
                            )}
                          </div>
                          {!hasBloom && !hasInterest && (
                            <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center">
                              <X className="w-3 h-3 text-red-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Recommendations */}
                    {bloomAnalysis.recommendations.length > 0 && (
                      <div className="mt-3 p-2 bg-olive-50 rounded-lg text-xs">
                        <div className="font-medium text-olive-700 mb-1">Suggestions:</div>
                        {bloomAnalysis.recommendations.slice(0, 2).map((rec, i) => (
                          <div key={i} className="text-olive-600">• {rec}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Height Tiers */}
            {heightAnalysis && (
              <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
                <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Height Layers
                </h3>
                <div className="space-y-1">
                  {Object.values(HEIGHT_TIERS).reverse().map(tier => {
                    const count = heightAnalysis.tierCounts[tier.id]?.count || 0;
                    const isActive = count > 0;
                    return (
                      <div key={tier.id} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: isActive ? tier.color : '#E0E0E0' }}
                        />
                        <div className={`flex-1 ${isActive ? 'text-sage-700' : 'text-sage-400'}`}>
                          {tier.name}
                        </div>
                        <div className={`font-medium ${isActive ? 'text-sage-800' : 'text-sage-300'}`}>
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {heightAnalysis.issues.length > 0 && (
                  <div className="mt-2 p-2 bg-olive-50 rounded text-xs text-olive-600">
                    {heightAnalysis.issues[0]}
                  </div>
                )}
              </div>
            )}

            {/* Mass Planting Analysis */}
            {massPlantingAnalysis && massPlantingAnalysis.issues.length > 0 && (
              <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
                <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Mass Planting
                </h3>
                <div className="space-y-1 text-xs">
                  {massPlantingAnalysis.issues.slice(0, 3).map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-olive-600">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-auto border border-sage-200 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-sage-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-sage-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-forest-500" />
                Vision Preview
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
                    <p className="text-sage-500">Creating your professional garden render</p>
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
                      rendering showing the completed professional garden at peak bloom.
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        context={upgradeContext}
      />
    </div>
  );
}
