import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Trees, Shrub, Leaf, LayoutGrid, ZoomIn, ZoomOut,
  RotateCcw, Download, Upload, Eye, Palette, Ruler, Check,
  X, ChevronRight, ChevronDown, ChevronUp, Search, Package, Sparkles,
  Layers, Settings, Info, Move, Trash2, Copy, FlipHorizontal,
  Sun, CloudRain, Thermometer, Star, Crown, CircleDot, Home,
  PenTool, Square, User, LogOut, Lock, Undo2, Redo2, GripVertical,
  RefreshCw, ArrowRightLeft
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

// USDA Hardiness Zones - Full annual temperature range (winter low to summer high)
const HARDINESS_ZONES = [
  { zone: 3, winterLowF: -40, summerHighF: 85, winterLowC: -40, summerHighC: 29, label: 'Zone 3' },
  { zone: 4, winterLowF: -30, summerHighF: 90, winterLowC: -34, summerHighC: 32, label: 'Zone 4' },
  { zone: 5, winterLowF: -20, summerHighF: 90, winterLowC: -29, summerHighC: 32, label: 'Zone 5' },
  { zone: 6, winterLowF: -10, summerHighF: 95, winterLowC: -23, summerHighC: 35, label: 'Zone 6' },
  { zone: 7, winterLowF: 0, summerHighF: 100, winterLowC: -18, summerHighC: 38, label: 'Zone 7' },
  { zone: 8, winterLowF: 10, summerHighF: 100, winterLowC: -12, summerHighC: 38, label: 'Zone 8' },
  { zone: 9, winterLowF: 20, summerHighF: 105, winterLowC: -7, summerHighC: 41, label: 'Zone 9' },
  { zone: 10, winterLowF: 30, summerHighF: 100, winterLowC: -1, summerHighC: 38, label: 'Zone 10' },
  { zone: 11, winterLowF: 40, summerHighF: 95, winterLowC: 4, summerHighC: 35, label: 'Zone 11' },
];

