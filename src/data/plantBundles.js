// ═══════════════════════════════════════════════════════════════════════════════
// PLANT PACKAGE / BUNDLE SYSTEM
// Theme-based landscape packages with swap logic for different conditions
// Built for North GA / Gainesville (Zone 7b-8a) as default
// UPDATED: All plant IDs now match plantDatabase.js exactly
// UPDATED: Every bundle has complete facet coverage (trees, shrubs, perennials, groundcovers)
// ═══════════════════════════════════════════════════════════════════════════════

// Package filters - every bundle should define these
export const PACKAGE_FILTERS = {
  hardiness: ['zone-6-7', 'zone-7-8', 'zone-8-9', 'zone-9-10'],
  light: ['full-sun', 'part-shade', 'full-shade'],
  moisture: ['dry', 'average', 'wet'],
  maintenance: ['low', 'standard', 'showcase']
};

// Plant roles in every package
export const PLANT_ROLES = {
  HERO: 'hero',           // 1-3 signature plants that sell the theme (trees/large shrubs)
  STRUCTURE: 'structure', // Evergreen backbone (shrubs)
  SEASONAL: 'seasonal',   // Bloom sequence / seasonal color (perennials/flowering shrubs)
  TEXTURE: 'texture',     // Grasses/perennials for movement
  CARPET: 'carpet'        // Groundcover / edge layer
};

