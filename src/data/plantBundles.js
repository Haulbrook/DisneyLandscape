// ═══════════════════════════════════════════════════════════════════════════════
// PLANT PACKAGE / BUNDLE SYSTEM
// Theme-based landscape packages with swap logic for different conditions
// Built for North GA / Gainesville (Zone 7b-8a) as default
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
  HERO: 'hero',           // 1-3 signature plants that sell the theme
  STRUCTURE: 'structure', // Evergreen backbone
  SEASONAL: 'seasonal',   // Bloom sequence / seasonal color
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
// THEME PACKAGES
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
        { plantId: 'tea-olive-15gal', quantity: 1, role: 'hero', note: 'Signature fragrance' },
        { plantId: 'dogwood-2in', quantity: 1, role: 'hero', note: 'Spring focal - Masters timing' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 5, role: 'hero', note: 'Signature color mass' },
        { plantId: 'magnolia-southern-10ft', quantity: 1, role: 'hero', note: 'Grand statement' }
      ],
      structure: [
        { plantId: 'holly-hoogendorn', quantity: 4, role: 'structure' },
        { plantId: 'boxwood-wintergreen-3gal', quantity: 6, role: 'structure' },
        { plantId: 'cleyera', quantity: 3, role: 'structure' },
        { plantId: 'distylium-vintage-jade', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 2, role: 'seasonal', note: 'Winter bloom' },
        { plantId: 'camellia-japonica-7gal', quantity: 2, role: 'seasonal' },
        { plantId: 'hydrangea-limelight', quantity: 3, role: 'seasonal' },
        { plantId: 'gardenia-august-beauty-3gal', quantity: 2, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink-1gal', quantity: 5, role: 'texture', note: 'Fall pink clouds' },
        { plantId: 'muhly-grass-white-cloud-1gal', quantity: 3, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 1, role: 'carpet', note: 'Flat coverage' },
        { plantId: 'fern-autumn-3gal', quantity: 6, role: 'carpet' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 6-7 / Exposed sites',
        changes: [
          { remove: 'tea-olive-15gal', add: 'osmanthus-fortunei-tea-olive-15gal', reason: 'More cold hardy' },
          { remove: 'gardenia-august-beauty-3gal', add: 'camellia-sasanqua-hot-flash', reason: 'Better cold tolerance' }
        ]
      },
      nandinaFree: {
        condition: 'Client wants nandina-free design',
        changes: [
          { remove: 'nandina', add: 'distylium-vintage-jade', reason: 'Similar form, non-invasive' },
          { remove: 'nandina-blush-pink', add: 'loropetalum-purple-pixie', reason: 'Colorful alternative' }
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
        { plantId: 'crape-myrtle-natchez-2.5in', quantity: 1, role: 'hero', note: 'White summer blooms' },
        { plantId: 'hydrangea-limelight', quantity: 2, role: 'hero' },
        { plantId: 'rose-knock-out-double-red', quantity: 4, role: 'hero', note: 'Continuous color' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen-3gal', quantity: 8, role: 'structure', note: 'Foundation hedge' },
        { plantId: 'holly-sky-pencil-7gal', quantity: 2, role: 'structure', note: 'Vertical accents' },
        { plantId: 'gardenia-frostproof-3gal', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rose-coral-drift', quantity: 4, role: 'seasonal' },
        { plantId: 'rose-pink-drift', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 3, role: 'texture', note: 'Vertical grass accents' },
        { plantId: 'muhly-grass-pink-1gal', quantity: 4, role: 'texture', note: 'Soft fall edge' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet', note: 'Between stepping stones' },
        { plantId: 'mondo-grass', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Less than 4-5 hours sun',
        changes: [
          { remove: 'rose-knock-out-double-red', add: 'hydrangea-endless-summer', reason: 'Shade tolerant blooms' },
          { remove: 'rose-coral-drift', add: 'fern-autumn-1gal', reason: 'Texture for shade' },
          { remove: 'rose-pink-drift', add: 'camellia-sasanqua-hot-flash', reason: 'Shade-loving color' }
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
        { plantId: 'japanese-maple-bloodgood-6ft', quantity: 1, role: 'hero', note: 'Primary focal' },
        { plantId: 'japanese-maple-coral-bark-6ft', quantity: 1, role: 'hero', note: 'Winter bark interest' },
        { plantId: 'camellia-japonica-7gal', quantity: 2, role: 'hero' },
        { plantId: 'azalea-encore-autumn-amethyst-7gal', quantity: 3, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-sky-pencil-7gal', quantity: 3, role: 'structure', note: 'Vertical evergreen' },
        { plantId: 'holly-needlepoint', quantity: 2, role: 'structure' },
        { plantId: 'cryptomeria-3gal', quantity: 2, role: 'structure' },
        { plantId: 'hinoki-cypress-5ft', quantity: 1, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 2, role: 'seasonal' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'fern-autumn-3gal', quantity: 4, role: 'texture' },
        { plantId: 'fern-japanese-painted', quantity: 3, role: 'texture' },
        { plantId: 'fern-holly', quantity: 3, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet', note: 'Primary groundcover' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Full sun / hot sites',
        changes: [
          { remove: 'japanese-maple-bloodgood-6ft', add: 'cryptomeria-10ft', reason: 'Heat tolerant focal' },
          { remove: 'japanese-maple-coral-bark-6ft', add: 'holly-sky-pencil-7gal', reason: 'Vertical without scorch' }
        ]
      }
    },
    finishNotes: 'Decomposed granite or pea gravel paths. Natural boulders. Raked gravel beds optional. Minimal color - structure dominates.',
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
        { plantId: 'boxwood-wintergreen-3gal', quantity: 12, role: 'hero', note: 'Hedge structure' },
        { plantId: 'hydrangea-endless-summer', quantity: 3, role: 'hero' },
        { plantId: 'rose-knock-out-double-red', quantity: 4, role: 'hero' }
      ],
      structure: [
        { plantId: 'yew-podocarpus-plum-pine-7gal', quantity: 3, role: 'structure', note: 'Hedge mass' },
        { plantId: 'holly-sky-pencil-7gal', quantity: 2, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'lavender-phenomenal', quantity: 5, role: 'seasonal' },
        { plantId: 'catmint-walkers-low', quantity: 6, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 5, role: 'seasonal' },
        { plantId: 'peony-2gal', quantity: 2, role: 'seasonal', note: 'Where zone allows' },
        { plantId: 'daisy-shasta-becky', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 3, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 1, role: 'carpet' },
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      deer: {
        condition: 'High deer pressure',
        changes: [
          { remove: 'rose-knock-out-double-red', add: 'boxwood-wintergreen-3gal', reason: 'Deer resistant' },
          { remove: 'hosta', add: 'distylium-vintage-jade', reason: 'Deer resistant foliage' }
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
        { plantId: 'rosemary-1gal', quantity: 3, role: 'hero', note: 'Culinary + ornamental' },
        { plantId: 'lavender-phenomenal', quantity: 5, role: 'hero' },
        { plantId: 'vitex-shoal-creek-15gal', quantity: 1, role: 'hero', note: 'Summer blue spikes' },
        { plantId: 'holly-sky-pencil-7gal', quantity: 4, role: 'hero', note: 'Italian cypress substitute' }
      ],
      structure: [
        { plantId: 'tea-olive-7gal', quantity: 2, role: 'structure' },
        { plantId: 'juniper-blue-pacific', quantity: 4, role: 'structure' },
        { plantId: 'juniper-blue-star-3gal', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rose-coral-drift', quantity: 3, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 6, role: 'texture', note: 'Silver-blue clumps' },
        { plantId: 'sedum-autumn-joy', quantity: 4, role: 'texture' },
        { plantId: 'sedum-angelina', quantity: 1, role: 'texture', note: 'Golden groundcover' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' },
        { plantId: 'rosemary-creeping', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      cold: {
        condition: 'Zone 7 or colder',
        changes: [
          { remove: 'rosemary-1gal', add: 'juniper-blue-star-3gal', reason: 'More cold hardy' },
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
        { plantId: 'wax-myrtle', quantity: 2, role: 'hero', note: 'Native coastal shrub' },
        { plantId: 'holly-dwarf-yaupon', quantity: 4, role: 'hero' },
        { plantId: 'juniper-blue-rug', quantity: 6, role: 'hero' },
        { plantId: 'juniper-blue-pacific', quantity: 4, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-inkberry', quantity: 3, role: 'structure' },
        { plantId: 'juniper-parsonii', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'northern-sea-oaks', quantity: 5, role: 'seasonal', note: 'Native oat grass' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink-3gal', quantity: 6, role: 'texture', note: 'Fall pink clouds' },
        { plantId: 'muhly-grass-white-cloud-3gal', quantity: 4, role: 'texture' },
        { plantId: 'sweet-flag-grass', quantity: 4, role: 'texture', note: 'Wet pocket accents' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 1, role: 'carpet', note: 'FLAG: Aggressive - manage edges' }
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
        { plantId: 'cone-flower-1gal', quantity: 8, role: 'hero', note: 'Pollinator magnet' },
        { plantId: 'black-eyed-susan', quantity: 8, role: 'hero' },
        { plantId: 'yarrow-1gal', quantity: 5, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-inkberry', quantity: 2, role: 'structure', note: 'Only if clean edge needed' }
      ],
      seasonal: [
        { plantId: 'salvia-may-night', quantity: 4, role: 'seasonal' },
        { plantId: 'salvia-blue-hill', quantity: 4, role: 'seasonal' },
        { plantId: 'bee-balm-petite-delight', quantity: 3, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink-3gal', quantity: 6, role: 'texture' },
        { plantId: 'karl-foerster', quantity: 4, role: 'texture' },
        { plantId: 'purple-lovegrass', quantity: 4, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Part shade areas',
        changes: [
          { remove: 'cone-flower-1gal', add: 'fern-autumn-1gal', reason: 'Shade tolerant texture' },
          { remove: 'black-eyed-susan', add: 'hydrangea-oakleaf-7gal', reason: 'Native shade bloomer' },
          { add: 'carex-everillo', quantity: 6, reason: 'Shade-loving grass' }
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
        { plantId: 'sweet-flag-grass', quantity: 6, role: 'hero', note: 'Loves wet feet' },
        { plantId: 'carex-1gal', quantity: 8, role: 'hero' },
        { plantId: 'iris', quantity: 6, role: 'hero', note: 'Wet-tolerant blooms' }
      ],
      structure: [
        { plantId: 'wax-myrtle', quantity: 2, role: 'structure', note: 'Tolerates wet' },
        { plantId: 'river-birch-heritage-8ft', quantity: 1, role: 'structure', note: 'Where space allows' }
      ],
      seasonal: [
        { plantId: 'calla-lillies', quantity: 4, role: 'seasonal' },
        { plantId: 'astilbe-fanal', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'northern-sea-oaks', quantity: 4, role: 'texture' },
        { plantId: 'muhly-grass-pink-1gal', quantity: 4, role: 'texture', note: 'Edge - drier zone' }
      ],
      carpet: [
        { plantId: 'creeping-jenny', quantity: 1, role: 'carpet', note: 'Wet-tolerant spreader' }
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
        { plantId: 'rose-coral-drift', quantity: 4, role: 'hero' },
        { plantId: 'rose-red-drift', quantity: 4, role: 'hero' },
        { plantId: 'salvia-may-night', quantity: 5, role: 'hero' }
      ],
      structure: [
        { plantId: 'tea-olive-3gal', quantity: 2, role: 'structure' },
        { plantId: 'juniper-blue-pacific', quantity: 3, role: 'structure' },
        { plantId: 'nandina', quantity: 3, role: 'structure', note: 'FLAG: Invasive - get approval' }
      ],
      seasonal: [
        { plantId: 'cone-flower-cheyenne-spirit', quantity: 4, role: 'seasonal' },
        { plantId: 'yarrow-1gal', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 5, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 1, role: 'carpet' },
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded courtyard',
        changes: [
          { remove: 'rose-coral-drift', add: 'fern-autumn-1gal', reason: 'Shade texture' },
          { remove: 'rose-red-drift', add: 'camellia-sasanqua-hot-flash', reason: 'Shade color' }
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
        { plantId: 'dwarf-alberta', quantity: 2, role: 'hero', note: 'Alpine conifer' },
        { plantId: 'hinoki-cypress-5ft', quantity: 1, role: 'hero' },
        { plantId: 'cryptomeria-10ft', quantity: 1, role: 'hero' },
        { plantId: 'canadian-hemlock-7ft', quantity: 1, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-hoogendorn', quantity: 4, role: 'structure' },
        { plantId: 'juniper-blue-star-3gal', quantity: 3, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-limelight', quantity: 2, role: 'seasonal', note: 'White blooms' },
        { plantId: 'gardenia-august-beauty-3gal', quantity: 2, role: 'seasonal' },
        { plantId: 'iris', quantity: 4, role: 'seasonal', note: 'Near water features' }
      ],
      texture: [
        { plantId: 'carex-everillo', quantity: 6, role: 'texture' },
        { plantId: 'sweet-flag-grass', quantity: 4, role: 'texture' },
        { plantId: 'fern-autumn-1gal', quantity: 4, role: 'texture' },
        { plantId: 'fern-holly', quantity: 3, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Zone 9-10 heat',
        changes: [
          { remove: 'canadian-hemlock-7ft', add: 'cryptomeria-10ft', reason: 'Heat tolerant' },
          { remove: 'dwarf-alberta', add: 'holly-sky-pencil-7gal', reason: 'Heat tolerant vertical' }
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
        { plantId: 'peony-2gal', quantity: 3, role: 'hero', note: 'Traditional symbol' },
        { plantId: 'camellia-japonica-7gal', quantity: 2, role: 'hero' },
        { plantId: 'chinese-snowball-viburnum-15gal', quantity: 1, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-hoogendorn', quantity: 4, role: 'structure' },
        { plantId: 'cleyera', quantity: 3, role: 'structure' },
        { plantId: 'distylium-vintage-jade', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua-hot-flash', quantity: 2, role: 'seasonal' },
        { plantId: 'azalea-encore-autumn-carnation', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'mondo-grass', quantity: 1, role: 'texture' },
        { plantId: 'fern-autumn-1gal', quantity: 4, role: 'texture' },
        { plantId: 'carex-1gal', quantity: 4, role: 'texture' },
        { plantId: 'muhly-grass-pink-1gal', quantity: 3, role: 'texture', note: 'Sunny outer ring' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Deep shade',
        changes: [
          { remove: 'muhly-grass-pink-1gal', add: 'fern-holly', reason: 'Shade tolerant' },
          { add: 'sweet-flag-grass', quantity: 4, reason: 'Wet shade accent' }
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
        { plantId: 'boxwood-wintergreen-3gal', quantity: 10, role: 'hero', note: 'Formal hedge' },
        { plantId: 'spirea-gold-flame', quantity: 3, role: 'hero' },
        { plantId: 'weigela', quantity: 2, role: 'hero' }
      ],
      structure: [
        { plantId: 'yew-japanese-plum', quantity: 3, role: 'structure' },
        { plantId: 'holly-sky-pencil-7gal', quantity: 2, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'catmint-walkers-low', quantity: 6, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 5, role: 'seasonal' },
        { plantId: 'daisy-shasta-becky', quantity: 4, role: 'seasonal' },
        { plantId: 'cone-flower-1gal', quantity: 4, role: 'seasonal' },
        { plantId: 'yarrow-1gal', quantity: 4, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 4, role: 'texture', note: 'Tidy verticals' },
        { plantId: 'hamlin-grass-3gal', quantity: 3, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      lowMaintenance: {
        condition: 'Reduce perennial maintenance',
        changes: [
          { remove: 'daisy-shasta-becky', add: 'boxwood-wintergreen-3gal', reason: 'Less deadheading' },
          { remove: 'cone-flower-1gal', add: 'distylium-vintage-jade', reason: 'Evergreen mass' }
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
        { plantId: 'rose-knock-out-double-red', quantity: 6, role: 'hero', note: 'National flower' },
        { plantId: 'rose-coral-drift', quantity: 4, role: 'hero' },
        { plantId: 'dogwood-2in', quantity: 1, role: 'hero' },
        { plantId: 'redbud-2in', quantity: 1, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-hoogendorn', quantity: 4, role: 'structure' },
        { plantId: 'boxwood-wintergreen-3gal', quantity: 6, role: 'structure' },
        { plantId: 'wax-myrtle', quantity: 2, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-limelight', quantity: 3, role: 'seasonal' },
        { plantId: 'hydrangea-little-lime', quantity: 2, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'fern-autumn-1gal', quantity: 4, role: 'texture' },
        { plantId: 'hosta-1gal', quantity: 4, role: 'texture', note: 'Check deer pressure' }
      ],
      carpet: [
        { plantId: 'liriope-variegated-1gal', quantity: 1, role: 'carpet', note: 'FLAG: Check invasive list' }
      ]
    },
    swaps: {
      deer: {
        condition: 'High deer pressure',
        changes: [
          { remove: 'hosta-1gal', add: 'distylium-vintage-jade', reason: 'Deer resistant' },
          { remove: 'rose-knock-out-double-red', add: 'holly-hoogendorn', reason: 'Deer resistant' }
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
        { plantId: 'rose-knock-out-double-red', quantity: 4, role: 'hero', note: 'Damask rose vibe' },
        { plantId: 'climbing-rose-peggy-martin', quantity: 1, role: 'hero', note: 'Climbing accent' },
        { plantId: 'tea-olive-7gal', quantity: 2, role: 'hero', note: 'Fragrance' },
        { plantId: 'gardenia-jubilation', quantity: 2, role: 'hero', note: 'Fragrance' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen-3gal', quantity: 8, role: 'structure', note: 'Geometric hedging' },
        { plantId: 'holly-hoogendorn', quantity: 3, role: 'structure' },
        { plantId: 'juniper-blue-star-3gal', quantity: 2, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'lavender-phenomenal', quantity: 4, role: 'seasonal' },
        { plantId: 'salvia-may-night', quantity: 4, role: 'seasonal' },
        { plantId: 'yarrow-1gal', quantity: 3, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 4, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      shade: {
        condition: 'Shaded courtyard',
        changes: [
          { remove: 'rose-knock-out-double-red', add: 'camellia-japonica-7gal', reason: 'Shade blooms' },
          { remove: 'lavender-phenomenal', add: 'fern-autumn-1gal', reason: 'Shade texture' }
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
        { plantId: 'boxwood-wintergreen-3gal', quantity: 14, role: 'hero', note: 'Parterre structure' },
        { plantId: 'holly-sky-pencil-7gal', quantity: 4, role: 'hero', note: 'Vertical accents' },
        { plantId: 'lavender-phenomenal', quantity: 6, role: 'hero' }
      ],
      structure: [
        { plantId: 'holly-hoogendorn', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'rose-pink-drift', quantity: 5, role: 'seasonal' },
        { plantId: 'peony-2gal', quantity: 2, role: 'seasonal' },
        { plantId: 'hydrangea-endless-summer', quantity: 3, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'catmint-walkers-low', quantity: 6, role: 'texture', note: 'Lavender ally' },
        { plantId: 'salvia-may-night', quantity: 4, role: 'texture' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      humid: {
        condition: 'Humid/shady sites',
        changes: [
          { remove: 'lavender-phenomenal', add: 'catmint-walkers-low', reason: 'Better in humidity' },
          { add: 'rosemary-1gal', quantity: 3, reason: 'Mediterranean alternative' }
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
        { plantId: 'maple-october-glory-3in', quantity: 1, role: 'hero', note: 'Fall color focal' },
        { plantId: 'maple-legacy-sugar-2in', quantity: 1, role: 'hero' },
        { plantId: 'river-birch-heritage-8ft', quantity: 1, role: 'hero' },
        { plantId: 'serviceberry-autumn-brilliance-2in', quantity: 1, role: 'hero' }
      ],
      structure: [
        { plantId: 'canadian-hemlock-7ft', quantity: 2, role: 'structure', note: 'Site dependent' },
        { plantId: 'cryptomeria-10ft', quantity: 1, role: 'structure' },
        { plantId: 'holly-hoogendorn', quantity: 4, role: 'structure' }
      ],
      seasonal: [
        { plantId: 'hydrangea-oakleaf-7gal', quantity: 2, role: 'seasonal' }
      ],
      texture: [
        { plantId: 'fern-autumn-3gal', quantity: 6, role: 'texture' },
        { plantId: 'fern-christmas', quantity: 4, role: 'texture' },
        { plantId: 'hosta-1gal', quantity: 6, role: 'texture', note: 'Check deer' },
        { plantId: 'carex-1gal', quantity: 4, role: 'texture' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 1, role: 'carpet' }
      ]
    },
    swaps: {
      hot: {
        condition: 'Hot/dry or exposed',
        changes: [
          { remove: 'canadian-hemlock-7ft', add: 'holly-hoogendorn', reason: 'Heat tolerant' },
          { remove: 'maple-legacy-sugar-2in', add: 'maple-october-glory-3in', reason: 'Better heat tolerance' }
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
