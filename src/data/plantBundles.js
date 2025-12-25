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
        { plantId: 'magnolia-southern', quantity: 1, role: 'hero', note: 'SIGNATURE: Grand Southern statement' },
        { plantId: 'dogwood', quantity: 2, role: 'hero', note: 'SIGNATURE: Masters spring timing' },
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'Burgundy specimen focal' }
      ],
      structure: [
        { plantId: 'tea-olive', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Signature fragrance' },
        { plantId: 'camellia-japonica', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Winter blooms' },
        { plantId: 'cleyera', quantity: 5, role: 'structure', note: 'Evergreen backdrop' }
      ],
      seasonal: [
        { plantId: 'azalea-encore-carnation', quantity: 10, role: 'seasonal', note: 'SIGNATURE: Pink mass' },
        { plantId: 'azalea-encore-amethyst', quantity: 6, role: 'seasonal', note: 'Purple accents' },
        { plantId: 'gardenia-august-beauty', quantity: 4, role: 'seasonal', note: 'Summer fragrance' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 12, role: 'texture', note: 'EXCLUSIVE: Woodland texture' },
        { plantId: 'fern-christmas', quantity: 8, role: 'texture', note: 'Evergreen fern' },
        { plantId: 'cast-iron-plant', quantity: 6, role: 'texture', note: 'Deep shade tolerant' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Shade groundcover' },
        { plantId: 'ajuga', quantity: 2, role: 'carpet', note: 'Purple accent carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MAIN STREET CLASSIC - Patriotic Americana
  // EXCLUSIVE: Roses, Hydrangeas, Hostas, Daylilies
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
        { plantId: 'crape-myrtle-natchez', quantity: 1, role: 'hero', note: 'SIGNATURE: White summer blooms' },
        { plantId: 'redbud', quantity: 1, role: 'hero', note: 'SIGNATURE: Early spring purple' },
        { plantId: 'serviceberry', quantity: 1, role: 'hero', note: 'Native four-season interest' }
      ],
      structure: [
        { plantId: 'hydrangea-limelight', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Summer showstopper' },
        { plantId: 'hydrangea-annabelle', quantity: 4, role: 'structure', note: 'White pom-poms' },
        { plantId: 'holly-nellie-stevens', quantity: 3, role: 'structure', note: 'Evergreen backdrop' }
      ],
      seasonal: [
        { plantId: 'rose-knockout-double-red', quantity: 6, role: 'seasonal', note: 'SIGNATURE: Red continuous bloom' },
        { plantId: 'rose-pink-drift', quantity: 5, role: 'seasonal', note: 'Pink carpet roses' },
        { plantId: 'rose-coral-drift', quantity: 5, role: 'seasonal', note: 'Coral accents' }
      ],
      texture: [
        { plantId: 'hosta', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Shade texture' },
        { plantId: 'hosta-patriot', quantity: 6, role: 'texture', note: 'White-edged patriotic' },
        { plantId: 'daylily-stella', quantity: 10, role: 'texture', note: 'Yellow continuous bloom' }
      ],
      carpet: [
        { plantId: 'liriope-variegated', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Striped edging' },
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet', note: 'Spring color carpet' }
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
        { plantId: 'sweetspire-little-henry', quantity: 5, role: 'structure', note: 'Native sweetspire' }
      ],
      seasonal: [
        { plantId: 'coneflower', quantity: 12, role: 'seasonal', note: 'SIGNATURE: Purple prairie icon' },
        { plantId: 'coneflower-cheyenne', quantity: 8, role: 'seasonal', note: 'Yellow coneflower' },
        { plantId: 'black-eyed-susan', quantity: 12, role: 'seasonal', note: 'SIGNATURE: Golden native' },
        { plantId: 'bee-balm', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Pollinator magnet' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 10, role: 'texture', note: 'SIGNATURE: Pink fall clouds' },
        { plantId: 'muhly-grass-white', quantity: 6, role: 'texture', note: 'White cloud grass' },
        { plantId: 'northern-sea-oats', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Native oats' },
        { plantId: 'karl-foerster', quantity: 6, role: 'texture', note: 'Feather reed grass' }
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
        { plantId: 'magnolia-sweetbay', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Swamp magnolia' }
      ],
      structure: [
        { plantId: 'wax-myrtle', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Coastal native' },
        { plantId: 'holly-inkberry', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Wet tolerant holly' },
        { plantId: 'leucothoe', quantity: 4, role: 'structure', note: 'Arching wet-tolerant' }
      ],
      seasonal: [
        { plantId: 'iris', quantity: 10, role: 'seasonal', note: 'SIGNATURE: Water iris' },
        { plantId: 'astilbe-fanal', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Red plumes' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal', note: 'Moisture loving' }
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
        { plantId: 'loropetalum-crimson-fire', quantity: 4, role: 'structure', note: 'Burgundy coastal accent' }
      ],
      seasonal: [
        { plantId: 'lantana-ms-huff', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Hardy lantana' },
        { plantId: 'gardenia-frost-proof', quantity: 4, role: 'seasonal', note: 'Fragrant coastal' },
        { plantId: 'hibiscus', quantity: 4, role: 'seasonal', note: 'Tropical blooms' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 12, role: 'texture', note: 'SIGNATURE: Pink coastal clouds' },
        { plantId: 'adagio-grass', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Compact miscanthus' },
        { plantId: 'mexican-feather', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Wispy movement' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Salt-tolerant carpet' },
        { plantId: 'juniper-blue-pacific', quantity: 2, role: 'carpet', note: 'Coastal juniper' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. MEXICO PAVILION - Desert Southwest
  // EXCLUSIVE: Agaves, Yuccas, Red Yucca, Desert Succulents
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'mexico-pavilion',
    name: 'Mexico Pavilion',
    subtitle: 'Desert Courtyard + Succulents',
    description: 'Authentic Mexican desert feel with succulents, agaves, and bold architectural plants.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇽',
    colorScheme: ['#D84315', '#FFB300', '#43A047', '#5D4037'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'vitex-shoal-creek', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Purple desert tree' },
        { plantId: 'crape-myrtle-dynamite', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Red desert crape' },
        { plantId: 'blue-atlas-cedar', quantity: 1, role: 'hero', note: 'Blue desert specimen' }
      ],
      structure: [
        { plantId: 'nandina-blush-pink', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Pink nandina' },
        { plantId: 'barberry', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Thorny burgundy' },
        { plantId: 'mugo-pine', quantity: 3, role: 'structure', note: 'Compact desert pine' }
      ],
      seasonal: [
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Desert bloomer' },
        { plantId: 'russian-sage', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Silver desert sage' },
        { plantId: 'lavender-phenomenal', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Desert lavender' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 15, role: 'texture', note: 'EXCLUSIVE: Blue desert tufts' },
        { plantId: 'maiden-grass', quantity: 6, role: 'texture', note: 'Tall desert grass' },
        { plantId: 'hamlin-grass', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Fountain grass' }
      ],
      carpet: [
        { plantId: 'sedum-angelina', quantity: 4, role: 'carpet', note: 'EXCLUSIVE: Golden succulent' },
        { plantId: 'bar-harbor-juniper', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Blue creeping juniper' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. ENGLAND PAVILION - English Cottage
  // EXCLUSIVE: English Roses, Lavender, Boxwood, Cottage Perennials
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'england-pavilion',
    name: 'England Pavilion',
    subtitle: 'English Cottage Garden',
    description: 'Roses, boxwood hedges, lavender borders, and romantic cottage perennial drifts.',
    theme: 'EPCOT World Showcase',
    preview: '🇬🇧',
    colorScheme: ['#E91E63', '#7B1FA2', '#FFFFFF', '#1B5E20'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        { plantId: 'dogwood-kousa', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Korean dogwood' },
        { plantId: 'fringe-tree', quantity: 1, role: 'hero', note: 'EXCLUSIVE: White fringe' },
        { plantId: 'kwanzan-cherry', quantity: 1, role: 'hero', note: 'Pink double cherry' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 10, role: 'structure', note: 'SIGNATURE: English hedge' },
        { plantId: 'boxwood-winter-gem', quantity: 6, role: 'structure', note: 'Compact boxwood' },
        { plantId: 'holly-sky-pencil', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Vertical accent' }
      ],
      seasonal: [
        { plantId: 'rose-apricot-drift', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Apricot cottage rose' },
        { plantId: 'rose-peach-drift', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Peach cottage' },
        { plantId: 'hydrangea-endless-summer', quantity: 4, role: 'seasonal', note: 'Blue/pink cottage' },
        { plantId: 'peony', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Cottage classic' }
      ],
      texture: [
        { plantId: 'lavender', quantity: 10, role: 'texture', note: 'SIGNATURE: English lavender' },
        { plantId: 'catmint-walkers', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Blue catmint' },
        { plantId: 'lambs-ear', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Soft silver' }
      ],
      carpet: [
        { plantId: 'creeping-thyme', quantity: 3, role: 'carpet', note: 'SIGNATURE: English herb' },
        { plantId: 'veronica-georgia-blue', quantity: 2, role: 'carpet', note: 'Blue spring' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. ITALY PAVILION - Mediterranean Formal
  // EXCLUSIVE: Cypress, Rosemary, Italian Herbs, Olive-like Plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'italy-pavilion',
    name: 'Italy Pavilion',
    subtitle: 'Tuscan Villa Garden',
    description: 'Italian parterre gardens with cypress columns, rosemary, and Mediterranean herbs.',
    theme: 'EPCOT World Showcase',
    preview: '🇮🇹',
    colorScheme: ['#43A047', '#5D4037', '#FFB300', '#D84315'],
    baseSize: '200 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'showcase' },
    plants: {
      hero: [
        { plantId: 'juniper-spartan', quantity: 2, role: 'hero', note: 'SIGNATURE: Italian cypress form' },
        { plantId: 'juniper-taylor', quantity: 2, role: 'hero', note: 'EXCLUSIVE: Columnar juniper' },
        { plantId: 'cryptomeria-radicans', quantity: 1, role: 'hero', note: 'Evergreen column' }
      ],
      structure: [
        { plantId: 'rosemary', quantity: 6, role: 'structure', note: 'SIGNATURE: Italian herb essential' },
        { plantId: 'laurel-otto-luyken', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Italian laurel' },
        { plantId: 'ligustrum', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Italian privet' }
      ],
      seasonal: [
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal', note: 'Mediterranean lavender' },
        { plantId: 'salvia-may-night', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Italian sage' },
        { plantId: 'salvia-blue-hill', quantity: 6, role: 'seasonal', note: 'Blue sage' }
      ],
      texture: [
        { plantId: 'santolina', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Silver mound' },
        { plantId: 'artemisia', quantity: 6, role: 'texture', note: 'EXCLUSIVE: Silver herbs' },
        { plantId: 'blue-fescue', quantity: 10, role: 'texture', note: 'Blue Mediterranean grass' }
      ],
      carpet: [
        { plantId: 'rosemary-creeping', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Creeping rosemary' },
        { plantId: 'juniper-blue-rug', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Blue carpet juniper' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. FRANCE PAVILION - French Formal
  // EXCLUSIVE: Parterres, Roses, Lavender Fields, Symmetry
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'france-pavilion',
    name: 'France Pavilion',
    subtitle: 'French Formal Garden',
    description: 'French parterre gardens - boxwood parterres, lavender fields of Provence, roses.',
    theme: 'EPCOT World Showcase',
    preview: '🇫🇷',
    colorScheme: ['#7B1FA2', '#E91E63', '#1B5E20', '#FFFFFF'],
    baseSize: '250 sq ft',
    defaultZone: 7,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        { plantId: 'magnolia-brackens-brown', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Compact magnolia' },
        { plantId: 'crape-myrtle-pink-velour', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Pink French crape' },
        { plantId: 'yoshino-cherry', quantity: 1, role: 'hero', note: 'SIGNATURE: French cherry' }
      ],
      structure: [
        { plantId: 'boxwood-wintergreen', quantity: 16, role: 'structure', note: 'SIGNATURE: French parterre' },
        { plantId: 'baby-gem-boxwood', quantity: 8, role: 'structure', note: 'EXCLUSIVE: Compact edging' },
        { plantId: 'distylium-vintage-jade', quantity: 4, role: 'structure', note: 'Modern boxwood alternative' }
      ],
      seasonal: [
        { plantId: 'rose-red-drift', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: French red rose' },
        { plantId: 'hydrangea-little-quick-fire', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Pink-white' },
        { plantId: 'hydrangea-little-lime', quantity: 4, role: 'seasonal', note: 'Compact lime hydrangea' }
      ],
      texture: [
        { plantId: 'lavender', quantity: 14, role: 'texture', note: 'SIGNATURE: Provence lavender' },
        { plantId: 'stokesia-blue-danube', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Blue aster' },
        { plantId: 'shasta-daisy-becky', quantity: 8, role: 'texture', note: 'EXCLUSIVE: White daisies' }
      ],
      carpet: [
        { plantId: 'gardenia-radicans', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Fragrant carpet' },
        { plantId: 'juniper-procumbens-nana', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Japanese garden juniper' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. GERMANY PAVILION - Central European
  // EXCLUSIVE: Spireas, Weigelas, German Perennials
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'germany-pavilion',
    name: 'Germany Pavilion',
    subtitle: 'Bavarian Garden Charm',
    description: 'Central European style - formal hedges with cottage perennials. Karl Foerster grass named after famous German nurseryman.',
    theme: 'EPCOT World Showcase',
    preview: '🇩🇪',
    colorScheme: ['#FFD54F', '#D84315', '#1B5E20', '#5D4037'],
    baseSize: '150 sq ft',
    defaultZone: 6,
    filters: { light: 'full-sun', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        { plantId: 'hornbeam-american', quantity: 1, role: 'hero', note: 'EXCLUSIVE: European hedge tree' },
        { plantId: 'ginkgo', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Ancient German specimen' },
        { plantId: 'zelkova-musashino', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Columnar elm' }
      ],
      structure: [
        { plantId: 'spirea-gold-flame', quantity: 6, role: 'structure', note: 'EXCLUSIVE: Golden spirea' },
        { plantId: 'spirea-candy-corn', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Multi-color spirea' },
        { plantId: 'weigela', quantity: 4, role: 'structure', note: 'EXCLUSIVE: German cottage shrub' }
      ],
      seasonal: [
        { plantId: 'forsythia-sugar-baby', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Spring yellow' },
        { plantId: 'hydrangea-summer-crush', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Raspberry pink' },
        { plantId: 'daylily-frans-hals', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Bi-color daylily' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 10, role: 'texture', note: 'SIGNATURE: Named after German nurseryman' },
        { plantId: 'karley-rose', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Pink fountain grass' },
        { plantId: 'coral-bell', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Heuchera variety' }
      ],
      carpet: [
        { plantId: 'ajuga', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Purple bugle' },
        { plantId: 'pachysandra', quantity: 2, role: 'carpet', note: 'German shade carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. MOROCCO PAVILION - Moorish Garden
  // EXCLUSIVE: Date Palm Look-alikes, Citrus-like Plants, Tile Accent Plants
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'morocco-pavilion',
    name: 'Morocco Pavilion',
    subtitle: 'Riad Courtyard Garden',
    description: 'Geometric Moorish gardens with courtyards, fountains, and drought-tolerant Mediterranean plants.',
    theme: 'EPCOT World Showcase',
    preview: '🇲🇦',
    colorScheme: ['#1565C0', '#FFB300', '#FFFFFF', '#43A047'],
    baseSize: '150 sq ft',
    defaultZone: 8,
    filters: { light: 'full-sun', moisture: 'dry', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'deodar-cedar', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Atlas cedar family' },
        { plantId: 'blue-atlas-cedar-horstmann', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Weeping blue' },
        { plantId: 'thunderhead-pine', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Japanese pine' }
      ],
      structure: [
        { plantId: 'rosemary', quantity: 8, role: 'structure', note: 'SIGNATURE: Moroccan herb' },
        { plantId: 'anise', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Licorice shrub' },
        { plantId: 'vitex-shoal-creek', quantity: 3, role: 'structure', note: 'Purple desert shrub' }
      ],
      seasonal: [
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Moroccan color' },
        { plantId: 'daylily-happy-returns', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Yellow rebloomer' },
        { plantId: 'cats-pajamas', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Compact catmint' }
      ],
      texture: [
        { plantId: 'zebra-grass', quantity: 6, role: 'texture', note: 'EXCLUSIVE: Banded grass' },
        { plantId: 'adagio-grass', quantity: 8, role: 'texture', note: 'Compact miscanthus' },
        { plantId: 'lenten-rose', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Shade hellebore' }
      ],
      carpet: [
        { plantId: 'juniper-parsonii', quantity: 3, role: 'carpet', note: 'EXCLUSIVE: Spreading juniper' },
        { plantId: 'rosemary-creeping', quantity: 2, role: 'carpet', note: 'Fragrant carpet' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. CHINA PAVILION - Chinese Garden
  // EXCLUSIVE: Ginkgo, Cryptomeria, Chinese Fringeflower, Peonies
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'china-pavilion',
    name: 'China Pavilion',
    subtitle: 'Temple Garden Serenity',
    description: 'Balanced Chinese garden with ginkgos, bamboo-like plants, and contemplative spaces.',
    theme: 'EPCOT World Showcase',
    preview: '🇨🇳',
    colorScheme: ['#D84315', '#FFD54F', '#1B5E20', '#5D4037'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'standard' },
    plants: {
      hero: [
        { plantId: 'ginkgo', quantity: 1, role: 'hero', note: 'SIGNATURE: Ancient Chinese tree' },
        { plantId: 'cryptomeria-radicans', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Temple tree' },
        { plantId: 'japanese-maple-sango-kaku', quantity: 1, role: 'hero', note: 'Coral bark maple' }
      ],
      structure: [
        { plantId: 'loropetalum-purple-pixie', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Chinese fringeflower' },
        { plantId: 'loropetalum-crimson-fire', quantity: 4, role: 'structure', note: 'Burgundy Chinese' },
        { plantId: 'fatsia', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Bold tropical leaf' },
        { plantId: 'paper-bush', quantity: 2, role: 'structure', note: 'EXCLUSIVE: Winter fragrance' }
      ],
      seasonal: [
        { plantId: 'peony', quantity: 6, role: 'seasonal', note: 'SIGNATURE: Chinese national flower' },
        { plantId: 'camellia-yuletide', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Red winter' },
        { plantId: 'camellia-october-magic', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Fall camellia' }
      ],
      texture: [
        { plantId: 'maiden-grass', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Tall bamboo-like' },
        { plantId: 'adagio-grass', quantity: 6, role: 'texture', note: 'Compact miscanthus' },
        { plantId: 'hosta-guacamole', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Golden hosta' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 3, role: 'carpet', note: 'SIGNATURE: Asian groundcover' },
        { plantId: 'liriope-variegated', quantity: 2, role: 'carpet', note: 'Striped lilyturf' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. NORWAY PAVILION - Nordic Forest
  // EXCLUSIVE: Birches, Spruces, Cold-Hardy Perennials
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'norway-pavilion',
    name: 'Norway Pavilion',
    subtitle: 'Nordic Forest Edge',
    description: 'Scandinavian woodland feel with birches, spruces, and cold-hardy plants.',
    theme: 'EPCOT World Showcase',
    preview: '🇳🇴',
    colorScheme: ['#1565C0', '#FFFFFF', '#1B5E20', '#8D6E63'],
    baseSize: '200 sq ft',
    defaultZone: 6,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'low' },
    plants: {
      hero: [
        { plantId: 'river-birch', quantity: 2, role: 'hero', note: 'SIGNATURE: Nordic birch' },
        { plantId: 'canadian-hemlock', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Nordic conifer' },
        { plantId: 'dwarf-alberta-spruce', quantity: 2, role: 'hero', note: 'EXCLUSIVE: Miniature spruce' }
      ],
      structure: [
        { plantId: 'rhododendron', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Nordic classic' },
        { plantId: 'rhododendron-roseum-elegans', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Pink rhodo' },
        { plantId: 'viburnum-chindo', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Nordic viburnum' }
      ],
      seasonal: [
        { plantId: 'hydrangea-oakleaf', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Native oakleaf' },
        { plantId: 'astilbe-fanal', quantity: 8, role: 'seasonal', note: 'EXCLUSIVE: Red astilbe' },
        { plantId: 'lenten-rose', quantity: 8, role: 'seasonal', note: 'Early spring hellebore' }
      ],
      texture: [
        { plantId: 'fern-christmas', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Evergreen fern' },
        { plantId: 'fern-autumn', quantity: 8, role: 'texture', note: 'Woodland fern' },
        { plantId: 'hosta-blue-angel', quantity: 6, role: 'texture', note: 'EXCLUSIVE: Giant blue hosta' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'SIGNATURE: Nordic shade carpet' },
        { plantId: 'ajuga', quantity: 2, role: 'carpet', note: 'Purple bugle' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. JAPAN PAVILION - Traditional Japanese
  // EXCLUSIVE: Cloud-Pruned Pines, Azaleas, Moss Substitutes
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'japan-pavilion',
    name: 'Japan Pavilion',
    subtitle: 'Traditional Temple Garden',
    description: 'Authentic Japanese garden with cloud-pruned pines, azaleas, and contemplative design.',
    theme: 'EPCOT World Showcase',
    preview: '🇯🇵',
    colorScheme: ['#C62828', '#FFFFFF', '#1B5E20', '#5D4037'],
    baseSize: '200 sq ft',
    defaultZone: 7,
    filters: { light: 'part-shade', moisture: 'average', maintenance: 'showcase' },
    plants: {
      hero: [
        { plantId: 'japanese-maple-dwarf', quantity: 2, role: 'hero', note: 'SIGNATURE: Compact laceleaf' },
        { plantId: 'thunderhead-pine', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Cloud-pruned pine' },
        { plantId: 'hinoki-cypress', quantity: 1, role: 'hero', note: 'SIGNATURE: Temple tree' }
      ],
      structure: [
        { plantId: 'azalea-encore-bonfire', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Red encore' },
        { plantId: 'azalea-encore-embers', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Orange-red' },
        { plantId: 'azalea-encore-chiffon', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Pink chiffon' },
        { plantId: 'cryptomeria-shrub', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Dwarf cryptomeria' }
      ],
      seasonal: [
        { plantId: 'camellia-hot-flash', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Sasanqua variety' },
        { plantId: 'iris', quantity: 10, role: 'seasonal', note: 'SIGNATURE: Japanese iris' },
        { plantId: 'winter-jasmine', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Yellow winter' }
      ],
      texture: [
        { plantId: 'japanese-painted-fern', quantity: 10, role: 'texture', note: 'SIGNATURE: Silver fronds' },
        { plantId: 'holly-fern', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Japanese fern' },
        { plantId: 'carex-everillo', quantity: 8, role: 'texture', note: 'Golden sedge' }
      ],
      carpet: [
        { plantId: 'mondo-grass', quantity: 4, role: 'carpet', note: 'SIGNATURE: Japanese essential' },
        { plantId: 'creeping-mazus', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Stepping stone plant' }
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
        { plantId: 'abelia-kaleidoscope', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Multi-color abelia' }
      ],
      seasonal: [
        { plantId: 'coneflower', quantity: 12, role: 'seasonal', note: 'SIGNATURE: Butterfly favorite' },
        { plantId: 'bee-balm', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Hummingbird magnet' },
        { plantId: 'black-eyed-susan', quantity: 10, role: 'seasonal', note: 'Native pollinator food' },
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Butterfly nectar' }
      ],
      texture: [
        { plantId: 'muhly-grass-pink', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Fall habitat' },
        { plantId: 'northern-sea-oats', quantity: 8, role: 'texture', note: 'Native seed heads' },
        { plantId: 'catmint-walkers', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Bee haven' }
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
        { plantId: 'japanese-maple-bloodgood', quantity: 1, role: 'hero', note: 'FALL: Crimson specimen' }
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
        { plantId: 'azalea-encore-autumn-twist', quantity: 5, role: 'structure', note: 'SPRING+FALL: Reblooming' }
      ],
      seasonal: [
        { plantId: 'lenten-rose', quantity: 8, role: 'seasonal', note: 'LATE WINTER: First color Feb-Apr' },
        { plantId: 'rose-knockout-double-red', quantity: 6, role: 'seasonal', note: 'SUMMER: Continuous May-frost' },
        { plantId: 'coneflower', quantity: 5, role: 'seasonal', note: 'SUMMER: Native pollinator' },
        { plantId: 'black-eyed-susan', quantity: 5, role: 'seasonal', note: 'SUMMER-FALL: Golden daisies' }
      ],
      texture: [
        { plantId: 'muhly-grass-white-cloud', quantity: 15, role: 'texture', note: 'FALL: White cloud masses' },
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
        { plantId: 'pieris-dorothy-wycoff', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Pink pieris' }
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
        { plantId: 'cast-iron-plant', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Indestructible' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 4, role: 'carpet', note: 'SIGNATURE: Shade essential' },
        { plantId: 'ajuga', quantity: 2, role: 'carpet', note: 'Purple accent' }
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
        { plantId: 'dwarf-yaupon-holly', quantity: 5, role: 'structure', note: 'EXCLUSIVE: Native drought holly' }
      ],
      seasonal: [
        { plantId: 'russian-sage', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Silver sage' },
        { plantId: 'lavender-phenomenal', quantity: 8, role: 'seasonal', note: 'Drought lavender' },
        { plantId: 'lantana-ms-huff', quantity: 6, role: 'seasonal', note: 'Drought bloomer' }
      ],
      texture: [
        { plantId: 'blue-fescue', quantity: 15, role: 'texture', note: 'SIGNATURE: Blue tufts' },
        { plantId: 'hamlin-grass', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Fountain grass' },
        { plantId: 'mexican-feather', quantity: 12, role: 'texture', note: 'EXCLUSIVE: Wispy blonde' }
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
        { plantId: 'holly-american', quantity: 1, role: 'hero', note: 'EXCLUSIVE: Native holly' }
      ],
      structure: [
        { plantId: 'holly-nellie-stevens', quantity: 5, role: 'structure', note: 'SIGNATURE: Workhorse holly' },
        { plantId: 'cherry-laurel', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Glossy hedge' },
        { plantId: 'laurel-compact-cherry', quantity: 4, role: 'structure', note: 'Compact version' },
        { plantId: 'cleyera', quantity: 4, role: 'structure', note: 'Evergreen backdrop' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua', quantity: 4, role: 'seasonal', note: 'Fall color' },
        { plantId: 'gardenia-frostproof', quantity: 3, role: 'seasonal', note: 'Summer fragrance' },
        { plantId: 'azalea-encore-majesty', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Purple encore' }
      ],
      texture: [
        { plantId: 'holly-fern', quantity: 8, role: 'texture', note: 'EXCLUSIVE: Evergreen fern' },
        { plantId: 'carex-everillo', quantity: 10, role: 'texture', note: 'Golden sedge' },
        { plantId: 'cast-iron-plant', quantity: 6, role: 'texture', note: 'Indestructible texture' }
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
        { plantId: 'forsythia-sugar-baby', quantity: 3, role: 'structure', note: 'EXCLUSIVE: Spring yellow' }
      ],
      seasonal: [
        { plantId: 'peony', quantity: 6, role: 'seasonal', note: 'SIGNATURE: Cottage classic' },
        { plantId: 'rose-apricot-drift', quantity: 5, role: 'seasonal', note: 'Apricot cottage rose' },
        { plantId: 'rose-peach-drift', quantity: 5, role: 'seasonal', note: 'Peach cottage' },
        { plantId: 'daylily-happy-returns', quantity: 8, role: 'seasonal', note: 'Yellow rebloomer' }
      ],
      texture: [
        { plantId: 'catmint-walkers', quantity: 10, role: 'texture', note: 'SIGNATURE: Blue cottage border' },
        { plantId: 'shasta-daisy-becky', quantity: 8, role: 'texture', note: 'EXCLUSIVE: White daisies' },
        { plantId: 'coral-bell', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Heuchera foliage' }
      ],
      carpet: [
        { plantId: 'creeping-phlox', quantity: 3, role: 'carpet', note: 'SIGNATURE: Spring color carpet' },
        { plantId: 'veronica-georgia-blue', quantity: 2, role: 'carpet', note: 'Blue spring' }
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
        { plantId: 'yew-dukes-garden', quantity: 4, role: 'structure', note: 'EXCLUSIVE: Spreading yew' }
      ],
      seasonal: [
        { plantId: 'hydrangea-little-lime', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Compact lime' },
        { plantId: 'gardenia-kleims-hardy', quantity: 3, role: 'seasonal', note: 'Compact white' }
      ],
      texture: [
        { plantId: 'karl-foerster', quantity: 12, role: 'texture', note: 'SIGNATURE: Vertical grass lines' },
        { plantId: 'blue-fescue', quantity: 15, role: 'texture', note: 'Blue spheres' },
        { plantId: 'carex-everillo', quantity: 10, role: 'texture', note: 'Golden accents' }
      ],
      carpet: [
        { plantId: 'juniper-blue-rug', quantity: 3, role: 'carpet', note: 'SIGNATURE: Blue carpet' },
        { plantId: 'juniper-blue-pacific', quantity: 2, role: 'carpet', note: 'EXCLUSIVE: Pacific juniper' }
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
        { plantId: 'oakleaf-hydrangea', quantity: 4, role: 'structure', note: 'Native hydrangea' },
        { plantId: 'sweetspire-little-henry', quantity: 4, role: 'structure', note: 'Native sweetspire' }
      ],
      seasonal: [
        { plantId: 'lenten-rose', quantity: 8, role: 'seasonal', note: 'SIGNATURE: Early shade bloom' },
        { plantId: 'azalea-encore-carnation', quantity: 5, role: 'seasonal', note: 'Woodland azalea' },
        { plantId: 'bee-balm', quantity: 6, role: 'seasonal', note: 'EXCLUSIVE: Native pollinator' }
      ],
      texture: [
        { plantId: 'fern-autumn', quantity: 12, role: 'texture', note: 'SIGNATURE: Woodland fern' },
        { plantId: 'fern-christmas', quantity: 8, role: 'texture', note: 'Evergreen fern' },
        { plantId: 'northern-sea-oats', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Native oats' }
      ],
      carpet: [
        { plantId: 'pachysandra', quantity: 3, role: 'carpet', note: 'SIGNATURE: Woodland carpet' },
        { plantId: 'creeping-phlox', quantity: 2, role: 'carpet', note: 'Native phlox' }
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
        { plantId: 'wax-myrtle', quantity: 4, role: 'structure', note: 'Fast native screen' }
      ],
      seasonal: [
        { plantId: 'camellia-sasanqua', quantity: 4, role: 'seasonal', note: 'EXCLUSIVE: Screening camellia' },
        { plantId: 'gardenia-august-beauty', quantity: 3, role: 'seasonal', note: 'Tall gardenia' }
      ],
      texture: [
        { plantId: 'holly-fern', quantity: 10, role: 'texture', note: 'EXCLUSIVE: Evergreen fern' },
        { plantId: 'carex-everillo', quantity: 8, role: 'texture', note: 'Golden sedge' }
      ],
      carpet: [
        { plantId: 'asiatic-jasmine', quantity: 4, role: 'carpet', note: 'SIGNATURE: Fast evergreen carpet' },
        { plantId: 'liriope-variegated', quantity: 2, role: 'carpet', note: 'Striped edge' }
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