// Invasive plant warnings - flag these for client approval
export const INVASIVE_WARNINGS = {
  'english-ivy': {
    name: 'English Ivy',
    status: 'Major Invasive',
    region: 'Southeast US',
    note: 'Use only with client approval / containment plan',
    alternatives: ['asiatic-jasmine', 'creeping-fig', 'confederate-jasmine']
  },
  'nandina': {
    name: 'Nandina',
    status: 'Invasive in GA',
    region: 'Georgia',
    note: 'Consider sterile cultivars or alternatives',
    alternatives: ['distylium-vintage-jade', 'loropetalum-purple-pixie', 'cleyera']
  },
  'liriope': {
    name: 'Liriope muscari',
    status: 'Potentially Invasive',
    region: 'SE-EPPC Listed',
    note: 'Flag for client - varies by context',
    alternatives: ['mondo-grass', 'carex-everillo', 'sweet-flag-grass']
  },
  'asiatic-jasmine': {
    name: 'Asiatic Jasmine',
    status: 'Aggressive Spreader',
    region: 'Southeast US',
    note: 'Great performer but manage edges carefully',
    alternatives: ['mondo-grass', 'pachysandra', 'creeping-phlox']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// THEME PACKAGES - ALL WITH COMPLETE FACET COVERAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const PLANT_BUNDLES = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. AUGUSTA CLASSIC SOUTHERN GOLF
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'augusta-classic',
    name: 'Augusta Classic',
    subtitle: 'Southern Golf Course Elegance',
    description: 'Inspired by Augusta National - azaleas, dogwoods, magnolias, and pristine evergreen structure. Each hole at Augusta is named after a plant.',
    theme: 'Southern Traditional',
    preview: '⛳',
    colorScheme: ['#E91E63', '#FFFFFF', '#1B5E20', '#FFB6C1'],
    baseSize: '200 sq ft',
    defaultZone: 8,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'showcase'
    },
    plants: {
      hero: [
        { plantId: 'magnolia-southern', quantity: 1, role: 'hero', note: 'Grand statement tree' },
        { plantId: 'dogwood', quantity: 2, role: 'hero', note: 'Spring focal - Masters timing' },
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'Specimen focal' },
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Summer blooms' }
      ],
      structure: [
        { plantId: 'tea-olive', quantity: 2, role: 'structure', note: 'Signature fragrance' },
        { plantId: 'holly-nellie-stevens', quantity: 2, role: 'structure', note: 'Evergreen screen' },
        { plantId: 'boxwood-wintergreen', quantity: 8, role: 'structure' },
        { plantId: 'cleyera', quantity: 4, role: 'structure' },
        { plantId: 'distylium-vintage-jade', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'azalea-encore-autumn-carnation', quantity: 8, role: 'seasonal', note: 'Signature color mass' },
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 3, role: 'seasonal', note: 'Winter bloom' },
        { plantId: 'camellia-japonica', quantity: 3, role: 'seasonal' },
        { plantId: 'hydrangea-limelight', quantity: 4, role: 'seasonal' },
        { plantId: 'gardenia-august-beauty', quantity: 3, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 8, role: 'texture', note: 'Fall pink clouds' },
        { plantId: 'muhly-grass-white', quantity: 5, role: 'texture' },
        { plantId: 'fern-autumn', quantity: 8, role: 'texture' },
        { plantId: 'carex-everillo', quantity: 6, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet', note: 'Primary groundcover' },
        { plantId: 'liriope-variegated', quantity: 1, role: 'carpet' },
        { plantId: 'pachysandra', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 6-7 / Exposed sites',
        changes: [
          { remove: 'tea-olive', add: 'holly-nellie-stevens', reason: 'More cold hardy' },
          { remove: 'gardenia-august-beauty', add: 'camellia-sasanqua-hot-flash', reason: 'Better cold tolerance' }
        ]
      }
    },
    finishNotes: 'Natural pine bark mulch (not dyed). Clean bed edges. No excessive color - let structure dominate.',
    inspirationSource: 'Augusta National Golf Club - holes named after plants'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MAIN STREET CLASSIC
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'main-street-classic',
    name: 'Main Street Classic',
    subtitle: 'Clean, Formal, Always-in-Bloom',
    description: 'Tight lines, bright seasonal beds, and maximum curb appeal. The quintessential American front yard.',
    theme: 'Classic Americana',
    preview: '🏛️',
    colorScheme: ['#D32F2F', '#FFFFFF', '#1565C0', '#FFD700'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'White summer blooms' },
        { plantId: 'dogwood', quantity: 1, role: 'hero', note: 'Spring flowering tree' },
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'Early spring color' },
        { plantId: 'holly-nellie-stevens', quantity: 2, role: 'hero', note: 'Evergreen backdrop' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 10, role: 'structure', note: 'Foundation hedge' },
        { plantId: 'holly-sky-pencil', quantity: 3, role: 'structure', note: 'Vertical accents' },
        { plantId: 'gardenia-frostproof', quantity: 4, role: 'structure' },
        { plantId: 'loropetalum-purple-pixie', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-limelight', quantity: 4, role: 'seasonal' },
        { plantId: 'rose-knock-out', quantity: 6, role: 'seasonal', note: 'Continuous color' },
        { plantId: 'rose-drift-coral', quantity: 5, role: 'seasonal' },
        { plantId: 'rose-drift-pink', quantity: 5, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 5, role: 'texture', note: 'Vertical grass accents' },
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture', note: 'Soft fall edge' },
        { plantId: 'daylily-stella-doro', quantity: 8, role: 'texture' },
        { plantId: 'hosta', quantity: 6, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet', note: 'Between stepping stones' },
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' },
        { plantId: 'liriope-variegated', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Less than 4-5 hours sun',
        changes: [
          { remove: 'rose-knock-out', add: 'hydrangea-endless-summer', reason: 'Shade tolerant blooms' },
          { remove: 'rose-drift-coral', add: 'fern-autumn', reason: 'Texture for shade' }
        ]
      }
    },
    finishNotes: 'Black hardwood or pine bark mini nuggets. Crisp bed edges. Symmetrical layout.',
    inspirationSource: 'Disney Main Street USA'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. JAPANESE GARDEN (ZEN)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'japanese-garden',
    name: 'Japanese Garden',
    subtitle: 'Zen & Layered Evergreens',
    description: 'Restrained blooms, layered evergreens, and the art of negative space. Japanese maples as living sculptures.',
    theme: 'Zen Asian',
    preview: '🎋',
    colorScheme: ['#C62828', '#1B5E20', '#FFFFFF', '#8D6E63'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'showcase'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'Primary focal' },
        { plantId: 'japanese-maple-coral-bark', quantity: 1, role: 'hero', note: 'Winter bark interest' },
        { plantId: 'yoshino-cherry', quantity: 1, role: 'hero', note: 'Spring blossoms' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero', note: 'Evergreen structure' }
      ],
      structure: [
        { plantId: 'holly-sky-pencil', quantity: 5, role: 'structure', note: 'Vertical evergreen' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure' },
        { plantId: 'nandina', quantity: 4, role: 'structure' },
        { plantId: 'camellia-japonica', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'azalea-encore-autumn-amethyst', quantity: 6, role: 'seasonal' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 6, role: 'seasonal' },
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 3, role: 'seasonal' },
        { plantId: 'iris', quantity: 6, role: 'seasonal', note: 'Near water features' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 8, role: 'texture' },
        { plantId: 'fern-japanese-painted', quantity: 6, role: 'texture' },
        { plantId: 'fern-holly', quantity: 5, role: 'texture' },
        { plantId: 'hosta', quantity: 8, role: 'texture' },
        { plantId: 'carex', quantity: 6, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 3, role: 'carpet', note: 'Primary groundcover' },
        { plantId: 'pachysandra', quantity: 1, role: 'carpet' },
        { plantId: 'creeping-mazus', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Full sun / hot sites',
        changes: [
          { remove: 'japanese-maple-bloodgood', add: 'cryptomeria-radicans', reason: 'Heat tolerant focal' }
        ]
      }
    },
    finishNotes: 'Decomposed granite or pea gravel paths. Natural boulders. Raked gravel beds optional. Minimal color - structure dominates.',
    invasiveWarnings: ['nandina'],
    inspirationSource: 'EPCOT Japan Pavilion'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ENGLISH MANOR / COTTAGE GARDEN
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'english-manor',
    name: 'English Manor',
    subtitle: 'Boxwood, Blooms & Soft Perennials',
    description: 'Formal hedges framing romantic perennial drifts. The classic English cottage garden look.',
    theme: 'English Traditional',
    preview: '🏰',
    colorScheme: ['#7B1FA2', '#E91E63', '#FFFFFF', '#33691E'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'Late spring blooms' },
        { plantId: 'crape-myrtle', quantity: 1, role: 'hero', note: 'Summer color' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'Fragrant focal' },
        { plantId: 'redbud-forest-pansy', quantity: 1, role: 'hero', note: 'Purple foliage' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 14, role: 'structure', note: 'Hedge structure' },
        { plantId: 'holly-sky-pencil', quantity: 4, role: 'structure' },
        { plantId: 'yew-podocarpus', quantity: 4, role: 'structure', note: 'Hedge mass' }
      ],
      seasonal: [
        { plantId: 'hydrangea-endless-summer', quantity: 5, role: 'seasonal' },
        { plantId: 'rose-knock-out', quantity: 6, role: 'seasonal' },
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal' },
        { plantId: 'catmint-walkers-low', quantity: 8, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'peony', quantity: 3, role: 'seasonal', note: 'Where zone allows' },
        { plantId: 'daisy-shasta-becky', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 5, role: 'texture' },
        { plantId: 'lamb-ear', quantity: 6, role: 'texture' },
        { plantId: 'russian-sage', quantity: 5, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet' },
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      deer: {
        condition: 'High deer pressure',
        changes: [
          { remove: 'rose-knock-out', add: 'boxwood-wintergreen', reason: 'Deer resistant' }
        ]
      }
    },
    finishNotes: 'Aged brick or stone edging. Natural mulch. Informal drifts within formal hedge frames.',
    inspirationSource: 'EPCOT United Kingdom Pavilion'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. MEDITERRANEAN COURTYARD
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'mediterranean-courtyard',
    name: 'Mediterranean Courtyard',
    subtitle: 'Silver/Blue Foliage & Herbs',
    description: 'Drought-tolerant elegance with rosemary, lavender, and architectural evergreens. Italian cypress vibes without the cold damage.',
    theme: 'Mediterranean',
    preview: '🏛️',
    colorScheme: ['#78909C', '#7B1FA2', '#8D6E63', '#FFFFFF'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Summer statement' },
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'Summer blue spikes' },
        { plantId: 'arborvitae-emerald-green', quantity: 2, role: 'hero', note: 'Italian cypress substitute' },
        { plantId: 'blue-atlas-cedar-horstmann', quantity: 1, role: 'hero', note: 'Specimen' }
      ],
      structure: [
        { plantId: 'holly-sky-pencil', quantity: 6, role: 'structure', note: 'Italian cypress substitute' },
        { plantId: 'tea-olive', quantity: 2, role: 'structure' },
        { plantId: 'juniper-blue-pacific', quantity: 6, role: 'structure' },
        { plantId: 'juniper-blue-star', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rosemary', quantity: 6, role: 'seasonal', note: 'Culinary + ornamental' },
        { plantId: 'lavender-phenomenal', quantity: 10, role: 'seasonal' },
        { plantId: 'rose-drift-coral', quantity: 5, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'cone-flower', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 10, role: 'texture', note: 'Silver-blue clumps' },
        { plantId: 'sedum-autumn-joy', quantity: 6, role: 'texture' },
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture' },
        { plantId: 'karl-foerster', quantity: 4, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 2, role: 'carpet', note: 'Golden groundcover' },
        { plantId: 'rosemary-creeping', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 7 or colder',
        changes: [
          { remove: 'rosemary', add: 'juniper-blue-star', reason: 'More cold hardy' },
          { remove: 'lavender-phenomenal', add: 'catmint-walkers-low', reason: 'Lavender substitute' }
        ]
      }
    },
    finishNotes: 'Decomposed granite or pea gravel. Terracotta containers. Boulders as accents.',
    inspirationSource: 'EPCOT Italy Pavilion'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. LOWCOUNTRY COASTAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'lowcountry-coastal',
    name: 'Lowcountry Coastal',
    subtitle: 'Wind-Tough & Salt-Tolerant Feel',
    description: 'Inspired by Georgia/Carolina coast - wax myrtle, muhly grass, and that relaxed coastal vibe.',
    theme: 'Coastal Southern',
    preview: '🌊',
    colorScheme: ['#E91E63', '#78909C', '#8D6E63', '#2E7D32'],
    baseSize: '200 sq ft',
    defaultZone: 8,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'Native coastal tree' },
        { plantId: 'crape-myrtle', quantity: 1, role: 'hero', note: 'Summer blooms' },
        { plantId: 'bald-cypress', quantity: 1, role: 'hero', note: 'Wet-tolerant focal' },
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'Multi-stem specimen' }
      ],
      structure: [
        { plantId: 'wax-myrtle', quantity: 3, role: 'structure', note: 'Native coastal shrub' },
        { plantId: 'holly-yaupon-dwarf', quantity: 6, role: 'structure' },
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure' },
        { plantId: 'juniper-parsonii', quantity: 4, role: 'structure' },
        { plantId: 'juniper-blue-rug', quantity: 8, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-oakleaf', quantity: 4, role: 'seasonal', note: 'Native blooms' },
        { plantId: 'gardenia-jubilation', quantity: 3, role: 'seasonal' },
        { plantId: 'iris', quantity: 8, role: 'seasonal', note: 'Wet-tolerant color' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 10, role: 'texture', note: 'Fall pink clouds' },
        { plantId: 'muhly-grass-white', quantity: 6, role: 'texture' },
        { plantId: 'northern-sea-oaks', quantity: 8, role: 'texture', note: 'Native oat grass' },
        { plantId: 'sweet-flag-grass', quantity: 6, role: 'texture', note: 'Wet pocket accents' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 2, role: 'carpet', note: 'FLAG: Aggressive - manage edges' },
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' },
        { plantId: 'bar-harbor-juniper', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      wet: {
        condition: 'Wet or poorly drained',
        changes: [
          { add: 'sweet-flag-grass', quantity: 6, reason: 'Loves wet feet' },
          { add: 'iris', quantity: 4, reason: 'Wet-tolerant color' }
        ]
      }
    },
    finishNotes: 'Long needle pine straw. Natural driftwood accents. Relaxed, naturalistic layout.',
    invasiveWarnings: ['asiatic-jasmine'],
    inspirationSource: 'Georgia/Carolina Lowcountry'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. MODERN PRAIRIE / POLLINATOR
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'modern-prairie',
    name: 'Modern Prairie',
    subtitle: 'Native-ish Look, Huge ROI',
    description: 'Coneflowers, black-eyed susans, and ornamental grasses. Low maintenance, pollinator paradise.',
    theme: 'Native Prairie',
    preview: '🌻',
    colorScheme: ['#9C27B0', '#FFC107', '#E91E63', '#8D6E63'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'Native spring blooms' },
        { plantId: 'dogwood', quantity: 1, role: 'hero', note: 'Native understory' },
        { plantId: 'black-tupelo', quantity: 1, role: 'hero', note: 'Fall color' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Multi-season interest' }
      ],
      structure: [
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure', note: 'Native evergreen' },
        { plantId: 'viburnum-spring-bouquet', quantity: 3, role: 'structure' },
        { plantId: 'oakleaf-hydrangea', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'cone-flower', quantity: 12, role: 'seasonal', note: 'Pollinator magnet' },
        { plantId: 'black-eyed-susan', quantity: 12, role: 'seasonal' },
        { plantId: 'yarrow', quantity: 8, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'salvia-blue-hill', quantity: 6, role: 'seasonal' },
        { plantId: 'bee-balm', quantity: 5, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 10, role: 'texture' },
        { plantId: 'karl-foerster', quantity: 6, role: 'texture' },
        { plantId: 'purple-lovegrass', quantity: 6, role: 'texture' },
        { plantId: 'little-bluestem', quantity: 6, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Part shade areas',
        changes: [
          { remove: 'cone-flower', add: 'fern-autumn', reason: 'Shade tolerant texture' },
          { remove: 'black-eyed-susan', add: 'hydrangea-oakleaf', reason: 'Native shade bloomer' }
        ]
      }
    },
    finishNotes: 'Natural mulch. Clean bed edges. Meadow-style drifts, not rows.',
    inspirationSource: 'Native American Prairie'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. RAIN GARDEN / WATER'S EDGE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'rain-garden',
    name: 'Rain Garden',
    subtitle: 'Solves Problems & Looks Intentional',
    description: 'For wet areas, drainage swales, or rain garden installations. Turns a problem into a feature.',
    theme: 'Water Feature',
    preview: '💧',
    colorScheme: ['#1E88E5', '#7CB342', '#8D6E63', '#FFFFFF'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'wet',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'bald-cypress', quantity: 1, role: 'hero', note: 'Wet-tolerant focal' },
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'Tolerates wet feet' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'Wet-tolerant' },
        { plantId: 'black-tupelo', quantity: 1, role: 'hero', note: 'Fall color' }
      ],
      structure: [
        { plantId: 'wax-myrtle', quantity: 3, role: 'structure', note: 'Tolerates wet' },
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure', note: 'Wet tolerant native' },
        { plantId: 'clethra', quantity: 3, role: 'structure', note: 'Summersweet' },
        { plantId: 'itea-virginia', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'iris', quantity: 10, role: 'seasonal', note: 'Wet-tolerant blooms' },
        { plantId: 'calla-lily', quantity: 6, role: 'seasonal' },
        { plantId: 'astilbe', quantity: 6, role: 'seasonal' },
        { plantId: 'lobelia-cardinal', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'sweet-flag-grass', quantity: 10, role: 'texture', note: 'Loves wet feet' },
        { plantId: 'carex', quantity: 10, role: 'texture' },
        { plantId: 'northern-sea-oaks', quantity: 6, role: 'texture' },
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture', note: 'Edge - drier zone' }
      ],
      carpet: [
        { plantId: 'creeping-jenny', quantity: 2, role: 'carpet', note: 'Wet-tolerant spreader' },
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' }
      ]
    },
    swaps: {},
    finishNotes: 'Natural mulch or river rock. Defined swales/berms. Let edges blur naturally.',
    inspirationSource: 'Stormwater management best practices'
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // EPCOT WORLD SHOWCASE PAVILION PACKAGES
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // MEXICO PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-mexico',
    name: 'Mexico Pavilion',
    subtitle: 'Fiesta Courtyard',
    description: 'Warm stone courtyard feel with bold color pots. Dahlia is Mexico\'s national flower.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇽',
    colorScheme: ['#D32F2F', '#FF9800', '#FFC107', '#2E7D32'],
    baseSize: '100 sq ft',
    defaultZone: 8,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle', quantity: 1, role: 'hero', note: 'Summer color' },
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'Blue spikes' },
        { plantId: 'pomegranate', quantity: 1, role: 'hero', note: 'Fruiting accent' }
      ],
      structure: [
        { plantId: 'tea-olive', quantity: 2, role: 'structure' },
        { plantId: 'juniper-blue-pacific', quantity: 4, role: 'structure' },
        { plantId: 'nandina', quantity: 4, role: 'structure', note: 'FLAG: Invasive - get approval' },
        { plantId: 'loropetalum-plum-delight', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rose-drift-coral', quantity: 6, role: 'seasonal' },
        { plantId: 'rose-drift-red', quantity: 6, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'cone-flower-cheyenne-spirit', quantity: 6, role: 'seasonal' },
        { plantId: 'yarrow', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 8, role: 'texture' },
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture' },
        { plantId: 'mexican-feather-grass', quantity: 8, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' },
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded courtyard',
        changes: [
          { remove: 'rose-drift-coral', add: 'fern-autumn', reason: 'Shade texture' }
        ]
      }
    },
    finishNotes: 'Warm-toned gravel or stone. Bold color containers. Terra cotta accents.',
    invasiveWarnings: ['nandina'],
    inspirationSource: 'EPCOT Mexico Pavilion - Dahlia national flower'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // NORWAY PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-norway',
    name: 'Norway Pavilion',
    subtitle: 'Nordic Alpine + Conifers',
    description: 'Mountain stream feel with conifers and white blooms. Clean, crisp Nordic style.',
    theme: 'EPCOT World Showcase',
    preview: '🇳🇴',
    colorScheme: ['#1B5E20', '#FFFFFF', '#607D8B', '#78909C'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'arborvitae-emerald-green', quantity: 3, role: 'hero', note: 'Alpine conifer' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero' },
        { plantId: 'blue-atlas-cedar', quantity: 1, role: 'hero', note: 'Specimen conifer' },
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'White bark' }
      ],
      structure: [
        { plantId: 'holly-compacta', quantity: 6, role: 'structure' },
        { plantId: 'juniper-blue-star', quantity: 5, role: 'structure' },
        { plantId: 'yew-podocarpus', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-limelight', quantity: 4, role: 'seasonal', note: 'White blooms' },
        { plantId: 'gardenia-august-beauty', quantity: 3, role: 'seasonal' },
        { plantId: 'iris', quantity: 6, role: 'seasonal', note: 'Near water features' },
        { plantId: 'astilbe', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'carex-everillo', quantity: 8, role: 'texture' },
        { plantId: 'sweet-flag-grass', quantity: 6, role: 'texture' },
        { plantId: 'fern-autumn', quantity: 8, role: 'texture' },
        { plantId: 'fern-holly', quantity: 6, role: 'texture' },
        { plantId: 'hosta', quantity: 8, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' },
        { plantId: 'pachysandra', quantity: 2, role: 'carpet' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Zone 9-10 heat',
        changes: [
          { remove: 'river-birch', add: 'cryptomeria-radicans', reason: 'Heat tolerant' }
        ]
      }
    },
    finishNotes: 'Boulders. Clean natural mulch. Mountain stream pockets with river rock.',
    inspirationSource: 'EPCOT Norway Pavilion - Pyramidal saxifrage symbol'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHINA PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-china',
    name: 'China Pavilion',
    subtitle: 'Peony + Scholar Garden',
    description: 'Peony as focal, layered evergreens, and framed views. Traditional scholar garden feel.',
    theme: 'EPCOT World Showcase',
    preview: '🇨🇳',
    colorScheme: ['#E91E63', '#D32F2F', '#1B5E20', '#FFFFFF'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'showcase'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'Specimen tree' },
        { plantId: 'yoshino-cherry', quantity: 1, role: 'hero', note: 'Spring blossoms' },
        { plantId: 'magnolia-southern', quantity: 1, role: 'hero', note: 'Grand focal' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero', note: 'Evergreen structure' }
      ],
      structure: [
        { plantId: 'holly-compacta', quantity: 6, role: 'structure' },
        { plantId: 'cleyera', quantity: 4, role: 'structure' },
        { plantId: 'distylium-vintage-jade', quantity: 5, role: 'structure' },
        { plantId: 'camellia-japonica', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'peony', quantity: 5, role: 'seasonal', note: 'Traditional symbol' },
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 3, role: 'seasonal' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 6, role: 'seasonal' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 8, role: 'texture' },
        { plantId: 'carex', quantity: 8, role: 'texture' },
        { plantId: 'hosta', quantity: 10, role: 'texture' },
        { plantId: 'muhly-grass-pink', quantity: 5, role: 'texture', note: 'Sunny outer ring' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 3, role: 'carpet' },
        { plantId: 'pachysandra', quantity: 1, role: 'carpet' },
        { plantId: 'liriope-variegated', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Deep shade',
        changes: [
          { remove: 'muhly-grass-pink', add: 'fern-holly', reason: 'Shade tolerant' }
        ]
      }
    },
    finishNotes: 'Stone paths. Clipped shapes. Framed views through "moon gates" of greenery.',
    inspirationSource: 'EPCOT China Pavilion - Peony traditional symbol'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GERMANY PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-germany',
    name: 'Germany Pavilion',
    subtitle: 'Formal Hedge + Cottage Perennial',
    description: 'Crisp hedges with orderly chaos in the perennial band. Blue cornflower vibes.',
    theme: 'EPCOT World Showcase',
    preview: '🇩🇪',
    colorScheme: ['#1565C0', '#FFC107', '#E91E63', '#33691E'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Summer statement' },
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'Spring interest' },
        { plantId: 'hornbeam-american', quantity: 1, role: 'hero', note: 'Fall color' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 14, role: 'structure', note: 'Formal hedge' },
        { plantId: 'holly-sky-pencil', quantity: 4, role: 'structure' },
        { plantId: 'yew-podocarpus', quantity: 4, role: 'structure' },
        { plantId: 'spirea-goldflame', quantity: 5, role: 'structure' },
        { plantId: 'weigela', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'catmint-walkers-low', quantity: 8, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'daisy-shasta-becky', quantity: 6, role: 'seasonal' },
        { plantId: 'cone-flower', quantity: 6, role: 'seasonal' },
        { plantId: 'yarrow', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 6, role: 'texture', note: 'Tidy verticals' },
        { plantId: 'hamlin-grass', quantity: 5, role: 'texture' },
        { plantId: 'lamb-ear', quantity: 8, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      lowMaintenance: {
        condition: 'Reduce perennial maintenance',
        changes: [
          { remove: 'daisy-shasta-becky', add: 'boxwood-wintergreen', reason: 'Less deadheading' }
        ]
      }
    },
    finishNotes: 'Crisp edging. Natural mulch. "Orderly chaos" in perennial band.',
    inspirationSource: 'EPCOT Germany Pavilion - Blue cornflower symbol'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // USA PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-usa',
    name: 'USA Pavilion',
    subtitle: 'Classic Americana',
    description: 'Rose is the U.S. national floral emblem. Strong lawn lines with foundation symmetry.',
    theme: 'EPCOT World Showcase',
    preview: '🇺🇸',
    colorScheme: ['#D32F2F', '#FFFFFF', '#1565C0', '#2E7D32'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'dogwood', quantity: 1, role: 'hero', note: 'Native flowering tree' },
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'Spring color' },
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Summer blooms' },
        { plantId: 'holly-nellie-stevens', quantity: 2, role: 'hero', note: 'Evergreen backdrop' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 10, role: 'structure' },
        { plantId: 'holly-compacta', quantity: 6, role: 'structure' },
        { plantId: 'wax-myrtle', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rose-knock-out', quantity: 8, role: 'seasonal', note: 'National flower' },
        { plantId: 'rose-drift-coral', quantity: 6, role: 'seasonal' },
        { plantId: 'hydrangea-limelight', quantity: 4, role: 'seasonal' },
        { plantId: 'hydrangea-little-lime', quantity: 3, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 6, role: 'texture' },
        { plantId: 'hosta', quantity: 8, role: 'texture', note: 'Check deer pressure' },
        { plantId: 'daylily-stella-doro', quantity: 8, role: 'texture' }
      ],
      carpet: [
        { plantId: 'liriope-variegated', quantity: 2, role: 'carpet', note: 'FLAG: Check invasive list' },
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' }
      ]
    },
    swaps: {
      deer: {
        condition: 'High deer pressure',
        changes: [
          { remove: 'hosta', add: 'distylium-vintage-jade', reason: 'Deer resistant' }
        ]
      }
    },
    finishNotes: 'Strong lawn lines. Foundation symmetry. Pine bark mulch.',
    invasiveWarnings: ['liriope'],
    inspirationSource: 'EPCOT USA Pavilion - Rose national emblem'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MOROCCO PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-morocco',
    name: 'Morocco Pavilion',
    subtitle: 'Riad Courtyard + Fragrance',
    description: 'Damask roses and fragrant plants in geometric courtyard style. Tight geometry with soft blooms.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇦',
    colorScheme: ['#E91E63', '#FF9800', '#1565C0', '#FFFFFF'],
    baseSize: '100 sq ft',
    defaultZone: 8,
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle', quantity: 1, role: 'hero', note: 'Summer blooms' },
        { plantId: 'pomegranate', quantity: 1, role: 'hero', note: 'Fruiting focal' },
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'Blue spikes' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 10, role: 'structure', note: 'Geometric hedging' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure' },
        { plantId: 'juniper-blue-star', quantity: 4, role: 'structure' },
        { plantId: 'tea-olive', quantity: 2, role: 'structure', note: 'Fragrance' }
      ],
      seasonal: [
        { plantId: 'rose-knock-out', quantity: 6, role: 'seasonal', note: 'Damask rose vibe' },
        { plantId: 'gardenia-jubilation', quantity: 3, role: 'seasonal', note: 'Fragrance' },
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'yarrow', quantity: 5, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 8, role: 'texture' },
        { plantId: 'rosemary', quantity: 5, role: 'texture' },
        { plantId: 'lamb-ear', quantity: 6, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded courtyard',
        changes: [
          { remove: 'rose-knock-out', add: 'camellia-japonica', reason: 'Shade blooms' }
        ]
      }
    },
    finishNotes: 'Tiled courtyard feel. Fountain focal if possible. Tight geometry.',
    inspirationSource: 'EPCOT Morocco Pavilion - Damask rose culture'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FRANCE PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-france',
    name: 'France Pavilion',
    subtitle: 'Parterre + Lavender Romance',
    description: 'Formal parterre style with lavender romance. Symmetry, clipped hedges, and soft color.',
    theme: 'EPCOT World Showcase',
    preview: '🇫🇷',
    colorScheme: ['#7B1FA2', '#E91E63', '#FFFFFF', '#33691E'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'showcase'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-muskogee', quantity: 1, role: 'hero', note: 'Lavender blooms' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'Fragrant focal' },
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'Spring interest' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 18, role: 'structure', note: 'Parterre structure' },
        { plantId: 'holly-sky-pencil', quantity: 6, role: 'structure', note: 'Vertical accents' },
        { plantId: 'holly-compacta', quantity: 6, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'lavender-phenomenal', quantity: 12, role: 'seasonal' },
        { plantId: 'rose-drift-pink', quantity: 6, role: 'seasonal' },
        { plantId: 'peony', quantity: 4, role: 'seasonal' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'catmint-walkers-low', quantity: 10, role: 'texture', note: 'Lavender ally' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'texture' },
        { plantId: 'russian-sage', quantity: 5, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      humid: {
        condition: 'Humid/shady sites',
        changes: [
          { remove: 'lavender-phenomenal', add: 'catmint-walkers-low', reason: 'Better in humidity' }
        ]
      }
    },
    finishNotes: 'Symmetry is key. Clipped hedges. Formal gravel paths.',
    inspirationSource: 'EPCOT France Pavilion - Fleur-de-lis association'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CANADA PAVILION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-canada',
    name: 'Canada Pavilion',
    subtitle: 'Woodland + Maples',
    description: 'Maple leaf symbolism with forest edge transitions. Natural woodland feel.',
    theme: 'EPCOT World Showcase',
    preview: '🇨🇦',
    colorScheme: ['#D32F2F', '#FF9800', '#1B5E20', '#8D6E63'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'maple-october-glory', quantity: 1, role: 'hero', note: 'Fall color focal' },
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'White bark' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Multi-season' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero', note: 'Evergreen backdrop' }
      ],
      structure: [
        { plantId: 'holly-compacta', quantity: 6, role: 'structure' },
        { plantId: 'viburnum-spring-bouquet', quantity: 4, role: 'structure' },
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure' },
        { plantId: 'clethra', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-oakleaf', quantity: 4, role: 'seasonal' },
        { plantId: 'azalea-encore-autumn-amethyst', quantity: 6, role: 'seasonal' },
        { plantId: 'astilbe', quantity: 6, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 10, role: 'texture' },
        { plantId: 'fern-christmas', quantity: 6, role: 'texture' },
        { plantId: 'hosta', quantity: 10, role: 'texture', note: 'Check deer' },
        { plantId: 'carex', quantity: 8, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet' },
        { plantId: 'pachysandra', quantity: 2, role: 'carpet' },
        { plantId: 'creeping-jenny', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Hot/dry or exposed',
        changes: [
          { remove: 'fern-autumn', add: 'muhly-grass-pink', reason: 'Heat tolerant' }
        ]
      }
    },
    finishNotes: 'Natural mulch. Boulders. Forest edge transitions.',
    inspirationSource: 'EPCOT Canada Pavilion - Maple leaf symbol'
  }
];

// Helper function to get bundle by ID
export const getBundleById = (id) => {
  return PLANT_BUNDLES.find(bundle => bundle.id === id);
};

// Helper function to get bundles by theme
export const getBundlesByTheme = (theme) => {
  return PLANT_BUNDLES.filter(bundle => bundle.theme === theme);
};

// Helper function to check if a plant has invasive warnings
export const getInvasiveWarning = (plantId) => {
  return INVASIVE_WARNINGS[plantId] || null;
};

// Get all plants from a bundle as a flat array
export const getBundlePlants = (bundle) => {
  if (!bundle || !bundle.plants) return [];

  const allPlants = [];
  Object.values(bundle.plants).forEach(roleArray => {
    roleArray.forEach(plant => {
      allPlants.push(plant);
    });
  });
  return allPlants;
};

export default PLANT_BUNDLES;