// Helper function to format zone temperature display
const formatZoneTemp = (zoneData) => {
  return `Zone ${zoneData.zone} (${zoneData.winterLowF}° to ${zoneData.summerHighF}°F / ${zoneData.winterLowC}° to ${zoneData.summerHighC}°C)`;
};

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

  // Undo/Redo history
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoAction = useRef(false);

  // Resizable sidebar widths (in pixels)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(288);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

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

  // Multi-select and swap functionality
  const [multiSelectedPlants, setMultiSelectedPlants] = useState([]); // Array of placed plant IDs
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapTargetPlant, setSwapTargetPlant] = useState(null); // Plant to swap TO

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
  const canvasContainerRef = useRef(null);
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

    // BASIC TIER: Show warning at 12th plant about re-bundle swap
    const newPlantCount = placedPlants.length + 1;
    if (demoMode.isBasicMode && demoMode.hasAppliedBundle && newPlantCount === 12) {
      demoMode.setShowReBundleWarning(true);
    }
  };

  // Handle plant selection on canvas
  // Shift+Click for multi-select, regular click for single select
  const handlePlantClick = (e, plant) => {
    e.preventDefault();
    e.stopPropagation();

    // Store scroll position before any state changes
    const container = canvasContainerRef.current;
    const scrollLeft = container?.scrollLeft || 0;
    const scrollTop = container?.scrollTop || 0;

    // Prevent any focus-related scrolling by blurring active element
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }

    // Shift+Click: Toggle multi-select
    if (e.shiftKey) {
      togglePlantMultiSelect(plant.id);
    } else {
      // Regular click: Single select (clears multi-select)
      if (multiSelectedPlants.length > 0) {
        setMultiSelectedPlants([]);
      }
      // Use functional update to avoid any stale state issues
      setSelectedPlacedPlant(prev => prev === plant.id ? null : plant.id);
    }

    // Restore scroll position after React's state update (use requestAnimationFrame for after render)
    requestAnimationFrame(() => {
      if (container) {
        container.scrollLeft = scrollLeft;
        container.scrollTop = scrollTop;
      }
    });
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

  // Check if a circle (plant with radius) stays ENTIRELY inside the custom bed path
  // This ensures maturity circles don't extend outside curved bed edges
  const isCircleInsidePath = (x, y, radius, path) => {
    if (path.length < 3) return true;

    // Check center point first
    if (!isPointInPath(x, y, path)) return false;

    // Check 12 points around the circle's edge (every 30 degrees)
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      const edgeX = x + Math.cos(angle) * radius;
      const edgeY = y + Math.sin(angle) * radius;
      if (!isPointInPath(edgeX, edgeY, path)) return false;
    }

    return true;
  };

  // Find the maximum safe radius at a given point inside the custom path
  // Returns the distance to the nearest edge
  const getDistanceToPathEdge = (x, y, path) => {
    if (path.length < 3) return Infinity;

    let minDist = Infinity;

    // Check distance to each edge segment
    for (let i = 0; i < path.length; i++) {
      const j = (i + 1) % path.length;
      const x1 = path[i].x, y1 = path[i].y;
      const x2 = path[j].x, y2 = path[j].y;

      // Distance from point to line segment
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len2 = dx * dx + dy * dy;

      let dist;
      if (len2 === 0) {
        // Segment is a point
        dist = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
      } else {
        // Project point onto line segment
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len2));
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;
        dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
      }

      minDist = Math.min(minDist, dist);
    }

    return minDist;
  };

  // Reset to rectangle bed
  const resetToRectangleBed = () => {
    setBedType('rectangle');
    setCustomBedPath([]);
    setIsDrawingMode(false);
  };

  // Delete selected plant
  const deleteSelectedPlant = useCallback(() => {
    if (selectedPlacedPlant) {
      setPlacedPlants(prev => prev.filter(p => p.id !== selectedPlacedPlant));
      setSelectedPlacedPlant(null);
    }
  }, [selectedPlacedPlant]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // UNDO/REDO FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════════

  // Track plant changes in history
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    // Only record if plants actually changed
    const currentState = JSON.stringify(placedPlants);
    const lastState = JSON.stringify(history[historyIndex]);

    if (currentState !== lastState) {
      // Truncate any future history if we're not at the end
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...placedPlants]);

      // Limit history to 50 entries to save memory
      if (newHistory.length > 50) {
        newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      } else {
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [placedPlants]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPlacedPlants([...history[newIndex]]);
      setSelectedPlacedPlant(null);
    }
  }, [historyIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPlacedPlants([...history[newIndex]]);
      setSelectedPlacedPlant(null);
    }
  }, [historyIndex, history]);

  // Check if undo/redo are available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // ═══════════════════════════════════════════════════════════════════════════════
  // SIDEBAR RESIZE HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════════

  const handleLeftResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingLeft(true);
  }, []);

  const handleRightResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingRight(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = Math.min(500, Math.max(200, e.clientX));
        setLeftSidebarWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(500, Math.max(200, window.innerWidth - e.clientX));
        setRightSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  // Keyboard handler for Delete/Backspace/Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Delete selected plant
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPlacedPlant) {
        e.preventDefault();
        deleteSelectedPlant();
      }
      // Escape to deselect
      if (e.key === 'Escape' && selectedPlacedPlant) {
        setSelectedPlacedPlant(null);
      }
      // Ctrl+Z = Undo, Ctrl+Shift+Z or Ctrl+Y = Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlacedPlant, deleteSelectedPlant, undo, redo]);

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

    // DEFAULT SIZE FOR BUNDLE PLANTS - represents established plants (~60-70% mature)
    // This ensures bundle-placed plants display same size as individually-placed 3gal plants
    const BUNDLE_DEFAULT_SIZE = '3gal';
    const BUNDLE_SIZE_MULTIPLIER = getSizeMultiplier(BUNDLE_DEFAULT_SIZE);

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

    // ═══════════════════════════════════════════════════════════════════════════════
    // PROFESSIONAL RULE: Odd-number groupings (3, 5, 7, 9) for natural look
    // Favor odd numbers for informal/natural beds
    // ═══════════════════════════════════════════════════════════════════════════════
    const roundToOddNumber = (n) => {
      if (n <= 1) return 1;
      if (n <= 2) return 3;
      if (n <= 4) return 3;
      if (n <= 6) return 5;
      if (n <= 8) return 7;
      if (n <= 10) return 9;
      if (n <= 13) return 11;
      // For larger numbers, round to nearest odd
      return Math.floor(n / 2) * 2 + 1;
    };

    // PROFESSIONAL RULE: Edge offset - plants should be 12-18" inside bed edges
    const EDGE_OFFSET_MIN = 12; // 12 inches minimum from edge
    const EDGE_OFFSET_MAX = 18; // 18 inches for larger plants
    const CANOPY_HEIGHT_THRESHOLD = 120; // 10 feet - only plants this tall or taller can spill over edges

    // ═══════════════════════════════════════════════════════════════════════════════
    // SHAPE-AWARE SAMPLING: Sample valid positions across the entire custom bed shape
    // This ensures plants are distributed to ALL lobes/regions, not just the center
    // ═══════════════════════════════════════════════════════════════════════════════
    const sampleValidBedPositions = (gridSpacing, plantRadius = 0) => {
      const validPositions = [];
      const checkRadius = plantRadius > 0;

      // Sample a grid across the bed bounds
      for (let x = bedBounds.minX + EDGE_OFFSET_MIN; x <= bedBounds.maxX - EDGE_OFFSET_MIN; x += gridSpacing) {
        for (let y = bedBounds.minY + EDGE_OFFSET_MIN; y <= bedBounds.maxY - EDGE_OFFSET_MIN; y += gridSpacing) {
          // For custom paths, check if point (and optionally its radius) fits inside
          if (useCustomPath) {
            if (checkRadius) {
              if (!isCircleInsidePath(x, y, plantRadius, customBedPath)) continue;
            } else {
              if (!isPointInPath(x, y, customBedPath)) continue;
            }
          }
          validPositions.push({ x, y });
        }
      }

      return validPositions;
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // LOBE DETECTION: Cluster valid positions into connected regions (lobes)
    // Uses simple grid-based flood fill to find separate lobes
    // ═══════════════════════════════════════════════════════════════════════════════
    const detectLobes = (positions, connectionRadius) => {
      if (positions.length === 0) return [];

      const lobes = [];
      const assigned = new Set();

      positions.forEach((startPos, startIdx) => {
        if (assigned.has(startIdx)) return;

        // Start a new lobe with flood fill
        const lobe = [];
        const queue = [startIdx];

        while (queue.length > 0) {
          const currentIdx = queue.shift();
          if (assigned.has(currentIdx)) continue;

          assigned.add(currentIdx);
          const currentPos = positions[currentIdx];
          lobe.push(currentPos);

          // Find all unassigned neighbors within connection radius
          positions.forEach((otherPos, otherIdx) => {
            if (assigned.has(otherIdx) || queue.includes(otherIdx)) return;
            const dist = Math.sqrt(Math.pow(currentPos.x - otherPos.x, 2) + Math.pow(currentPos.y - otherPos.y, 2));
            if (dist <= connectionRadius) {
              queue.push(otherIdx);
            }
          });
        }

        if (lobe.length > 0) {
          lobes.push(lobe);
        }
      });

      return lobes;
    };

    // Get centroid of a lobe for distribution
    const getLobeCentroid = (lobe) => {
      const sumX = lobe.reduce((sum, p) => sum + p.x, 0);
      const sumY = lobe.reduce((sum, p) => sum + p.y, 0);
      return { x: sumX / lobe.length, y: sumY / lobe.length };
    };

    // Group sampled positions by height zone (back/middle/front)
    const groupPositionsByZone = (positions) => {
      const bedHeight = bedBounds.maxY - bedBounds.minY;
      const zones = {
        back: [],    // Top 45% of bed (furthest from viewer)
        middle: [],  // Middle 50% (overlaps)
        front: []    // Bottom 40% (closest to viewer)
      };

      positions.forEach(pos => {
        const relativeY = (pos.y - bedBounds.minY) / bedHeight;

        // Back zone: 0-45%
        if (relativeY <= 0.45) {
          zones.back.push(pos);
        }
        // Middle zone: 25-75%
        if (relativeY >= 0.25 && relativeY <= 0.75) {
          zones.middle.push(pos);
        }
        // Front zone: 60-100%
        if (relativeY >= 0.60) {
          zones.front.push(pos);
        }
      });

      return zones;
    };

    // Select evenly distributed cluster centers from sampled positions
    // ENHANCED: First ensures each detected lobe gets at least one cluster center
    const selectDistributedCenters = (positions, numCenters, minSpacing) => {
      if (positions.length === 0) return [];
      if (positions.length <= numCenters) return [...positions];

      const centers = [];

      // LOBE-AWARE DISTRIBUTION: Detect lobes and ensure each gets clusters
      if (useCustomPath && positions.length > 10) {
        const connectionRadius = minSpacing * 2.5; // Points this close are same lobe
        const lobes = detectLobes(positions, connectionRadius);

        if (lobes.length > 1) {
          // Multiple lobes detected - distribute clusters proportionally
          const totalPositions = positions.length;

          lobes.forEach(lobe => {
            // Each lobe gets clusters proportional to its size (min 1)
            const lobeShare = lobe.length / totalPositions;
            const lobeClusters = Math.max(1, Math.round(numCenters * lobeShare));

            // Pick centers from this lobe using greedy selection
            const lobePositions = [...lobe];
            for (let i = lobePositions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [lobePositions[i], lobePositions[j]] = [lobePositions[j], lobePositions[i]];
            }

            let lobeCentersAdded = 0;
            while (lobeCentersAdded < lobeClusters && lobePositions.length > 0) {
              let bestIdx = 0;
              let bestMinDist = 0;

              for (let i = 0; i < lobePositions.length; i++) {
                const pos = lobePositions[i];
                let minDistToCenters = Infinity;

                for (const center of centers) {
                  const dist = Math.sqrt(Math.pow(pos.x - center.x, 2) + Math.pow(pos.y - center.y, 2));
                  minDistToCenters = Math.min(minDistToCenters, dist);
                }

                if (centers.length === 0 || minDistToCenters > bestMinDist) {
                  bestMinDist = minDistToCenters;
                  bestIdx = i;
                }
              }

              if (centers.length === 0 || bestMinDist >= minSpacing * 0.5) {
                centers.push(lobePositions[bestIdx]);
                lobeCentersAdded++;
              }
              lobePositions.splice(bestIdx, 1);
            }
          });

          return centers.slice(0, numCenters);
        }
      }

      // FALLBACK: Single lobe or rectangular bed - use original greedy selection
      const availablePositions = [...positions];

      // Shuffle to randomize starting point
      for (let i = availablePositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
      }

      // Greedy selection: pick positions that maximize distance from already selected
      while (centers.length < numCenters && availablePositions.length > 0) {
        let bestIdx = 0;
        let bestMinDist = 0;

        // Find position with greatest minimum distance to existing centers
        for (let i = 0; i < availablePositions.length; i++) {
          const pos = availablePositions[i];
          let minDistToCenters = Infinity;

          for (const center of centers) {
            const dist = Math.sqrt(Math.pow(pos.x - center.x, 2) + Math.pow(pos.y - center.y, 2));
            minDistToCenters = Math.min(minDistToCenters, dist);
          }

          // First point or better spread
          if (centers.length === 0 || minDistToCenters > bestMinDist) {
            bestMinDist = minDistToCenters;
            bestIdx = i;
          }
        }

        // Only add if meets minimum spacing (or first point)
        if (centers.length === 0 || bestMinDist >= minSpacing) {
          centers.push(availablePositions[bestIdx]);
        }
        availablePositions.splice(bestIdx, 1);
      }

      return centers;
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // QUANTITY SCALING - BALANCED for natural variety
    // - Structure plants (36-72") PROTECTED: minimum 3 per type
    // - Small plants CAPPED: no single type dominates
    // - Height tier enforcement: ensure chest-height (36-48") plants get placed
    // ═══════════════════════════════════════════════════════════════════════════════
    // Scale caps with bed area and bundle multiplier for proper coverage
    // Base values work for 150 sq ft bed at 1x - scale up for larger beds/multipliers
    const scaleFactor = Math.max(1, areaScale * bundleScale);
    const MAX_SINGLE_PLANT_QTY = Math.round(15 * scaleFactor); // Scale cap with bed size
    const MIN_STRUCTURE_QTY = Math.max(3, Math.round(3 * bundleScale)); // Structure plants need minimum for grouping
    const MIN_CHEST_HEIGHT_QTY = Math.max(5, Math.round(5 * bundleScale)); // Ensure chest-height tier represented

    // Track height tiers for enforcement
    let chestHeightCount = 0; // 36-48" plants

    // Track plants skipped due to zone incompatibility for user feedback
    const skippedForZone = [];

    const processedPlants = plantsList.map(bp => {
      const plantData = ALL_PLANTS.find(p => p.id === bp.plantId);
      if (!plantData) return null;

      // ═══════════════════════════════════════════════════════════════════════════════
      // ZONE SURVIVABILITY CHECK: Skip plants that can't survive in selected zone
      // ═══════════════════════════════════════════════════════════════════════════════
      const plantZones = plantData.zones || [];
      if (plantZones.length > 0 && !plantZones.includes(selectedZone)) {
        skippedForZone.push({
          name: plantData.name,
          zones: plantZones,
          role: bp.role
        });
        return null; // Skip this plant - won't survive
      }

      const height = getPlantHeightInches(bp.plantId);
      const radius = getPlantSpreadRadius(bp.plantId);
      const role = roleMapping[bp.role] || bp.role;

      // Determine height tier
      const isChestHeight = height >= 36 && height <= 48; // Critical missing tier
      const isKneeHeight = height >= 12 && height < 36;

      // Get plant size category
      const sizes = plantData.sizes || ['3gal'];
      const primarySize = sizes[0];
      const isSmallPlant = ['4in', 'flat', '1qt', '1gal'].includes(primarySize);
      const isMediumPlant = ['2gal', '3gal'].includes(primarySize);

      // Scale quantity based on plant size and bed area
      let quantity = Math.round(bp.quantity * bundleScale * areaScale);

      // At 3x multiplier: OVERFULL mode - pack bed tight for instant impact
      // Plants will need thinning as they mature
      if (bundleScale >= 3) {
        quantity = Math.round(quantity * 1.5); // Extra 50% boost at 3x
      }

      // REBALANCED: Small plants get moderate boost (was 2.5x, now 2.0x)
      if (isSmallPlant) {
        const smallBoost = bundleScale >= 3 ? 2.5 : 2.0; // More groundcover at 3x
        quantity = Math.max(Math.round(quantity * smallBoost), 5);
      } else if (isMediumPlant) {
        const medBoost = bundleScale >= 3 ? 2.0 : 1.5; // More shrubs at 3x
        quantity = Math.max(Math.round(quantity * medBoost), 5);
      }

      // STRUCTURE PROTECTION: Back/structure plants get minimum guarantee
      // These are critical for layering - don't let them shrink to 1
      if (role === 'back' || bp.role === 'structure') {
        quantity = Math.max(quantity, MIN_STRUCTURE_QTY);
        // Chest-height plants get extra boost to fill missing tier
        if (isChestHeight) {
          quantity = Math.max(quantity, MIN_CHEST_HEIGHT_QTY);
          chestHeightCount += quantity;
        }
      }

      // SHRUB BOOST: Middle/seasonal plants (but not compounding on texture)
      if ((role === 'middle' && bp.role === 'seasonal') || bp.role === 'seasonal') {
        quantity = Math.max(Math.round(quantity * 1.3), 5);
      }

      // TEXTURE PLANTS: Reduced boost to prevent dominance
      if (bp.role === 'texture') {
        // Don't boost texture as aggressively - they already get small plant boost
        quantity = Math.max(quantity, 5);
      }

      // Groundcover scales with multiplier - higher multiplier = fuller coverage
      if (role === 'groundcover' || role === 'front') {
        const baseQty = Math.floor(bedArea / (radius * radius * 5));
        // At 2x+, reduce the reduction to fill more of the bed
        const reductionFactor = bundleScale >= 2 ? 0.8 : (bundleScale >= 1.5 ? 0.65 : 0.5);
        quantity = Math.max(Math.floor(baseQty * reductionFactor), quantity);
      }

      // Trees/focal - scale with multiplier for more trees at higher scales
      if (role === 'focal' || height > 120) {
        // Tighter spacing at higher multipliers (more trees)
        const spacingMultiplier = bundleScale >= 2 ? 1.8 : (bundleScale >= 1.5 ? 2.0 : 2.5);
        const minTreeSpacing = radius * spacingMultiplier;
        const maxTrees = Math.floor(bedBounds.width / minTreeSpacing) * Math.floor(bedBounds.height / minTreeSpacing);
        // At 2x+, ensure at least 2-3 trees for variety
        const minTrees = bundleScale >= 2 ? 3 : (bundleScale >= 1.5 ? 2 : 1);
        quantity = Math.min(quantity, Math.max(minTrees, maxTrees));
      }

      // CAP: No single plant type dominates (except trees which are already limited)
      if (role !== 'focal' && height <= 120) {
        quantity = Math.min(quantity, MAX_SINGLE_PLANT_QTY);
      }

      // APPLY ODD-NUMBER RULE for non-groundcover plants
      if (role !== 'groundcover') {
        quantity = roundToOddNumber(quantity);
      }

      return {
        ...bp,
        plantData,
        role,
        height,
        radius,
        quantity,
        isSmallPlant,
        isChestHeight,
        isKneeHeight,
        isCanopy: height > 120
      };
    }).filter(Boolean);

    // ═══════════════════════════════════════════════════════════════════════════════
    // CHEST HEIGHT TIER BOOST: If missing 36-48" plants, boost existing ones
    // ═══════════════════════════════════════════════════════════════════════════════
    if (chestHeightCount < MIN_CHEST_HEIGHT_QTY) {
      // Find chest-height plants in processed list and boost them
      processedPlants.forEach(p => {
        if (p.isChestHeight && p.quantity < 5) {
          p.quantity = roundToOddNumber(Math.max(5, p.quantity + 2));
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // DIVERSITY INJECTION: If a role has high quantity but few varieties, add more
    // Goal: 4-6 different plant types per role when quantity is significant
    // ═══════════════════════════════════════════════════════════════════════════════
    const MIN_VARIETIES_PER_ROLE = 4;
    const VARIETY_QUANTITY_THRESHOLD = 15; // Only diversify if total > 15 plants

    // Group by role to analyze diversity
    const roleGroups = {};
    processedPlants.forEach(p => {
      if (!roleGroups[p.role]) roleGroups[p.role] = [];
      roleGroups[p.role].push(p);
    });

    // Check roles that need more variety
    ['back', 'middle'].forEach(role => {
      const plants = roleGroups[role] || [];
      const totalQuantity = plants.reduce((sum, p) => sum + p.quantity, 0);
      const uniqueTypes = new Set(plants.map(p => p.plantId)).size;

      if (totalQuantity >= VARIETY_QUANTITY_THRESHOLD && uniqueTypes < MIN_VARIETIES_PER_ROLE) {
        const varietiesToAdd = MIN_VARIETIES_PER_ROLE - uniqueTypes;
        const existingPlantIds = new Set(plants.map(p => p.plantId));

        // Find compatible plants from database not already in bundle
        const compatiblePlants = ALL_PLANTS.filter(p => {
          if (existingPlantIds.has(p.id)) return false;
          // Match by category - shrubs for back/middle roles
          const category = p.category || p.dbCategory;
          if (role === 'back') return category === 'shrubs' && getPlantHeightInches(p.id) >= 48;
          if (role === 'middle') return (category === 'shrubs' || category === 'perennials') &&
            getPlantHeightInches(p.id) >= 18 && getPlantHeightInches(p.id) <= 60;
          return false;
        });

        // Shuffle and pick new varieties
        const shuffledCompat = compatiblePlants.sort(() => Math.random() - 0.5);
        const newVarieties = shuffledCompat.slice(0, varietiesToAdd);

        // NATURAL VARIETY: Uneven quantities create visual interest
        // Some plants dominate (9-13), some accent (3-7), not equal distribution
        const quantityToRedistribute = Math.floor(totalQuantity * 0.35); // Take 35% for new varieties

        // Vary existing plant quantities randomly (keep some dominant, reduce others more)
        plants.forEach((p, idx) => {
          // Random variation: some keep more (0.7-0.9), some less (0.5-0.7)
          const variationFactor = 0.5 + Math.random() * 0.4; // 0.5 to 0.9
          p.quantity = Math.max(3, Math.floor(p.quantity * variationFactor));
          p.quantity = roundToOddNumber(p.quantity);
        });

        // Add new variety plants with VARIED quantities (not equal)
        let remainingToDistribute = quantityToRedistribute;
        newVarieties.forEach((plantData, idx) => {
          const height = getPlantHeightInches(plantData.id);
          const radius = getPlantSpreadRadius(plantData.id);

          // Vary quantity: first gets more, others get random amounts
          let varietyQty;
          if (idx === 0) {
            // First new variety gets more (accent feature)
            varietyQty = Math.floor(remainingToDistribute * (0.3 + Math.random() * 0.2));
          } else if (idx === newVarieties.length - 1) {
            // Last one gets remainder
            varietyQty = remainingToDistribute;
          } else {
            // Middle ones get random portion
            varietyQty = Math.floor(remainingToDistribute * (0.15 + Math.random() * 0.25));
          }

          varietyQty = roundToOddNumber(Math.max(3, Math.min(varietyQty, 11)));
          remainingToDistribute -= varietyQty;

          processedPlants.push({
            plantId: plantData.id,
            plantData,
            role,
            height,
            radius,
            quantity: varietyQty,
            isSmallPlant: false,
            isCanopy: height > 120,
            injectedVariety: true
          });
        });
      }
    });

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

          // Check if in custom path - canopy trees (10'+) can spill, others must fit entirely
          if (useCustomPath) {
            if (bundlePlant.isCanopy) {
              if (!isPointInPath(x, y, customBedPath)) continue;
            } else {
              if (!isCircleInsidePath(x, y, bundlePlant.radius, customBedPath)) continue;
            }
          }

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
            scale: 0.95 + Math.random() * 0.1,
            size: BUNDLE_DEFAULT_SIZE,
            sizeMultiplier: BUNDLE_SIZE_MULTIPLIER
          });
        }
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PROFESSIONAL RULE: Height zones for layered depth
    // Back = 60-100% of bed depth, Middle = 30-70%, Front = 0-40%
    // ═══════════════════════════════════════════════════════════════════════════════
    const heightZones = {
      focal: { minY: bedBounds.minY + bedBounds.height * 0.2, maxY: bedBounds.maxY - bedBounds.height * 0.3 },
      back: { minY: bedBounds.minY + EDGE_OFFSET_MAX, maxY: bedBounds.minY + bedBounds.height * 0.45 },
      topiary: { minY: bedBounds.minY + EDGE_OFFSET_MAX, maxY: bedBounds.minY + bedBounds.height * 0.5 },
      middle: { minY: bedBounds.minY + bedBounds.height * 0.25, maxY: bedBounds.maxY - bedBounds.height * 0.25 },
      front: { minY: bedBounds.maxY - bedBounds.height * 0.4, maxY: bedBounds.maxY - EDGE_OFFSET_MIN },
      edge: { minY: bedBounds.maxY - bedBounds.height * 0.35, maxY: bedBounds.maxY - EDGE_OFFSET_MIN },
      groundcover: { minY: bedBounds.maxY - bedBounds.height * 0.5, maxY: bedBounds.maxY - EDGE_OFFSET_MIN }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // ORGANIC SPLATTER PLACEMENT - IMPROVED: More even distribution, less blobby
    // Creates irregular groupings that spread across the entire bed, not dense blobs
    // ═══════════════════════════════════════════════════════════════════════════════
    const createSplatterPositions = (centerX, centerY, count, spacing, role) => {
      const positions = [];

      if (count === 1) {
        positions.push({ x: centerX, y: centerY });
        return positions;
      }

      // IMPROVED: Use higher power (0.85) for more even distribution, less blobby
      // Old was 0.6 which created dense centers - now plants spread more evenly
      for (let i = 0; i < count; i++) {
        // Random angle for each plant
        const angle = Math.random() * Math.PI * 2;

        // IMPROVED: Higher power = more even distribution across the area
        // 0.85 pushes more plants toward the outer edge vs bunching in center
        const distanceFactor = Math.pow(Math.random(), 0.85);
        // IMPROVED: Larger spread radius for wider distribution
        const maxDist = spacing * Math.sqrt(count) * 0.6;
        const distance = distanceFactor * maxDist;

        // Organic wobble - keeps natural look
        const wobbleX = (Math.random() - 0.5) * spacing * 0.5;
        const wobbleY = (Math.random() - 0.5) * spacing * 0.5;

        // Reduced bleeding effect - still natural but less dense extensions
        const bleedChance = Math.random();
        const bleedExtension = bleedChance > 0.85 ? spacing * (0.2 + Math.random() * 0.3) : 0;

        positions.push({
          x: centerX + Math.cos(angle) * (distance + bleedExtension) + wobbleX,
          y: centerY + Math.sin(angle) * (distance + bleedExtension) + wobbleY
        });
      }

      return positions;
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // HELPER: Calculate edge offset based on plant height
    // Only 10'+ canopy trees can spill over - all others stay inside bed
    // ═══════════════════════════════════════════════════════════════════════════════
    const getPlantEdgeOffset = (plantHeight, plantRadius) => {
      // 10'+ canopy trees can have their canopy extend OVER the bed edge
      // Their trunk/center still stays inside, but canopy can visually overhang
      if (plantHeight >= CANOPY_HEIGHT_THRESHOLD) {
        // Tall canopy: center must be at least 24" inside, but canopy can spill
        return Math.max(24, plantRadius * 0.3);
      }
      // All other plants: maturity circle (full radius) must stay inside bed
      return EDGE_OFFSET_MIN + plantRadius;
    };

    // Create drift/river positions for flowing masses
    const createDriftPositions = (startX, startY, endX, endY, count, width) => {
      const positions = [];
      const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX);
      const perpAngle = angle + Math.PI / 2;

      for (let i = 0; i < count; i++) {
        // Position along the drift line
        const t = Math.random();
        const baseX = startX + (endX - startX) * t;
        const baseY = startY + (endY - startY) * t;

        // Offset perpendicular to drift direction (creates width)
        const perpOffset = (Math.random() - 0.5) * width;

        // Organic waviness along the drift
        const wave = Math.sin(t * Math.PI * 2) * width * 0.3;

        positions.push({
          x: baseX + Math.cos(perpAngle) * (perpOffset + wave) + (Math.random() - 0.5) * width * 0.2,
          y: baseY + Math.sin(perpAngle) * (perpOffset + wave) + (Math.random() - 0.5) * width * 0.2
        });
      }

      return positions;
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 2: Place structure/back plants using SHAPE-AWARE distribution
    // Samples valid positions across the ENTIRE custom bed shape, including all lobes
    // ═══════════════════════════════════════════════════════════════════════════════
    const structurePlants = processedPlants.filter(p => p.role === 'back' || p.role === 'topiary');
    const usedClusterAreas = []; // Track cluster areas for bleeding overlap

    // Pre-sample valid positions for back zone plants (with room for their radius)
    const backZoneSampleSpacing = 30; // Sample every 30 inches
    const allBackZonePositions = useCustomPath
      ? sampleValidBedPositions(backZoneSampleSpacing, 0).filter(pos => {
          const relY = (pos.y - bedBounds.minY) / (bedBounds.maxY - bedBounds.minY);
          return relY <= 0.5; // Back half of bed
        })
      : [];

    structurePlants.forEach(bundlePlant => {
      const zone = heightZones[bundlePlant.role] || heightZones.back;
      const plantEdgeOffset = getPlantEdgeOffset(bundlePlant.height, bundlePlant.radius);
      const canSpillOver = bundlePlant.height >= CANOPY_HEIGHT_THRESHOLD;

      // Calculate number of clusters based on quantity
      const numClusters = Math.max(1, Math.ceil(bundlePlant.quantity / 5));
      const plantsPerCluster = Math.ceil(bundlePlant.quantity / numClusters);

      // SHAPE-AWARE: Get valid positions for this plant's radius in the back zone
      let validZonePositions;
      if (useCustomPath) {
        validZonePositions = allBackZonePositions.filter(pos =>
          canSpillOver || isCircleInsidePath(pos.x, pos.y, bundlePlant.radius * 1.2, customBedPath)
        );
      } else {
        // For rectangular beds, generate positions the old way
        validZonePositions = [];
        for (let x = bedBounds.minX + plantEdgeOffset; x <= bedBounds.maxX - plantEdgeOffset; x += 40) {
          for (let y = zone.minY; y <= zone.maxY; y += 40) {
            validZonePositions.push({ x, y });
          }
        }
      }

      // Select evenly distributed cluster centers from valid positions
      const clusterCenters = selectDistributedCenters(
        validZonePositions,
        numClusters,
        bundlePlant.radius * 2.5 // Minimum spacing between clusters
      );

      // If we didn't get enough centers, add some fallbacks
      while (clusterCenters.length < numClusters) {
        const fx = bedBounds.centerX + (Math.random() - 0.5) * bedBounds.width * 0.6;
        const fy = (zone.minY + zone.maxY) / 2;
        if (!useCustomPath || canSpillOver || isCircleInsidePath(fx, fy, bundlePlant.radius, customBedPath)) {
          clusterCenters.push({ x: fx, y: fy });
        } else {
          break; // Can't find more valid positions
        }
      }

      clusterCenters.forEach((clusterCenter, clusterIdx) => {
        // Use SPLATTER placement with this cluster's portion of plants
        const clusterPlantCount = clusterIdx < clusterCenters.length - 1 ? plantsPerCluster :
          Math.max(1, bundlePlant.quantity - (clusterCenters.length - 1) * plantsPerCluster);
        const clusterSpacing = bundlePlant.radius * 1.8;
        const positions = createSplatterPositions(
          clusterCenter.x, clusterCenter.y,
          clusterPlantCount, clusterSpacing, bundlePlant.role
        );

        positions.forEach((pos, i) => {
          // Use height-based edge offset for boundary clamping
          let x = Math.max(bedBounds.minX + plantEdgeOffset, Math.min(bedBounds.maxX - plantEdgeOffset, pos.x));
          let y = Math.max(zone.minY, Math.min(zone.maxY, pos.y));

          // For custom paths: ensure ENTIRE maturity circle stays inside (unless 10'+ canopy)
          if (useCustomPath) {
            const canSpillOver = bundlePlant.height >= CANOPY_HEIGHT_THRESHOLD;
            if (canSpillOver) {
              // Tall canopy trees: just check center is inside
              if (!isPointInPath(x, y, customBedPath)) return;
            } else {
              // All other plants: full maturity circle must stay inside
              if (!isCircleInsidePath(x, y, bundlePlant.radius, customBedPath)) return;
            }
          }

          // Looser collision - allow more overlap for organic feel
          const tooClose = newPlants.some(p => {
            const d = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            const isSameType = p.plantId === bundlePlant.plantId;

            if (!isSameType) {
              const minDist = getMinSpacing(bundlePlant.plantId, p.plantId) * 0.7;
              return d < minDist;
            }
            return d < bundlePlant.radius * 0.7;
          });

          if (!tooClose) {
            newPlants.push({
              id: `bundle-${Date.now()}-struct-${clusterIdx}-${i}-${Math.random().toString(36).substr(2, 5)}`,
              plantId: bundlePlant.plantId,
              x, y,
              rotation: (Math.random() - 0.5) * 20,
              scale: 0.9 + Math.random() * 0.15,
              isClusterCenter: i === 0,
              size: BUNDLE_DEFAULT_SIZE,
              sizeMultiplier: BUNDLE_SIZE_MULTIPLIER
            });
          }
        });

        // Track this cluster area
        usedClusterAreas.push({
          x: clusterCenter.x,
          y: clusterCenter.y,
          radius: clusterSpacing * Math.sqrt(clusterPlantCount)
        });
      }); // End of cluster centers forEach
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 3: Place middle/seasonal plants using SHAPE-AWARE distribution
    // Samples valid positions across the ENTIRE custom bed shape middle zone
    // ═══════════════════════════════════════════════════════════════════════════════
    const middlePlants = processedPlants.filter(p => p.role === 'middle');

    // Pre-sample valid positions for middle zone plants
    const middleZoneSampleSpacing = 30;
    const allMiddleZonePositions = useCustomPath
      ? sampleValidBedPositions(middleZoneSampleSpacing, 0).filter(pos => {
          const relY = (pos.y - bedBounds.minY) / (bedBounds.maxY - bedBounds.minY);
          return relY >= 0.25 && relY <= 0.75; // Middle zone
        })
      : [];

    middlePlants.forEach(bundlePlant => {
      const zone = heightZones.middle;
      const plantEdgeOffset = getPlantEdgeOffset(bundlePlant.height, bundlePlant.radius);
      const canSpillOver = bundlePlant.height >= CANOPY_HEIGHT_THRESHOLD;

      // Calculate number of clusters
      const numClusters = Math.max(1, Math.ceil(bundlePlant.quantity / 5));
      const plantsPerCluster = Math.ceil(bundlePlant.quantity / numClusters);

      // SHAPE-AWARE: Get valid positions for this plant's radius in middle zone
      let validZonePositions;
      if (useCustomPath) {
        validZonePositions = allMiddleZonePositions.filter(pos =>
          canSpillOver || isCircleInsidePath(pos.x, pos.y, bundlePlant.radius * 1.2, customBedPath)
        );
      } else {
        validZonePositions = [];
        for (let x = bedBounds.minX + plantEdgeOffset; x <= bedBounds.maxX - plantEdgeOffset; x += 40) {
          for (let y = zone.minY; y <= zone.maxY; y += 40) {
            validZonePositions.push({ x, y });
          }
        }
      }

      // Select evenly distributed cluster centers, avoiding already used areas
      const availablePositions = validZonePositions.filter(pos => {
        return !usedClusterAreas.some(area => {
          const dist = Math.sqrt(Math.pow(pos.x - area.x, 2) + Math.pow(pos.y - area.y, 2));
          return dist < area.radius * 0.5;
        });
      });

      const clusterCenters = selectDistributedCenters(
        availablePositions.length > 0 ? availablePositions : validZonePositions,
        numClusters,
        bundlePlant.radius * 2
      );

      // Fallback if needed
      while (clusterCenters.length < numClusters) {
        const fx = bedBounds.centerX + (Math.random() - 0.5) * bedBounds.width * 0.6;
        const fy = (zone.minY + zone.maxY) / 2;
        if (!useCustomPath || canSpillOver || isCircleInsidePath(fx, fy, bundlePlant.radius, customBedPath)) {
          clusterCenters.push({ x: fx, y: fy });
        } else {
          break;
        }
      }

      clusterCenters.forEach((clusterCenter, clusterIdx) => {
        const clusterPlantCount = clusterIdx < clusterCenters.length - 1 ? plantsPerCluster :
          Math.max(1, bundlePlant.quantity - (clusterCenters.length - 1) * plantsPerCluster);
        const clusterSpacing = bundlePlant.radius * 1.7;
        const positions = createSplatterPositions(
          clusterCenter.x, clusterCenter.y,
          clusterPlantCount, clusterSpacing, bundlePlant.role
        );

        positions.forEach((pos, i) => {
          let x = Math.max(bedBounds.minX + plantEdgeOffset, Math.min(bedBounds.maxX - plantEdgeOffset, pos.x));
          let y = Math.max(zone.minY, Math.min(zone.maxY, pos.y));

          // For custom paths: ensure ENTIRE maturity circle stays inside
          if (useCustomPath) {
            if (canSpillOver) {
              if (!isPointInPath(x, y, customBedPath)) return;
            } else {
              if (!isCircleInsidePath(x, y, bundlePlant.radius, customBedPath)) return;
            }
          }

          const tooClose = newPlants.some(p => {
            const d = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            const isSameType = p.plantId === bundlePlant.plantId;
            if (!isSameType) {
              const minDist = getMinSpacing(bundlePlant.plantId, p.plantId) * 0.65;
              return d < minDist;
            }
            return d < bundlePlant.radius * 0.65;
          });

          if (!tooClose) {
            newPlants.push({
              id: `bundle-${Date.now()}-mid-${clusterIdx}-${i}-${Math.random().toString(36).substr(2, 5)}`,
              plantId: bundlePlant.plantId,
              x, y,
              rotation: (Math.random() - 0.5) * 25,
              scale: 0.85 + Math.random() * 0.2,
              isClusterCenter: i === 0,
              size: BUNDLE_DEFAULT_SIZE,
              sizeMultiplier: BUNDLE_SIZE_MULTIPLIER
            });
          }
        });

        usedClusterAreas.push({
          x: clusterCenter.x,
          y: clusterCenter.y,
          radius: clusterSpacing * Math.sqrt(clusterPlantCount)
        });
      }); // End of middle cluster centers forEach
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 4: Place front/edge plants using SHAPE-AWARE distribution
    // Front plants are placed across the entire front zone of the custom shape
    // ═══════════════════════════════════════════════════════════════════════════════
    const frontPlants = processedPlants.filter(p => p.role === 'front' || p.role === 'edge');

    // Pre-sample valid positions for front zone
    const frontZoneSampleSpacing = 25;
    const allFrontZonePositions = useCustomPath
      ? sampleValidBedPositions(frontZoneSampleSpacing, 0).filter(pos => {
          const relY = (pos.y - bedBounds.minY) / (bedBounds.maxY - bedBounds.minY);
          return relY >= 0.55; // Front zone (bottom 45%)
        })
      : [];

    frontPlants.forEach(bundlePlant => {
      const zone = heightZones.front;
      const plantEdgeOffset = getPlantEdgeOffset(bundlePlant.height, bundlePlant.radius);
      const canSpillOver = bundlePlant.height >= CANOPY_HEIGHT_THRESHOLD;

      // SHAPE-AWARE: Get valid positions for this plant in front zone
      let validFrontPositions;
      if (useCustomPath) {
        validFrontPositions = allFrontZonePositions.filter(pos =>
          canSpillOver || isCircleInsidePath(pos.x, pos.y, bundlePlant.radius, customBedPath)
        );
      } else {
        validFrontPositions = [];
        for (let x = bedBounds.minX + plantEdgeOffset; x <= bedBounds.maxX - plantEdgeOffset; x += 30) {
          for (let y = zone.minY; y <= zone.maxY; y += 30) {
            validFrontPositions.push({ x, y });
          }
        }
      }

      // Calculate how many drift lines we need (one per ~7 plants)
      const numDrifts = Math.max(1, Math.ceil(bundlePlant.quantity / 7));
      const plantsPerDrift = Math.ceil(bundlePlant.quantity / numDrifts);

      // Select distributed start points for drifts across the front zone
      const driftStarts = selectDistributedCenters(validFrontPositions, numDrifts, bundlePlant.radius * 3);

      driftStarts.forEach((startPos, driftIdx) => {
        // Find an end point in the same general area
        const nearbyPositions = validFrontPositions.filter(pos => {
          const dist = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
          return dist > bundlePlant.radius * 2 && dist < bundlePlant.radius * 8;
        });

        const endPos = nearbyPositions.length > 0
          ? nearbyPositions[Math.floor(Math.random() * nearbyPositions.length)]
          : { x: startPos.x + (Math.random() - 0.5) * 60, y: startPos.y + (Math.random() - 0.5) * 30 };

        const driftPlantCount = driftIdx < numDrifts - 1 ? plantsPerDrift :
          Math.max(1, bundlePlant.quantity - (numDrifts - 1) * plantsPerDrift);

        const driftWidth = bundlePlant.radius * 2.5;
        const positions = createDriftPositions(
          startPos.x, startPos.y,
          endPos.x, endPos.y,
          driftPlantCount, driftWidth
        );

        positions.forEach((pos, i) => {
          let x = Math.max(bedBounds.minX + plantEdgeOffset, Math.min(bedBounds.maxX - plantEdgeOffset, pos.x));
          let y = Math.max(zone.minY, Math.min(zone.maxY, pos.y));

          // For custom paths: ensure ENTIRE maturity circle stays inside
          if (useCustomPath) {
            if (canSpillOver) {
              if (!isPointInPath(x, y, customBedPath)) return;
            } else {
              if (!isCircleInsidePath(x, y, bundlePlant.radius, customBedPath)) return;
            }
          }

          const tooClose = newPlants.some(p => {
            const d = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            const isSameType = p.plantId === bundlePlant.plantId;
            if (!isSameType) {
              const minDist = getMinSpacing(bundlePlant.plantId, p.plantId) * 0.6;
              return d < minDist;
            }
            return d < bundlePlant.radius * 0.6;
          });

          if (!tooClose) {
            newPlants.push({
              id: `bundle-${Date.now()}-front-${driftIdx}-${i}-${Math.random().toString(36).substr(2, 5)}`,
              plantId: bundlePlant.plantId,
              x, y,
              rotation: (Math.random() - 0.5) * 30,
              scale: 0.8 + Math.random() * 0.25,
              isClusterCenter: i === 0,
              size: BUNDLE_DEFAULT_SIZE,
              sizeMultiplier: BUNDLE_SIZE_MULTIPLIER
            });
          }
        });

        usedClusterAreas.push({
          x: (startPos.x + endPos.x) / 2,
          y: (startPos.y + endPos.y) / 2,
          radius: driftWidth
        });
      });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 5: ORGANIC GROUNDCOVER - Flowing rivers & drifts (NOT scattered!)
    // Groundcover should flow like water: streams along edges, drifts around shrubs
    // NEVER scatter individually - always place as connected masses
    // ═══════════════════════════════════════════════════════════════════════════════
    const groundcoverPlants = processedPlants.filter(p => p.role === 'groundcover');
    const gcZone = heightZones.groundcover;

    // Helper: Create organic flowing river path with natural curves
    const createFlowingRiver = (startX, startY, endX, endY, width, waviness = 25) => {
      const points = [];
      const segments = 12 + Math.floor(Math.random() * 6);
      const dx = (endX - startX) / segments;
      const dy = (endY - startY) / segments;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Organic sine wave perpendicular to path
        const wave = Math.sin(t * Math.PI * (2 + Math.random())) * waviness;
        const baseX = startX + dx * i;
        const baseY = startY + dy * i;

        // Add multiple points across river width for density
        for (let w = -1; w <= 1; w += 0.5) {
          const offsetX = (dy !== 0) ? wave * (dy / Math.abs(dy)) : wave;
          const offsetY = (dx !== 0) ? -wave * (dx / Math.abs(dx)) : 0;
          points.push({
            x: baseX + offsetX + w * width * 0.3 + (Math.random() - 0.5) * 6,
            y: baseY + offsetY + (Math.random() - 0.5) * 8
          });
        }
      }
      return points;
    };

    // Helper: Create crescent drift around a shrub (like moon shape)
    const createCrescentDrift = (centerX, centerY, innerRadius, outerRadius, arcStart, arcLength) => {
      const points = [];
      const numArcs = 3; // Multiple arcs for density

      for (let arc = 0; arc < numArcs; arc++) {
        const radius = innerRadius + (outerRadius - innerRadius) * (arc / numArcs);
        const numPoints = Math.floor(arcLength / 0.25);

        for (let i = 0; i < numPoints; i++) {
          const angle = arcStart + (arcLength * i / numPoints);
          const wobble = (Math.random() - 0.5) * 8;
          points.push({
            x: centerX + Math.cos(angle) * (radius + wobble),
            y: centerY + Math.sin(angle) * (radius + wobble)
          });
        }
      }
      return points;
    };

    groundcoverPlants.forEach(bundlePlant => {
      const spacing = bundlePlant.radius * 1.8; // Tighter spacing for flowing effect
      let placedCount = 0;
      const targetQuantity = bundlePlant.quantity;
      const allFlowPoints = [];

      // ─────────────────────────────────────────────────────────────────────────────
      // PATTERN 1: SINGLE MAIN RIVER - one flowing stream along front edge
      // REDUCED: Only one river instead of two parallel streams
      // ─────────────────────────────────────────────────────────────────────────────
      const frontRiverY = bedBounds.maxY - EDGE_OFFSET_MIN - 10;
      const riverPoints = createFlowingRiver(
        bedBounds.minX + EDGE_OFFSET_MIN,
        frontRiverY,
        bedBounds.maxX - EDGE_OFFSET_MIN,
        frontRiverY + (Math.random() - 0.5) * 15,
        spacing * 2.5, // Wider spacing = fewer plants
        30
      );
      allFlowPoints.push(...riverPoints);
      // REMOVED: Second parallel river - more space for shrubs

      // ─────────────────────────────────────────────────────────────────────────────
      // PATTERN 2: CRESCENT DRIFTS - wrapping around shrubs (REDUCED)
      // Only wrap around 3 key shrubs instead of 6
      // ─────────────────────────────────────────────────────────────────────────────
      const shrubsToWrap = newPlants.filter(p => {
        const plantData = ALL_PLANTS.find(pl => pl.id === p.plantId);
        return plantData && ['focal', 'back'].includes(plantData.category); // Only focal/back, not middle
      });

      shrubsToWrap.slice(0, 3).forEach((shrub, idx) => { // REDUCED: 3 instead of 6
        const plantData = ALL_PLANTS.find(pl => pl.id === shrub.plantId);
        if (!plantData) return;

        const plantRadius = (plantData.spread || 36) / 2;
        // Create crescent on the front side of shrub (viewer-facing)
        const arcStart = Math.PI * 0.2 + (Math.random() - 0.5) * 0.3; // Bottom-facing arc
        const arcLength = Math.PI * (0.6 + Math.random() * 0.4);

        const crescentPoints = createCrescentDrift(
          shrub.x,
          shrub.y,
          plantRadius + 10,
          plantRadius + 30,
          arcStart,
          arcLength
        );
        allFlowPoints.push(...crescentPoints);
      });

      // ─────────────────────────────────────────────────────────────────────────────
      // PATTERN 3: SIDE RIBBONS - REMOVED to allow shrub placement near edges
      // ─────────────────────────────────────────────────────────────────────────────
      // Side ribbons removed - shrubs now go closer to edges

      // ─────────────────────────────────────────────────────────────────────────────
      // PATTERN 4: CONNECTING VEINS - REDUCED: fewer and sparser veins
      // ─────────────────────────────────────────────────────────────────────────────
      const veinCount = Math.max(1, Math.floor(bedBounds.width / 300)); // Much fewer veins
      for (let v = 0; v < veinCount; v++) {
        const veinX = bedBounds.minX + EDGE_OFFSET_MIN + (v + 1) * (bedBounds.width - EDGE_OFFSET_MIN * 2) / (veinCount + 1);
        const veinPoints = createFlowingRiver(
          veinX + (Math.random() - 0.5) * 30,
          gcZone.maxY - 25,
          veinX + (Math.random() - 0.5) * 50,
          gcZone.minY + 60, // Shorter veins
          spacing * 1.2, // Wider spacing
          20
        );
        allFlowPoints.push(...veinPoints);
      }

      // DO NOT shuffle - maintain flow continuity for river effect
      // Instead, place along paths in order

      for (const point of allFlowPoints) {
        if (placedCount >= targetQuantity) break;

        // Apply edge offsets - groundcover maturity circles must stay inside custom paths
        if (useCustomPath && !isCircleInsidePath(point.x, point.y, bundlePlant.radius, customBedPath)) continue;
        if (point.x < bedBounds.minX + EDGE_OFFSET_MIN || point.x > bedBounds.maxX - EDGE_OFFSET_MIN) continue;
        if (point.y < gcZone.minY || point.y > gcZone.maxY) continue;

        // Check spacing - groundcover can be close to other plants but not overlapping
        const tooClose = newPlants.some(p => {
          const dist = Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2));
          const otherPlant = ALL_PLANTS.find(pl => pl.id === p.plantId);
          const isOtherGroundcover = otherPlant?.category === 'groundcover' || otherPlant?.category === 'front';
          // Groundcover can nestle close to larger plants
          return dist < (isOtherGroundcover ? spacing * 0.65 : spacing * 0.3);
        });

        if (!tooClose) {
          newPlants.push({
            id: `bundle-${Date.now()}-gc-${placedCount}`,
            plantId: bundlePlant.plantId,
            x: point.x + (Math.random() - 0.5) * 5,
            y: point.y + (Math.random() - 0.5) * 5,
            rotation: (Math.random() - 0.5) * 40,
            scale: 0.75 + Math.random() * 0.3,
            size: BUNDLE_DEFAULT_SIZE,
            sizeMultiplier: BUNDLE_SIZE_MULTIPLIER
          });
          placedCount++;
        }
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 6: MINIMAL gap-fill - REDUCED to match 50% groundcover reduction
    // Only fill critical gaps, more space left for shrub visibility
    // ═══════════════════════════════════════════════════════════════════════════════
    const primaryGroundcover = groundcoverPlants[0];
    if (primaryGroundcover) {
      const gcSpacing = primaryGroundcover.radius * 5; // Much more conservative spacing

      // Only look for gaps along the front edge where groundcover rivers should be
      const frontFillY = gcZone.maxY - EDGE_OFFSET_MIN - 15;

      for (let x = bedBounds.minX + EDGE_OFFSET_MIN + 60; x < bedBounds.maxX - EDGE_OFFSET_MIN - 60; x += gcSpacing) {
        const y = frontFillY + (Math.random() - 0.5) * 10;

        // Groundcover gap-fill must also keep maturity circles inside custom path
        if (useCustomPath && !isCircleInsidePath(x, y, primaryGroundcover.radius, customBedPath)) continue;
        if (y < gcZone.minY || y > gcZone.maxY) continue;

        // Find nearest groundcover plant (not any plant)
        const nearestGcDist = newPlants
          .filter(p => {
            const pd = ALL_PLANTS.find(pl => pl.id === p.plantId);
            return pd && (pd.category === 'groundcover' || pd.category === 'front');
          })
          .reduce((min, p) => Math.min(min, Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))), Infinity);

        // Only fill if there's a very large gap - much stricter threshold
        if (nearestGcDist > gcSpacing * 3 && nearestGcDist < gcSpacing * 6) {
          // Add just 2 plants to maintain grouped feel without over-filling
          for (let i = 0; i < 2; i++) {
            const offsetX = (i - 0.5) * gcSpacing * 0.3;
            const offsetY = (Math.random() - 0.5) * gcSpacing * 0.2;
            newPlants.push({
              id: `bundle-${Date.now()}-fill-${x}-${i}`,
              plantId: primaryGroundcover.plantId,
              x: x + offsetX + (Math.random() - 0.5) * 6,
              y: y + offsetY,
              rotation: (Math.random() - 0.5) * 40,
              scale: 0.7 + Math.random() * 0.25,
              size: BUNDLE_DEFAULT_SIZE,
              sizeMultiplier: BUNDLE_SIZE_MULTIPLIER
            });
          }
        }
      }
    }

    // Log zone compatibility feedback
    if (skippedForZone.length > 0) {
      console.log(`Zone ${selectedZone} Compatibility: Skipped ${skippedForZone.length} plants that won't survive:`,
        skippedForZone.map(p => `${p.name} (zones ${p.zones.join('-')})`));
      // Could add a toast notification here in the future
    }

    setPlacedPlants([...placedPlants, ...newPlants]);
    setSelectedBundle(bundle);
  };

  // Clear all plants
  const clearCanvas = () => {
    setPlacedPlants([]);
    setSelectedPlacedPlant(null);
    setSelectedBundle(null);
    setMultiSelectedPlants([]);
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // MULTI-SELECT & SWAP FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════════

  // Toggle a plant's selection in multi-select mode
  const togglePlantMultiSelect = (plantId) => {
    setMultiSelectedPlants(prev => {
      if (prev.includes(plantId)) {
        return prev.filter(id => id !== plantId);
      } else {
        return [...prev, plantId];
      }
    });
  };

  // Select all plants of a specific type (by plantId)
  const selectAllOfType = (plantId) => {
    const matchingPlants = placedPlants.filter(p => p.plantId === plantId);
    const matchingIds = matchingPlants.map(p => p.id);
    setMultiSelectedPlants(matchingIds);
  };

  // Clear multi-selection
  const clearMultiSelect = () => {
    setMultiSelectedPlants([]);
  };

  // Get unique plant types from selected plants
  const getSelectedPlantTypes = () => {
    const selectedPlantIds = new Set(
      multiSelectedPlants.map(id => placedPlants.find(p => p.id === id)?.plantId).filter(Boolean)
    );
    return Array.from(selectedPlantIds).map(plantId => ALL_PLANTS.find(p => p.id === plantId)).filter(Boolean);
  };

  // Swap selected plants to a new plant type
  const swapSelectedPlants = (newPlantId) => {
    if (multiSelectedPlants.length === 0 || !newPlantId) return;

    const newPlantData = ALL_PLANTS.find(p => p.id === newPlantId);
    if (!newPlantData) return;

    // Check zone compatibility
    if (newPlantData.zones && !newPlantData.zones.includes(selectedZone)) {
      console.warn(`${newPlantData.name} won't survive in Zone ${selectedZone}`);
      return;
    }

    setPlacedPlants(prev => prev.map(plant => {
      if (multiSelectedPlants.includes(plant.id)) {
        // Keep position, rotation, scale - just change the plant type
        return {
          ...plant,
          plantId: newPlantId,
          // Reset size to default for new plant
          size: newPlantData.sizes?.[0] || '3gal',
          sizeMultiplier: getSizeMultiplier(newPlantData.sizes?.[0] || '3gal')
        };
      }
      return plant;
    }));

    setShowSwapModal(false);
    setSwapTargetPlant(null);
    setMultiSelectedPlants([]);
  };

  // Delete all multi-selected plants
  const deleteMultiSelected = () => {
    setPlacedPlants(prev => prev.filter(p => !multiSelectedPlants.includes(p.id)));
    setMultiSelectedPlants([]);
    setSelectedPlacedPlant(null);
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

      const plantList = Object.entries(plantCounts)
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
        <aside
          className="border-r border-sage-200 bg-white h-[calc(100vh-73px)] overflow-hidden flex flex-col relative"
          style={{ width: leftSidebarWidth, minWidth: 200, maxWidth: 500 }}
        >
          {/* Resize Handle */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-sage-400 transition-colors z-20 ${
              isResizingLeft ? 'bg-sage-500' : 'bg-transparent hover:bg-sage-300'
            }`}
            onMouseDown={handleLeftResizeStart}
            title="Drag to resize"
          />
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
                  className="flex-1 bg-cream-50 border border-sage-200 rounded-lg px-2 py-1 text-xs text-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-500/50"
                >
                  {HARDINESS_ZONES.map(z => (
                    <option key={z.zone} value={z.zone}>
                      {formatZoneTemp(z)}
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
              {/* Undo/Redo */}
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-lg transition-colors ${
                  canUndo
                    ? 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                    : 'bg-sage-50 text-sage-300 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-lg transition-colors ${
                  canRedo
                    ? 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                    : 'bg-sage-50 text-sage-300 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
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
          <div
            ref={canvasContainerRef}
            className="flex-1 overflow-auto bg-cream-100 p-8"
            style={{ scrollBehavior: 'auto' }}
          >
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
              className="relative mx-auto bg-gradient-to-b from-wood-200 to-wood-300 rounded-lg shadow-xl border border-wood-400"
              style={{
                width: bedDimensions.width * 12 * zoom * 4, // feet * 12 = inches * zoom * 4 pixels
                height: bedDimensions.height * 12 * zoom * 4,
                cursor: isDrawingMode ? 'crosshair' : selectedPlant ? 'crosshair' : 'default',
                overflow: 'hidden', // Clip all content to canvas bounds - prevents blur artifacts
                isolation: 'isolate' // Create new stacking context to contain blurs
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
              {showBedLabels && (
                <>
                  {/* BACK Label - Always at top (house/fence side) */}
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg pointer-events-none"
                    style={{ backgroundColor: '#795548' }}
                  >
                    <span>🏠</span>
                    <span>BACK</span>
                  </div>

                  {/* FRONT Label - Always at bottom (viewing side) */}
                  <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg pointer-events-none"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    <span>👁️</span>
                    <span>FRONT</span>
                  </div>

                  {/* Left side indicator */}
                  <div
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg pointer-events-none"
                    style={{ backgroundColor: '#607D8B' }}
                  >
                    <span>◀</span>
                  </div>

                  {/* Right side indicator */}
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg pointer-events-none"
                    style={{ backgroundColor: '#607D8B' }}
                  >
                    <span>▶</span>
                  </div>

                  {/* Edge Color Bars - subtle border indicators */}
                  <div className="absolute top-0 left-8 right-8 h-1 rounded-full pointer-events-none bg-amber-700/60" />
                  <div className="absolute bottom-0 left-8 right-8 h-1 rounded-full pointer-events-none bg-green-600/60" />
                  <div className="absolute left-0 top-8 bottom-8 w-1 rounded-full pointer-events-none bg-gray-500/40" />
                  <div className="absolute right-0 top-8 bottom-8 w-1 rounded-full pointer-events-none bg-gray-500/40" />
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
                const isMultiSelected = multiSelectedPlants.includes(plant.id);
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
                      } hover:brightness-110 transition-all outline-none`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: iconPixels,
                        height: iconPixels,
                        backgroundColor: plantData?.color || '#4CAF50',
                        boxShadow: `0 4px 12px ${plantData?.color}40`
                      }}
                      tabIndex={-1}
                      onClick={(e) => handlePlantClick(e, plant)}
                      onMouseDown={(e) => handleDragStart(e, plant)}
                    >
                      <span style={{ fontSize: iconPixels * 0.5 }}>{plantData?.icon}</span>
                    </div>

                    {/* Multi-selection ring (purple) */}
                    {isMultiSelected && (
                      <div className="absolute inset-0 rounded-full ring-4 ring-purple-500 ring-opacity-70" />
                    )}

                    {/* Selection ring - now shows size info */}
                    {isSelected && (() => {
                      // Smart label positioning - keep visible within canvas bounds
                      const canvasWidth = bedDimensions.width * 12 * zoom * 4;
                      const canvasHeight = bedDimensions.height * 12 * zoom * 4;
                      const plantX = plant.x * zoom * 4;
                      const plantY = plant.y * zoom * 4;

                      // Position label below if near top edge, above otherwise
                      const nearTop = plantY < 80;
                      const nearBottom = plantY > canvasHeight - 80;
                      const nearLeft = plantX < 120;
                      const nearRight = plantX > canvasWidth - 120;

                      // Vertical position
                      const verticalClass = nearTop ? 'top-full mt-2' : '-top-8';

                      // Horizontal position - shift left/right if near edges
                      let horizontalClass = 'left-1/2 -translate-x-1/2';
                      if (nearLeft) horizontalClass = 'left-0';
                      else if (nearRight) horizontalClass = 'right-0';

                      return (
                        <>
                          <div className="absolute inset-0 rounded-full ring-4 ring-sage-500 ring-opacity-50" />
                          <div className={`absolute ${verticalClass} ${horizontalClass} bg-sage-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 shadow-lg`}>
                            {plantData?.name} {plant.size && `(${plant.size})`} - {Math.round(matureSpread)}" spread
                          </div>
                        </>
                      );
                    })()}
                  </div>
                );
              })}

              {/* Multi-Select Floating Toolbar */}
              {multiSelectedPlants.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-sage-200 p-3 z-50 flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-lg">
                    <span className="text-purple-700 font-bold">{multiSelectedPlants.length}</span>
                    <span className="text-purple-600 text-sm">selected</span>
                  </div>

                  {/* Select All of Type Button */}
                  {multiSelectedPlants.length === 1 && (() => {
                    const selectedPlant = placedPlants.find(p => p.id === multiSelectedPlants[0]);
                    const plantData = selectedPlant ? ALL_PLANTS.find(p => p.id === selectedPlant.plantId) : null;
                    const sameTypeCount = placedPlants.filter(p => p.plantId === selectedPlant?.plantId).length;

                    return sameTypeCount > 1 ? (
                      <button
                        onClick={() => selectAllOfType(selectedPlant.plantId)}
                        className="flex items-center gap-1 px-3 py-2 bg-sage-100 hover:bg-sage-200 rounded-lg text-sm text-sage-700 transition-colors"
                        title={`Select all ${sameTypeCount} ${plantData?.name || 'plants'}`}
                      >
                        <Layers className="w-4 h-4" />
                        Select All {sameTypeCount} {plantData?.name}
                      </button>
                    ) : null;
                  })()}

                  {/* Swap Button */}
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="flex items-center gap-1 px-3 py-2 bg-forest-500 hover:bg-forest-600 rounded-lg text-sm text-white transition-colors"
                    title="Swap selected plants"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Swap Plants
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={deleteMultiSelected}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm text-white transition-colors"
                    title="Delete selected plants"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>

                  {/* Clear Selection */}
                  <button
                    onClick={clearMultiSelect}
                    className="flex items-center gap-1 px-2 py-2 hover:bg-sage-100 rounded-lg text-sm text-sage-500 transition-colors"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Empty State - only show when no plants AND no custom bed drawn */}
              {placedPlants.length === 0 && !(bedType === 'custom' && customBedPath.length > 2) && (
                <div className="absolute inset-0 flex items-center justify-center text-sage-500">
                  <div className="text-center">
                    <Flower2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Select a plant or bundle to begin</p>
                    <p className="text-sm mt-2">Click on the canvas to place plants</p>
                  </div>
                </div>
              )}

              {/* Watermark Overlay - for Demo and Basic tiers */}
              {demoMode.hasWatermark && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                  {/* Diagonal watermark pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-sage-900/10 font-bold text-4xl whitespace-nowrap select-none"
                      style={{
                        transform: 'rotate(-30deg) scale(1.5)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      IMAGINE DESIGN
                    </div>
                  </div>
                  {/* Corner watermark */}
                  <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Flower2 className="w-4 h-4 text-sage-500" />
                      <span className="text-xs font-medium text-sage-600">
                        {demoMode.isBasicMode ? 'Basic' : 'Demo'} - imaginelandscape.design
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Quality Rules & Stats */}
        <aside
          className="border-l border-sage-200 bg-white h-[calc(100vh-73px)] overflow-y-auto relative"
          style={{ width: rightSidebarWidth, minWidth: 200, maxWidth: 500 }}
        >
          {/* Resize Handle */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-sage-400 transition-colors z-20 ${
              isResizingRight ? 'bg-sage-500' : 'bg-transparent hover:bg-sage-300'
            }`}
            onMouseDown={handleRightResizeStart}
            title="Drag to resize"
          />
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

                {/* Individual Scores with Diagnostics */}
                <div className="space-y-2 text-xs">
                  {/* Coverage */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Coverage</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.coverage}%`,
                            backgroundColor: showReadyScore.scores.coverage >= 80 ? '#4CAF50' : showReadyScore.scores.coverage >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.coverage)}</div>
                    </div>
                    {showReadyScore.scores.coverage < 100 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ {Math.round(coveragePercent)}% of 95% target ({Math.round(95 - coveragePercent)}% more needed)
                      </div>
                    )}
                  </div>

                  {/* Bloom Sequence */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Bloom Sequence</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.bloomSequence}%`,
                            backgroundColor: showReadyScore.scores.bloomSequence >= 80 ? '#4CAF50' : showReadyScore.scores.bloomSequence >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.bloomSequence)}</div>
                    </div>
                    {bloomAnalysis && bloomAnalysis.interestGaps && bloomAnalysis.interestGaps.length > 0 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ Missing: {bloomAnalysis.interestGaps.map(m => m.abbr).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Height Layers */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Height Layers</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.heightLayering}%`,
                            backgroundColor: showReadyScore.scores.heightLayering >= 80 ? '#4CAF50' : showReadyScore.scores.heightLayering >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.heightLayering)}</div>
                    </div>
                    {heightAnalysis && heightAnalysis.issues && heightAnalysis.issues.length > 0 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ {heightAnalysis.issues[0]}
                      </div>
                    )}
                    {heightAnalysis && showReadyScore.scores.heightLayering < 100 && heightAnalysis.tierDiversity && (
                      <div className="ml-24 pl-2 text-[10px] text-sage-500 mt-0.5">
                        ↳ Using {heightAnalysis.tierDiversity} of {Math.min(5, Math.ceil(placedPlants.length / 3))} ideal tiers
                      </div>
                    )}
                  </div>

                  {/* Form Variety */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Form Variety</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.formVariety}%`,
                            backgroundColor: showReadyScore.scores.formVariety >= 80 ? '#4CAF50' : showReadyScore.scores.formVariety >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.formVariety)}</div>
                    </div>
                    {formAnalysis && formAnalysis.issues && formAnalysis.issues.length > 0 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ {formAnalysis.issues[0]}
                      </div>
                    )}
                    {formAnalysis && formAnalysis.formCounts && showReadyScore.scores.formVariety < 100 && (
                      <div className="ml-24 pl-2 text-[10px] text-sage-500 mt-0.5">
                        ↳ Forms: {Object.entries(formAnalysis.formCounts).map(([f, c]) => `${f}:${c}`).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Texture Mix */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Texture Mix</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.textureVariety}%`,
                            backgroundColor: showReadyScore.scores.textureVariety >= 80 ? '#4CAF50' : showReadyScore.scores.textureVariety >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.textureVariety)}</div>
                    </div>
                    {textureAnalysis && textureAnalysis.issues && textureAnalysis.issues.length > 0 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ {textureAnalysis.issues[0]}
                      </div>
                    )}
                    {textureAnalysis && textureAnalysis.textureCounts && showReadyScore.scores.textureVariety < 100 && (
                      <div className="ml-24 pl-2 text-[10px] text-sage-500 mt-0.5">
                        ↳ Textures: {Object.entries(textureAnalysis.textureCounts).map(([t, c]) => `${t}:${c}`).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Mass Planting */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Mass Planting</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.massPlanting}%`,
                            backgroundColor: showReadyScore.scores.massPlanting >= 80 ? '#4CAF50' : showReadyScore.scores.massPlanting >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.massPlanting)}</div>
                    </div>
                    {massPlantingAnalysis && massPlantingAnalysis.issues && massPlantingAnalysis.issues.length > 0 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ {massPlantingAnalysis.issues.length} plant(s) need grouping (min 3-5)
                      </div>
                    )}
                    {massPlantingAnalysis && massPlantingAnalysis.suggestions && massPlantingAnalysis.suggestions.length > 0 && (
                      <div className="ml-24 pl-2 text-[10px] text-sage-500 mt-0.5">
                        ↳ {massPlantingAnalysis.suggestions.length} even groups (odd preferred)
                      </div>
                    )}
                  </div>

                  {/* Color Harmony */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 text-sage-600">Color Harmony</div>
                      <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${showReadyScore.scores.colorHarmony}%`,
                            backgroundColor: showReadyScore.scores.colorHarmony >= 80 ? '#4CAF50' : showReadyScore.scores.colorHarmony >= 60 ? '#FFC107' : '#F44336'
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sage-700">{Math.round(showReadyScore.scores.colorHarmony)}</div>
                    </div>
                    {showReadyScore.scores.colorHarmony < 100 && (
                      <div className="ml-24 pl-2 text-[10px] text-amber-600 mt-0.5">
                        ↳ Clashing colors detected
                      </div>
                    )}
                  </div>
                </div>

                {/* Points Lost Summary */}
                {showReadyScore.totalScore < 93 && (
                  <div className="mt-3 pt-3 border-t border-sage-200">
                    <div className="text-[10px] text-sage-600">
                      <span className="font-medium">To reach 93+:</span> Fix categories showing amber text above
                    </div>
                    <div className="text-[10px] text-sage-500 mt-1">
                      Points lost: {(() => {
                        const losses = [];
                        if (showReadyScore.scores.coverage < 100) losses.push(`Coverage -${Math.round((100 - showReadyScore.scores.coverage) * 0.2)}`);
                        if (showReadyScore.scores.bloomSequence < 100) losses.push(`Bloom -${Math.round((100 - showReadyScore.scores.bloomSequence) * 0.2)}`);
                        if (showReadyScore.scores.heightLayering < 100) losses.push(`Height -${Math.round((100 - showReadyScore.scores.heightLayering) * 0.15)}`);
                        if (showReadyScore.scores.formVariety < 100) losses.push(`Form -${Math.round((100 - showReadyScore.scores.formVariety) * 0.15)}`);
                        if (showReadyScore.scores.textureVariety < 100) losses.push(`Texture -${Math.round((100 - showReadyScore.scores.textureVariety) * 0.1)}`);
                        if (showReadyScore.scores.massPlanting < 100) losses.push(`Mass -${Math.round((100 - showReadyScore.scores.massPlanting) * 0.1)}`);
                        if (showReadyScore.scores.colorHarmony < 100) losses.push(`Color -${Math.round((100 - showReadyScore.scores.colorHarmony) * 0.1)}`);
                        return losses.join(', ') || 'None';
                      })()}
                    </div>
                  </div>
                )}
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

      {/* Plant Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] border border-sage-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-sage-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-sage-800 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-forest-500" />
                Swap {multiSelectedPlants.length} Plants
              </h2>
              <button
                onClick={() => { setShowSwapModal(false); setSwapTargetPlant(null); }}
                className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>

            <div className="p-4">
              {/* Currently Selected Info */}
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-700 font-medium mb-2">Currently Selected:</div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedPlantTypes().map(plant => (
                    <span key={plant.id} className="px-2 py-1 bg-purple-100 rounded text-sm text-purple-800 flex items-center gap-1">
                      <span>{plant.icon}</span>
                      {plant.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400" />
                  <input
                    type="text"
                    placeholder="Search plants to swap to..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-forest-200 focus:border-forest-400"
                  />
                </div>
              </div>

              {/* Plant Options Grid */}
              <div className="max-h-[40vh] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_PLANTS
                    .filter(plant => {
                      // Zone compatibility check
                      if (plant.zones && !plant.zones.includes(selectedZone)) return false;
                      // Search filter
                      if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                      return true;
                    })
                    .slice(0, 50) // Limit for performance
                    .map(plant => (
                      <button
                        key={plant.id}
                        onClick={() => swapSelectedPlants(plant.id)}
                        className={`p-3 rounded-lg border text-left hover:border-forest-400 hover:bg-forest-50 transition-all ${
                          swapTargetPlant === plant.id
                            ? 'border-forest-500 bg-forest-50'
                            : 'border-sage-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{plant.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sage-800 text-sm truncate">{plant.name}</div>
                            <div className="text-xs text-sage-500">{plant.height} • {plant.category}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Hint */}
              <div className="mt-4 text-xs text-sage-500 text-center">
                Click a plant to swap all {multiSelectedPlants.length} selected plants to that variety
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Re-Bundle Warning Modal (Basic tier - 12+ plants) */}
      {demoMode.showReBundleWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 overflow-hidden">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900">Re-Bundle Notice</h3>
                  <p className="text-sm text-amber-700">Important information</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sage-700 mb-4">
                You now have <span className="font-bold text-sage-900">12+ plants</span> in your design.
              </p>
              <p className="text-sage-600 mb-4">
                From this point forward, if you <span className="font-semibold">clear the canvas</span> or{' '}
                <span className="font-semibold">apply a different bundle</span>, it will use your{' '}
                <span className="font-bold text-amber-600">1 re-bundle swap</span> for this project.
              </p>
              <div className="bg-sage-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-sage-600">
                  <span className="font-medium">Tip:</span> Make sure you're happy with your bundle choice before adding more plants!
                </p>
              </div>
              <p className="text-sm text-sage-500">
                Upgrade to <span className="font-semibold text-sage-700">Pro</span> for unlimited bundle swaps.
              </p>
            </div>
            <div className="px-6 py-4 bg-sage-50 flex gap-3">
              <button
                onClick={() => demoMode.setShowReBundleWarning(false)}
                className="flex-1 px-4 py-2.5 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors"
              >
                Got it, continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
