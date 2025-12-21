import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Trees, Shrub, Leaf, LayoutGrid, ZoomIn, ZoomOut,
  RotateCcw, Download, Upload, Eye, Palette, Ruler, Check,
  X, ChevronRight, ChevronDown, ChevronUp, Search, Package, Sparkles,
  Layers, Settings, Info, Move, Trash2, Copy, FlipHorizontal,
  Sun, CloudRain, Thermometer, Star, Crown, CircleDot, Home,
  PenTool, Square
} from 'lucide-react';

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

  // Hardiness zone filter
  const [selectedZone, setSelectedZone] = useState(7); // Default to Zone 7

  // Size variant selection - tracks selected size for each plant that has multiple sizes
  const [plantSizeSelections, setPlantSizeSelections] = useState({});

  // Plant attribute filters
  const [sunFilter, setSunFilter] = useState('all'); // 'all', 'Full Sun', 'Part Shade', 'Shade', 'Full-Part Sun'
  const [waterFilter, setWaterFilter] = useState('all'); // 'all', 'Low', 'Moderate', 'High'
  const [colorFilter, setColorFilter] = useState('all'); // 'all' or specific hex color
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
  const checkCollision = (x, y, plantId, existingPlants) => {
    const newPlantSize = getPlantSizes(plantId).matureSpread / 2;

    for (const existing of existingPlants) {
      const existingSize = getPlantSizes(existing.plantId).matureSpread / 2;
      const minDistance = newPlantSize + existingSize + 6; // 6 inch buffer
      const distance = Math.sqrt(Math.pow(x - existing.x, 2) + Math.pow(y - existing.y, 2));
      if (distance < minDistance) return true;
    }
    return false;
  };

  // Find valid position using spiral search - respects custom bed shape
  const findValidPositionInBed = (targetX, targetY, plantId, existingPlants, bedBounds, customPath) => {
    const plantSize = getPlantSizes(plantId).matureSpread / 2;
    const padding = plantSize + 6;

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
  const generateValidGridPoints = (bedBounds, customPath, gridSpacing = 30) => {
    const validPoints = [];
    const padding = 15;

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

          validPoints.push({ x, y, distFromCenter: normalizedDist });
        }
      }
    }

    return validPoints;
  };

  // Apply bed bundle with smart placement that fills the entire bed shape
  const applyBundle = (bundle) => {
    const newPlants = [];

    // Determine bed bounds - use custom path if available, otherwise rectangle
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

    // For custom beds, generate a grid of all valid planting points
    const validPoints = useCustomPath
      ? generateValidGridPoints(bedBounds, customBedPath, 25)
      : generateValidGridPoints(bedBounds, null, 25);

    // Sort points into zones by distance from center
    const centerPoints = validPoints.filter(p => p.distFromCenter < 0.25);
    const innerPoints = validPoints.filter(p => p.distFromCenter >= 0.25 && p.distFromCenter < 0.5);
    const middlePoints = validPoints.filter(p => p.distFromCenter >= 0.5 && p.distFromCenter < 0.75);
    const outerPoints = validPoints.filter(p => p.distFromCenter >= 0.75);

    // Shuffle each zone for variety
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    shuffle(centerPoints);
    shuffle(innerPoints);
    shuffle(middlePoints);
    shuffle(outerPoints);

    // Map new role names to old role names for zone placement
    const roleMapping = {
      'hero': 'focal',
      'structure': 'back',
      'seasonal': 'middle',
      'texture': 'middle',
      'carpet': 'groundcover'
    };

    // Map roles to point zones (for custom/island beds, center = back)
    const getZonePoints = (role) => {
      // Normalize role names (new format -> old format)
      const normalizedRole = roleMapping[role] || role;

      if (useCustomPath) {
        // Island bed: focal/back in center, front/edge at perimeter
        switch (normalizedRole) {
          case 'focal': return [...centerPoints];
          case 'back': return [...centerPoints, ...innerPoints];
          case 'topiary': return [...innerPoints, ...centerPoints];
          case 'middle': return [...innerPoints, ...middlePoints];
          case 'front': return [...middlePoints, ...outerPoints];
          case 'edge': return [...outerPoints, ...middlePoints];
          case 'groundcover': return [...outerPoints, ...middlePoints, ...innerPoints];
          default: return [...middlePoints];
        }
      } else {
        // Rectangle bed: use Y position for back-to-front
        const sortByY = (points, desc = false) =>
          [...points].sort((a, b) => desc ? b.y - a.y : a.y - b.y);

        switch (normalizedRole) {
          case 'focal': return sortByY(validPoints, true).slice(0, Math.floor(validPoints.length * 0.2));
          case 'back': return sortByY(validPoints, true).slice(0, Math.floor(validPoints.length * 0.3));
          case 'topiary': return sortByY(validPoints, true).slice(0, Math.floor(validPoints.length * 0.4));
          case 'middle': return validPoints.slice(Math.floor(validPoints.length * 0.3), Math.floor(validPoints.length * 0.7));
          case 'front': return sortByY(validPoints, false).slice(0, Math.floor(validPoints.length * 0.4));
          case 'edge': return sortByY(validPoints, false).slice(0, Math.floor(validPoints.length * 0.3));
          case 'groundcover': return sortByY(validPoints, false).slice(0, Math.floor(validPoints.length * 0.4));
          default: return [...validPoints];
        }
      }
    };

    // Handle both old flat array format and new object format
    const plantsList = Array.isArray(bundle.plants)
      ? bundle.plants
      : getBundlePlants(bundle);

    // Sort bundle plants by category priority (place larger plants first)
    const sortedPlants = [...plantsList].sort((a, b) => {
      const order = ['focal', 'hero', 'back', 'structure', 'topiary', 'middle', 'seasonal', 'texture', 'front', 'edge', 'groundcover', 'carpet'];
      const roleA = roleMapping[a.role] || a.role;
      const roleB = roleMapping[b.role] || b.role;
      return order.indexOf(roleA) - order.indexOf(roleB);
    });

    // Track used points to distribute evenly
    const usedPoints = new Set();

    sortedPlants.forEach((bundlePlant, plantIndex) => {
      const plantData = ALL_PLANTS.find(p => p.id === bundlePlant.plantId);
      if (!plantData) return;

      const scaledQuantity = Math.round(bundlePlant.quantity * bundleScale);
      const zonePoints = getZonePoints(bundlePlant.role);

      for (let i = 0; i < scaledQuantity; i++) {
        // Find best available point in the zone
        let bestPoint = null;

        for (const point of zonePoints) {
          const pointKey = `${Math.round(point.x)},${Math.round(point.y)}`;
          if (usedPoints.has(pointKey)) continue;

          // Check if this point works (no collision)
          const testPos = findValidPositionInBed(
            point.x + (Math.random() - 0.5) * 15,
            point.y + (Math.random() - 0.5) * 15,
            bundlePlant.plantId,
            newPlants,
            bedBounds,
            useCustomPath ? customBedPath : null
          );

          if (testPos) {
            bestPoint = testPos;
            usedPoints.add(pointKey);
            break;
          }
        }

        // If no zone point worked, try anywhere in the bed
        if (!bestPoint) {
          for (const point of validPoints) {
            const pointKey = `${Math.round(point.x)},${Math.round(point.y)}`;
            if (usedPoints.has(pointKey)) continue;

            const testPos = findValidPositionInBed(
              point.x + (Math.random() - 0.5) * 15,
              point.y + (Math.random() - 0.5) * 15,
              bundlePlant.plantId,
              newPlants,
              bedBounds,
              useCustomPath ? customBedPath : null
            );

            if (testPos) {
              bestPoint = testPos;
              usedPoints.add(pointKey);
              break;
            }
          }
        }

        if (bestPoint) {
          newPlants.push({
            id: `bundle-${Date.now()}-${plantIndex}-${i}`,
            plantId: bundlePlant.plantId,
            x: bestPoint.x,
            y: bestPoint.y,
            rotation: (Math.random() - 0.5) * 10,
            scale: 0.95 + Math.random() * 0.1
          });
        }
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

    // Draw plants as circles with category-based colors
    placedPlants.forEach(plant => {
      const plantData = ALL_PLANTS.find(p => p.id === plant.plantId);
      if (!plantData) return;

      const spreadMatch = plantData.spread.match(/(\d+)/);
      const spread = spreadMatch ? parseInt(spreadMatch[1]) : 12;
      const radius = (spread / 2) * scale;

      // Color based on category (for sketch clarity)
      const categoryColors = {
        focal: '#2E7D32',      // Dark green for trees
        topiary: '#1B5E20',    // Darker green
        back: '#4CAF50',       // Medium green
        middle: '#81C784',     // Light green
        front: '#C8E6C9',      // Very light green
        groundcover: '#A5D6A7' // Pale green
      };

      ctx.fillStyle = categoryColors[plantData.category] || '#4CAF50';
      ctx.strokeStyle = '#000000';
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
    if (placedPlants.length === 0) {
      setGenerateError('Please add some plants to your design first.');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setSelectedSeason(season);

    try {
      // Build detailed plant inventory
      const plantDetails = {};
      placedPlants.forEach(p => {
        const plantData = ALL_PLANTS.find(pl => pl.id === p.plantId);
        if (plantData) {
          if (!plantDetails[plantData.name]) {
            plantDetails[plantData.name] = {
              count: 0,
              height: plantData.height,
              spread: plantData.spread,
              category: plantData.category,
              bloomTime: plantData.bloomTime,
              bloomColor: plantData.bloomColor || 'green foliage',
              disneyUse: plantData.disneyUse
            };
          }
          plantDetails[plantData.name].count++;
        }
      });

      // Group plants by category with detailed descriptions
      const byCategory = {
        focal: [],
        topiary: [],
        back: [],
        middle: [],
        front: [],
        groundcover: []
      };

      Object.entries(plantDetails).forEach(([name, info]) => {
        const description = `${info.count}x ${name} (${info.height} tall, ${info.bloomColor}, blooms ${info.bloomTime})`;
        byCategory[info.category]?.push(description);
      });

      // Build the detailed prompt - bedDimensions is already in feet
      const bedSizeFt = `${bedDimensions.width}ft x ${bedDimensions.height}ft`;

      // Describe the bed shape
      let bedShapeDescription = 'rectangular';
      if (bedType === 'custom' && customBedPath.length > 2) {
        // Analyze the custom path to describe the shape
        const bounds = getPathBounds(customBedPath);
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;
        const aspectRatio = width / height;
        const numPoints = customBedPath.length;

        if (numPoints <= 6) {
          bedShapeDescription = 'organic curved kidney-bean shaped';
        } else if (numPoints <= 12) {
          bedShapeDescription = 'organic free-form curved';
        } else {
          bedShapeDescription = 'natural organic curved with flowing edges';
        }

        if (aspectRatio > 2) {
          bedShapeDescription += ', elongated horizontal';
        } else if (aspectRatio < 0.5) {
          bedShapeDescription += ', elongated vertical';
        }
      }

      let promptParts = [];
      promptParts.push(`GARDEN BED SPECIFICATIONS:`);
      promptParts.push(`- Shape: ${bedShapeDescription} mulch bed`);
      promptParts.push(`- Size: ${bedSizeFt} canvas area`);
      promptParts.push(`- Total plants: ${placedPlants.length}`);
      promptParts.push(`- Coverage: ${coveragePercent.toFixed(0)}%`);
      promptParts.push('');
      promptParts.push('EXACT PLANT LIST (show these specific plants):');

      if (byCategory.focal.length) {
        promptParts.push(`FOCAL/SPECIMEN TREES (tallest, back-center): ${byCategory.focal.join('; ')}`);
      }
      if (byCategory.topiary.length) {
        promptParts.push(`TOPIARIES (sculptural, accent positions): ${byCategory.topiary.join('; ')}`);
      }
      if (byCategory.back.length) {
        promptParts.push(`BACK ROW (tall shrubs 4-8ft, along back edge): ${byCategory.back.join('; ')}`);
      }
      if (byCategory.middle.length) {
        promptParts.push(`MIDDLE ROW (medium shrubs 2-4ft): ${byCategory.middle.join('; ')}`);
      }
      if (byCategory.front.length) {
        promptParts.push(`FRONT ROW (low plants 1-2ft, along front edge): ${byCategory.front.join('; ')}`);
      }
      if (byCategory.groundcover.length) {
        promptParts.push(`GROUNDCOVER/EDGING (under 1ft, fills gaps): ${byCategory.groundcover.join('; ')}`);
      }

      const prompt = promptParts.join('\n');

      // Export canvas as sketch for ControlNet
      const sketchImage = exportCanvasAsSketch();

      console.log('Generating image with prompt:', prompt);
      console.log('Sketch image generated for ControlNet');

      const response = await fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, season, sketchImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      const plantList = Object.entries(plantDetails)
        .map(([name, info]) => `${info.count} ${name}`)
        .join(', ');

      setGeneratedImage({
        url: data.imageUrl,
        season: season,
        description: `${season.charAt(0).toUpperCase() + season.slice(1)} garden with ${plantList}`,
        plantCount: placedPlants.length,
        coverage: coveragePercent.toFixed(1),
        revisedPrompt: data.revisedPrompt
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
                              {plant.zones && ` • Zones ${Math.min(...plant.zones)}-${Math.max(...plant.zones)}`}
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
              {BED_BUNDLES.map(bundle => {
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

            {/* Design Rules Checklist */}
            <div className="bg-cream-50 rounded-xl p-4 border border-sage-200">
              <h3 className="font-bold text-sage-800 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Design Rules Check
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
    </div>
  );
}
