// ═══════════════════════════════════════════════════════════════════════════════
// PLANT PACKAGE / BUNDLE SYSTEM
// Theme-based landscape packages with swap logic for different conditions
// Built for North GA / Gainesville (Zone 7b-8a) as default
// DRASTICALLY UNIQUE: Each bundle now has exclusive plants specific to its theme
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
  HERO: 'hero',
  STRUCTURE: 'structure',
  SEASONAL: 'seasonal',
  TEXTURE: 'texture',
  CARPET: 'carpet'
};

// ═══════════════════════════════════════════════════════════════════════════════
// THEME PACKAGES - DRASTICALLY UNIQUE PLANTS PER THEME
// ═══════════════════════════════════════════════════════════════════════════════

export const PLANT_BUNDLES = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. AUGUSTA CLASSIC - Southern Golf Elegance
  // EXCLUSIVE: Magnolias, Dogwoods, Azaleas, Tea Olives, Ferns
  // HEIGHT TIERS: All 7 tiers covered with Southern-appropriate plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'augusta-classic',
    name: 'Augusta Classic',
    subtitle: 'Southern Golf Course Elegance',
    description: 'Inspired by Augusta National - azaleas, dogwoods, magnolias, and pristine evergreen structure.',
    theme: 'Southern Traditional',
    preview: '⛳',
    colorScheme: ['#E91E63', '#FFFFFF', '#1B5E20', '#FFB6C1'],
    baseSize: '200 sq ft',
    defaultZone: 8,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        // CANOPY (72"+) - 3 options
        { plantId: 'magnolia-southern', quantity: 1, role: 'hero', note: 'CANOPY: Grand Southern statement', heightTier: 'canopy' },
        { plantId: 'dogwood', quantity: 2, role: 'hero', note: 'CANOPY: Masters spring timing', heightTier: 'canopy' },
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'CANOPY: Burgundy specimen focal', heightTier: 'canopy' }
      ],
      structure: [
        // EYE LEVEL (48-72") - 3 options
        { plantId: 'tea-olive', quantity: 3, role: 'structure', note: 'EYE LEVEL: Signature fragrance', heightTier: 'eye' },
        { plantId: 'gardenia-august-beauty', quantity: 3, role: 'structure', note: 'EYE LEVEL: Summer fragrance 4-6ft', heightTier: 'eye' },
        { plantId: 'nandina', quantity: 3, role: 'structure', note: 'EYE LEVEL: Heavenly bamboo 4-8ft', heightTier: 'eye' },
        // CHEST HEIGHT (36-48") - 3 options
        { plantId: 'camellia-japonica', quantity: 4, role: 'structure', note: 'CHEST: Winter blooms', heightTier: 'chest' },
        { plantId: 'cleyera', quantity: 4, role: 'structure', note: 'CHEST: Evergreen backdrop', heightTier: 'chest' },
        { plantId: 'azalea-encore-autumn-royalty', quantity: 3, role: 'structure', note: 'CHEST: Purple rebloomer', heightTier: 'chest' },
        // ZONE 7 ADDITIONS - Southern shrubs
        { plantId: 'vitex', quantity: 2, role: 'structure', note: 'ZONE 7: Summer butterfly magnet', heightTier: 'eye' },
        { plantId: 'clethra', quantity: 2, role: 'structure', note: 'US NATIVE: Summersweet fragrance', heightTier: 'chest' }
      ],
      seasonal: [
        // WAIST HEIGHT (24-36") - 3 options
        { plantId: 'azalea-encore-carnation', quantity: 8, role: 'seasonal', note: 'WAIST: Pink mass', heightTier: 'waist' },
        { plantId: 'azalea-encore-amethyst', quantity: 5, role: 'seasonal', note: 'WAIST: Purple accents', heightTier: 'waist' },
        { plantId: 'hydrangea-little-quick-fire', quantity: 4, role: 'seasonal', note: 'WAIST: Compact hydrangea', heightTier: 'waist' },
        // ZONE 7 ADDITIONS - Shade perennials
        { plantId: 'astilbe', quantity: 4, role: 'seasonal', note: 'ZONE 7: Feathery shade plumes', heightTier: 'knee' }
      ],
      texture: [
        // KNEE HEIGHT (12-24") - 3 options
        { plantId: 'fern-autumn', quantity: 8, role: 'texture', note: 'KNEE: Woodland texture', heightTier: 'knee' },
        { plantId: 'fern-christmas', quantity: 6, role: 'texture', note: 'KNEE: Evergreen fern', heightTier: 'knee' },
        { plantId: 'cast-iron-plant', quantity: 5, role: 'texture', note: 'KNEE: Deep shade tolerant', heightTier: 'knee' },
        // ANKLE HEIGHT (6-12") - 2 options
        { plantId: 'liriope-variegated', quantity: 5, role: 'texture', note: 'ANKLE: Striped lilyturf', heightTier: 'ankle' },
        { plantId: 'mondo-grass', quantity: 5, role: 'texture', note: 'ANKLE: Dark green edging', heightTier: 'ankle' },
        // ZONE 7 ADDITIONS
        { plantId: 'coral-bells', quantity: 4, role: 'texture', note: 'ZONE 7: Colorful shade foliage', heightTier: 'knee' }
      ],
      carpet: [
        // GROUND PLANE (0-6") - 3 options
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'GROUND: Shade groundcover', heightTier: 'ground' },
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'GROUND: Purple accent carpet', heightTier: 'ground' },
        { plantId: 'creeping-jenny', quantity: 2, role: 'carpet', note: 'GROUND: Golden carpet', heightTier: 'ground' },
        // ZONE 7 ADDITIONS
        { plantId: 'sweet-woodruff', quantity: 2, role: 'carpet', note: 'ZONE 7: Fragrant shade carpet', heightTier: 'ground' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MAIN STREET CLASSIC - Patriotic Americana
  // EXCLUSIVE: Roses, Hydrangeas, Hostas, Daylilies
  // HEIGHT TIERS: All 7 tiers covered with American garden classics
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'main-street-classic',
    name: 'Main Street Classic',
    subtitle: 'Clean, Formal, Always-in-Bloom',
    description: 'Tight lines, bright seasonal beds, and maximum curb appeal. Quintessential American front yard.',
    theme: 'Classic Americana',
    preview: '🏛️',
    colorScheme: ['#D32F2F', '#FFFFFF', '#1565C0', '#FFD700'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        // CANOPY (72"+) - 3 options
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'CANOPY: White summer blooms', heightTier: 'canopy' },
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'CANOPY: Early spring purple', heightTier: 'canopy' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'CANOPY: Native four-season interest', heightTier: 'canopy' }
      ],
      structure: [
        // EYE LEVEL (48-72") - 3 options
        { plantId: 'hydrangea-limelight', quantity: 4, role: 'structure', note: 'EYE LEVEL: Summer showstopper 6-8ft', heightTier: 'eye' },
        { plantId: 'hydrangea-oakleaf', quantity: 3, role: 'structure', note: 'EYE LEVEL: Native oakleaf 4-8ft', heightTier: 'eye' },
        { plantId: 'weigela', quantity: 3, role: 'structure', note: 'EYE LEVEL: Pink bells 4-6ft', heightTier: 'eye' },
        // CHEST HEIGHT (36-48") - 3 options
        { plantId: 'hydrangea-annabelle', quantity: 4, role: 'structure', note: 'CHEST: White pom-poms', heightTier: 'chest' },
        { plantId: 'holly-nellie-stevens', quantity: 2, role: 'structure', note: 'CHEST: Evergreen backdrop', heightTier: 'chest' },
        { plantId: 'boxwood-wintergreen', quantity: 4, role: 'structure', note: 'CHEST: Classic American hedge', heightTier: 'chest' },
        // ZONE 7 ADDITIONS - American shrubs
        { plantId: 'clethra', quantity: 2, role: 'structure', note: 'US NATIVE: Summersweet fragrance', heightTier: 'chest' },
        { plantId: 'elderberry', quantity: 2, role: 'structure', note: 'US NATIVE: Wildlife-friendly shrub', heightTier: 'eye' }
      ],
      seasonal: [
        // WAIST HEIGHT (24-36") - 3 options
        { plantId: 'rose-knockout-double-red', quantity: 5, role: 'seasonal', note: 'WAIST: Red continuous bloom', heightTier: 'waist' },
        { plantId: 'rose-pink-drift', quantity: 4, role: 'seasonal', note: 'WAIST: Pink carpet roses', heightTier: 'waist' },
        { plantId: 'rose-coral-drift', quantity: 4, role: 'seasonal', note: 'WAIST: Coral accents', heightTier: 'waist' },
        // ZONE 7 ADDITIONS - Native perennials
        { plantId: 'coneflower', quantity: 4, role: 'seasonal', note: 'US NATIVE: Purple Americana classic', heightTier: 'knee' }
      ],
      texture: [
        // KNEE HEIGHT (12-24") - 3 options
        { plantId: 'hosta', quantity: 6, role: 'texture', note: 'KNEE: Shade texture', heightTier: 'knee' },
        { plantId: 'hosta-patriot', quantity: 5, role: 'texture', note: 'KNEE: White-edged patriotic', heightTier: 'knee' },
        { plantId: 'daylily-stella', quantity: 8, role: 'texture', note: 'KNEE: Yellow continuous bloom', heightTier: 'knee' },
        // ANKLE HEIGHT (6-12") - 2 options
        { plantId: 'liriope-variegated', quantity: 5, role: 'texture', note: 'ANKLE: Striped edging', heightTier: 'ankle' },
        { plantId: 'mondo-grass', quantity: 4, role: 'texture', note: 'ANKLE: Dark green border', heightTier: 'ankle' },
        // ZONE 7 ADDITIONS - American grasses
        { plantId: 'switchgrass', quantity: 4, role: 'texture', note: 'US NATIVE: Prairie grass', heightTier: 'eye' }
      ],
      carpet: [
        // GROUND PLANE (0-6") - 3 options
        { plantId: 'creeping-phlox', quantity: 3, role: 'carpet', note: 'GROUND: Spring color carpet', heightTier: 'ground' },
        { plantId: 'sedum-angelina', quantity: 3, role: 'carpet', note: 'GROUND: Golden succulent', heightTier: 'ground' },
        { plantId: 'creeping-thyme', quantity: 2, role: 'carpet', note: 'GROUND: Aromatic groundcover', heightTier: 'ground' },
        // ZONE 7 ADDITIONS
        { plantId: 'vinca-minor', quantity: 2, role: 'carpet', note: 'ZONE 7: Classic ground cover', heightTier: 'ground' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. JAPANESE GARDEN - Zen Asian
  // EXCLUSIVE: Japanese Maples, Pieris, Nandinas, Mondo Grass
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
    defaultZone: 8,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        { plantId: 'japanese-maple-coral-bark', quantity: 1, role: 'hero', note: 'SIGNATURE: Coral winter bark' },
        { plantId: 'japanese-maple-orangeola', quantity: 1, role: 'hero', note: 'Weeping laceleaf form' },
        { plantId: 'hinoki-cypress', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Japanese temple tree' }
      ],
      structure: [
        { plantId: 'pieris-mountain-fire', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Red new growth' },
        { plantId: 'pieris-cavatine', quantity: 3, role: 'structure', note: 'Compact white bells' },
        { plantId: 'nandina', quantity: 4, role: 'structure', note: 'Heavenly bamboo' },
        { plantId: 'mahonia-soft-caress', quantity: 3, role: 'structure', note: 'Soft texture mahonia' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua', quantity: 4, role: 'seasonal', note: 'Fall blooms' },
        { plantId: 'camellia-shi-shi', quantity: 3, role: 'seasonal', note: 'Compact pink' },
        { plantId: 'iris', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Japanese iris' }
      ],
      texture: [
        { plantId: 'fern-japanese-painted', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Silver fronds' },
        { plantId: 'carex-everillo', quantity: 10, role: 'texture', note: 'Golden sedge' },
        { plantId: 'sweet-flag', quantity: 6, role: 'texture', note: 'Water edge grass' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 4, role: 'carpet', note: 'EXCLUSIVE: Japanese essential' },
        { plantId: 'creeping-mazus', quantity: 2, role: 'carpet', note: 'Purple stepping stones' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. MODERN PRAIRIE - Native American
  // EXCLUSIVE: Coneflowers, Black-Eyed Susans, Muhly Grass, Native Grasses
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'modern-prairie',
    name: 'Modern Prairie',
    subtitle: 'Native-ish Look, Huge ROI',
    description: 'Coneflowers, black-eyed susans, and ornamental grasses. Native prairie meets modern design.',
    theme: 'Native Prairie',
    preview: '🌻',
    colorScheme: ['#1565C0', '#FFD54F', '#E91E63', '#8D6E63'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'SIGNATURE: Native multi-trunk' },
        { plantId: 'serviceberry-autumn-brilliance', quantity: 1, role: 'hero', note: 'Native four-season' },
        { plantId: 'black-tupelo', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Fall fire color' }
      ],
      structure: [
        { plantId: 'beautyberry', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Purple berry clusters' },
        { plantId: 'fothergilla-dwarf', quantity: 4, role: 'structure', note: 'Native witch-hazel family' },
        { plantId: 'sweetspire-little-henry', quantity: 5, role: 'structure', note: 'Native sweetspire' },
        // ZONE 7 ADDITIONS - Native prairie shrubs
        { plantId: 'ninebark', quantity: 4, role: 'structure', note: 'NATIVE: Purple foliage native' },
        { plantId: 'summersweet', quantity: 3, role: 'structure', note: 'NATIVE: Fragrant wet tolerant' }
      ],
      seasonal: [
        { plantId: 'coneflower', quantity: 12, role: 'seasonal', note: 'SIGNATURE: Purple prairie icon' },
        { plantId: 'coneflower-cheyenne', quantity: 8, role: 'seasonal', note: 'Yellow coneflower' },
        { plantId: 'black-eyed-susan', quantity: 12, role: 'seasonal', note: 'SIGNATURE: Golden native' },
        { plantId: 'bee-balm', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Pollinator magnet' },
        // ZONE 7 ADDITIONS - Native prairie perennials
        { plantId: 'blanket-flower', quantity: 8, role: 'seasonal', note: 'NATIVE: Heat/drought tolerant' },
        { plantId: 'coreopsis', quantity: 8, role: 'seasonal', note: 'NATIVE: Long-blooming prairie' },
        { plantId: 'liatris', quantity: 6, role: 'seasonal', note: 'NATIVE: Prairie spike pollinator' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 10, role: 'texture', note: 'SIGNATURE: Pink fall clouds' },
        { plantId: 'muhly-grass-white', quantity: 6, role: 'texture', note: 'White cloud grass' },
        { plantId: 'northern-sea-oats', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Native oats' },
        { plantId: 'karl-foerster', quantity: 6, role: 'texture', note: 'Feather reed grass' },
        // ZONE 7 ADDITIONS - Native prairie grasses
        { plantId: 'switch-grass', quantity: 6, role: 'texture', note: 'NATIVE: Upright prairie grass' },
        { plantId: 'little-bluestem', quantity: 8, role: 'texture', note: 'NATIVE: Blue-copper prairie' }
      ],
      carpet: [
        { plantId: 'veronica-georgia-blue', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Blue spring carpet' },
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet', note: 'Native phlox' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. RAIN GARDEN - Water Feature
  // EXCLUSIVE: Bald Cypress, Wax Myrtle, Iris, Sedges
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'rain-garden',
    name: 'Rain Garden',
    subtitle: 'Solves Problems & Looks Intentional',
    description: 'For wet areas, drainage swales, or rain gardens. Plants that thrive with wet feet.',
    theme: 'Water Feature',
    preview: '💧',
    colorScheme: ['#1565C0', '#43A047', '#FFD54F', '#8D6E63'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'wet', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'bald-cypress', quantity: 1, role: 'hero', note: 'SIGNATURE: Wet feet champion' },
        { plantId: 'river-birch', quantity: 1, role: 'hero', note: 'Native water lover' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Swamp magnolia' },
        // ZONE 7 ADDITIONS - Wet tolerant tree
        { plantId: 'nuttall-oak', quantity: 1, role: 'hero', note: 'NATIVE: Fast-growing wet tolerant' }
      ],
      structure: [
        { plantId: 'wax-myrtle', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Coastal native' },
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Wet tolerant holly' },
        { plantId: 'leucothoe', quantity: 4, role: 'structure', note: 'Arching wet-tolerant' },
        // ZONE 7 ADDITIONS - Wet tolerant shrubs
        { plantId: 'summersweet', quantity: 4, role: 'structure', note: 'NATIVE: Wet-tolerant fragrant' },
        { plantId: 'red-twig-dogwood', quantity: 4, role: 'structure', note: 'NATIVE: Wet tolerant, red stems' },
        { plantId: 'winterberry-holly', quantity: 3, role: 'structure', note: 'NATIVE: Wet tolerant berries' },
        { plantId: 'arrowwood-viburnum', quantity: 3, role: 'structure', note: 'NATIVE: Wet tolerant wildlife' }
      ],
      seasonal: [
        { plantId: 'iris', quantity: 10, role: 'seasonal', note: 'SIGNATURE: Water iris' },
        { plantId: 'astilbe-fanal', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Red plumes' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal', note: 'Moisture loving' },
        // ZONE 7 ADDITIONS - Wet loving iris varieties
        { plantId: 'japanese-iris', quantity: 6, role: 'seasonal', note: 'JAPAN NATIVE: Wet-loving iris' },
        { plantId: 'louisiana-iris', quantity: 5, role: 'seasonal', note: 'NATIVE: Bog garden iris' },
        { plantId: 'siberian-iris', quantity: 5, role: 'seasonal', note: 'EUROPE: Tough wet iris' }
      ],
      texture: [
        { plantId: 'carex-everillo', quantity: 12, role: 'texture', note: 'EXCLUSIVE: Golden sedge' },
        { plantId: 'sweet-flag', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Water edge grass' },
        { plantId: 'northern-sea-oats', quantity: 6, role: 'texture', note: 'Native oats' }
      ],
      carpet: [
        { plantId: 'creeping-mazus', quantity: 4, role: 'carpet', note: 'EXCLUSIVE: Wet stepping stones' },
        { plantId: 'ajuga', quantity: 2, role: 'carpet', note: 'Moisture tolerant' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. LOWCOUNTRY COASTAL - Georgia/Carolina Coast
  // EXCLUSIVE: Palmettos, Muhly, Lantana, Sea Oats
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'lowcountry-coastal',
    name: 'Lowcountry Coastal',
    subtitle: 'Wind-Tough & Salt-Tolerant Feel',
    description: 'Inspired by Georgia/Carolina coast - wax myrtle, muhly grass, and salt-tolerant beauties.',
    theme: 'Coastal Southern',
    preview: '🌊',
    colorScheme: ['#81D4FA', '#FFB74D', '#E8F5E9', '#A1887F'],
    baseSize: '200 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-muskogee', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Lavender coastal crape' },
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'Coastal magnolia' },
        { plantId: 'vitex-tree', quantity: 1, role: 'hero', note: 'SIGNATURE: Beach vitex' }
      ],
      structure: [
        { plantId: 'wax-myrtle', quantity: 6, role: 'structure', note: 'SIGNATURE: Coastal essential' },
        { plantId: 'yew-podocarpus', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Coastal yew' },
        { plantId: 'loropetalum-crimson-fire', quantity: 4, role: 'structure', note: 'Burgundy coastal accent' },
        // ZONE 7 ADDITIONS - Coastal shrubs
        { plantId: 'vitex', quantity: 2, role: 'structure', note: 'ZONE 7: Beach butterfly bush' },
        { plantId: 'clethra', quantity: 2, role: 'structure', note: 'US NATIVE: Coastal summersweet' }
      ],
      seasonal: [
        { plantId: 'lantana-ms-huff', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Hardy lantana' },
        { plantId: 'gardenia-frost-proof', quantity: 4, role: 'seasonal', note: 'Fragrant coastal' },
        { plantId: 'hibiscus', quantity: 4, role: 'seasonal', note: 'Tropical blooms' },
        // ZONE 7 ADDITIONS - Coastal perennials
        { plantId: 'daylily-happy-returns', quantity: 4, role: 'seasonal', note: 'ZONE 7: Coastal yellow daylily' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 12, role: 'texture', note: 'SIGNATURE: Pink coastal clouds' },
        { plantId: 'adagio-grass', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Compact miscanthus' },
        { plantId: 'mexican-feather', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Wispy movement' },
        // ZONE 7 ADDITIONS - Coastal grasses
        { plantId: 'blue-oat-grass', quantity: 5, role: 'texture', note: 'ZONE 7: Steel blue coastal accent' },
        { plantId: 'switchgrass', quantity: 4, role: 'texture', note: 'US NATIVE: Coastal prairie grass' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Salt-tolerant carpet' },
        { plantId: 'juniper-blue-pacific', quantity: 2, role: 'carpet', note: 'Coastal juniper' },
        // ZONE 7 ADDITIONS
        { plantId: 'creeping-jenny', quantity: 2, role: 'carpet', note: 'ZONE 7: Golden groundcover' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. MEXICO PAVILION - Authentic Mexican/Southwestern
  // EXCLUSIVE: Agaves, Red Yucca, Texas Sage, Esperanza, Mexican Bird of Paradise
  // ALL PLANTS NATIVE TO MEXICO OR AMERICAN SOUTHWEST
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'mexico-pavilion',
    name: 'Mexico Pavilion',
    subtitle: 'Authentic Hacienda Garden',
    description: 'True Mexican garden with native agaves, desert blooms, and plants that thrive in arid climates.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇽',
    colorScheme: ['#D84315', '#FFB300', '#43A047', '#5D4037'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        // AUTHENTIC: Texas Mountain Laurel is native to Mexico/Texas
        { plantId: 'texas-mountain-laurel', quantity: 3, role: 'hero', note: 'MEXICO NATIVE: Grape-scented purple blooms' },
        // AUTHENTIC: Agave is THE iconic Mexican plant
        { plantId: 'agave-americana', quantity: 3, role: 'hero', note: 'MEXICO NATIVE: Iconic architectural agave' },
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'Texas native, Mexican compatible' }
      ],
      structure: [
        // AUTHENTIC: All Mexican/Texas natives
        { plantId: 'texas-sage', quantity: 5, role: 'structure', note: 'MEXICO NATIVE: Silver leaves, purple blooms' },
        { plantId: 'cenizo', quantity: 5, role: 'structure', note: 'MEXICO NATIVE: Compact silverleaf sage' },
        { plantId: 'mexican-bird-of-paradise', quantity: 3, role: 'structure', note: 'MEXICO NATIVE: Yellow feathery blooms' },
        { plantId: 'esperanza-yellow-bells', quantity: 5, role: 'structure', note: 'MEXICO NATIVE: Trumpet yellow flowers' }
      ],
      seasonal: [
        // AUTHENTIC: Native Mexican flowering plants
        { plantId: 'mexican-honeysuckle', quantity: 5, role: 'seasonal', note: 'MEXICO NATIVE: Orange hummingbird magnet' },
        { plantId: 'lantana-ms-huff', quantity: 5, role: 'seasonal', note: 'Texas/Mexico native lantana' },
        { plantId: 'red-yucca', quantity: 7, role: 'seasonal', note: 'TEXAS/MEXICO NATIVE: Coral flower spikes' }
      ],
      texture: [
        // AUTHENTIC: Mexican succulents and grasses
        { plantId: 'sotol', quantity: 5, role: 'texture', note: 'MEXICO NATIVE: Dramatic spiky rosette' },
        { plantId: 'red-yucca', quantity: 5, role: 'texture', note: 'TEXAS/MEXICO NATIVE: Grass-like rosette' },
        { plantId: 'mexican-feather', quantity: 10, role: 'texture', note: 'Mexican native wispy grass' },
        { plantId: 'blue-fescue', quantity: 8, role: 'texture', note: 'Blue accent tufts' }
      ],
      carpet: [
        { plantId: 'sedum-angelina', quantity: 5, role: 'carpet', note: 'Drought succulent carpet' },
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'Heat-tolerant groundcover' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. ENGLAND PAVILION - Authentic English Cottage Garden
  // EXCLUSIVE: English Oak, Hawthorn, Yew, Roses, Lavender, Boxwood
  // ALL PLANTS NATIVE TO BRITAIN OR TRADITIONAL ENGLISH GARDEN PLANTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'england-pavilion',
    name: 'England Pavilion',
    subtitle: 'Authentic English Cottage Garden',
    description: 'True English garden with native oaks, hawthorns, yew hedges, and romantic cottage perennials.',
    theme: 'EPCOT World Showcase',
    preview: '🇬🇧',
    colorScheme: ['#E91E63', '#7B1FA2', '#FFFFFF', '#1B5E20'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        // AUTHENTIC: Native British trees
        { plantId: 'english-oak', quantity: 1, role: 'hero', note: 'ENGLAND NATIVE: The iconic British oak' },
        { plantId: 'english-hawthorn', quantity: 1, role: 'hero', note: 'ENGLAND NATIVE: May blossom tree' },
        { plantId: 'wild-cherry', quantity: 1, role: 'hero', note: 'BRITAIN NATIVE: White spring blossoms' }
      ],
      structure: [
        // Classic English garden hedging
        { plantId: 'boxwood-wintergreen', quantity: 10, role: 'structure', note: 'SIGNATURE: English parterre hedge' },
        { plantId: 'english-yew', quantity: 3, role: 'structure', note: 'ENGLAND NATIVE: Classic topiary yew' },
        { plantId: 'english-holly', quantity: 3, role: 'structure', note: 'ENGLAND NATIVE: Christmas holly' },
        // ZONE 7 ADDITIONS - European native shrubs
        { plantId: 'mock-orange', quantity: 3, role: 'structure', note: 'EUROPE NATIVE: Fragrant white cottage shrub' },
        { plantId: 'elderberry', quantity: 2, role: 'structure', note: 'EUROPE NATIVE: Traditional English hedgerow' }
      ],
      seasonal: [
        // English cottage roses and perennials
        { plantId: 'rose-apricot-drift', quantity: 6, role: 'seasonal', note: 'ENGLISH ROSE: Apricot cottage' },
        { plantId: 'rose-peach-drift', quantity: 6, role: 'seasonal', note: 'ENGLISH ROSE: Peach cottage' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal', note: 'English cottage classic' },
        { plantId: 'peony', quantity: 5, role: 'seasonal', note: 'ENGLAND: Traditional cottage peony' },
        // ZONE 7 ADDITIONS - European iris
        { plantId: 'siberian-iris', quantity: 4, role: 'seasonal', note: 'EUROPE NATIVE: Blue cottage garden iris' }
      ],
      texture: [
        // Classic English herbaceous borders
        { plantId: 'lavender', quantity: 12, role: 'texture', note: 'SIGNATURE: English lavender borders' },
        { plantId: 'catmint-walkers', quantity: 8, role: 'texture', note: 'English border catmint' },
        { plantId: 'lambs-ear', quantity: 8, role: 'texture', note: 'Traditional cottage silver' },
        // ZONE 7 ADDITIONS - European texture
        { plantId: 'blue-oat-grass', quantity: 6, role: 'texture', note: 'EUROPE NATIVE: Steel blue grass' },
        { plantId: 'dianthus', quantity: 6, role: 'texture', note: 'EUROPE NATIVE: English cottage pinks' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 4, role: 'carpet', note: 'BRITAIN NATIVE: English herb carpet' },
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Bugle groundcover' },
        // ZONE 7 ADDITIONS - European groundcovers
        { plantId: 'vinca-minor', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Traditional periwinkle' },
        { plantId: 'sweet-woodruff', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Fragrant shade carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. ITALY PAVILION - Authentic Tuscan Villa Garden
  // EXCLUSIVE: Italian Cypress, Stone Pine, Bay Laurel, Olive, Rosemary
  // ALL PLANTS NATIVE TO ITALY OR TRADITIONAL MEDITERRANEAN GARDENS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'italy-pavilion',
    name: 'Italy Pavilion',
    subtitle: 'Authentic Tuscan Villa Garden',
    description: 'True Italian garden with iconic cypress columns, stone pines, bay laurel, and Mediterranean herbs.',
    theme: 'EPCOT World Showcase',
    preview: '🇮🇹',
    colorScheme: ['#43A047', '#5D4037', '#FFB300', '#D84315'],
    baseSize: '200 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'showcase' },
    plants: {
      hero: [
        // AUTHENTIC: Native Italian trees
        { plantId: 'italian-cypress', quantity: 3, role: 'hero', note: 'ITALY NATIVE: Iconic Tuscan columnar cypress' },
        { plantId: 'italian-stone-pine', quantity: 1, role: 'hero', note: 'ITALY NATIVE: Roman umbrella pine' },
        { plantId: 'olive-tree', quantity: 2, role: 'hero', note: 'MEDITERRANEAN NATIVE: Ancient Italian symbol' }
      ],
      structure: [
        // Classic Italian garden plants
        { plantId: 'bay-laurel', quantity: 4, role: 'structure', note: 'ITALY NATIVE: Roman victory wreaths' },
        { plantId: 'rosemary', quantity: 6, role: 'structure', note: 'MEDITERRANEAN NATIVE: Italian herb essential' },
        { plantId: 'oleander', quantity: 3, role: 'structure', note: 'MEDITERRANEAN NATIVE: Villa gardens' }
      ],
      seasonal: [
        // Mediterranean flowering plants
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal', note: 'MEDITERRANEAN: Tuscan lavender fields' },
        { plantId: 'salvia-may-night', quantity: 8, role: 'seasonal', note: 'ITALY: Italian sage' },
        { plantId: 'rockrose-cistus', quantity: 5, role: 'seasonal', note: 'MEDITERRANEAN NATIVE: Hillside wildflower' }
      ],
      texture: [
        // Mediterranean silver and aromatic plants
        { plantId: 'santolina', quantity: 8, role: 'texture', note: 'MEDITERRANEAN NATIVE: Silver lavender cotton' },
        { plantId: 'artemisia', quantity: 6, role: 'texture', note: 'MEDITERRANEAN NATIVE: Silver foliage' },
        { plantId: 'blue-fescue', quantity: 10, role: 'texture', note: 'Mediterranean blue grass' }
      ],
      carpet: [
        { plantId: 'rosemary-creeping', quantity: 4, role: 'carpet', note: 'ITALY NATIVE: Cascading rosemary' },
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'MEDITERRANEAN NATIVE: Aromatic herb mat' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. FRANCE PAVILION - Authentic French Formal Garden
  // EXCLUSIVE: Boxwood Parterres, French Lavender, Roses, Lilacs
  // ALL PLANTS TRADITIONAL TO FRENCH GARDENS OR NATIVE TO FRANCE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'france-pavilion',
    name: 'France Pavilion',
    subtitle: 'Authentic Versailles Garden',
    description: 'True French garden with formal boxwood parterres, Provence lavender fields, and romantic roses.',
    theme: 'EPCOT World Showcase',
    preview: '🇫🇷',
    colorScheme: ['#7B1FA2', '#E91E63', '#1B5E20', '#FFFFFF'],
    baseSize: '250 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        // AUTHENTIC: French garden trees
        { plantId: 'french-lilac', quantity: 2, role: 'hero', note: 'FRANCE: Fragrant Parisian lilac' },
        { plantId: 'european-beech', quantity: 1, role: 'hero', note: 'FRANCE NATIVE: Formal allée tree' },
        { plantId: 'common-fig', quantity: 1, role: 'hero', note: 'MEDITERRANEAN: French Riviera essential' }
      ],
      structure: [
        // Classic French parterre hedging
        { plantId: 'boxwood-wintergreen', quantity: 16, role: 'structure', note: 'SIGNATURE: Versailles parterre' },
        { plantId: 'baby-gem-boxwood', quantity: 10, role: 'structure', note: 'FRANCE: Compact broderie edging' },
        { plantId: 'french-lavender', quantity: 6, role: 'structure', note: 'FRANCE NATIVE: Provence lavender shrub' },
        // ZONE 7 ADDITIONS - European shrubs
        { plantId: 'snowball-viburnum', quantity: 3, role: 'structure', note: 'EUROPE NATIVE: French snowball shrub' },
        { plantId: 'mock-orange', quantity: 2, role: 'structure', note: 'EUROPE NATIVE: Fragrant Parisian favorite' }
      ],
      seasonal: [
        // French roses and hydrangeas
        { plantId: 'rose-red-drift', quantity: 6, role: 'seasonal', note: 'FRANCE: Classic French red rose' },
        { plantId: 'rose-peach-drift', quantity: 5, role: 'seasonal', note: 'FRANCE: Romantic peach rose' },
        { plantId: 'hydrangea-little-quick-fire', quantity: 4, role: 'seasonal', note: 'French garden hydrangea' },
        { plantId: 'peony', quantity: 4, role: 'seasonal', note: 'FRANCE: Romantic French garden peony' },
        // ZONE 7 ADDITIONS - European perennials
        { plantId: 'siberian-iris', quantity: 4, role: 'seasonal', note: 'EUROPE NATIVE: Classic Monet garden iris' }
      ],
      texture: [
        // Provence-style planting
        { plantId: 'lavender', quantity: 14, role: 'texture', note: 'SIGNATURE: Provence lavender fields' },
        { plantId: 'catmint-walkers', quantity: 8, role: 'texture', note: 'French border catmint' },
        { plantId: 'shasta-daisy-becky', quantity: 8, role: 'texture', note: 'FRANCE: Marguerite daisies' },
        // ZONE 7 ADDITIONS - European texture
        { plantId: 'dianthus', quantity: 6, role: 'texture', note: 'EUROPE NATIVE: French carnation pinks' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 4, role: 'carpet', note: 'FRANCE NATIVE: Herbes de Provence' },
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Purple bugle carpet' },
        // ZONE 7 ADDITIONS - European groundcovers
        { plantId: 'creeping-jenny', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Golden moneywort' },
        { plantId: 'vinca-minor', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: French periwinkle' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. GERMANY PAVILION - Authentic Central European Garden
  // EXCLUSIVE: European Beech, Linden, Hornbeam, Karl Foerster Grass
  // ALL PLANTS NATIVE TO GERMANY OR LONG-CULTIVATED IN GERMAN GARDENS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'germany-pavilion',
    name: 'Germany Pavilion',
    subtitle: 'Authentic Bavarian Garden',
    description: 'True German garden with European beech, lindens, and the famous Karl Foerster grass named after the legendary German nurseryman.',
    theme: 'EPCOT World Showcase',
    preview: '🇩🇪',
    colorScheme: ['#FFD54F', '#D84315', '#1B5E20', '#5D4037'],
    baseSize: '150 sq ft',
    defaultZone: 6,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        // AUTHENTIC: All native to Central Europe
        { plantId: 'european-hornbeam', quantity: 1, role: 'hero', note: 'GERMANY NATIVE: Classic pleached hedge tree' },
        { plantId: 'small-leaf-linden', quantity: 1, role: 'hero', note: 'GERMANY NATIVE: Iconic Lindenstraße tree' },
        { plantId: 'copper-beech', quantity: 1, role: 'hero', note: 'EUROPE NATIVE: Purple specimen beech' }
      ],
      structure: [
        // Spireas thrive in Central European climate
        { plantId: 'spirea-gold-flame', quantity: 6, role: 'structure', note: 'EUROPE: Golden spirea' },
        { plantId: 'spirea-candy-corn', quantity: 5, role: 'structure', note: 'EUROPE: Multi-color spirea' },
        { plantId: 'weigela', quantity: 4, role: 'structure', note: 'EUROPE: German cottage shrub' },
        { plantId: 'boxwood-wintergreen', quantity: 5, role: 'structure', note: 'EUROPE: Classic German parterre hedge' },
        // ZONE 7 ADDITIONS - European native shrubs
        { plantId: 'bridal-wreath-spirea', quantity: 3, role: 'structure', note: 'EUROPE NATIVE: Classic German bridal shrub' },
        { plantId: 'mock-orange', quantity: 2, role: 'structure', note: 'EUROPE NATIVE: Fragrant cottage favorite' }
      ],
      seasonal: [
        // Forsythia is from Europe/Asia, naturalized in Germany
        { plantId: 'forsythia-sugar-baby', quantity: 4, role: 'seasonal', note: 'EUROPE: Spring yellow herald' },
        { plantId: 'hydrangea-summer-crush', quantity: 4, role: 'seasonal', note: 'European garden classic' },
        { plantId: 'peony', quantity: 5, role: 'seasonal', note: 'EUROPE: Classic German cottage peony' },
        { plantId: 'lenten-rose', quantity: 5, role: 'seasonal', note: 'EUROPE NATIVE: Helleborus for shade' },
        // ZONE 7 ADDITIONS - European perennials
        { plantId: 'siberian-iris', quantity: 4, role: 'seasonal', note: 'EUROPE NATIVE: Blue German garden iris' },
        { plantId: 'astilbe', quantity: 4, role: 'seasonal', note: 'EUROPE/ASIA: Feathery shade perennial' }
      ],
      texture: [
        // Karl Foerster: THE German grass, named after the famous German nurseryman
        { plantId: 'karl-foerster', quantity: 12, role: 'texture', note: 'SIGNATURE: Named after legendary German nurseryman' },
        { plantId: 'karley-rose', quantity: 6, role: 'texture', note: 'European fountain grass' },
        { plantId: 'hosta', quantity: 8, role: 'texture', note: 'Shade garden essential' },
        // ZONE 7 ADDITIONS - European grass
        { plantId: 'blue-oat-grass', quantity: 6, role: 'texture', note: 'EUROPE NATIVE: Steel blue German grass' }
      ],
      carpet: [
        { plantId: 'ajuga', quantity: 4, role: 'carpet', note: 'EUROPE NATIVE: Purple bugle groundcover' },
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'German shade carpet' },
        // ZONE 7 ADDITIONS - European groundcovers
        { plantId: 'vinca-minor', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: German periwinkle' },
        { plantId: 'sweet-woodruff', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Waldmeister groundcover' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. MOROCCO PAVILION - Authentic Moorish Riad Garden
  // EXCLUSIVE: Atlas Cedar, Oleander, Pomegranate, Mediterranean Natives
  // ALL PLANTS NATIVE TO MOROCCO/NORTH AFRICA/MEDITERRANEAN
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'morocco-pavilion',
    name: 'Morocco Pavilion',
    subtitle: 'Authentic Riad Courtyard',
    description: 'True Moorish garden with Atlas cedars, pomegranates, oleanders - plants of the Maghreb.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇦',
    colorScheme: ['#1565C0', '#FFB300', '#FFFFFF', '#43A047'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        // AUTHENTIC: Atlas Cedar is NATIVE to Morocco's Atlas Mountains
        { plantId: 'blue-atlas-cedar', quantity: 1, role: 'hero', note: 'MOROCCO NATIVE: Atlas Mountains cedar' },
        // AUTHENTIC: Olive is essential Mediterranean/North African
        { plantId: 'olive-tree', quantity: 3, role: 'hero', note: 'MEDITERRANEAN NATIVE: Ancient Moroccan symbol' },
        // AUTHENTIC: Strawberry Tree native to Mediterranean
        { plantId: 'strawberry-tree', quantity: 1, role: 'hero', note: 'MEDITERRANEAN NATIVE: Red fruit, evergreen' }
      ],
      structure: [
        // AUTHENTIC: All Mediterranean/North African natives
        { plantId: 'oleander', quantity: 5, role: 'structure', note: 'MOROCCO NATIVE: Profuse pink/white blooms' },
        { plantId: 'pomegranate', quantity: 3, role: 'structure', note: 'PERSIA/MOROCCO: Orange flowers, red fruit' },
        { plantId: 'mastic-tree', quantity: 3, role: 'structure', note: 'MEDITERRANEAN NATIVE: Aromatic evergreen' },
        { plantId: 'rosemary', quantity: 5, role: 'structure', note: 'MEDITERRANEAN NATIVE: Moroccan culinary herb' }
      ],
      seasonal: [
        // AUTHENTIC: Mediterranean flowering plants
        { plantId: 'rockrose-cistus', quantity: 5, role: 'seasonal', note: 'MOROCCO NATIVE: Papery pink flowers' },
        { plantId: 'jerusalem-sage', quantity: 5, role: 'seasonal', note: 'MEDITERRANEAN NATIVE: Yellow whorls' },
        { plantId: 'french-lavender', quantity: 7, role: 'seasonal', note: 'MEDITERRANEAN NATIVE: Rabbit-ear petals' }
      ],
      texture: [
        // AUTHENTIC: Mediterranean grasses and herbs
        { plantId: 'blue-fescue', quantity: 10, role: 'texture', note: 'Mediterranean blue tufts' },
        { plantId: 'santolina', quantity: 8, role: 'texture', note: 'MEDITERRANEAN NATIVE: Silver mound herb' },
        { plantId: 'artemisia', quantity: 6, role: 'texture', note: 'MEDITERRANEAN NATIVE: Silver foliage' }
      ],
      carpet: [
        { plantId: 'rosemary-creeping', quantity: 5, role: 'carpet', note: 'MEDITERRANEAN NATIVE: Fragrant carpet' },
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'MEDITERRANEAN NATIVE: Aromatic herb mat' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. CHINA PAVILION - Authentic Chinese Temple Garden
  // EXCLUSIVE: Ginkgo, Chinese Fringe Tree, Dawn Redwood, Peonies, Camellias
  // ALL PLANTS NATIVE TO CHINA
  // HEIGHT TIERS: All 7 tiers covered with authentic Chinese plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'china-pavilion',
    name: 'China Pavilion',
    subtitle: 'Authentic Temple Garden',
    description: 'True Chinese garden with ginkgos, dawn redwoods, peonies - plants native to China.',
    theme: 'EPCOT World Showcase',
    preview: '🇨🇳',
    colorScheme: ['#D84315', '#FFD54F', '#1B5E20', '#5D4037'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        // CANOPY (72"+) - 4 options - All NATIVE to China
        { plantId: 'ginkgo', quantity: 1, role: 'hero', note: 'CANOPY: Living fossil, ancient temple tree', heightTier: 'canopy' },
        { plantId: 'chinese-fringe-tree', quantity: 1, role: 'hero', note: 'CANOPY: White fringe flowers', heightTier: 'canopy' },
        { plantId: 'paperbark-maple', quantity: 1, role: 'hero', note: 'CANOPY: Cinnamon peeling bark', heightTier: 'canopy' },
        { plantId: 'dawn-redwood', quantity: 1, role: 'hero', note: 'CANOPY: Living fossil conifer', heightTier: 'canopy' },
        // ZONE 7 ADDITIONS - Chinese native trees
        { plantId: 'star-magnolia', quantity: 1, role: 'hero', note: 'CHINA/JAPAN: Early fragrant white', heightTier: 'canopy' },
        { plantId: 'trident-maple', quantity: 1, role: 'hero', note: 'CHINA NATIVE: Urban tolerant fall color', heightTier: 'canopy' },
        { plantId: 'chinese-elm', quantity: 1, role: 'hero', note: 'CHINA NATIVE: Disease-resistant shade', heightTier: 'canopy' }
      ],
      structure: [
        // EYE LEVEL (48-72") - 4 options - Chinese natives
        { plantId: 'paper-bush', quantity: 3, role: 'structure', note: 'EYE LEVEL: Fragrant winter blooms 4-6ft', heightTier: 'eye' },
        { plantId: 'nandina', quantity: 4, role: 'structure', note: 'EYE LEVEL: Heavenly bamboo 4-8ft', heightTier: 'eye' },
        { plantId: 'chinese-snowball-viburnum', quantity: 3, role: 'structure', note: 'EYE LEVEL: Massive white blooms 6-10ft', heightTier: 'eye' },
        { plantId: 'pieris-mountain-fire', quantity: 3, role: 'structure', note: 'EYE LEVEL: Red new growth 4-6ft', heightTier: 'eye' },
        // CHEST HEIGHT (36-48") - 3 options
        { plantId: 'loropetalum-crimson-fire', quantity: 4, role: 'structure', note: 'CHEST: Burgundy fringeflower', heightTier: 'chest' },
        { plantId: 'chinese-witch-hazel', quantity: 3, role: 'structure', note: 'CHEST: Yellow winter flowers', heightTier: 'chest' },
        { plantId: 'camellia-shi-shi', quantity: 3, role: 'structure', note: 'CHEST: Compact pink camellia 4-5ft', heightTier: 'chest' },
        // ZONE 7 ADDITIONS - Chinese native shrub
        { plantId: 'bridal-wreath-spirea', quantity: 3, role: 'structure', note: 'CHINA NATIVE: Classic white arching', heightTier: 'chest' }
      ],
      seasonal: [
        // WAIST HEIGHT (24-36") - 3 options
        { plantId: 'peony', quantity: 5, role: 'seasonal', note: 'WAIST: National flower of China', heightTier: 'waist' },
        { plantId: 'camellia-sasanqua', quantity: 4, role: 'seasonal', note: 'WAIST: Fall-blooming camellia', heightTier: 'waist' },
        { plantId: 'loropetalum-purple-pixie', quantity: 4, role: 'seasonal', note: 'WAIST: Purple fringeflower', heightTier: 'waist' }
      ],
      texture: [
        // KNEE HEIGHT (12-24") - 3 options
        { plantId: 'chinese-beautyberry', quantity: 4, role: 'texture', note: 'KNEE: Purple berry clusters', heightTier: 'knee' },
        { plantId: 'hosta-guacamole', quantity: 6, role: 'texture', note: 'KNEE: Shade texture foliage', heightTier: 'knee' },
        { plantId: 'fern-japanese-painted', quantity: 6, role: 'texture', note: 'KNEE: Silver painted fern', heightTier: 'knee' },
        // ANKLE HEIGHT (6-12") - 3 options
        { plantId: 'liriope-variegated', quantity: 5, role: 'texture', note: 'ANKLE: Striped lilyturf', heightTier: 'ankle' },
        { plantId: 'mondo-grass', quantity: 5, role: 'texture', note: 'ANKLE: Temple groundcover', heightTier: 'ankle' },
        { plantId: 'carex-everillo', quantity: 4, role: 'texture', note: 'ANKLE: Golden sedge', heightTier: 'ankle' }
      ],
      carpet: [
        // GROUND PLANE (0-6") - 3 options
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'GROUND: Purple bugle groundcover', heightTier: 'ground' },
        { plantId: 'creeping-mazus', quantity: 3, role: 'carpet', note: 'GROUND: Purple stepping stones', heightTier: 'ground' },
        { plantId: 'pachysandra', quantity: 2, role: 'carpet', note: 'GROUND: Shade carpet', heightTier: 'ground' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. NORWAY PAVILION - Authentic Nordic/Scandinavian Garden
  // EXCLUSIVE: Norway Spruce, Scots Pine, Mountain Ash, Birch, Heather, Lingonberry
  // ALL PLANTS NATIVE TO SCANDINAVIA OR THRIVING IN NORDIC GARDENS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'norway-pavilion',
    name: 'Norway Pavilion',
    subtitle: 'Authentic Nordic Forest Edge',
    description: 'True Scandinavian woodland with Norway spruce, mountain ash, heather, and lingonberries.',
    theme: 'EPCOT World Showcase',
    preview: '🇳🇴',
    colorScheme: ['#1565C0', '#FFFFFF', '#1B5E20', '#8D6E63'],
    baseSize: '200 sq ft',
    defaultZone: 6,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        // AUTHENTIC: All native to Scandinavia
        { plantId: 'norway-spruce', quantity: 1, role: 'hero', note: 'NORWAY NATIVE: Classic Nordic conifer' },
        { plantId: 'scots-pine', quantity: 1, role: 'hero', note: 'NORDIC NATIVE: Orange bark, blue needles' },
        { plantId: 'mountain-ash', quantity: 1, role: 'hero', note: 'NORDIC NATIVE: Orange berry clusters' },
        { plantId: 'river-birch', quantity: 3, role: 'hero', note: 'BIRCH: Nordic forest essential' }
      ],
      structure: [
        // Rhododendrons thrive in Nordic climates
        { plantId: 'rhododendron', quantity: 5, role: 'structure', note: 'Nordic garden classic' },
        { plantId: 'rhododendron-roseum-elegans', quantity: 3, role: 'structure', note: 'Cold-hardy pink rhodo' },
        { plantId: 'boxwood-wintergreen', quantity: 5, role: 'structure', note: 'Cold-hardy evergreen' },
        { plantId: 'viburnum-chindo', quantity: 3, role: 'structure', note: 'Cold-hardy viburnum' },
        { plantId: 'pieris-mountain-fire', quantity: 3, role: 'structure', note: 'Nordic-adapted pieris' },
        // ZONE 7 ADDITIONS - Northern European shrubs
        { plantId: 'elderberry', quantity: 2, role: 'structure', note: 'EUROPE NATIVE: Scandinavian hedgerow' },
        { plantId: 'snowball-viburnum', quantity: 2, role: 'structure', note: 'EUROPE NATIVE: Cold-hardy snowball' }
      ],
      seasonal: [
        // AUTHENTIC: Heather is native to Nordic heathlands
        { plantId: 'heather', quantity: 10, role: 'seasonal', note: 'NORDIC NATIVE: Purple heath flowers' },
        { plantId: 'hydrangea-oakleaf', quantity: 5, role: 'seasonal', note: 'Cold-hardy hydrangea' },
        { plantId: 'astilbe-fanal', quantity: 5, role: 'seasonal', note: 'Shade garden plumes' },
        { plantId: 'lenten-rose', quantity: 5, role: 'seasonal', note: 'Early spring hellebore' },
        // ZONE 7 ADDITIONS - Cold-hardy perennials
        { plantId: 'siberian-iris', quantity: 4, role: 'seasonal', note: 'EUROPE/ASIA: Cold-hardy Nordic iris' }
      ],
      texture: [
        { plantId: 'fern-christmas', quantity: 7, role: 'texture', note: 'Evergreen woodland fern' },
        { plantId: 'fern-autumn', quantity: 5, role: 'texture', note: 'Deciduous fern' },
        { plantId: 'hosta-blue-angel', quantity: 5, role: 'texture', note: 'Blue woodland hosta' },
        { plantId: 'carex-everillo', quantity: 5, role: 'texture', note: 'Golden sedge accent' },
        // ZONE 7 ADDITIONS - European grass
        { plantId: 'blue-oat-grass', quantity: 5, role: 'texture', note: 'EUROPE NATIVE: Steel blue Nordic grass' }
      ],
      carpet: [
        // AUTHENTIC: Lingonberry is native Nordic groundcover
        { plantId: 'lingonberry', quantity: 7, role: 'carpet', note: 'NORDIC NATIVE: Edible red berries' },
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'Purple bugle groundcover' },
        // ZONE 7 ADDITIONS - European groundcovers
        { plantId: 'vinca-minor', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Cold-hardy periwinkle' },
        { plantId: 'sweet-woodruff', quantity: 3, role: 'carpet', note: 'EUROPE NATIVE: Scandinavian woodland' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. JAPAN PAVILION - Authentic Japanese Temple Garden
  // EXCLUSIVE: Japanese Maple, Thunderhead Pine, Hinoki, Azaleas, Cryptomeria
  // ALL PLANTS NATIVE TO JAPAN OR TRADITIONAL JAPANESE GARDEN PLANTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'japan-pavilion',
    name: 'Japan Pavilion',
    subtitle: 'Authentic Temple Garden',
    description: 'True Japanese garden with cloud-pruned pines, maples, azaleas, and contemplative design.',
    theme: 'EPCOT World Showcase',
    preview: '🇯🇵',
    colorScheme: ['#C62828', '#FFFFFF', '#1B5E20', '#5D4037'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        // AUTHENTIC: All native to Japan
        { plantId: 'japanese-maple-dwarf', quantity: 2, role: 'hero', note: 'JAPAN NATIVE: Compact laceleaf maple' },
        { plantId: 'thunderhead-pine', quantity: 1, role: 'hero', note: 'JAPAN NATIVE: Cloud-pruned black pine' },
        { plantId: 'hinoki-cypress', quantity: 1, role: 'hero', note: 'JAPAN NATIVE: Sacred temple tree' }
      ],
      structure: [
        // Azaleas are native to Japan, essential in Japanese gardens
        { plantId: 'azalea-encore-bonfire', quantity: 5, role: 'structure', note: 'JAPAN: Red karafuto azalea style' },
        { plantId: 'azalea-encore-embers', quantity: 5, role: 'structure', note: 'JAPAN: Orange-red kirishima style' },
        { plantId: 'pieris-mountain-fire', quantity: 4, role: 'structure', note: 'JAPAN NATIVE: Asebi pieris' },
        { plantId: 'cryptomeria-shrub', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: Sugi dwarf cedar' },
        // ZONE 7 ADDITIONS - Japanese native shrubs
        { plantId: 'aucuba', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: Gold dust shade shrub' },
        { plantId: 'japanese-quince', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: Early spring color' },
        { plantId: 'deutzia', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: White spring bells' },
        { plantId: 'kerria', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: Yellow shade flowers' }
      ],
      seasonal: [
        // Camellias and iris are essential Japanese garden plants
        { plantId: 'camellia-sasanqua', quantity: 5, role: 'seasonal', note: 'JAPAN NATIVE: Sazanka camellia' },
        { plantId: 'iris', quantity: 10, role: 'seasonal', note: 'JAPAN NATIVE: Hanashobu iris' },
        { plantId: 'peony', quantity: 4, role: 'seasonal', note: 'ASIA: Botan peony, beloved in Japan' },
        // ZONE 7 ADDITIONS - Japanese iris varieties
        { plantId: 'japanese-iris', quantity: 6, role: 'seasonal', note: 'JAPAN NATIVE: Large flat iris' }
      ],
      texture: [
        // Japanese ferns and grasses
        { plantId: 'fern-japanese-painted', quantity: 10, role: 'texture', note: 'JAPAN NATIVE: Silver painted fern' },
        { plantId: 'holly-fern', quantity: 8, role: 'texture', note: 'JAPAN NATIVE: Cyrtomium fern' },
        { plantId: 'sweet-flag', quantity: 6, role: 'texture', note: 'JAPAN: Sekisho sweet flag grass' },
        // ZONE 7 ADDITIONS - Japanese grasses
        { plantId: 'japanese-forest-grass', quantity: 6, role: 'texture', note: 'JAPAN NATIVE: Golden cascade' },
        { plantId: 'black-mondo-grass', quantity: 5, role: 'texture', note: 'JAPAN NATIVE: Dramatic black accent' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 5, role: 'carpet', note: 'JAPAN NATIVE: Ryuunohige grass' },
        { plantId: 'liriope-variegated', quantity: 3, role: 'carpet', note: 'JAPAN NATIVE: Yaburan lilyturf' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 16. POLLINATOR PARADISE - Butterfly & Bee Garden
  // EXCLUSIVE: Native Flowers, Milkweed, Butterfly Bush
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'pollinator-paradise',
    name: 'Pollinator Paradise',
    subtitle: 'Butterfly & Bee Haven',
    description: 'Nectar-rich plants for butterflies, bees, and hummingbirds. A living ecosystem.',
    theme: 'Wildlife Garden',
    preview: '🦋',
    colorScheme: ['#FFB300', '#E91E63', '#7B1FA2', '#43A047'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'vitex-tree', quantity: 1, role: 'hero', note: 'SIGNATURE: Butterfly magnet tree' },
        { plantId: 'crape-myrtle-tuscarora', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Coral pink crape' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Native bird food' }
      ],
      structure: [
        { plantId: 'butterfly-bush-davidii', quantity: 4, role: 'structure', note: 'SIGNATURE: Butterfly bush' },
        { plantId: 'butterfly-bush-ice-chip', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Compact white' },
        { plantId: 'pugster-blue-buddleia', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Dwarf blue' },
        { plantId: 'abelia-kaleidoscope', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Multi-color abelia' },
        // ZONE 7 ADDITIONS - Pollinator shrubs
        { plantId: 'rose-of-sharon', quantity: 3, role: 'structure', note: 'Summer pollinator shrub' },
        { plantId: 'summersweet', quantity: 3, role: 'structure', note: 'NATIVE: Fragrant pollinator' },
        { plantId: 'blue-mist-shrub', quantity: 4, role: 'structure', note: 'Late summer blue pollinator' }
      ],
      seasonal: [
        { plantId: 'coneflower', quantity: 12, role: 'seasonal', note: 'SIGNATURE: Butterfly favorite' },
        { plantId: 'bee-balm', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Hummingbird magnet' },
        { plantId: 'black-eyed-susan', quantity: 10, role: 'seasonal', note: 'Native pollinator food' },
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Butterfly nectar' },
        // ZONE 7 ADDITIONS - Native pollinator perennials
        { plantId: 'blanket-flower', quantity: 8, role: 'seasonal', note: 'NATIVE: Heat-proof pollinator' },
        { plantId: 'liatris', quantity: 6, role: 'seasonal', note: 'NATIVE: Blazing star pollinator' },
        { plantId: 'agastache', quantity: 6, role: 'seasonal', note: 'Pollinator magnet blue spikes' },
        { plantId: 'sedum-autumn-joy', quantity: 5, role: 'seasonal', note: 'Fall butterfly favorite' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Fall habitat' },
        { plantId: 'northern-sea-oats', quantity: 8, role: 'texture', note: 'Native seed heads' },
        { plantId: 'catmint-walkers', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Bee haven' },
        // ZONE 7 ADDITIONS - Native prairie grass
        { plantId: 'little-bluestem', quantity: 6, role: 'texture', note: 'NATIVE: Prairie habitat' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'SIGNATURE: Ground bee food' },
        { plantId: 'veronica-georgia-blue', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Early bee nectar' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 17. FOUR SEASONS - Year-Round Interest
  // EXCLUSIVE: Balanced Bloom Sequence All Seasons + Evergreen Structure
  // TRAINING: Needs heavy shrub presence + winter bloomers + evergreen anchors
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'four-seasons',
    name: 'Four Season Color',
    subtitle: 'Always Something Blooming',
    description: 'Carefully sequenced for year-round color. Winter camellia, spring azalea, summer hydrangea, fall grasses.',
    theme: 'Continuous Bloom',
    preview: '🌈',
    colorScheme: ['#E91E63', '#FFD54F', '#D84315', '#1B5E20'],
    baseSize: '120 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'SPRING: White blooms, fall color, winter berries' },
        { plantId: 'crape-myrtle-tuscarora', quantity: 1, role: 'hero', note: 'SUMMER: Coral-pink 100 days' },
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'FALL: Crimson specimen' },
        // ZONE 7 ADDITIONS
        { plantId: 'star-magnolia', quantity: 1, role: 'hero', note: 'EARLY SPRING: First to bloom' }
      ],
      structure: [
        // EVERGREEN ANCHORS - year-round structure (critical for winter)
        { plantId: 'arborvitae-tater-tot', quantity: 8, role: 'structure', note: 'EVERGREEN: Compact globes year-round' },
        { plantId: 'dwarf-alberta-spruce', quantity: 4, role: 'structure', note: 'EVERGREEN: Pyramidal anchors' },
        { plantId: 'holly-compacta', quantity: 4, role: 'structure', note: 'EVERGREEN: Berries for winter color' },
        // WINTER BLOOMERS (critical!)
        { plantId: 'gardenia-frost-proof', quantity: 6, role: 'structure', note: 'WINTER: Fragrant white Jan-Mar' },
        { plantId: 'camellia-sasanqua', quantity: 5, role: 'structure', note: 'WINTER: Pink Oct-Dec' },
        { plantId: 'paper-bush', quantity: 4, role: 'structure', note: 'WINTER: Yellow fragrant Jan-Feb' },
        // SPRING/SUMMER BLOOMERS
        { plantId: 'hydrangea-endless-summer', quantity: 8, role: 'structure', note: 'SUMMER: Blue/pink rebloomer' },
        { plantId: 'azalea-encore-autumn-twist', quantity: 5, role: 'structure', note: 'SPRING+FALL: Reblooming' },
        // ZONE 7 ADDITIONS - Winter interest shrubs
        { plantId: 'winterberry-holly', quantity: 3, role: 'structure', note: 'WINTER: Red berry interest' },
        { plantId: 'red-twig-dogwood', quantity: 3, role: 'structure', note: 'WINTER: Red stem interest' },
        { plantId: 'korean-spice-viburnum', quantity: 2, role: 'structure', note: 'SPRING: Fragrant blooms' }
      ],
      seasonal: [
        { plantId: 'lenten-rose', quantity: 8, role: 'seasonal', note: 'LATE WINTER: First color Feb-Apr' },
        { plantId: 'rose-knockout-double-red', quantity: 6, role: 'seasonal', note: 'SUMMER: Continuous May-frost' },
        { plantId: 'coneflower', quantity: 5, role: 'seasonal', note: 'SUMMER: Native pollinator' },
        { plantId: 'black-eyed-susan', quantity: 5, role: 'seasonal', note: 'SUMMER-FALL: Golden daisies' },
        // ZONE 7 ADDITIONS - Seasonal color
        { plantId: 'sedum-autumn-joy', quantity: 5, role: 'seasonal', note: 'FALL: Pink to rust' },
        { plantId: 'liatris', quantity: 4, role: 'seasonal', note: 'SUMMER: Purple spikes' }
      ],
      texture: [
        { plantId: 'muhly-grass-white', quantity: 15, role: 'texture', note: 'FALL: White cloud masses' },
        { plantId: 'muhly-grass-pink', quantity: 10, role: 'texture', note: 'FALL: Pink clouds' },
        { plantId: 'karl-foerster', quantity: 8, role: 'texture', note: 'WINTER: Tan structure persists' },
        { plantId: 'daylily-stella', quantity: 8, role: 'texture', note: 'SUMMER: Yellow rebloomer' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 4, role: 'carpet', note: 'SPRING: Pink/purple carpet' },
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'SPRING: Purple spikes + evergreen' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 18. SHADE SANCTUARY - Deep Shade Garden
  // EXCLUSIVE: Hostas, Ferns, Hellebores, Shade Lovers
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'shade-sanctuary',
    name: 'Shade Sanctuary',
    subtitle: 'Deep Shade Oasis',
    description: 'For those challenging shady spots - hostas, ferns, and shade-loving beauties.',
    theme: 'Shade Garden',
    preview: '🌿',
    colorScheme: ['#1B5E20', '#FFFFFF', '#7B1FA2', '#8D6E63'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-shade', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'SIGNATURE: Shade-tolerant dogwood' },
        { plantId: 'redbud-forest-pansy', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Purple-leaf redbud' },
        { plantId: 'japanese-maple-orangeola', quantity: 1, role: 'hero', note: 'Orange laceleaf' }
      ],
      structure: [
        { plantId: 'hydrangea-oakleaf', quantity: 4, role: 'structure', note: 'SIGNATURE: Shade oakleaf' },
        { plantId: 'fatsia', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Bold tropical' },
        { plantId: 'leucothoe', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Arching shade shrub' },
        { plantId: 'pieris-dorothy-wycoff', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Pink pieris' },
        // ZONE 7 ADDITIONS - Shade-loving shrubs
        { plantId: 'mountain-laurel', quantity: 3, role: 'structure', note: 'NATIVE: Shade evergreen' },
        { plantId: 'sweetbox', quantity: 4, role: 'structure', note: 'Fragrant winter shade shrub' },
        { plantId: 'aucuba', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: Gold dust shade' },
        { plantId: 'kerria', quantity: 3, role: 'structure', note: 'JAPAN NATIVE: Yellow shade flowers' }
      ],
      seasonal: [
        { plantId: 'lenten-rose', quantity: 10, role: 'seasonal', note: 'SIGNATURE: Shade hellebore' },
        { plantId: 'astilbe-fanal', quantity: 8, role: 'seasonal', note: 'Red plumes' },
        { plantId: 'camellia-japonica', quantity: 3, role: 'seasonal', note: 'Shade bloomer' }
      ],
      texture: [
        { plantId: 'hosta-blue-angel', quantity: 8, role: 'texture', note: 'SIGNATURE: Giant blue' },
        { plantId: 'hosta-guacamole', quantity: 6, role: 'texture', note: 'Golden center' },
        { plantId: 'fern-japanese-painted', quantity: 10, role: 'texture', note: 'Silver fronds' },
        { plantId: 'cast-iron-plant', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Indestructible' },
        // ZONE 7 ADDITIONS - Shade grasses and ferns
        { plantId: 'japanese-forest-grass', quantity: 6, role: 'texture', note: 'JAPAN NATIVE: Golden shade grass' },
        { plantId: 'lady-fern', quantity: 6, role: 'texture', note: 'NATIVE: Graceful deciduous fern' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 4, role: 'carpet', note: 'SIGNATURE: Shade essential' },
        { plantId: 'ajuga', quantity: 2, role: 'carpet', note: 'Purple accent' },
        // ZONE 7 ADDITIONS - Shade groundcovers
        { plantId: 'vinca-minor', quantity: 3, role: 'carpet', note: 'EUROPE: Periwinkle shade spreader' },
        { plantId: 'dead-nettle', quantity: 3, role: 'carpet', note: 'EUROPE: Silver shade groundcover' },
        { plantId: 'sweet-woodruff', quantity: 2, role: 'carpet', note: 'EUROPE: Fragrant shade carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 19. DROUGHT SMART - Water-Wise Xeriscape
  // EXCLUSIVE: Sedums, Ornamental Grasses, Succulents
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'drought-smart',
    name: 'Drought Smart',
    subtitle: 'Water-Wise Xeriscape',
    description: 'Beautiful without the water bill. Drought-tolerant plants that thrive on neglect.',
    theme: 'Xeriscape',
    preview: '☀️',
    colorScheme: ['#FFD54F', '#43A047', '#8D6E63', '#5D4037'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'blue-ice-cypress', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Silver-blue drought tree' },
        { plantId: 'eastern-red-cedar', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Native tough cedar' },
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'Purple drought tree' }
      ],
      structure: [
        { plantId: 'juniper-blue-point', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Blue column' },
        { plantId: 'yew-yewtopia', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Compact yew' },
        { plantId: 'dwarf-yaupon-holly', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Native drought holly' },
        // ZONE 7 ADDITIONS - Drought tolerant shrub
        { plantId: 'blue-mist-shrub', quantity: 4, role: 'structure', note: 'Drought tolerant blue' }
      ],
      seasonal: [
        { plantId: 'russian-sage', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Silver sage' },
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal', note: 'Drought lavender' },
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Drought bloomer' },
        // ZONE 7 ADDITIONS - Drought tolerant perennials
        { plantId: 'blanket-flower', quantity: 8, role: 'seasonal', note: 'NATIVE: Heat/drought proof' },
        { plantId: 'yarrow', quantity: 6, role: 'seasonal', note: 'NATIVE: Drought/deer resistant' },
        { plantId: 'coreopsis', quantity: 6, role: 'seasonal', note: 'NATIVE: Long-blooming drought' },
        { plantId: 'gaura', quantity: 5, role: 'seasonal', note: 'NATIVE: Wispy drought tolerant' },
        { plantId: 'sedum-autumn-joy', quantity: 5, role: 'seasonal', note: 'Drought succulent' },
        { plantId: 'agastache', quantity: 5, role: 'seasonal', note: 'Drought blue spikes' },
        { plantId: 'penstemon', quantity: 5, role: 'seasonal', note: 'NATIVE: Drought tolerant' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 15, role: 'texture', note: 'SIGNATURE: Blue tufts' },
        { plantId: 'hamlin-grass', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Fountain grass' },
        { plantId: 'mexican-feather', quantity: 12, role: 'texture', note: 'EXCLUSIVE: Wispy blonde' },
        // ZONE 7 ADDITIONS - Drought grasses
        { plantId: 'blue-oat-grass', quantity: 8, role: 'texture', note: 'EUROPE: Blue drought grass' },
        { plantId: 'little-bluestem', quantity: 6, role: 'texture', note: 'NATIVE: Prairie drought' }
      ],
      carpet: [
        { plantId: 'sedum-angelina', quantity: 4, role: 'carpet', note: 'SIGNATURE: Golden succulent' },
        { plantId: 'bar-harbor-juniper', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Blue carpet' },
        { plantId: 'juniper-blue-rug', quantity: 2, role: 'carpet', note: 'Silvery carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 20. EVERGREEN FOUNDATION - Timeless Structure
  // EXCLUSIVE: Hollies, Arborvitae, Evergreen Shrubs
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'evergreen-foundation',
    name: 'Evergreen Foundation',
    subtitle: 'Timeless Structure',
    description: 'Classic evergreen foundation planting. Clean, professional, always green.',
    theme: 'Foundation',
    preview: '🌲',
    colorScheme: ['#1B5E20', '#2E7D32', '#388E3C', '#43A047'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'arborvitae-emerald-green', quantity: 3, role: 'hero', note: 'SIGNATURE: Classic column' },
        { plantId: 'arborvitae-green-giant', quantity: 2, role: 'hero', note: 'EXCLUSIVE: Fast screen' },
        { plantId: 'holly-american', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Native holly' },
        // ZONE 7 ADDITIONS - Evergreen trees
        { plantId: 'colorado-blue-spruce', quantity: 1, role: 'hero', note: 'NATIVE: Blue specimen' },
        { plantId: 'white-pine', quantity: 1, role: 'hero', note: 'NATIVE: Soft evergreen' }
      ],
      structure: [
        { plantId: 'holly-nellie-stevens', quantity: 5, role: 'structure', note: 'SIGNATURE: Workhorse holly' },
        { plantId: 'cherry-laurel', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Glossy hedge' },
        { plantId: 'laurel-compact-cherry', quantity: 4, role: 'structure', note: 'Compact version' },
        { plantId: 'cleyera', quantity: 4, role: 'structure', note: 'Evergreen backdrop' },
        // ZONE 7 ADDITIONS - Commercial foundation shrubs
        { plantId: 'indian-hawthorn', quantity: 5, role: 'structure', note: 'ELITE: Commercial #2 foundation' },
        { plantId: 'pittosporum', quantity: 4, role: 'structure', note: 'ELITE: Commercial workhorse' },
        { plantId: 'skip-laurel', quantity: 4, role: 'structure', note: 'Shade screening laurel' },
        { plantId: 'pjm-rhododendron', quantity: 3, role: 'structure', note: 'Cold-hardy evergreen' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua', quantity: 4, role: 'seasonal', note: 'Fall color' },
        { plantId: 'gardenia-frost-proof', quantity: 3, role: 'seasonal', note: 'Summer fragrance' },
        { plantId: 'azalea-encore-majesty', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Purple encore' }
      ],
      texture: [
        { plantId: 'holly-fern', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Evergreen fern' },
        { plantId: 'carex-everillo', quantity: 10, role: 'texture', note: 'Golden sedge' },
        { plantId: 'cast-iron-plant', quantity: 6, role: 'texture', note: 'Indestructible texture' },
        // ZONE 7 ADDITIONS - Liriope
        { plantId: 'big-blue-liriope', quantity: 8, role: 'texture', note: 'ELITE: Commercial spec standard' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 3, role: 'carpet', note: 'SIGNATURE: Evergreen carpet' },
        { plantId: 'liriope-variegated', quantity: 2, role: 'carpet', note: 'Striped edge' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 21. TROPICAL VIBES - Lush & Bold
  // EXCLUSIVE: Bananas, Cannas, Elephant Ears, Bold Tropicals
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'tropical-vibes',
    name: 'Tropical Vibes',
    subtitle: 'Lush & Bold Statement',
    description: 'Bold tropical foliage for that resort vacation feel right at home.',
    theme: 'Tropical',
    preview: '🌴',
    colorScheme: ['#43A047', '#D84315', '#FFD54F', '#E91E63'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: { light: 'part-shade', moisture: 'wet', maintenance: 'showcase' },
    plants: {
      hero: [
        { plantId: 'magnolia-alta', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Columnar magnolia' },
        { plantId: 'crape-myrtle-dynamite', quantity: 1, role: 'hero', note: 'Red tropical crape' },
        { plantId: 'windmill-palm', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Hardy palm (if available)' }
      ],
      structure: [
        { plantId: 'fatsia', quantity: 4, role: 'structure', note: 'SIGNATURE: Bold tropical leaf' },
        { plantId: 'anise-florida-sunshine', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Golden anise' },
        { plantId: 'anise-bananappeal', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Banana-scent anise' },
        { plantId: 'gardenia-jubilation', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Large gardenia' }
      ],
      seasonal: [
        { plantId: 'hibiscus', quantity: 5, role: 'seasonal', note: 'SIGNATURE: Tropical blooms' },
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Tropical color' },
        { plantId: 'gardenia-kleims-hardy', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Compact gardenia' }
      ],
      texture: [
        { plantId: 'maiden-grass', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Tall tropical grass' },
        { plantId: 'zebra-grass', quantity: 6, role: 'texture', note: 'EXCLUSIVE: Banded tropical' },
        { plantId: 'cast-iron-plant', quantity: 8, role: 'texture', note: 'Bold shade texture' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 3, role: 'carpet', note: 'SIGNATURE: Tropical carpet' },
        { plantId: 'mondo-grass', quantity: 2, role: 'carpet', note: 'Asian groundcover' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 22. COTTAGE CHARM - Informal Romance
  // EXCLUSIVE: Peonies, Old Roses, Cottage Perennials
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'cottage-charm',
    name: 'Cottage Charm',
    subtitle: 'Informal Romantic Garden',
    description: 'Overflowing cottage garden with romantic perennials and old-fashioned charm.',
    theme: 'Cottage',
    preview: '🌸',
    colorScheme: ['#E91E63', '#7B1FA2', '#FFFFFF', '#FFB6C1'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        { plantId: 'crape-myrtle-pink-velour', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Pink cottage tree' },
        { plantId: 'fringe-tree', quantity: 1, role: 'hero', note: 'EXCLUSIVE: White fringe' },
        { plantId: 'redbud-forest-pansy', quantity: 1, role: 'hero', note: 'Purple-leaf redbud' }
      ],
      structure: [
        { plantId: 'hydrangea-endless-summer', quantity: 5, role: 'structure', note: 'SIGNATURE: Cottage hydrangea' },
        { plantId: 'weigela', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Pink bells' },
        { plantId: 'forsythia-sugar-baby', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Spring yellow' },
        // ZONE 7 ADDITIONS - Cottage shrubs
        { plantId: 'mock-orange', quantity: 3, role: 'structure', note: 'ZONE 7: Fragrant white cottage classic' },
        { plantId: 'bridal-wreath-spirea', quantity: 3, role: 'structure', note: 'ZONE 7: Classic white arching' }
      ],
      seasonal: [
        { plantId: 'peony', quantity: 6, role: 'seasonal', note: 'SIGNATURE: Cottage classic' },
        { plantId: 'rose-apricot-drift', quantity: 5, role: 'seasonal', note: 'Apricot cottage rose' },
        { plantId: 'rose-peach-drift', quantity: 5, role: 'seasonal', note: 'Peach cottage' },
        { plantId: 'daylily-happy-returns', quantity: 8, role: 'seasonal', note: 'Yellow rebloomer' },
        // ZONE 7 ADDITIONS - Cottage perennials
        { plantId: 'siberian-iris', quantity: 4, role: 'seasonal', note: 'ZONE 7: Blue cottage iris' },
        { plantId: 'astilbe', quantity: 4, role: 'seasonal', note: 'ZONE 7: Feathery cottage plumes' }
      ],
      texture: [
        { plantId: 'catmint-walkers', quantity: 10, role: 'texture', note: 'SIGNATURE: Blue cottage border' },
        { plantId: 'shasta-daisy-becky', quantity: 8, role: 'texture', note: 'EXCLUSIVE: White daisies' },
        { plantId: 'coral-bell', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Heuchera foliage' },
        // ZONE 7 ADDITIONS - Cottage texture
        { plantId: 'dianthus', quantity: 6, role: 'texture', note: 'ZONE 7: Cottage garden pinks' },
        { plantId: 'coral-bells', quantity: 4, role: 'texture', note: 'ZONE 7: Colorful shade foliage' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 3, role: 'carpet', note: 'SIGNATURE: Spring color carpet' },
        { plantId: 'veronica-georgia-blue', quantity: 2, role: 'carpet', note: 'Blue spring' },
        // ZONE 7 ADDITIONS - Cottage groundcovers
        { plantId: 'sweet-woodruff', quantity: 3, role: 'carpet', note: 'ZONE 7: Fragrant shade carpet' },
        { plantId: 'creeping-jenny', quantity: 2, role: 'carpet', note: 'ZONE 7: Golden cottage carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 23. MINIMALIST MODERN - Clean Contemporary
  // EXCLUSIVE: Architectural Plants, Grasses, Minimal Palette
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    subtitle: 'Clean Contemporary Lines',
    description: 'Architectural plants, ornamental grasses, and a restrained color palette.',
    theme: 'Modern',
    preview: '◻️',
    colorScheme: ['#1B5E20', '#FFFFFF', '#8D6E63', '#5D4037'],
    baseSize: '150 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'juniper-skyrocket', quantity: 3, role: 'hero', note: 'SIGNATURE: Narrow columns' },
        { plantId: 'blue-point-juniper', quantity: 2, role: 'hero', note: 'EXCLUSIVE: Blue pyramids' },
        { plantId: 'arborvitae-north-pole', quantity: 2, role: 'hero', note: 'EXCLUSIVE: Narrow arborvitae' }
      ],
      structure: [
        { plantId: 'holly-carissa', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Soft holly' },
        { plantId: 'holly-helleri', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Compact holly' },
        { plantId: 'yew-dukes-garden', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Spreading yew' },
        // ZONE 7 ADDITIONS - Modern shrubs
        { plantId: 'sky-pencil-holly', quantity: 3, role: 'structure', note: 'ZONE 7: Narrow architectural column' }
      ],
      seasonal: [
        { plantId: 'hydrangea-little-lime', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Compact lime' },
        { plantId: 'gardenia-kleims-hardy', quantity: 3, role: 'seasonal', note: 'Compact white' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 12, role: 'texture', note: 'SIGNATURE: Vertical grass lines' },
        { plantId: 'blue-fescue', quantity: 15, role: 'texture', note: 'Blue spheres' },
        { plantId: 'carex-everillo', quantity: 10, role: 'texture', note: 'Golden accents' },
        // ZONE 7 ADDITIONS - Architectural grasses
        { plantId: 'blue-oat-grass', quantity: 6, role: 'texture', note: 'ZONE 7: Steel blue architectural' },
        { plantId: 'japanese-forest-grass', quantity: 4, role: 'texture', note: 'ZONE 7: Golden cascading grass' }
      ],
      carpet: [
        { plantId: 'juniper-blue-rug', quantity: 3, role: 'carpet', note: 'SIGNATURE: Blue carpet' },
        { plantId: 'juniper-blue-pacific', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Pacific juniper' },
        // ZONE 7 ADDITIONS
        { plantId: 'vinca-minor', quantity: 2, role: 'carpet', note: 'ZONE 7: Clean evergreen carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 24. WOODLAND EDGE - Natural Transition
  // EXCLUSIVE: Native Trees, Understory Plants, Ferns
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'woodland-edge',
    name: 'Woodland Edge',
    subtitle: 'Natural Forest Transition',
    description: 'Where lawn meets forest - native plants that create a natural woodland edge.',
    theme: 'Native Woodland',
    preview: '🌳',
    colorScheme: ['#1B5E20', '#8D6E63', '#FFFFFF', '#5D4037'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'serviceberry-autumn-brilliance', quantity: 2, role: 'hero', note: 'SIGNATURE: Native four-season' },
        { plantId: 'dogwood', quantity: 1, role: 'hero', note: 'Native flowering' },
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Spring purple' }
      ],
      structure: [
        { plantId: 'beautyberry', quantity: 5, role: 'structure', note: 'SIGNATURE: Purple berry clusters' },
        { plantId: 'fothergilla-dwarf', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Native witch-hazel' },
        { plantId: 'hydrangea-oakleaf', quantity: 4, role: 'structure', note: 'Native hydrangea' },
        { plantId: 'sweetspire-little-henry', quantity: 4, role: 'structure', note: 'Native sweetspire' },
        // ZONE 7 ADDITIONS - Woodland shrubs
        { plantId: 'elderberry', quantity: 2, role: 'structure', note: 'US NATIVE: Wildlife-friendly' },
        { plantId: 'clethra', quantity: 2, role: 'structure', note: 'US NATIVE: Summersweet shade' }
      ],
      seasonal: [
        { plantId: 'lenten-rose', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Early shade bloom' },
        { plantId: 'azalea-encore-carnation', quantity: 5, role: 'seasonal', note: 'Woodland azalea' },
        { plantId: 'bee-balm', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Native pollinator' },
        // ZONE 7 ADDITIONS - Woodland perennials
        { plantId: 'astilbe', quantity: 4, role: 'seasonal', note: 'ZONE 7: Feathery shade plumes' },
        { plantId: 'coneflower', quantity: 3, role: 'seasonal', note: 'US NATIVE: Woodland edge pollinator' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 12, role: 'texture', note: 'SIGNATURE: Woodland fern' },
        { plantId: 'fern-christmas', quantity: 8, role: 'texture', note: 'Evergreen fern' },
        { plantId: 'northern-sea-oats', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Native oats' },
        // ZONE 7 ADDITIONS - Woodland texture
        { plantId: 'coral-bells', quantity: 4, role: 'texture', note: 'ZONE 7: Colorful shade foliage' },
        { plantId: 'japanese-forest-grass', quantity: 4, role: 'texture', note: 'ZONE 7: Golden shade grass' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'SIGNATURE: Woodland carpet' },
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet', note: 'Native phlox' },
        // ZONE 7 ADDITIONS - Woodland groundcovers
        { plantId: 'sweet-woodruff', quantity: 3, role: 'carpet', note: 'ZONE 7: Fragrant shade carpet' },
        { plantId: 'vinca-minor', quantity: 2, role: 'carpet', note: 'ZONE 7: Evergreen shade carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 25. PRIVACY SCREEN - Fast & Dense
  // EXCLUSIVE: Fast-Growing Screens, Dense Evergreens
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'privacy-screen',
    name: 'Privacy Screen',
    subtitle: 'Fast & Dense Coverage',
    description: 'For when you need privacy ASAP. Fast-growing, dense evergreen screens.',
    theme: 'Functional',
    preview: '🏠',
    colorScheme: ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'leyland-cypress', quantity: 5, role: 'hero', note: 'SIGNATURE: Fast privacy screen' },
        { plantId: 'arborvitae-green-giant', quantity: 4, role: 'hero', note: 'EXCLUSIVE: 3-4ft/year growth' },
        { plantId: 'carolina-sapphire-cypress', quantity: 3, role: 'hero', note: 'EXCLUSIVE: Blue-green screen' }
      ],
      structure: [
        { plantId: 'holly-nellie-stevens', quantity: 6, role: 'structure', note: 'SIGNATURE: Dense holly' },
        { plantId: 'cherry-laurel', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Fast evergreen' },
        { plantId: 'wax-myrtle', quantity: 4, role: 'structure', note: 'Fast native screen' },
        // ZONE 7 ADDITIONS - Privacy shrubs
        { plantId: 'sky-pencil-holly', quantity: 4, role: 'structure', note: 'ZONE 7: Narrow columnar accent' },
        { plantId: 'snowball-viburnum', quantity: 3, role: 'structure', note: 'ZONE 7: Dense screening viburnum' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Screening camellia' },
        { plantId: 'gardenia-august-beauty', quantity: 3, role: 'seasonal', note: 'Tall gardenia' }
      ],
      texture: [
        { plantId: 'holly-fern', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Evergreen fern' },
        { plantId: 'carex-everillo', quantity: 8, role: 'texture', note: 'Golden sedge' },
        // ZONE 7 ADDITIONS - Screen understory
        { plantId: 'blue-oat-grass', quantity: 5, role: 'texture', note: 'ZONE 7: Steel blue accent' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 4, role: 'carpet', note: 'SIGNATURE: Fast evergreen carpet' },
        { plantId: 'liriope-variegated', quantity: 2, role: 'carpet', note: 'Striped edge' },
        // ZONE 7 ADDITIONS
        { plantId: 'vinca-minor', quantity: 3, role: 'carpet', note: 'ZONE 7: Evergreen shade carpet' }
      ]
    }
  }
];

// Export bundle count for statistics
export const BUNDLE_COUNT = PLANT_BUNDLES.length;

// Helper to get bundle by ID
export const getBundleById = (id) => PLANT_BUNDLES.find(b => b.id === id);

// Get all plants from a bundle
export const getBundlePlants = (bundle) => {
  if (!bundle || !bundle.plants) return [];
  return [
    ...(bundle.plants.hero || []),
    ...(bundle.plants.structure || []),
    ...(bundle.plants.seasonal || []),
    ...(bundle.plants.texture || []),
    ...(bundle.plants.carpet || [])
  ];
};

// Invasive plant warnings - plants that may spread aggressively
export const INVASIVE_WARNINGS = {
  'bamboo-golden': 'Running bamboo - spreads aggressively underground. Requires containment barrier.',
  'english-ivy': 'Invasive in many regions. Can damage structures and trees.',
  'vinca-minor': 'Can escape cultivation and spread in woodlands.',
  'wisteria-chinese': 'Can strangle trees and damage structures. Japanese wisteria preferred.',
  'butterfly-bush': 'Invasive in some regions. Consider sterile cultivars.',
  'burning-bush': 'Invasive in eastern US. Birds spread seeds.',
  'privet': 'Highly invasive. Consider native alternatives like inkberry.'
};

// Get invasive warning for a plant
export const getInvasiveWarning = (plantId) => {
  return INVASIVE_WARNINGS[plantId] || null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISNEY HORTICULTURE SPACING & DENSITY RULES
// Source: Disney Imagineering Horticulture Standards
// ═══════════════════════════════════════════════════════════════════════════════

// Layer Distribution Ratios (by bed volume)
export const DISNEY_LAYER_RATIOS = {
  TALL_THRILLERS: 0.10,    // 10% - Focal points, hero plants, canopy trees
  MEDIUM_FILLERS: 0.60,    // 60% - Bulk of planting (structure, seasonal)
  LOW_SPILLERS: 0.30       // 30% - Borders, groundcovers (texture, carpet)
};

// Spacing Standards (in inches, on center)
export const DISNEY_SPACING = {
  LOW: { min: 6, max: 8, label: '6-8" OC', avgSpacing: 7 },      // Groundcovers, low perennials
  MEDIUM: { min: 10, max: 12, label: '10-12" OC', avgSpacing: 11 }, // Shrubs, perennials
  TALL: { min: 18, max: 24, label: '18-24" OC', avgSpacing: 21 },   // Large shrubs
  TREE: { min: 72, max: 180, label: '6-15ft', avgSpacing: 120 }    // Trees, focal points
};

// Map plant roles to spacing standards
export const ROLE_TO_SPACING = {
  hero: 'TREE',
  structure: 'TALL',
  seasonal: 'MEDIUM',
  texture: 'MEDIUM',
  carpet: 'LOW'
};

// Map plant roles to layer categories
export const ROLE_TO_LAYER = {
  hero: 'TALL_THRILLERS',
  structure: 'MEDIUM_FILLERS',
  seasonal: 'MEDIUM_FILLERS',
  texture: 'LOW_SPILLERS',
  carpet: 'LOW_SPILLERS'
};

// Coverage Standards
// IMPORTANT: 85-90% coverage is TARGET AT PLANT MATURITY, not at planting
// 70% of installs use younger plants with multiplier for immediate "full" look
export const DISNEY_COVERAGE = {
  TARGET_COVERAGE_AT_MATURITY: 0.90,  // 90% surface coverage WHEN MATURE
  MIN_COVERAGE_AT_MATURITY: 0.85,     // 85% minimum acceptable AT MATURITY
  YOUNG_PLANT_USAGE: 0.70,            // 70% of installs use younger plants
  PLANTS_PER_SQFT: {
    dense: 2,              // Young plants, instant impact (1.5-2x multiplier)
    standard: 1,           // Mature plants or budget installs (1x multiplier)
    sparse: 0.5            // Specimen/focal planting
  },
  MULTIPLIER_GUIDE: {
    young_instant: 2.0,    // Young plants, want immediate full coverage
    young_standard: 1.5,   // Young plants, standard growth room
    mature: 1.0,           // Mature plants, proper spacing for final size
    specimen: 0.75         // Focal specimens, room to showcase
  }
};

/**
 * Calculate Disney-standard plant quantities based on bed area
 * Coverage target is 85-90% AT MATURITY - multiplier compensates for young plant installs
 *
 * @param {number} bedAreaSqFt - Bed area in square feet
 * @param {string} plantAge - 'young' (70% of installs), 'mature', or 'specimen'
 * @returns {Object} Plant count targets by role
 */
export const calculateDisneyQuantities = (bedAreaSqFt, plantAge = 'young') => {
  // Select plants per sqft based on plant age/install type
  let plantsPerSqFt;
  switch (plantAge) {
    case 'young':
    case 'dense':
      plantsPerSqFt = DISNEY_COVERAGE.PLANTS_PER_SQFT.dense;  // 2 per sqft
      break;
    case 'mature':
    case 'standard':
    case 'normal':
      plantsPerSqFt = DISNEY_COVERAGE.PLANTS_PER_SQFT.standard; // 1 per sqft
      break;
    case 'specimen':
    case 'sparse':
      plantsPerSqFt = DISNEY_COVERAGE.PLANTS_PER_SQFT.sparse; // 0.5 per sqft
      break;
    default:
      plantsPerSqFt = DISNEY_COVERAGE.PLANTS_PER_SQFT.dense;  // Default to young/dense
  }

  const totalPlants = Math.round(bedAreaSqFt * plantsPerSqFt);

  // Apply layer ratios (10% Tall, 60% Medium, 30% Low)
  const tallCount = Math.max(1, Math.round(totalPlants * DISNEY_LAYER_RATIOS.TALL_THRILLERS));
  const mediumCount = Math.round(totalPlants * DISNEY_LAYER_RATIOS.MEDIUM_FILLERS);
  const lowCount = Math.round(totalPlants * DISNEY_LAYER_RATIOS.LOW_SPILLERS);

  return {
    total: totalPlants,
    hero: Math.max(1, Math.round(tallCount * 0.5)),           // Half of tall allocation
    structure: Math.round(mediumCount * 0.6),                  // 60% of medium allocation
    seasonal: Math.round(mediumCount * 0.4),                   // 40% of medium allocation
    texture: Math.round(lowCount * 0.6),                       // 60% of low allocation
    carpet: Math.round(lowCount * 0.4),                        // 40% of low allocation
    byLayer: {
      tall: tallCount,
      medium: mediumCount,
      low: lowCount
    },
    plantAge,
    plantsPerSqFt
  };
};

/**
 * Get spacing for a plant based on its role
 * @param {string} role - Plant role (hero, structure, seasonal, texture, carpet)
 * @returns {Object} Spacing configuration
 */
export const getPlantSpacing = (role) => {
  const spacingKey = ROLE_TO_SPACING[role] || 'MEDIUM';
  return DISNEY_SPACING[spacingKey];
};

/**
 * Calculate how many plants fit in area based on spacing
 * @param {number} areaSqFt - Area in square feet
 * @param {string} role - Plant role
 * @returns {number} Number of plants that fit
 */
export const calculatePlantsFromSpacing = (areaSqFt, role) => {
  const spacing = getPlantSpacing(role);
  const avgSpacingFt = spacing.avgSpacing / 12; // Convert inches to feet
  const plantsPerRow = Math.sqrt(areaSqFt) / avgSpacingFt;
  return Math.round(plantsPerRow * plantsPerRow);
};

/**
 * Apply Disney density multiplier to bundle plants
 *
 * Multiplier Guide (from DISNEY_COVERAGE.MULTIPLIER_GUIDE):
 * - 2.0: Young plants, instant full coverage (most common - 70% of installs)
 * - 1.5: Young plants, standard growth room
 * - 1.0: Mature plants, proper spacing for final size
 * - 0.75: Specimen planting, room to showcase
 *
 * @param {Object} bundle - The bundle definition
 * @param {number} multiplier - Density multiplier (default 1.5 for young plants)
 * @param {number} bedAreaSqFt - Bed area in square feet
 * @returns {Array} Plants with adjusted quantities
 */
export const applyDisneyDensity = (bundle, multiplier = 1.5, bedAreaSqFt = 200) => {
  const plants = getBundlePlants(bundle);

  // Determine plant age category based on multiplier
  let plantAge = 'young';
  if (multiplier >= 1.75) plantAge = 'young';       // Dense young plants
  else if (multiplier >= 1.25) plantAge = 'young';  // Standard young plants
  else if (multiplier >= 0.9) plantAge = 'mature';  // Mature plants
  else plantAge = 'specimen';                        // Specimen planting

  const targetCounts = calculateDisneyQuantities(bedAreaSqFt, plantAge);

  // Group plants by role
  const byRole = {};
  plants.forEach(p => {
    if (!byRole[p.role]) byRole[p.role] = [];
    byRole[p.role].push(p);
  });

  // Scale quantities based on role targets and multiplier
  const result = [];
  Object.entries(byRole).forEach(([role, rolePlants]) => {
    const roleTarget = targetCounts[role] || 5;
    const totalInRole = rolePlants.reduce((sum, p) => sum + p.quantity, 0);
    const scaleFactor = (roleTarget * multiplier) / totalInRole;

    rolePlants.forEach(p => {
      const scaledQty = Math.max(1, Math.round(p.quantity * scaleFactor));
      result.push({
        ...p,
        quantity: scaledQty,
        spacing: getPlantSpacing(p.role),
        plantAge
      });
    });
  });

  return result;
};

/**
 * Validate bundle against Disney layer ratios
 * @param {Object} bundle - Bundle to validate
 * @returns {Object} Validation result with issues
 */
export const validateBundleRatios = (bundle) => {
  const plants = getBundlePlants(bundle);
  const totalQty = plants.reduce((sum, p) => sum + p.quantity, 0);

  if (totalQty === 0) return { valid: true, issues: [] };

  // Calculate actual ratios
  const heroQty = plants.filter(p => p.role === 'hero').reduce((sum, p) => sum + p.quantity, 0);
  const structureQty = plants.filter(p => p.role === 'structure').reduce((sum, p) => sum + p.quantity, 0);
  const seasonalQty = plants.filter(p => p.role === 'seasonal').reduce((sum, p) => sum + p.quantity, 0);
  const textureQty = plants.filter(p => p.role === 'texture').reduce((sum, p) => sum + p.quantity, 0);
  const carpetQty = plants.filter(p => p.role === 'carpet').reduce((sum, p) => sum + p.quantity, 0);

  const tallRatio = heroQty / totalQty;
  const mediumRatio = (structureQty + seasonalQty) / totalQty;
  const lowRatio = (textureQty + carpetQty) / totalQty;

  const issues = [];

  // Check tall (should be ~10%)
  if (tallRatio > 0.20) {
    issues.push(`Too many hero plants (${Math.round(tallRatio * 100)}%). Target: 10%`);
  }

  // Check medium (should be ~60%)
  if (mediumRatio < 0.40) {
    issues.push(`Not enough fillers (${Math.round(mediumRatio * 100)}%). Target: 60%`);
  } else if (mediumRatio > 0.80) {
    issues.push(`Too many fillers (${Math.round(mediumRatio * 100)}%). Target: 60%`);
  }

  // Check low (should be ~30%)
  if (lowRatio < 0.15) {
    issues.push(`Not enough groundcover (${Math.round(lowRatio * 100)}%). Target: 30%`);
  }

  return {
    valid: issues.length === 0,
    issues,
    ratios: {
      tall: Math.round(tallRatio * 100),
      medium: Math.round(mediumRatio * 100),
      low: Math.round(lowRatio * 100)
    },
    counts: {
      hero: heroQty,
      structure: structureQty,
      seasonal: seasonalQty,
      texture: textureQty,
      carpet: carpetQty,
      total: totalQty
    }
  };
};
