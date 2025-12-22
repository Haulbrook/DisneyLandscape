// ═══════════════════════════════════════════════════════════════════════════════
// RESIDENTIAL LANDSCAPE DESIGN SYSTEM
// Professional Home Landscaping Standards & Best Practices
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// YARD ZONE TYPES - Different areas have different design goals
// ═══════════════════════════════════════════════════════════════════════════════

export const YARD_ZONES = {
  FRONT_FOUNDATION: {
    id: 'front-foundation',
    name: 'Front Foundation',
    description: 'Beds against the front of the house',
    goals: ['Curb appeal', 'Frame entry', 'Soften architecture'],
    minDepth: 72, // 6 feet minimum
    idealDepth: 96, // 8 feet ideal
    maxDepth: 144, // 12 feet max
    distanceFromHouse: { min: 24, ideal: 36 }, // 2-3 feet from foundation
    heightRule: 'windowsill', // Plants shouldn't exceed windowsill height
  },
  FRONT_ISLAND: {
    id: 'front-island',
    name: 'Front Yard Island',
    description: 'Freestanding beds in front lawn',
    goals: ['Create focal point', 'Add dimension', 'Define spaces'],
    minDepth: 48,
    idealDepth: 72,
    viewFromAllSides: true,
    focalPointRequired: true,
  },
  ENTRY_PATH: {
    id: 'entry-path',
    name: 'Entry Walkway',
    description: 'Beds lining the path to front door',
    goals: ['Guide visitors', 'Create welcoming approach', 'Frame entry'],
    minWidth: 36, // Keep path clear
    plantHeightMax: 36, // Don't block sightlines
    lowMaintenance: true,
  },
  SIDE_YARD: {
    id: 'side-yard',
    name: 'Side Yard',
    description: 'Narrow areas between houses',
    goals: ['Privacy screening', 'Utility concealment', 'Transition zone'],
    narrowSpaceRules: true,
    privacyPriority: true,
    utilityAccess: true, // Leave room for AC units, meters
  },
  BACKYARD_BORDER: {
    id: 'backyard-border',
    name: 'Backyard Border',
    description: 'Perimeter beds in backyard',
    goals: ['Privacy', 'Enclose space', 'Create rooms'],
    minDepth: 72,
    idealDepth: 144, // 12 feet for full layering
    privacyScreening: true,
  },
  PATIO_SURROUND: {
    id: 'patio-surround',
    name: 'Patio Surround',
    description: 'Beds around outdoor living spaces',
    goals: ['Frame views', 'Privacy', 'Seasonal interest'],
    fragrantPlantsBonus: true,
    nightInterest: true, // Consider lighting/white flowers
    lowAllergen: true,
  },
  PRIVACY_SCREEN: {
    id: 'privacy-screen',
    name: 'Privacy Screen',
    description: 'Dedicated screening planting',
    goals: ['Block views', 'Reduce noise', 'Create enclosure'],
    staggeredPlanting: true,
    evergreenPreferred: true,
    minHeight: 72, // 6 feet minimum at maturity
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FOUNDATION PLANTING RULES - Critical distances and proportions
// ═══════════════════════════════════════════════════════════════════════════════

export const FOUNDATION_RULES = {
  // Distance from house foundation by plant type
  DISTANCE_FROM_HOUSE: {
    groundcover: { min: 12, ideal: 18 },      // 1-1.5 feet
    smallShrub: { min: 24, ideal: 30 },       // 2-2.5 feet
    mediumShrub: { min: 36, ideal: 42 },      // 3-3.5 feet
    largeShrub: { min: 48, ideal: 60 },       // 4-5 feet
    smallTree: { min: 120, ideal: 180 },      // 10-15 feet
    largeTree: { min: 180, ideal: 240 },      // 15-20 feet
  },

  // Distance from utilities
  DISTANCE_FROM_AC_UNIT: 24,      // 2 feet minimum
  DISTANCE_FROM_METERS: 36,       // 3 feet for access
  DISTANCE_FROM_WINDOWS: 12,      // Keep 1 foot clearance
  DISTANCE_FROM_DRYER_VENT: 36,   // 3 feet minimum

  // Height rules relative to house
  HEIGHT_RULES: {
    underWindow: 'windowsillMinus6', // 6 inches below windowsill
    cornerAccent: 'soffit50',         // 50% of distance to soffit
    entryFrame: 'roofline75',         // 75% of roofline height
  },

  // Maintenance access
  MAINTENANCE_CLEARANCE: 36, // 3 feet behind plants for access
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURE EDGE RULES - What CAN'T go against houses/buildings
// ═══════════════════════════════════════════════════════════════════════════════

export const STRUCTURE_EDGE_RULES = {
  // Edge types that indicate a structure (house, building, fence)
  STRUCTURE_EDGES: ['back', 'entry'],

  // Maximum mature height for plants directly against structure (in inches)
  MAX_HEIGHT_AGAINST_STRUCTURE: 96, // 8 feet max

  // Maximum mature spread for plants against structure
  MAX_SPREAD_AGAINST_STRUCTURE: 72, // 6 feet max

  // Trees that are NEVER okay against structures (too large, invasive roots)
  PROHIBITED_NEAR_STRUCTURE: [
    'magnolia-southern',    // Gets 60-80ft, massive roots
    'oak-willow',           // Huge canopy
    'oak-red',              // Large tree
    'maple-red',            // Large, surface roots
    'tulip-poplar',         // Very tall
    'sweetgum',             // Large, spiky balls
    'pine-loblolly',        // Gets very tall
    'cedar-deodar',         // Wide spreading
  ],

  // Plants that ARE okay against structures (narrow, columnar, or prunable)
  FOUNDATION_SAFE_PLANTS: [
    // Columnar/Narrow forms - won't hit the house
    'japanese-maple-bloodgood',   // Can be pruned, stays compact
    'japanese-maple-crimson-queen', // Weeping, manageable
    'crape-myrtle-natchez',       // Can be limbed up
    'arborvitae-emerald-green',   // Columnar, tight
    'holly-sky-pencil',           // Very narrow columnar
    'juniper-skyrocket',          // Columnar
    'cypress-italian',            // Columnar
    // Dwarf varieties
    'japanese-maple-dwarf',       // Stays small
    'hydrangea-little-lime',      // Compact
    'loropetalum-purple-pixie',   // Dwarf
    'boxwood-wintergreen',        // Can be shaped
    'holly-soft-touch',           // Compact
    'yaupon-holly-dwarf',         // Dwarf
    'spirea-little-princess',     // Compact
    'azalea-encore-autumn-carnation', // Medium, prunable
  ],

  // Minimum distance from structure by plant mature height
  getMinDistanceFromStructure: (matureHeightInches) => {
    if (matureHeightInches <= 24) return 12;   // Small shrubs: 1ft
    if (matureHeightInches <= 48) return 24;   // Medium shrubs: 2ft
    if (matureHeightInches <= 72) return 36;   // Large shrubs: 3ft
    if (matureHeightInches <= 120) return 60;  // Small trees: 5ft
    return 120; // Large trees: 10ft minimum
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CANOPY RESTRICTIONS - Trees can't overhang structures
// ═══════════════════════════════════════════════════════════════════════════════

export const CANOPY_RULES = {
  // Edges where tree canopy cannot extend over
  NO_CANOPY_EDGES: ['back', 'entry'],

  // Calculate if a tree's canopy would hit the structure edge
  wouldCanopyHitStructure: (treeX, treeY, matureSpread, bedWidth, bedHeight, orientation) => {
    const canopyRadius = matureSpread / 2;
    const issues = [];

    // Check each edge
    if (orientation.top === 'back' || orientation.top === 'entry') {
      if (treeY - canopyRadius < 0) {
        issues.push('Tree canopy would overhang structure at top edge');
      }
    }
    if (orientation.bottom === 'back' || orientation.bottom === 'entry') {
      if (treeY + canopyRadius > bedHeight) {
        issues.push('Tree canopy would overhang structure at bottom edge');
      }
    }
    if (orientation.left === 'back' || orientation.left === 'entry') {
      if (treeX - canopyRadius < 0) {
        issues.push('Tree canopy would overhang structure at left edge');
      }
    }
    if (orientation.right === 'back' || orientation.right === 'entry') {
      if (treeX + canopyRadius > bedWidth) {
        issues.push('Tree canopy would overhang structure at right edge');
      }
    }

    return { valid: issues.length === 0, issues };
  },

  // Get safe planting zone for trees (away from structure edges)
  getSafeTreeZone: (bedWidth, bedHeight, orientation, canopyRadius) => {
    let minX = 0, maxX = bedWidth, minY = 0, maxY = bedHeight;

    if (orientation.top === 'back' || orientation.top === 'entry') {
      minY = canopyRadius;
    }
    if (orientation.bottom === 'back' || orientation.bottom === 'entry') {
      maxY = bedHeight - canopyRadius;
    }
    if (orientation.left === 'back' || orientation.left === 'entry') {
      minX = canopyRadius;
    }
    if (orientation.right === 'back' || orientation.right === 'entry') {
      maxX = bedWidth - canopyRadius;
    }

    return { minX, maxX, minY, maxY };
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SMALL BED PREFERENCES - Favor dwarf/compact plants for smaller beds
// ═══════════════════════════════════════════════════════════════════════════════

export const SMALL_BED_RULES = {
  // Beds under this size (sq ft) should prefer smaller plants
  SMALL_BED_THRESHOLD: 100,
  MEDIUM_BED_THRESHOLD: 200,

  // Preferred plants for small residential beds (under 100 sq ft)
  SMALL_BED_FAVORITES: [
    // Dwarf shrubs
    'loropetalum-purple-pixie',
    'hydrangea-little-lime',
    'boxwood-baby-gem',
    'spirea-little-princess',
    'yaupon-holly-dwarf',
    'azalea-bloom-a-thon',
    'gardenia-frost-proof-dwarf',
    'abelia-kaleidoscope',
    // Compact perennials
    'heuchera-palace-purple',
    'hosta-blue-mouse-ears',
    'astilbe-pumila',
    'sedum-angelina',
    'creeping-phlox',
    'liriope-big-blue',
    // Dwarf grasses
    'blue-fescue',
    'carex-everillo',
    'mondo-grass',
    'dwarf-fountain-grass',
    // Compact conifers
    'arborvitae-tater-tot',
    'spruce-dwarf-alberta',
    'juniper-blue-star',
    'pine-mugo-dwarf',
  ],

  // Dwarf trees suitable for small beds
  SMALL_BED_TREES: [
    'japanese-maple-dwarf',
    'japanese-maple-crimson-queen',
    'crape-myrtle-dwarf',
    'redbud-dwarf',
    'magnolia-little-gem',
    'dogwood-kousa-dwarf',
  ],

  // Max heights by bed size
  getMaxPlantHeight: (bedAreaSqFt) => {
    if (bedAreaSqFt < 50) return 36;   // 3ft max for tiny beds
    if (bedAreaSqFt < 100) return 60;  // 5ft max for small beds
    if (bedAreaSqFt < 200) return 96;  // 8ft max for medium beds
    return 180; // 15ft for large beds
  },

  // Recommended max spread by bed size
  getMaxPlantSpread: (bedAreaSqFt) => {
    if (bedAreaSqFt < 50) return 24;   // 2ft spread max
    if (bedAreaSqFt < 100) return 48;  // 4ft spread max
    if (bedAreaSqFt < 200) return 72;  // 6ft spread max
    return 120; // 10ft for large beds
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BED DEPTH & LAYERING GUIDELINES
// ═══════════════════════════════════════════════════════════════════════════════

export const BED_DEPTH_RULES = {
  // Minimum bed depths for proper layering
  SHALLOW: {
    depth: 36,  // 3 feet
    layers: 2,
    maxPlantHeight: 24,
    description: 'Ground cover + small shrubs only',
  },
  STANDARD: {
    depth: 72,  // 6 feet
    layers: 3,
    maxPlantHeight: 48,
    description: 'Full three-layer planting possible',
    backRow: { height: '36-48in', depth: 24 },
    middleRow: { height: '18-36in', depth: 24 },
    frontRow: { height: '6-18in', depth: 24 },
  },
  DEEP: {
    depth: 96,  // 8 feet
    layers: 4,
    maxPlantHeight: 72,
    description: 'Allows small ornamental trees',
    backRow: { height: '48-72in', depth: 30 },
    middleBackRow: { height: '30-48in', depth: 24 },
    middleFrontRow: { height: '18-30in', depth: 24 },
    frontRow: { height: '6-18in', depth: 18 },
  },
  EXTRA_DEEP: {
    depth: 144, // 12 feet
    layers: 5,
    maxPlantHeight: 120,
    description: 'Full privacy screening with trees',
    canopyLayer: { height: '8ft+', depth: 48 },
    understoryLayer: { height: '4-8ft', depth: 30 },
    shrubLayer: { height: '2-4ft', depth: 30 },
    perennialLayer: { height: '1-2ft', depth: 24 },
    groundcoverLayer: { height: '0-12in', depth: 12 },
  },
};

// Rule of thirds for vertical layering
export const VERTICAL_LAYER_RULE = {
  description: 'Each layer should be ~1/3 the height of the layer behind it',
  calculate: (tallestHeight) => ({
    background: tallestHeight,
    midground: Math.round(tallestHeight * 0.33),
    foreground: Math.round(tallestHeight * 0.33 * 0.33),
  }),
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANT SPACING FORMULAS - Residential standards
// ═══════════════════════════════════════════════════════════════════════════════

export const SPACING_FORMULAS = {
  // Standard spacing: half of combined mature widths
  calculateSpacing: (spread1, spread2) => {
    return (spread1 / 2) + (spread2 / 2);
  },

  // Hedge spacing: tighter for dense screen
  calculateHedgeSpacing: (matureWidth) => {
    return matureWidth * 0.5; // 50% of mature width
  },

  // Mass planting: allows some overlap
  calculateMassSpacing: (matureWidth) => {
    return matureWidth * 0.75; // 75% of mature width
  },

  // Privacy screen: staggered double row
  calculatePrivacySpacing: (matureWidth) => ({
    withinRow: matureWidth * 0.6,
    betweenRows: matureWidth * 0.5,
    staggerOffset: matureWidth * 0.3, // Offset for zig-zag pattern
  }),

  // Foundation spacing from house
  calculateFoundationSetback: (matureWidth, matureHeight) => {
    const halfWidth = matureWidth / 2;
    const maintenanceBuffer = 36; // 3 feet for access
    return Math.max(halfWidth + maintenanceBuffer, matureHeight > 72 ? 60 : 36);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CURB APPEAL RULES - Front yard design principles
// ═══════════════════════════════════════════════════════════════════════════════

export const CURB_APPEAL_RULES = {
  // Entry should be focal point
  ENTRY_FOCUS: {
    rule: 'Front door should be the primary focal point',
    specimenLimit: 1, // Only one specimen tree in front
    specimenPosition: 'nearEntry', // Specimen should lead eye to door
  },

  // Scale to house
  SCALE_RULES: {
    singleStory: {
      maxTreeHeight: 25, // feet
      maxShrubHeight: 4, // feet near foundation
      cornerPlantHeight: '60-75% of eave height',
    },
    twoStory: {
      maxTreeHeight: 40,
      maxShrubHeight: 6,
      cornerPlantHeight: '50-60% of eave height',
    },
    largeHome: {
      minBedDepth: 96, // 8 feet
      avoidDwarfVarieties: true,
    },
    smallHome: {
      maxBedDepth: 72, // 6 feet
      useDwarfVarieties: true,
      avoidLargeShrubs: true,
    },
  },

  // Color guidelines
  COLOR_RULES: {
    entryAccent: 'Use brightest colors near entry',
    coolColors: 'Use blues/purples to make space feel larger',
    warmColors: 'Use reds/oranges to draw attention',
    whiteFlowers: 'Visible at dusk, extends enjoyment time',
  },

  // Seasonal interest
  FOUR_SEASON_INTEREST: {
    spring: ['flowering trees', 'bulbs', 'early perennials'],
    summer: ['perennial blooms', 'annuals', 'foliage color'],
    fall: ['fall foliage', 'ornamental grasses', 'berries'],
    winter: ['evergreen structure', 'bark interest', 'berries'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIVACY SCREENING RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const PRIVACY_SCREENING_RULES = {
  // Staggered planting for faster coverage
  STAGGERED_PATTERN: {
    description: 'Plant in zig-zag pattern for denser screen',
    rowOffset: 0.5, // Offset second row by 50% of spacing
    minRows: 2,
    idealRows: 3,
  },

  // Layered privacy
  LAYERED_SCREEN: {
    description: 'Multiple heights for complete privacy',
    layers: [
      { name: 'canopy', height: '15-25ft', purpose: 'overhead screening' },
      { name: 'screen', height: '8-15ft', purpose: 'eye-level privacy' },
      { name: 'understory', height: '4-8ft', purpose: 'fill gaps' },
      { name: 'base', height: '1-4ft', purpose: 'ground level density' },
    ],
  },

  // Placement strategy
  PLACEMENT: {
    closeToViewer: 'More effective than at property line',
    distanceFromPatio: 10, // feet - creates intimate space
    distanceFromPropertyLine: 24, // inches minimum setback
  },

  // Plant selection priorities
  PLANT_PRIORITIES: {
    evergreen: 0.6, // 60% evergreen for year-round privacy
    deciduous: 0.4, // 40% deciduous for seasonal interest
    fastGrowing: ['arborvitae', 'privet', 'leyland cypress'],
    lowMaintenance: ['holly', 'boxwood', 'viburnum'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN PRINCIPLES - Residential specific
// ═══════════════════════════════════════════════════════════════════════════════

export const RESIDENTIAL_DESIGN_PRINCIPLES = {
  // Rule of Threes
  ODD_NUMBERS: {
    rule: 'Plant in groups of 3, 5, or 7 for natural appearance',
    exception: 'Single specimens for focal points',
    evenNumbersOK: 'Only for formal/symmetrical designs',
  },

  // Repetition creates unity
  REPETITION: {
    rule: 'Repeat key plants at least 3 times in the design',
    drifts: 'Use "drifts" of same plant for impact',
    colorEcho: 'Echo colors throughout the landscape',
  },

  // Balance
  BALANCE: {
    symmetrical: 'Formal designs - mirror both sides',
    asymmetrical: 'Informal designs - equal visual weight',
    radial: 'Island beds - balance from center outward',
  },

  // Unity
  UNITY: {
    limitVariety: 'Max 3-5 different plant species per 100 sq ft',
    colorScheme: 'Stick to 2-3 main colors plus green',
    formConsistency: 'Use consistent plant forms within a bed',
  },

  // Flow
  FLOW: {
    curves: 'Curved bed edges feel more natural',
    transitions: 'Beds should flow into each other',
    avoidIsolation: 'Avoid random, disconnected plantings',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESIDENTIAL PLACEMENT ALGORITHM HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

// Calculate appropriate bed depth based on available space and goals
export const calculateIdealBedDepth = (availableSpace, zoneType, goals = []) => {
  const zone = YARD_ZONES[zoneType] || YARD_ZONES.BACKYARD_BORDER;

  let idealDepth = zone.idealDepth || 72;

  // Adjust for goals
  if (goals.includes('privacy')) idealDepth = Math.max(idealDepth, 96);
  if (goals.includes('screening')) idealDepth = Math.max(idealDepth, 144);
  if (goals.includes('lowMaintenance')) idealDepth = Math.min(idealDepth, 72);

  // Don't exceed available space
  return Math.min(idealDepth, availableSpace);
};

// Determine number of layers based on bed depth
export const calculateLayerCount = (bedDepth) => {
  if (bedDepth < 36) return 1;
  if (bedDepth < 72) return 2;
  if (bedDepth < 96) return 3;
  if (bedDepth < 144) return 4;
  return 5;
};

// Get layer depths for a bed
export const calculateLayerDepths = (bedDepth, layerCount) => {
  const layers = [];
  const baseDepth = bedDepth / layerCount;

  // Back layers get slightly more depth
  for (let i = 0; i < layerCount; i++) {
    const isBack = i < layerCount / 2;
    const depth = isBack ? baseDepth * 1.2 : baseDepth * 0.9;
    layers.push({
      index: i,
      name: i === 0 ? 'back' : i === layerCount - 1 ? 'front' : `middle-${i}`,
      depth: Math.round(depth),
      startOffset: layers.reduce((sum, l) => sum + l.depth, 0),
    });
  }

  return layers;
};

// Calculate plant quantity based on bed size and plant spacing
export const calculatePlantQuantity = (bedArea, plantSpread, role) => {
  const spreadInches = plantSpread;
  const plantArea = Math.PI * Math.pow(spreadInches / 2, 2);

  // Adjust coverage target by role
  let coverageMultiplier = 1.0;
  if (role === 'groundcover') coverageMultiplier = 1.2; // Slight overlap OK
  if (role === 'hedge') coverageMultiplier = 1.3; // More overlap for density
  if (role === 'specimen') coverageMultiplier = 0.5; // More space around

  const quantity = Math.ceil((bedArea / plantArea) * coverageMultiplier);

  // Apply rule of odds (adjust to nearest odd number for small quantities)
  if (quantity <= 9 && quantity % 2 === 0) {
    return quantity + 1;
  }

  return quantity;
};

// Validate residential placement
export const validateResidentialPlacement = (plant, position, bedBounds, zoneType, existingPlants) => {
  const issues = [];
  const zone = YARD_ZONES[zoneType];

  // Check distance from house (if foundation bed)
  if (zoneType === 'FRONT_FOUNDATION' && position.distanceFromHouse) {
    const rule = FOUNDATION_RULES.DISTANCE_FROM_HOUSE;
    const plantCategory = plant.heightInches > 72 ? 'largeShrub' :
                          plant.heightInches > 48 ? 'mediumShrub' :
                          plant.heightInches > 24 ? 'smallShrub' : 'groundcover';

    if (position.distanceFromHouse < rule[plantCategory].min) {
      issues.push(`${plant.name} too close to house. Minimum ${rule[plantCategory].min / 12}ft required.`);
    }
  }

  // Check plant height relative to windows
  if (zone?.heightRule === 'windowsill' && position.nearWindow) {
    if (plant.heightInches > position.windowsillHeight - 6) {
      issues.push(`${plant.name} will grow above windowsill. Choose shorter variety.`);
    }
  }

  // Check spacing from other plants
  existingPlants.forEach(existing => {
    const idealSpacing = SPACING_FORMULAS.calculateSpacing(
      plant.spreadInches || 24,
      existing.spreadInches || 24
    );
    const actualDistance = Math.sqrt(
      Math.pow(position.x - existing.x, 2) +
      Math.pow(position.y - existing.y, 2)
    );

    if (actualDistance < idealSpacing * 0.7) {
      issues.push(`${plant.name} too close to ${existing.name}. Plants will crowd.`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESIDENTIAL BUNDLES - Pre-designed home landscape packages with actual plants
// ═══════════════════════════════════════════════════════════════════════════════

export const RESIDENTIAL_BUNDLES = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. COMPACT FOUNDATION - Small bed favorite with dwarf plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'compact-foundation',
    name: 'Compact Foundation',
    subtitle: 'Dwarf Varieties for Small Spaces',
    description: 'Perfect for smaller foundation beds. Uses dwarf and compact varieties that stay proportional without constant pruning.',
    theme: 'Small Space Design',
    preview: '🏡',
    colorScheme: ['#7B1FA2', '#4CAF50', '#FFC107', '#E8F5E9'],
    baseSize: '60 sq ft',
    defaultZone: 7,
    isResidential: true,
    yardZone: 'FRONT_FOUNDATION',
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-crimson-queen', quantity: 1, role: 'hero', note: 'Weeping form, stays compact 6-8ft' }
      ],
      structure: [
        { plantId: 'loropetalum-purple-pixie', quantity: 3, role: 'structure', note: 'Purple foliage, 2-3ft' },
        { plantId: 'hydrangea-little-lime', quantity: 3, role: 'structure', note: 'Compact 3-5ft' },
        { plantId: 'boxwood-baby-gem', quantity: 5, role: 'structure', note: 'Tiny boxwood 2-3ft' }
      ],
      seasonal: [
        { plantId: 'azalea-bloom-a-thon', quantity: 3, role: 'seasonal', note: 'Reblooming, compact' },
        { plantId: 'gardenia-frost-proof-dwarf', quantity: 2, role: 'seasonal', note: 'Fragrant, 3ft' }
      ],
      texture: [
        { plantId: 'carex-everillo', quantity: 5, role: 'texture', note: 'Lime green sedge' },
        { plantId: 'heuchera-palace-purple', quantity: 5, role: 'texture', note: 'Purple foliage echo' }
      ],
      carpet: [
        { plantId: 'mondo-grass-dwarf', quantity: 1, role: 'carpet', note: 'Fine texture edge' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet', note: 'Gold groundcover' }
      ]
    },
    finishNotes: 'Ideal for beds 3-6ft deep. No large trees that will overwhelm the space.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. EVERGREEN TAPESTRY - All-season structure focus
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'evergreen-tapestry',
    name: 'Evergreen Tapestry',
    subtitle: 'Year-Round Green Architecture',
    description: 'A sophisticated mix of evergreen textures and forms. Minimal seasonal change but maximum winter interest.',
    theme: 'Evergreen Focus',
    preview: '🌲',
    colorScheme: ['#1B5E20', '#2E7D32', '#4A5568', '#90A4AE'],
    baseSize: '120 sq ft',
    defaultZone: 7,
    isResidential: true,
    yardZone: 'PRIVACY_SCREEN',
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'arborvitae-emerald-green', quantity: 3, role: 'hero', note: 'Columnar 12-15ft, tight to structure OK' },
        { plantId: 'holly-sky-pencil', quantity: 2, role: 'hero', note: 'Vertical accent 8-10ft' }
      ],
      structure: [
        { plantId: 'cleyera', quantity: 3, role: 'structure', note: 'Broad leaf contrast' },
        { plantId: 'osmanthus-goshiki', quantity: 3, role: 'structure', note: 'Variegated holly-like' },
        { plantId: 'podocarpus-maki', quantity: 2, role: 'structure', note: 'Upright, fine texture' }
      ],
      seasonal: [
        { plantId: 'camellia-japonica', quantity: 3, role: 'seasonal', note: 'Winter blooms' },
        { plantId: 'nandina-firepower', quantity: 5, role: 'seasonal', note: 'Red winter color' }
      ],
      texture: [
        { plantId: 'juniper-blue-star', quantity: 5, role: 'texture', note: 'Silver-blue mound' },
        { plantId: 'pine-mugo-dwarf', quantity: 3, role: 'texture', note: 'Dwarf pine texture' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 2, role: 'carpet', note: 'Shade tolerant' }
      ]
    },
    finishNotes: 'This bed looks the same January through December. Great for formal settings.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. SOUTHERN CHARM - Traditional Southern cottage
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'southern-charm',
    name: 'Southern Charm',
    subtitle: 'Classic Southern Cottage',
    description: 'Old-fashioned favorites your grandmother would love. Fragrance, flowers, and Southern hospitality.',
    theme: 'Southern Traditional',
    preview: '🌺',
    colorScheme: ['#E91E63', '#FFFFFF', '#4CAF50', '#FFB6C1'],
    baseSize: '100 sq ft',
    defaultZone: 8,
    isResidential: true,
    yardZone: 'FRONT_FOUNDATION',
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-tuscarora', quantity: 1, role: 'hero', note: 'Coral pink, 15-20ft - keep away from house' }
      ],
      structure: [
        { plantId: 'gardenia-august-beauty', quantity: 3, role: 'structure', note: 'Intensely fragrant' },
        { plantId: 'camellia-sasanqua-yuletide', quantity: 2, role: 'structure', note: 'Red Christmas blooms' },
        { plantId: 'tea-olive', quantity: 2, role: 'structure', note: 'Fall/spring fragrance' }
      ],
      seasonal: [
        { plantId: 'azalea-formosa', quantity: 5, role: 'seasonal', note: 'Classic pink azalea' },
        { plantId: 'hydrangea-oakleaf', quantity: 2, role: 'seasonal', note: 'White blooms, fall color' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 7, role: 'texture', note: 'Soft texture, shade' },
        { plantId: 'cast-iron-plant', quantity: 5, role: 'texture', note: 'Bulletproof shade plant' }
      ],
      carpet: [
        { plantId: 'liriope-variegated', quantity: 1, role: 'carpet', note: 'Striped edging' },
        { plantId: 'ajuga-bronze', quantity: 1, role: 'carpet', note: 'Bronze groundcover' }
      ]
    },
    finishNotes: 'The fragrance from gardenia and tea olive will greet visitors at the door.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. MODERN MINIMALIST - Clean lines, architectural plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    subtitle: 'Clean Lines & Bold Forms',
    description: 'Less is more. Architectural plants with strong forms, limited palette, maximum impact.',
    theme: 'Contemporary',
    preview: '🔲',
    colorScheme: ['#37474F', '#78909C', '#8BC34A', '#FFFFFF'],
    baseSize: '80 sq ft',
    defaultZone: 7,
    isResidential: true,
    yardZone: 'FRONT_FOUNDATION',
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-sango-kaku', quantity: 1, role: 'hero', note: 'Coral bark, architectural winter interest' }
      ],
      structure: [
        { plantId: 'boxwood-green-velvet', quantity: 7, role: 'structure', note: 'Sheared geometric forms' },
        { plantId: 'yew-hicksii', quantity: 3, role: 'structure', note: 'Dark columnar backdrop' }
      ],
      seasonal: [
        { plantId: 'agapanthus-white', quantity: 5, role: 'seasonal', note: 'White globe flowers' },
        { plantId: 'allium-globe', quantity: 7, role: 'seasonal', note: 'Purple spheres' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 7, role: 'texture', note: 'Vertical grass columns' },
        { plantId: 'blue-oat-grass', quantity: 5, role: 'texture', note: 'Blue steel mounds' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet', note: 'Dark fine-texture edge' }
      ]
    },
    finishNotes: 'Use decomposed granite or large pebble mulch. Keep edges razor sharp.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. FOUR SEASON COLOR - Something blooming always
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'four-season-color',
    name: 'Four Season Color',
    subtitle: 'Always Something Blooming',
    description: 'Carefully sequenced for year-round color. Winter camellia, spring azalea, summer hydrangea, fall grasses.',
    theme: 'Continuous Bloom',
    preview: '🌈',
    colorScheme: ['#E91E63', '#9C27B0', '#2196F3', '#FF9800'],
    baseSize: '120 sq ft',
    defaultZone: 7,
    isResidential: true,
    yardZone: 'BACKYARD_BORDER',
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Spring bloom, fall color, berries' },
        { plantId: 'witchhazel', quantity: 1, role: 'hero', note: 'Late winter fragrant blooms' }
      ],
      structure: [
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 2, role: 'structure', note: 'Fall/winter red' },
        { plantId: 'hydrangea-endless-summer', quantity: 3, role: 'structure', note: 'Summer blue/pink' },
        { plantId: 'viburnum-spring-bouquet', quantity: 2, role: 'structure', note: 'Spring fragrance' }
      ],
      seasonal: [
        { plantId: 'hellebore-winter-jewel', quantity: 5, role: 'seasonal', note: 'Late winter blooms' },
        { plantId: 'daffodil', quantity: 15, role: 'seasonal', note: 'Early spring' },
        { plantId: 'astilbe-red', quantity: 5, role: 'seasonal', note: 'Summer shade color' },
        { plantId: 'japanese-anemone', quantity: 5, role: 'seasonal', note: 'Fall blooms' }
      ],
      texture: [
        { plantId: 'hakone-grass', quantity: 5, role: 'texture', note: 'Golden cascading' },
        { plantId: 'muhly-grass-white', quantity: 3, role: 'texture', note: 'Fall white plumes' }
      ],
      carpet: [
        { plantId: 'sweet-woodruff', quantity: 1, role: 'carpet', note: 'Spring white flowers' },
        { plantId: 'creeping-jenny', quantity: 1, role: 'carpet', note: 'Gold trailing' }
      ]
    },
    finishNotes: 'Chart the bloom calendar - you should have color every month of the year.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SHADE SANCTUARY - For under trees and north sides
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'shade-sanctuary',
    name: 'Shade Sanctuary',
    subtitle: 'Thrives in Low Light',
    description: 'Perfect for under mature trees or north-facing foundations. Foliage texture and subtle blooms.',
    theme: 'Shade Garden',
    preview: '🌿',
    colorScheme: ['#1B5E20', '#4CAF50', '#81C784', '#FFFFFF'],
    baseSize: '100 sq ft',
    defaultZone: 7,
    isResidential: true,
    yardZone: 'SIDE_YARD',
    filters: {
      light: 'full-shade',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'Understory tree, late spring bloom' }
      ],
      structure: [
        { plantId: 'aucuba-gold-dust', quantity: 3, role: 'structure', note: 'Speckled gold foliage' },
        { plantId: 'fatsia-japonica', quantity: 2, role: 'structure', note: 'Bold tropical texture' },
        { plantId: 'pieris-mountain-fire', quantity: 2, role: 'structure', note: 'Red new growth' }
      ],
      seasonal: [
        { plantId: 'hydrangea-oakleaf-ruby-slippers', quantity: 3, role: 'seasonal', note: 'Compact, shade loving' },
        { plantId: 'astilbe-mix', quantity: 7, role: 'seasonal', note: 'Feathery blooms' }
      ],
      texture: [
        { plantId: 'hosta-sum-and-substance', quantity: 3, role: 'texture', note: 'Giant gold hosta' },
        { plantId: 'hosta-blue-angel', quantity: 3, role: 'texture', note: 'Blue-gray contrast' },
        { plantId: 'fern-japanese-painted', quantity: 7, role: 'texture', note: 'Silver fronds' }
      ],
      carpet: [
        { plantId: 'lamium-beacon-silver', quantity: 1, role: 'carpet', note: 'Silver leaves, pink flowers' },
        { plantId: 'wild-ginger', quantity: 1, role: 'carpet', note: 'Heart-shaped leaves' }
      ]
    },
    finishNotes: 'These plants will BURN in full sun. Keep moist but not wet.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. NATIVE WILDLIFE - Support local ecosystem
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'native-wildlife',
    name: 'Native Wildlife Garden',
    subtitle: 'Support Local Ecosystem',
    description: 'Native and pollinator-friendly plants designed for continuous bloom. Supports local wildlife and ecosystem health.',
    theme: 'Pollinator Garden',
    preview: '🦋',
    colorScheme: ['#E91E63', '#FF9800', '#9C27B0', '#FFEB3B'],
    baseSize: '100 sq ft',
    defaultZone: 7,
    isResidential: true,
    yardZone: 'BACKYARD_BORDER',
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'Early bee food' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Berries for birds' }
      ],
      structure: [
        { plantId: 'butterfly-bush', quantity: 3, role: 'structure', note: 'Butterfly magnet' },
        { plantId: 'beautyberry', quantity: 2, role: 'structure', note: 'Fall bird food' },
        { plantId: 'itea-henry-garnet', quantity: 2, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'coneflower-purple', quantity: 7, role: 'seasonal', note: 'Native, long bloom' },
        { plantId: 'black-eyed-susan', quantity: 7, role: 'seasonal', note: 'Native classic' },
        { plantId: 'bee-balm', quantity: 5, role: 'seasonal', note: 'Hummingbird favorite' },
        { plantId: 'salvia-may-night', quantity: 5, role: 'seasonal' },
        { plantId: 'milkweed-butterfly', quantity: 5, role: 'seasonal', note: 'Monarch host plant' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 5, role: 'texture' },
        { plantId: 'switchgrass', quantity: 3, role: 'texture', note: 'Native grass' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 1, role: 'carpet', note: 'Early nectar' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    finishNotes: 'Leave seed heads in fall for birds. Avoid pesticides. Include water source nearby.',
  }
];

// Legacy template reference (for backwards compatibility)
export const RESIDENTIAL_BUNDLE_TEMPLATES = RESIDENTIAL_BUNDLES.reduce((acc, bundle) => {
  acc[bundle.id.toUpperCase().replace(/-/g, '_')] = bundle;
  return acc;
}, {});

// ═══════════════════════════════════════════════════════════════════════════════
// RESIDENTIAL SCORE CALCULATION - Home Plant Trainer Scoring System
// ═══════════════════════════════════════════════════════════════════════════════

export const RESIDENTIAL_CRITERIA = {
  layering: { weight: 20, description: 'Proper front-to-back layering' },
  spacing: { weight: 20, description: 'Appropriate plant spacing' },
  oddGroupings: { weight: 15, description: 'Plants in odd-numbered groups (3, 5, 7)' },
  zoneCompliance: { weight: 15, description: 'Meets yard zone requirements' },
  fourSeason: { weight: 15, description: 'Year-round interest' },
  curbAppeal: { weight: 15, description: 'Visual balance and entry focus' },
};

// Analyze plant layering based on bed depth
export const analyzeResidentialLayering = (placedPlants, allPlants, bedDimensions) => {
  if (placedPlants.length === 0) return { score: 0, issues: ['No plants placed'] };

  const bedDepthInches = bedDimensions.height * 12;
  const expectedLayers = calculateLayerCount(bedDepthInches);
  const layerDepths = calculateLayerDepths(bedDepthInches, expectedLayers);

  // Group plants by their Y position (front to back)
  const plantsWithData = placedPlants.map(placed => {
    const plantData = allPlants.find(p => p.id === placed.plantId);
    if (!plantData) return null;
    const heightMatch = plantData.height.match(/(\d+)/);
    let heightInches = heightMatch ? parseInt(heightMatch[1]) : 24;
    if (plantData.height.toLowerCase().includes('ft')) heightInches *= 12;
    return { ...placed, ...plantData, heightInches };
  }).filter(Boolean);

  // Check if taller plants are in back, shorter in front
  let correctLayering = 0;
  let totalChecks = 0;
  const bedHeightPx = bedDimensions.height * 12; // Convert to canvas units

  plantsWithData.forEach(plant => {
    const normalizedY = plant.y / bedHeightPx; // 0 = top (back), 1 = bottom (front)
    const expectedPosition = plant.heightInches > 48 ? 0.2 : // Tall in back
                             plant.heightInches > 24 ? 0.5 : // Medium in middle
                             0.8; // Short in front
    const tolerance = 0.3;
    if (Math.abs(normalizedY - expectedPosition) <= tolerance) correctLayering++;
    totalChecks++;
  });

  const score = totalChecks > 0 ? Math.round((correctLayering / totalChecks) * 100) : 0;

  return {
    score,
    expectedLayers,
    actualLayers: new Set(plantsWithData.map(p =>
      p.heightInches > 48 ? 'back' : p.heightInches > 24 ? 'middle' : 'front'
    )).size,
    issues: score < 70 ? ['Consider placing taller plants towards the back of the bed'] : [],
    recommendation: score < 50 ? 'Arrange plants by height: tallest in back, shortest in front' : null,
  };
};

// Analyze plant spacing against residential rules
export const analyzeResidentialSpacing = (placedPlants, allPlants) => {
  if (placedPlants.length < 2) return { score: 100, issues: [] };

  const plantsWithData = placedPlants.map(placed => {
    const plantData = allPlants.find(p => p.id === placed.plantId);
    if (!plantData) return null;
    const spreadMatch = plantData.spread.match(/(\d+)/);
    let spreadInches = spreadMatch ? parseInt(spreadMatch[1]) : 24;
    if (plantData.spread.toLowerCase().includes('ft')) spreadInches *= 12;
    return { ...placed, ...plantData, spreadInches };
  }).filter(Boolean);

  let spacingIssues = 0;
  let totalPairs = 0;
  const issues = [];

  for (let i = 0; i < plantsWithData.length; i++) {
    for (let j = i + 1; j < plantsWithData.length; j++) {
      const p1 = plantsWithData[i];
      const p2 = plantsWithData[j];
      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      const idealSpacing = SPACING_FORMULAS.calculateSpacing(p1.spreadInches, p2.spreadInches);

      totalPairs++;
      if (distance < idealSpacing * 0.5) {
        spacingIssues++;
        if (issues.length < 3) {
          issues.push(`${p1.name} and ${p2.name} are too close together`);
        }
      }
    }
  }

  const score = totalPairs > 0 ? Math.round(((totalPairs - spacingIssues) / totalPairs) * 100) : 100;

  return {
    score,
    totalPairs,
    spacingIssues,
    issues,
  };
};

// Analyze odd-number groupings (Rule of Threes)
export const analyzeOddGroupings = (placedPlants, allPlants) => {
  if (placedPlants.length === 0) return { score: 0, issues: [] };

  // Count plants by type
  const plantCounts = {};
  placedPlants.forEach(placed => {
    const plantData = allPlants.find(p => p.id === placed.plantId);
    if (plantData) {
      plantCounts[plantData.id] = (plantCounts[plantData.id] || 0) + 1;
    }
  });

  let oddGroups = 0;
  let totalGroups = 0;
  const issues = [];

  Object.entries(plantCounts).forEach(([plantId, count]) => {
    if (count > 1) {
      totalGroups++;
      if (count % 2 === 1 || count === 1) {
        oddGroups++;
      } else {
        const plantData = allPlants.find(p => p.id === plantId);
        if (plantData && issues.length < 3) {
          issues.push(`${plantData.name}: ${count} planted (try ${count + 1} for visual balance)`);
        }
      }
    }
  });

  const score = totalGroups > 0 ? Math.round((oddGroups / totalGroups) * 100) : 100;

  return {
    score,
    plantGroups: Object.keys(plantCounts).length,
    oddGroupCount: oddGroups,
    issues,
    tip: 'Plant in groups of 3, 5, or 7 for a natural, professional look',
  };
};

// Analyze zone compliance
export const analyzeZoneCompliance = (placedPlants, allPlants, zoneType, bedDimensions) => {
  const zone = YARD_ZONES[zoneType];
  if (!zone) return { score: 100, issues: [] };

  const issues = [];
  let compliantPlants = 0;

  const plantsWithData = placedPlants.map(placed => {
    const plantData = allPlants.find(p => p.id === placed.plantId);
    if (!plantData) return null;
    const heightMatch = plantData.height.match(/(\d+)/);
    let heightInches = heightMatch ? parseInt(heightMatch[1]) : 24;
    if (plantData.height.toLowerCase().includes('ft')) heightInches *= 12;
    return { ...placed, ...plantData, heightInches };
  }).filter(Boolean);

  plantsWithData.forEach(plant => {
    let compliant = true;

    // Check height rules for specific zones
    if (zoneType === 'ENTRY_PATH' && plant.heightInches > 36) {
      compliant = false;
      if (issues.length < 3) issues.push(`${plant.name} too tall for entry path (max 36")`);
    }

    if (zoneType === 'PRIVACY_SCREEN' && plant.heightInches < 72) {
      compliant = false;
      if (issues.length < 3) issues.push(`${plant.name} too short for privacy (min 6ft)`);
    }

    if (compliant) compliantPlants++;
  });

  const score = plantsWithData.length > 0 ?
    Math.round((compliantPlants / plantsWithData.length) * 100) : 100;

  return {
    score,
    zoneName: zone.name,
    zoneGoals: zone.goals,
    issues,
  };
};

// Calculate overall residential score
export const calculateResidentialScore = (analysis) => {
  const {
    layering = { score: 0 },
    spacing = { score: 0 },
    oddGroupings = { score: 0 },
    zoneCompliance = { score: 0 },
    fourSeason = { score: 0 },
    curbAppeal = { score: 0 },
  } = analysis;

  const scores = {
    layering: layering.score,
    spacing: spacing.score,
    oddGroupings: oddGroupings.score,
    zoneCompliance: zoneCompliance.score,
    fourSeason: fourSeason.score,
    curbAppeal: curbAppeal.score,
  };

  // Calculate weighted total
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(RESIDENTIAL_CRITERIA).forEach(([key, { weight }]) => {
    totalScore += (scores[key] || 0) * weight;
    totalWeight += weight;
  });

  const finalScore = Math.round(totalScore / totalWeight);

  // Determine rating
  let rating, ratingColor;
  if (finalScore >= 90) {
    rating = 'Pro Landscaper';
    ratingColor = '#4CAF50';
  } else if (finalScore >= 75) {
    rating = 'Curb Appeal Ready';
    ratingColor = '#8BC34A';
  } else if (finalScore >= 60) {
    rating = 'Good Foundation';
    ratingColor = '#FFC107';
  } else if (finalScore >= 40) {
    rating = 'Getting Started';
    ratingColor = '#FF9800';
  } else {
    rating = 'Early Planning';
    ratingColor = '#f44336';
  }

  return {
    totalScore: finalScore,
    scores,
    rating,
    ratingColor,
    recommendations: [
      ...(layering.issues || []),
      ...(spacing.issues || []),
      ...(oddGroupings.issues || []),
      ...(zoneCompliance.issues || []),
    ].slice(0, 5),
  };
};

export default {
  YARD_ZONES,
  FOUNDATION_RULES,
  STRUCTURE_EDGE_RULES,
  CANOPY_RULES,
  SMALL_BED_RULES,
  BED_DEPTH_RULES,
  VERTICAL_LAYER_RULE,
  SPACING_FORMULAS,
  CURB_APPEAL_RULES,
  PRIVACY_SCREENING_RULES,
  RESIDENTIAL_DESIGN_PRINCIPLES,
  RESIDENTIAL_BUNDLES,
  RESIDENTIAL_BUNDLE_TEMPLATES,
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
  calculateResidentialScore,
};
