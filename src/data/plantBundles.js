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
  // MEXICO PAVILION - Authentic desert/Mexican plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-mexico',
    name: 'Mexico Pavilion',
    subtitle: 'Desert Courtyard + Succulents',
    description: 'Authentic Mexican desert feel with succulents, ornamental grasses, and bold pops of color. Drought-tolerant and sun-loving.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇽',
    colorScheme: ['#D32F2F', '#FF9800', '#FFC107', '#8D6E63'],
    baseSize: '100 sq ft',
    defaultZone: 8,
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'Blue spikes - desert tree' },
        { plantId: 'pomegranate', quantity: 1, role: 'hero', note: 'Fruiting focal' }
      ],
      structure: [
        { plantId: 'yucca-color-guard', quantity: 5, role: 'structure', note: 'AUTHENTIC - spiky succulent' },
        { plantId: 'juniper-blue-pacific', quantity: 4, role: 'structure', note: 'Low spreading desert feel' },
        { plantId: 'juniper-blue-star', quantity: 3, role: 'structure', note: 'Silver-blue mound' }
      ],
      seasonal: [
        { plantId: 'lantana-ms-huff', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - native to Americas' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal', note: 'Blue/purple spikes' },
        { plantId: 'cone-flower-cheyenne-spirit', quantity: 5, role: 'seasonal', note: 'Warm color mix' },
        { plantId: 'yarrow', quantity: 5, role: 'seasonal', note: 'Yellow/red tones' }
      ],
      texture: [
        { plantId: 'mexican-feather-grass', quantity: 10, role: 'texture', note: 'AUTHENTIC - native Mexican grass' },
        { plantId: 'blue-fescue', quantity: 8, role: 'texture', note: 'Silver-blue clumps' },
        { plantId: 'muhly-grass-pink', quantity: 5, role: 'texture', note: 'Fall pink clouds' }
      ],
      carpet: [
        { plantId: 'sedum-angelina', quantity: 3, role: 'carpet', note: 'AUTHENTIC - succulent groundcover' },
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet', note: 'Between stepping stones' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 7 or colder',
        changes: [
          { remove: 'lantana-ms-huff', add: 'cone-flower', reason: 'More cold hardy' }
        ]
      }
    },
    finishNotes: 'Decomposed granite mulch. Terracotta pots. Boulders. NO traditional mulch - use gravel/stone.',
    inspirationSource: 'EPCOT Mexico Pavilion - Chihuahuan Desert aesthetic'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // NORWAY PAVILION - Authentic Nordic plants (conifers, birch, heather)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-norway',
    name: 'Norway Pavilion',
    subtitle: 'Nordic Alpine + Spruce & Cedar',
    description: 'Authentic Scandinavian mountain feel with SPRUCES, CEDARS, and BIRCHES. Cool greens, white bark, and alpine groundcovers.',
    theme: 'EPCOT World Showcase',
    preview: '🇳🇴',
    colorScheme: ['#1B5E20', '#FFFFFF', '#607D8B', '#2E7D32'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'blue-atlas-cedar', quantity: 1, role: 'hero', note: 'AUTHENTIC - iconic Nordic conifer' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero', note: 'Evergreen spruce-like' },
        { plantId: 'river-birch', quantity: 2, role: 'hero', note: 'AUTHENTIC - white bark, Nordic staple' },
        { plantId: 'arborvitae-emerald-green', quantity: 2, role: 'hero', note: 'Columnar conifer' }
      ],
      structure: [
        { plantId: 'juniper-blue-star', quantity: 6, role: 'structure', note: 'AUTHENTIC - alpine juniper' },
        { plantId: 'juniper-blue-pacific', quantity: 4, role: 'structure', note: 'Spreading conifer' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure', note: 'Compact evergreen' }
      ],
      seasonal: [
        { plantId: 'astilbe', quantity: 8, role: 'seasonal', note: 'White/pink feathery blooms' },
        { plantId: 'iris', quantity: 6, role: 'seasonal', note: 'Stream edge - purple/white' },
        { plantId: 'hydrangea-oakleaf', quantity: 3, role: 'seasonal', note: 'White blooms, fall color' }
      ],
      texture: [
        { plantId: 'carex', quantity: 10, role: 'texture', note: 'Sedge - native look' },
        { plantId: 'fern-christmas', quantity: 8, role: 'texture', note: 'Evergreen fern' },
        { plantId: 'fern-autumn', quantity: 6, role: 'texture', note: 'Deciduous fern' },
        { plantId: 'sweet-flag-grass', quantity: 6, role: 'texture', note: 'Stream edge grass' }
      ],
      carpet: [
        { plantId: 'creeping-jenny', quantity: 2, role: 'carpet', note: 'Stream edge - gold/green' },
        { plantId: 'pachysandra', quantity: 2, role: 'carpet', note: 'Shade carpet' },
        { plantId: 'bar-harbor-juniper', quantity: 1, role: 'carpet', note: 'AUTHENTIC - creeping juniper' }
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
    finishNotes: 'BOULDERS essential. River rock stream pockets. Natural bark mulch only. Cool, mountain feel.',
    inspirationSource: 'EPCOT Norway Pavilion - Scandinavian fjord landscape'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHINA PAVILION - Authentic Asian scholar garden plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-china',
    name: 'China Pavilion',
    subtitle: 'Peony + Scholar Garden',
    description: 'AUTHENTIC Asian scholar garden with peonies (China national flower), Japanese maples, camellias, and azaleas - all native to Asia.',
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
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'AUTHENTIC - native to East Asia' },
        { plantId: 'yoshino-cherry', quantity: 1, role: 'hero', note: 'AUTHENTIC - Chinese/Japanese cherry' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero', note: 'AUTHENTIC - Japanese cedar' }
      ],
      structure: [
        { plantId: 'nandina', quantity: 5, role: 'structure', note: 'AUTHENTIC - "heavenly bamboo" from China' },
        { plantId: 'camellia-japonica', quantity: 4, role: 'structure', note: 'AUTHENTIC - native to East Asia' },
        { plantId: 'cleyera', quantity: 4, role: 'structure', note: 'AUTHENTIC - Japanese shrub' }
      ],
      seasonal: [
        { plantId: 'peony', quantity: 6, role: 'seasonal', note: 'AUTHENTIC - China national flower' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - Asian origin' },
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 4, role: 'seasonal', note: 'AUTHENTIC - Asian camellia' },
        { plantId: 'iris', quantity: 6, role: 'seasonal', note: 'Asian iris varieties' }
      ],
      texture: [
        { plantId: 'fern-japanese-painted', quantity: 8, role: 'texture', note: 'AUTHENTIC - Japanese fern' },
        { plantId: 'fern-autumn', quantity: 6, role: 'texture', note: 'Asian fern' },
        { plantId: 'hosta', quantity: 8, role: 'texture', note: 'AUTHENTIC - native to Asia' },
        { plantId: 'carex', quantity: 6, role: 'texture', note: 'Asian sedge' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 4, role: 'carpet', note: 'AUTHENTIC - Japanese groundcover' },
        { plantId: 'liriope-variegated', quantity: 2, role: 'carpet', note: 'AUTHENTIC - Asian origin' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Deep shade',
        changes: [
          { remove: 'peony', add: 'fern-japanese-painted', reason: 'Shade tolerant' }
        ]
      }
    },
    finishNotes: 'Stone paths. Moon gate frames. Restrained color - structure over flowers. Koi pond if possible.',
    invasiveWarnings: ['nandina'],
    inspirationSource: 'EPCOT China Pavilion - Traditional scholar garden aesthetic'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // JAPAN PAVILION - Authentic zen garden + Japanese maples
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-japan',
    name: 'Japan Pavilion',
    subtitle: 'Zen Garden + Maples',
    description: 'AUTHENTIC Japanese zen garden - Japanese maples, cherry blossoms, azaleas, and the art of MA (negative space). Restrained beauty, sculptural trees.',
    theme: 'EPCOT World Showcase',
    preview: '🇯🇵',
    colorScheme: ['#C62828', '#FFFFFF', '#1B5E20', '#8D6E63'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'showcase'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'AUTHENTIC - iconic Japanese specimen' },
        { plantId: 'japanese-maple-coral-bark', quantity: 1, role: 'hero', note: 'AUTHENTIC - winter bark interest' },
        { plantId: 'yoshino-cherry', quantity: 1, role: 'hero', note: 'AUTHENTIC - Japanese cherry blossom' },
        { plantId: 'cryptomeria-radicans', quantity: 2, role: 'hero', note: 'AUTHENTIC - Japanese cedar (sugi)' }
      ],
      structure: [
        { plantId: 'holly-sky-pencil', quantity: 6, role: 'structure', note: 'AUTHENTIC - Japanese holly cultivar' },
        { plantId: 'nandina', quantity: 5, role: 'structure', note: 'AUTHENTIC - "heavenly bamboo" from Japan' },
        { plantId: 'camellia-japonica', quantity: 4, role: 'structure', note: 'AUTHENTIC - Japanese camellia' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure', note: 'Clipped Japanese style' }
      ],
      seasonal: [
        { plantId: 'azalea-encore-autumn-amethyst', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - azaleas native to Japan' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 6, role: 'seasonal', note: 'AUTHENTIC - pink azalea mass' },
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 4, role: 'seasonal', note: 'AUTHENTIC - fall/winter bloom' },
        { plantId: 'iris', quantity: 6, role: 'seasonal', note: 'AUTHENTIC - Japanese iris for water edge' }
      ],
      texture: [
        { plantId: 'fern-japanese-painted', quantity: 10, role: 'texture', note: 'AUTHENTIC - Japanese painted fern' },
        { plantId: 'fern-autumn', quantity: 8, role: 'texture', note: 'Japanese woodland fern' },
        { plantId: 'hosta', quantity: 8, role: 'texture', note: 'AUTHENTIC - native to Japan' },
        { plantId: 'carex', quantity: 6, role: 'texture', note: 'Japanese forest grass feel' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 5, role: 'carpet', note: 'AUTHENTIC - Japanese groundcover essential' },
        { plantId: 'pachysandra', quantity: 2, role: 'carpet', note: 'Japanese spurge' },
        { plantId: 'creeping-mazus', quantity: 2, role: 'carpet', note: 'Stepping stone crevices' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Full sun / hot sites',
        changes: [
          { remove: 'japanese-maple-bloodgood', add: 'cryptomeria-radicans', reason: 'More heat tolerant' }
        ]
      }
    },
    finishNotes: 'MA (negative space) is essential! Raked gravel/decomposed granite. BOULDERS as focal points. Stone lanterns. Restrained - less is more.',
    invasiveWarnings: ['nandina'],
    inspirationSource: 'EPCOT Japan Pavilion - Traditional zen garden aesthetic'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNITED KINGDOM PAVILION - English cottage garden + roses
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-uk',
    name: 'United Kingdom Pavilion',
    subtitle: 'English Cottage + Roses',
    description: 'AUTHENTIC English cottage garden - roses (Tudor rose!), boxwood hedges, lavender borders, and romantic perennial drifts. Formal structure with informal planting.',
    theme: 'EPCOT World Showcase',
    preview: '🇬🇧',
    colorScheme: ['#E91E63', '#7B1FA2', '#FFFFFF', '#33691E'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'European dogwood relative' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'English garden specimen' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 14, role: 'structure', note: 'AUTHENTIC - English hedge essential' },
        { plantId: 'yew-podocarpus', quantity: 5, role: 'structure', note: 'AUTHENTIC - English yew tradition' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure', note: 'English holly' }
      ],
      seasonal: [
        { plantId: 'rose-knock-out', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - Tudor rose, English symbol' },
        { plantId: 'rose-drift-pink', quantity: 6, role: 'seasonal', note: 'AUTHENTIC - English rose garden' },
        { plantId: 'hydrangea-endless-summer', quantity: 5, role: 'seasonal', note: 'AUTHENTIC - English hydrangea' },
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - English lavender borders' },
        { plantId: 'peony', quantity: 4, role: 'seasonal', note: 'AUTHENTIC - English cottage favorite' }
      ],
      texture: [
        { plantId: 'catmint-walkers-low', quantity: 10, role: 'texture', note: 'AUTHENTIC - English border plant' },
        { plantId: 'lamb-ear', quantity: 8, role: 'texture', note: 'AUTHENTIC - cottage garden staple' },
        { plantId: 'russian-sage', quantity: 5, role: 'texture', note: 'Silver-blue cottage accent' },
        { plantId: 'fern-autumn', quantity: 6, role: 'texture', note: 'Woodland edge' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'AUTHENTIC - English herb garden' },
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet', note: 'Spring carpet color' },
        { plantId: 'sedum-angelina', quantity: 2, role: 'carpet', note: 'Golden accent' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded areas',
        changes: [
          { remove: 'rose-knock-out', add: 'hydrangea-oakleaf', reason: 'Shade tolerant blooms' }
        ]
      }
    },
    finishNotes: 'Aged brick or stone edging. Arbors with climbing roses. Informal drifts within formal hedge frames. Tea garden feel.',
    inspirationSource: 'EPCOT United Kingdom Pavilion - Traditional English cottage garden'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ITALY PAVILION - Italian cypress + Mediterranean courtyard
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-italy',
    name: 'Italy Pavilion',
    subtitle: 'Tuscan Cypress + Courtyard',
    description: 'AUTHENTIC Italian Renaissance garden - cypress columns, olive tree vibes, rosemary, lavender. Formal geometry with Mediterranean warmth.',
    theme: 'EPCOT World Showcase',
    preview: '🇮🇹',
    colorScheme: ['#1B5E20', '#78909C', '#8D6E63', '#FFFFFF'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'arborvitae-emerald-green', quantity: 4, role: 'hero', note: 'AUTHENTIC - Italian cypress substitute' },
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Mediterranean courtyard tree' }
      ],
      structure: [
        { plantId: 'holly-sky-pencil', quantity: 8, role: 'structure', note: 'AUTHENTIC - Italian cypress columnar form' },
        { plantId: 'tea-olive', quantity: 3, role: 'structure', note: 'AUTHENTIC - olive tree substitute' },
        { plantId: 'boxwood-wintergreen', quantity: 10, role: 'structure', note: 'AUTHENTIC - Italian parterre hedging' },
        { plantId: 'juniper-blue-star', quantity: 4, role: 'structure', note: 'Mediterranean silver-blue' }
      ],
      seasonal: [
        { plantId: 'lavender-phenomenal', quantity: 10, role: 'seasonal', note: 'AUTHENTIC - Tuscan lavender' },
        { plantId: 'rose-drift-coral', quantity: 6, role: 'seasonal', note: 'Italian garden roses' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal', note: 'Mediterranean sage' },
        { plantId: 'yarrow', quantity: 5, role: 'seasonal', note: 'AUTHENTIC - Mediterranean native' }
      ],
      texture: [
        { plantId: 'rosemary', quantity: 8, role: 'texture', note: 'AUTHENTIC - Italian herb essential' },
        { plantId: 'blue-fescue', quantity: 10, role: 'texture', note: 'Silver-blue Mediterranean grass' },
        { plantId: 'lamb-ear', quantity: 6, role: 'texture', note: 'Silver foliage accent' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'AUTHENTIC - Italian herb garden' },
        { plantId: 'sedum-angelina', quantity: 3, role: 'carpet', note: 'Golden Mediterranean succulent' },
        { plantId: 'rosemary-creeping', quantity: 2, role: 'carpet', note: 'AUTHENTIC - trailing rosemary' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 7 or colder',
        changes: [
          { remove: 'rosemary', add: 'juniper-blue-star', reason: 'More cold hardy' }
        ]
      }
    },
    finishNotes: 'CYPRESS COLUMNS essential! Terracotta pots. Stone/gravel paths. Fountain focal point. Formal Italian Renaissance geometry.',
    inspirationSource: 'EPCOT Italy Pavilion - Tuscan villa garden aesthetic'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GERMANY PAVILION - Central European cottage garden + formal hedges
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-germany',
    name: 'Germany Pavilion',
    subtitle: 'Formal Hedge + Bavarian Cottage',
    description: 'AUTHENTIC Central European style - formal boxwood hedges with cottage perennials. Karl Foerster grass named after famous German nurseryman.',
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
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'European dogwood relative' },
        { plantId: 'hornbeam-american', quantity: 1, role: 'hero', note: 'AUTHENTIC - European hornbeam tradition' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 16, role: 'structure', note: 'AUTHENTIC - European hedge tradition' },
        { plantId: 'yew-podocarpus', quantity: 5, role: 'structure', note: 'AUTHENTIC - European yew' },
        { plantId: 'spirea-goldflame', quantity: 5, role: 'structure', note: 'European cottage shrub' },
        { plantId: 'weigela', quantity: 4, role: 'structure', note: 'AUTHENTIC - named after German botanist' }
      ],
      seasonal: [
        { plantId: 'catmint-walkers-low', quantity: 10, role: 'seasonal', note: 'Blue cornflower color echo' },
        { plantId: 'salvia-may-night', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - German cultivar' },
        { plantId: 'daisy-shasta-becky', quantity: 6, role: 'seasonal', note: 'European daisy tradition' },
        { plantId: 'cone-flower', quantity: 5, role: 'seasonal', note: 'Cottage garden staple' },
        { plantId: 'yarrow', quantity: 6, role: 'seasonal', note: 'AUTHENTIC - European native' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 8, role: 'texture', note: 'AUTHENTIC - named after German horticulturist!' },
        { plantId: 'lamb-ear', quantity: 8, role: 'texture', note: 'AUTHENTIC - European native' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'AUTHENTIC - European herb' },
        { plantId: 'sedum-angelina', quantity: 2, role: 'carpet', note: 'European stonecrop' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded areas',
        changes: [
          { remove: 'salvia-may-night', add: 'hosta', reason: 'Shade tolerant' }
        ]
      }
    },
    finishNotes: 'PRECISION hedge trimming essential. Gravel paths. Window boxes with geraniums. Orderly but romantic.',
    inspirationSource: 'EPCOT Germany Pavilion - Bavarian village garden'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // USA PAVILION - Native American plants + national symbols
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-usa',
    name: 'USA Pavilion',
    subtitle: 'Native American Garden',
    description: 'AUTHENTIC native plants + national symbols. Rose (national flower), dogwood, redbud, coneflower, black-eyed susan - all NATIVE to North America.',
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
        { plantId: 'dogwood', quantity: 1, role: 'hero', note: 'NATIVE - iconic American flowering tree' },
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'NATIVE - Eastern US native' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'NATIVE - multi-season interest' }
      ],
      structure: [
        { plantId: 'holly-inkberry', quantity: 5, role: 'structure', note: 'NATIVE - Eastern US holly' },
        { plantId: 'wax-myrtle', quantity: 4, role: 'structure', note: 'NATIVE - coastal native' },
        { plantId: 'itea-virginia', quantity: 4, role: 'structure', note: 'NATIVE - Virginia sweetspire' },
        { plantId: 'viburnum-spring-bouquet', quantity: 3, role: 'structure', note: 'NATIVE - American viburnum' }
      ],
      seasonal: [
        { plantId: 'rose-knock-out', quantity: 8, role: 'seasonal', note: 'National flower of USA' },
        { plantId: 'cone-flower', quantity: 8, role: 'seasonal', note: 'NATIVE - prairie coneflower' },
        { plantId: 'black-eyed-susan', quantity: 8, role: 'seasonal', note: 'NATIVE - Maryland state flower' },
        { plantId: 'bee-balm', quantity: 5, role: 'seasonal', note: 'NATIVE - American wildflower' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture', note: 'NATIVE - Gulf Coast grass' },
        { plantId: 'little-bluestem', quantity: 5, role: 'texture', note: 'NATIVE - prairie grass' },
        { plantId: 'fern-autumn', quantity: 6, role: 'texture', note: 'NATIVE - American fern' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 3, role: 'carpet', note: 'NATIVE - Appalachian wildflower' },
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded areas',
        changes: [
          { remove: 'cone-flower', add: 'hydrangea-oakleaf', reason: 'NATIVE shade bloomer' }
        ]
      }
    },
    finishNotes: 'Celebrate American natives! Strong foundation. Clean edges. Red-white-blue color pops.',
    inspirationSource: 'EPCOT USA Pavilion - Celebrating native American flora'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MOROCCO PAVILION - Mediterranean/North African riad courtyard
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-morocco',
    name: 'Morocco Pavilion',
    subtitle: 'Riad Courtyard + Fragrance',
    description: 'AUTHENTIC Moroccan riad courtyard - fragrant roses, citrus vibes, lavender, rosemary, and geometric hedges. Drought-tolerant Mediterranean feel.',
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
        { plantId: 'pomegranate', quantity: 1, role: 'hero', note: 'AUTHENTIC - Middle Eastern fruit tree' },
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'AUTHENTIC - Mediterranean tree' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 12, role: 'structure', note: 'AUTHENTIC - geometric riad hedging' },
        { plantId: 'tea-olive', quantity: 3, role: 'structure', note: 'AUTHENTIC - olive tree substitute, fragrant' },
        { plantId: 'juniper-blue-star', quantity: 4, role: 'structure', note: 'Mediterranean conifer' }
      ],
      seasonal: [
        { plantId: 'rose-knock-out', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - Damask rose culture' },
        { plantId: 'lavender-phenomenal', quantity: 10, role: 'seasonal', note: 'AUTHENTIC - Mediterranean lavender' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal', note: 'Mediterranean sage family' },
        { plantId: 'yarrow', quantity: 5, role: 'seasonal', note: 'AUTHENTIC - Mediterranean native' }
      ],
      texture: [
        { plantId: 'rosemary', quantity: 8, role: 'texture', note: 'AUTHENTIC - Mediterranean herb' },
        { plantId: 'blue-fescue', quantity: 8, role: 'texture', note: 'Silver-blue Mediterranean grass' },
        { plantId: 'lamb-ear', quantity: 6, role: 'texture', note: 'AUTHENTIC - Middle Eastern native' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'AUTHENTIC - Mediterranean herb' },
        { plantId: 'sedum-angelina', quantity: 2, role: 'carpet', note: 'Mediterranean succulent' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 7 or colder',
        changes: [
          { remove: 'rosemary', add: 'juniper-blue-star', reason: 'More cold hardy' }
        ]
      }
    },
    finishNotes: 'TILES essential. Central fountain. Geometric precision. Fragrance near seating. Terra cotta pots.',
    inspirationSource: 'EPCOT Morocco Pavilion - Traditional riad courtyard garden'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FRANCE PAVILION - French formal parterre + Provence lavender
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-france',
    name: 'France Pavilion',
    subtitle: 'Parterre + Lavender Romance',
    description: 'AUTHENTIC French formal garden - boxwood parterres, lavender fields of Provence, roses. Symmetry and romance in perfect balance.',
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
        { plantId: 'crape-myrtle-muskogee', quantity: 1, role: 'hero', note: 'Lavender blooms - Provence feel' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'AUTHENTIC - European magnolia' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 20, role: 'structure', note: 'AUTHENTIC - French parterre essential' },
        { plantId: 'holly-sky-pencil', quantity: 6, role: 'structure', note: 'Formal vertical accents' },
        { plantId: 'yew-podocarpus', quantity: 4, role: 'structure', note: 'AUTHENTIC - European topiary tradition' }
      ],
      seasonal: [
        { plantId: 'lavender-phenomenal', quantity: 14, role: 'seasonal', note: 'AUTHENTIC - Provence lavender fields' },
        { plantId: 'rose-drift-pink', quantity: 8, role: 'seasonal', note: 'AUTHENTIC - French rose gardens' },
        { plantId: 'peony', quantity: 5, role: 'seasonal', note: 'AUTHENTIC - French cottage favorite' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal', note: 'AUTHENTIC - French hydrangea tradition' }
      ],
      texture: [
        { plantId: 'catmint-walkers-low', quantity: 12, role: 'texture', note: 'Lavender companion' },
        { plantId: 'russian-sage', quantity: 6, role: 'texture', note: 'Silver-blue Provence feel' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'AUTHENTIC - French herb garden' },
        { plantId: 'sedum-angelina', quantity: 2, role: 'carpet', note: 'Golden accent' }
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
    finishNotes: 'SYMMETRY is everything. Clipped boxwood. Pea gravel paths. White garden furniture. Très élégant!',
    inspirationSource: 'EPCOT France Pavilion - Versailles meets Provence'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CANADA PAVILION - Boreal forest + maples (national symbol)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'epcot-canada',
    name: 'Canada Pavilion',
    subtitle: 'Boreal Forest + Maples',
    description: 'AUTHENTIC Canadian boreal forest feel - MAPLES (national symbol), white bark birch, conifers, woodland ferns. Fall color spectacular.',
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
        { plantId: 'maple-october-glory', quantity: 2, role: 'hero', note: 'AUTHENTIC - Canadian maple symbol!' },
        { plantId: 'river-birch', quantity: 2, role: 'hero', note: 'AUTHENTIC - Canadian white birch' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'NATIVE - Canadian berry shrub' },
        { plantId: 'arborvitae-emerald-green', quantity: 2, role: 'hero', note: 'AUTHENTIC - Northern cedar' }
      ],
      structure: [
        { plantId: 'juniper-blue-star', quantity: 5, role: 'structure', note: 'AUTHENTIC - boreal conifer' },
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure', note: 'NATIVE - North American holly' },
        { plantId: 'viburnum-spring-bouquet', quantity: 4, role: 'structure', note: 'NATIVE - American viburnum' },
        { plantId: 'clethra', quantity: 3, role: 'structure', note: 'NATIVE - summersweet' }
      ],
      seasonal: [
        { plantId: 'hydrangea-oakleaf', quantity: 5, role: 'seasonal', note: 'NATIVE - fall color' },
        { plantId: 'astilbe', quantity: 6, role: 'seasonal', note: 'Woodland bloomer' },
        { plantId: 'iris', quantity: 5, role: 'seasonal', note: 'Stream edge color' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 10, role: 'texture', note: 'AUTHENTIC - woodland fern' },
        { plantId: 'fern-christmas', quantity: 8, role: 'texture', note: 'Evergreen fern - winter interest' },
        { plantId: 'carex', quantity: 8, role: 'texture', note: 'NATIVE - sedge grass' },
        { plantId: 'hosta', quantity: 6, role: 'texture', note: 'Woodland shade plant' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'Forest floor groundcover' },
        { plantId: 'creeping-jenny', quantity: 2, role: 'carpet', note: 'Stream edge gold' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Hot/dry or exposed',
        changes: [
          { remove: 'fern-autumn', add: 'carex', reason: 'More heat tolerant' }
        ]
      }
    },
    finishNotes: 'BOULDERS essential. Stream/waterfall if possible. Natural bark mulch. Forest edge feel. Fall color is the star!',
    inspirationSource: 'EPCOT Canada Pavilion - Celebrating the maple leaf nation'
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // RESIDENTIAL HOME LANDSCAPE PACKAGES
  // ═══════════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // CLASSIC FOUNDATION - Traditional 3-layer home foundation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'residential-foundation-classic',
    name: 'Classic Foundation',
    subtitle: 'Traditional Home Foundation',
    description: 'Time-tested 3-layer foundation planting with evergreen backbone, seasonal color, and defined edges. Perfect for front of home.',
    theme: 'Residential',
    preview: '🏡',
    colorScheme: ['#2E7D32', '#4CAF50', '#E91E63', '#FFFFFF'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    residentialZone: 'FRONT_FOUNDATION',
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'Corner specimen - min 8ft from house' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 6, role: 'structure', note: 'Back row - 3ft from house' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure', note: 'Mid-height evergreen' },
        { plantId: 'distylium-vintage-jade', quantity: 3, role: 'structure', note: 'Under windows' }
      ],
      seasonal: [
        { plantId: 'azalea-encore-autumn-carnation', quantity: 6, role: 'seasonal', note: 'Spring/fall color' },
        { plantId: 'hydrangea-endless-summer', quantity: 3, role: 'seasonal', note: 'Summer focal' },
        { plantId: 'gardenia-august-beauty', quantity: 2, role: 'seasonal', note: 'Near entry for fragrance' }
      ],
      texture: [
        { plantId: 'daylily-stella-doro', quantity: 8, role: 'texture', note: 'Middle row' },
        { plantId: 'hosta', quantity: 5, role: 'texture', note: 'Shaded areas' },
        { plantId: 'coral-bell', quantity: 5, role: 'texture' }
      ],
      carpet: [
        { plantId: 'liriope-variegated', quantity: 15, role: 'carpet', note: 'Edge definition' },
        { plantId: 'mondo-grass', quantity: 12, role: 'carpet', note: 'Between stepping stones' }
      ]
    },
    placementRules: {
      distanceFromHouse: 36,
      maintainWindowClearance: true,
      cornerAccent: true
    },
    finishNotes: '3ft maintenance access behind shrubs. Keep 6" below windowsills.',
    inspirationSource: 'Traditional American Home Landscaping'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CURB APPEAL COTTAGE - Colorful informal front yard
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'residential-curb-appeal-cottage',
    name: 'Cottage Curb Appeal',
    subtitle: 'Colorful Front Yard',
    description: 'Welcoming, colorful cottage-style planting that draws eyes to your entry. Informal layering with year-round interest.',
    theme: 'Residential',
    preview: '🌷',
    colorScheme: ['#E91E63', '#9C27B0', '#FFEB3B', '#4CAF50'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    residentialZone: 'FRONT_FOUNDATION',
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Near entry - frame door' },
        { plantId: 'dogwood', quantity: 1, role: 'hero', note: 'Spring focal' }
      ],
      structure: [
        { plantId: 'rose-knockout-pink', quantity: 5, role: 'structure', note: 'Continuous bloom' },
        { plantId: 'hydrangea-limelight', quantity: 3, role: 'structure' },
        { plantId: 'spiraea-goldmound', quantity: 4, role: 'structure', note: 'Golden foliage accent' }
      ],
      seasonal: [
        { plantId: 'coneflower-purple', quantity: 8, role: 'seasonal', note: 'Pollinator magnet' },
        { plantId: 'black-eyed-susan', quantity: 8, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 6, role: 'seasonal' },
        { plantId: 'daylily-stella-doro', quantity: 10, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'catmint-walkers-low', quantity: 8, role: 'texture' },
        { plantId: 'russian-sage', quantity: 4, role: 'texture', note: 'Back corners' },
        { plantId: 'blue-fescue', quantity: 12, role: 'texture', note: 'Front accent' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 10, role: 'carpet', note: 'Spring carpet' },
        { plantId: 'sedum-angelina', quantity: 8, role: 'carpet', note: 'Golden edge' },
        { plantId: 'creeping-thyme', quantity: 6, role: 'carpet' }
      ]
    },
    designPrinciples: {
      oddNumbers: true,
      repeatColors: true,
      entryFocus: true
    },
    finishNotes: 'Curves, not straight lines. Let plants intermingle.',
    inspirationSource: 'English Cottage Garden Style'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVACY SCREEN - Layered backyard screening
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'residential-privacy-screen',
    name: 'Privacy Screen',
    subtitle: 'Layered Backyard Privacy',
    description: 'Multi-layer screening for maximum privacy. Staggered planting with 60% evergreen for year-round coverage.',
    theme: 'Residential',
    preview: '🌲',
    colorScheme: ['#1B5E20', '#2E7D32', '#4CAF50', '#81C784'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    residentialZone: 'PRIVACY_SCREEN',
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'cryptomeria-radicans', quantity: 3, role: 'hero', note: 'Tall evergreen screen - stagger' },
        { plantId: 'magnolia-southern', quantity: 1, role: 'hero', note: 'Year-round foliage' }
      ],
      structure: [
        { plantId: 'holly-nellie-stevens', quantity: 6, role: 'structure', note: 'Second row screen' },
        { plantId: 'tea-olive', quantity: 4, role: 'structure', note: 'Fragrance + screening' },
        { plantId: 'cleyera', quantity: 5, role: 'structure' },
        { plantId: 'viburnum-spring-bouquet', quantity: 4, role: 'structure', note: 'Fragrant spring' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 4, role: 'seasonal', note: 'Winter color' },
        { plantId: 'loropetalum-purple-pixie', quantity: 6, role: 'seasonal' },
        { plantId: 'hydrangea-oakleaf', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 8, role: 'texture', note: 'Fall plumes' },
        { plantId: 'maiden-grass', quantity: 4, role: 'texture', note: 'Movement/sound' },
        { plantId: 'fern-autumn', quantity: 8, role: 'texture' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 20, role: 'carpet', note: 'Aggressive - edge carefully' },
        { plantId: 'pachysandra', quantity: 15, role: 'carpet', note: 'Shade areas' }
      ]
    },
    placementRules: {
      staggeredRows: true,
      rowSpacing: 48,
      rowOffset: 0.5,
      evergreenRatio: 0.6
    },
    finishNotes: 'Stagger plants in zig-zag. Place screen 8-10ft from patio for intimacy.',
    inspirationSource: 'Professional Privacy Screening Techniques'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LOW MAINTENANCE - Easy care foundation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'residential-low-maintenance',
    name: 'Easy Care',
    subtitle: 'Low Maintenance Foundation',
    description: 'Maximum impact, minimum effort. Drought-tolerant, disease-resistant plants that thrive on neglect.',
    theme: 'Residential',
    preview: '🌿',
    colorScheme: ['#2E7D32', '#8BC34A', '#CDDC39', '#795548'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    residentialZone: 'FRONT_FOUNDATION',
    filters: {
      light: 'full-sun',
      moisture: 'dry',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'No spraying needed' }
      ],
      structure: [
        { plantId: 'distylium-vintage-jade', quantity: 6, role: 'structure', note: 'No pruning needed' },
        { plantId: 'loropetalum-purple-pixie', quantity: 4, role: 'structure', note: 'Dwarf - no pruning' },
        { plantId: 'juniper-blue-rug', quantity: 4, role: 'structure' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rose-knockout-pink', quantity: 5, role: 'seasonal', note: 'Self-cleaning' },
        { plantId: 'daylily-stella-doro', quantity: 12, role: 'seasonal', note: 'Reblooming' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture', note: 'Cut back once/year' },
        { plantId: 'blue-fescue', quantity: 10, role: 'texture' },
        { plantId: 'yucca-color-guard', quantity: 3, role: 'texture', note: 'Dramatic accent' }
      ],
      carpet: [
        { plantId: 'sedum-angelina', quantity: 15, role: 'carpet', note: 'Drought-proof' },
        { plantId: 'creeping-thyme', quantity: 10, role: 'carpet', note: 'Walk on it' },
        { plantId: 'bar-harbor-juniper', quantity: 5, role: 'carpet' }
      ]
    },
    requirements: {
      waterReq: 'Low',
      diseaseResistant: true,
      minimalPruning: true
    },
    finishNotes: '3" mulch. Drip irrigation optional. One spring cleanup.',
    inspirationSource: 'Xeriscaping Principles'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FOUR SEASON INTEREST - Year-round beauty
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'residential-four-season',
    name: 'Four Season Interest',
    subtitle: 'Year-Round Beauty',
    description: 'Something beautiful every month. Planned bloom sequence with winter structure, fall color, and year-round texture.',
    theme: 'Residential',
    preview: '🍂',
    colorScheme: ['#E91E63', '#4CAF50', '#FF9800', '#9C27B0'],
    baseSize: '175 sq ft',
    defaultZone: 7,
    residentialZone: 'BACKYARD_BORDER',
    filters: {
      light: 'part-shade',
      moisture: 'average',
      maintenance: 'standard'
    },
    plants: {
      hero: [
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'Spring red, fall crimson' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Spring flowers, fall fruit, winter bark' },
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'Exfoliating bark - winter interest' }
      ],
      structure: [
        { plantId: 'holly-nellie-stevens', quantity: 3, role: 'structure', note: 'Winter berries' },
        { plantId: 'camellia-japonica', quantity: 3, role: 'structure', note: 'Winter bloom' },
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 3, role: 'structure', note: 'Fall bloom' },
        { plantId: 'boxwood-wintergreen', quantity: 4, role: 'structure', note: 'Evergreen structure' }
      ],
      seasonal: [
        { plantId: 'azalea-encore-autumn-carnation', quantity: 5, role: 'seasonal', note: 'Spring + fall' },
        { plantId: 'hydrangea-oakleaf', quantity: 3, role: 'seasonal', note: 'Summer bloom, fall color' },
        { plantId: 'witch-hazel', quantity: 2, role: 'seasonal', note: 'Late winter bloom' },
        { plantId: 'coneflower-purple', quantity: 6, role: 'seasonal', note: 'Summer bloom, winter seeds' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture', note: 'Fall plumes' },
        { plantId: 'karl-foerster', quantity: 4, role: 'texture', note: 'Winter structure' },
        { plantId: 'hosta', quantity: 8, role: 'texture', note: 'Spring-fall foliage' },
        { plantId: 'fern-christmas', quantity: 6, role: 'texture', note: 'Evergreen fern' }
      ],
      carpet: [
        { plantId: 'hellebore', quantity: 8, role: 'carpet', note: 'Late winter bloom' },
        { plantId: 'mondo-grass', quantity: 12, role: 'carpet', note: 'Evergreen carpet' },
        { plantId: 'creeping-phlox', quantity: 8, role: 'carpet', note: 'Early spring color' }
      ]
    },
    bloomCalendar: {
      jan: ['camellia-japonica', 'hellebore'],
      feb: ['camellia-japonica', 'witch-hazel', 'hellebore'],
      mar: ['creeping-phlox', 'serviceberry'],
      apr: ['azalea', 'dogwood', 'japanese-maple'],
      may: ['azalea', 'hydrangea'],
      jun: ['hydrangea', 'daylily'],
      jul: ['coneflower', 'hydrangea'],
      aug: ['muhly-grass', 'coneflower'],
      sep: ['muhly-grass', 'azalea-encore'],
      oct: ['camellia-sasanqua', 'fall-color'],
      nov: ['camellia-sasanqua', 'berries'],
      dec: ['camellia-japonica', 'holly-berries', 'bark-interest']
    },
    finishNotes: 'Group by bloom time for maximum impact. Ensure something blooms every month.',
    inspirationSource: 'Professional Four-Season Garden Design'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // POLLINATOR PARADISE - Attract butterflies, bees, hummingbirds
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'residential-pollinator',
    name: 'Pollinator Paradise',
    subtitle: 'Wildlife Garden',
    description: 'Attract butterflies, bees, and hummingbirds with native and nectar-rich plants. Continuous bloom from spring to frost.',
    theme: 'Residential',
    preview: '🦋',
    colorScheme: ['#9C27B0', '#FF9800', '#E91E63', '#FFEB3B'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    residentialZone: 'BACKYARD_BORDER',
    filters: {
      light: 'full-sun',
      moisture: 'average',
      maintenance: 'low'
    },
    plants: {
      hero: [
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Native - spring nectar, fall berries' },
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'Summer nectar' }
      ],
      structure: [
        { plantId: 'itea-little-henry', quantity: 4, role: 'structure', note: 'Native - fragrant' },
        { plantId: 'clethra', quantity: 3, role: 'structure', note: 'Summersweet - bees love it' },
        { plantId: 'viburnum-spring-bouquet', quantity: 3, role: 'structure', note: 'Spring flowers, fall berries' }
      ],
      seasonal: [
        { plantId: 'coneflower-purple', quantity: 12, role: 'seasonal', note: 'Butterfly magnet' },
        { plantId: 'black-eyed-susan', quantity: 10, role: 'seasonal', note: 'Native - goldfinch seeds' },
        { plantId: 'bee-balm', quantity: 6, role: 'seasonal', note: 'Hummingbird favorite' },
        { plantId: 'salvia-may-night', quantity: 8, role: 'seasonal', note: 'Long bloom' },
        { plantId: 'lantana', quantity: 6, role: 'seasonal', note: 'Butterfly nectar' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 6, role: 'texture', note: 'Fall interest' },
        { plantId: 'karl-foerster', quantity: 4, role: 'texture', note: 'Grass seeds for birds' },
        { plantId: 'catmint-walkers-low', quantity: 8, role: 'texture', note: 'Bee favorite' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 12, role: 'carpet', note: 'Ground bee haven' },
        { plantId: 'sedum-angelina', quantity: 8, role: 'carpet', note: 'Late season nectar' },
        { plantId: 'ajuga', quantity: 10, role: 'carpet', note: 'Early spring nectar' }
      ]
    },
    requirements: {
      nativePlants: true,
      noPesticides: true,
      continuousBloom: true
    },
    finishNotes: 'No pesticides! Leave seed heads for winter bird food. Shallow water source nearby.',
    inspirationSource: 'Xerces Society Pollinator Guidelines'
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
