// ═══════════════════════════════════════════════════════════════════════════════
// DISNEY IMAGINEERING DESIGN SYSTEM
// Show-Ready Standards for Professional Landscape Design
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// HEIGHT TIERS - Disney's 7-Layer System
// ═══════════════════════════════════════════════════════════════════════════════

export const HEIGHT_TIERS = {
  GROUND_PLANE: { id: 1, name: 'Ground Plane', minHeight: 0, maxHeight: 6, label: '0-6"', color: '#8BC34A' },
  ANKLE: { id: 2, name: 'Ankle Height', minHeight: 6, maxHeight: 12, label: '6-12"', color: '#689F38' },
  KNEE: { id: 3, name: 'Knee Height', minHeight: 12, maxHeight: 24, label: '12-24"', color: '#558B2F' },
  WAIST: { id: 4, name: 'Waist Height', minHeight: 24, maxHeight: 36, label: '24-36"', color: '#33691E' },
  CHEST: { id: 5, name: 'Chest Height', minHeight: 36, maxHeight: 48, label: '36-48"', color: '#1B5E20' },
  EYE_LEVEL: { id: 6, name: 'Eye Level', minHeight: 48, maxHeight: 72, label: '48-72"', color: '#004D40' },
  CANOPY: { id: 7, name: 'Canopy', minHeight: 72, maxHeight: 9999, label: '6ft+', color: '#006064' }
};

// Get tier from height in inches
export const getHeightTier = (heightInches) => {
  if (heightInches <= 6) return HEIGHT_TIERS.GROUND_PLANE;
  if (heightInches <= 12) return HEIGHT_TIERS.ANKLE;
  if (heightInches <= 24) return HEIGHT_TIERS.KNEE;
  if (heightInches <= 36) return HEIGHT_TIERS.WAIST;
  if (heightInches <= 48) return HEIGHT_TIERS.CHEST;
  if (heightInches <= 72) return HEIGHT_TIERS.EYE_LEVEL;
  return HEIGHT_TIERS.CANOPY;
};

// Parse height string to inches (takes max value)
export const parseHeightToInches = (heightStr) => {
  if (!heightStr) return 24;
  const str = heightStr.toLowerCase();

  // Handle feet notation
  if (str.includes('ft')) {
    const matches = str.match(/(\d+(?:\.\d+)?)/g);
    if (matches && matches.length > 0) {
      const maxFeet = Math.max(...matches.map(Number));
      return maxFeet * 12;
    }
  }

  // Handle inches notation
  const matches = str.match(/(\d+)/g);
  if (matches && matches.length > 0) {
    return Math.max(...matches.map(Number));
  }

  return 24;
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANT FORMS - Shape classifications
// ═══════════════════════════════════════════════════════════════════════════════

export const PLANT_FORMS = {
  MOUNDING: { id: 'mounding', name: 'Mounding', icon: '🔵', description: 'Rounded, dome-shaped habit' },
  UPRIGHT: { id: 'upright', name: 'Upright', icon: '📍', description: 'Vertical, columnar growth' },
  SPREADING: { id: 'spreading', name: 'Spreading', icon: '↔️', description: 'Horizontal, wide growth' },
  VASE: { id: 'vase', name: 'Vase', icon: '🏆', description: 'Narrow base, flaring top' },
  PYRAMIDAL: { id: 'pyramidal', name: 'Pyramidal', icon: '🔺', description: 'Wide base, pointed top' },
  COLUMNAR: { id: 'columnar', name: 'Columnar', icon: '▯', description: 'Tall, narrow, uniform width' },
  WEEPING: { id: 'weeping', name: 'Weeping', icon: '🌊', description: 'Cascading, drooping branches' },
  PROSTRATE: { id: 'prostrate', name: 'Prostrate', icon: '➖', description: 'Flat, ground-hugging' },
  ARCHING: { id: 'arching', name: 'Arching', icon: '🌈', description: 'Graceful, fountain-like' },
  IRREGULAR: { id: 'irregular', name: 'Irregular', icon: '✴️', description: 'Asymmetric, artistic' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANT TEXTURES - Visual texture classifications
// ═══════════════════════════════════════════════════════════════════════════════

export const PLANT_TEXTURES = {
  FINE: { id: 'fine', name: 'Fine', description: 'Delicate, feathery, small leaves/needles', weight: 1 },
  MEDIUM: { id: 'medium', name: 'Medium', description: 'Standard leaf size, balanced appearance', weight: 2 },
  COARSE: { id: 'coarse', name: 'Coarse', description: 'Large leaves, bold appearance', weight: 3 },
  BOLD: { id: 'bold', name: 'Bold', description: 'Dramatic, architectural, statement piece', weight: 4 }
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM MONTHS - Month-by-month flowering data
// ═══════════════════════════════════════════════════════════════════════════════

export const MONTHS = [
  { id: 1, name: 'January', abbr: 'Jan', season: 'winter' },
  { id: 2, name: 'February', abbr: 'Feb', season: 'winter' },
  { id: 3, name: 'March', abbr: 'Mar', season: 'spring' },
  { id: 4, name: 'April', abbr: 'Apr', season: 'spring' },
  { id: 5, name: 'May', abbr: 'May', season: 'spring' },
  { id: 6, name: 'June', abbr: 'Jun', season: 'summer' },
  { id: 7, name: 'July', abbr: 'Jul', season: 'summer' },
  { id: 8, name: 'August', abbr: 'Aug', season: 'summer' },
  { id: 9, name: 'September', abbr: 'Sep', season: 'fall' },
  { id: 10, name: 'October', abbr: 'Oct', season: 'fall' },
  { id: 11, name: 'November', abbr: 'Nov', season: 'fall' },
  { id: 12, name: 'December', abbr: 'Dec', season: 'winter' }
];

export const SEASONS = {
  SPRING: { id: 'spring', name: 'Spring', months: [3, 4, 5], color: '#81C784' },
  SUMMER: { id: 'summer', name: 'Summer', months: [6, 7, 8], color: '#FFD54F' },
  FALL: { id: 'fall', name: 'Fall', months: [9, 10, 11], color: '#FF8A65' },
  WINTER: { id: 'winter', name: 'Winter', months: [12, 1, 2], color: '#90CAF9' }
};

// Parse bloom time string to month array
export const parseBloomTime = (bloomTimeStr) => {
  if (!bloomTimeStr) return { bloomMonths: [], interestMonths: [], isEvergreen: false };

  const str = bloomTimeStr.toLowerCase();

  // Evergreen - provides year-round structure
  if (str.includes('evergreen')) {
    return {
      bloomMonths: [],
      interestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      isEvergreen: true,
      interestType: 'foliage'
    };
  }

  // Foliage interest only
  if (str === 'foliage') {
    return {
      bloomMonths: [],
      interestMonths: [4, 5, 6, 7, 8, 9, 10],
      isEvergreen: false,
      interestType: 'foliage'
    };
  }

  // Fall color
  if (str.includes('fall color') || str.includes('fall foliage')) {
    return {
      bloomMonths: [],
      interestMonths: [9, 10, 11],
      isEvergreen: false,
      interestType: 'fall-color'
    };
  }

  // Year-round interest
  if (str.includes('year-round')) {
    return {
      bloomMonths: [],
      interestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      isEvergreen: false,
      interestType: 'multi-season'
    };
  }

  // Berries interest
  if (str.includes('berries') && !str.includes('evergreen')) {
    const months = str.includes('fall') ? [9, 10, 11] :
                   str.includes('winter') ? [11, 12, 1, 2] : [9, 10, 11, 12];
    return {
      bloomMonths: [],
      interestMonths: months,
      isEvergreen: false,
      interestType: 'berries'
    };
  }

  // Map month names to numbers
  const monthMap = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9, 'sept': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12
  };

  // Map season names to month ranges
  const seasonMap = {
    'early spring': [3, 4],
    'mid spring': [4, 5],
    'late spring': [5, 6],
    'spring': [3, 4, 5],
    'early summer': [6, 7],
    'mid summer': [7],
    'midsummer': [7],
    'late summer': [8],
    'summer': [6, 7, 8],
    'early fall': [9],
    'mid fall': [10],
    'late fall': [11],
    'fall': [9, 10, 11],
    'autumn': [9, 10, 11],
    'early winter': [12],
    'mid winter': [1],
    'late winter': [2],
    'winter': [12, 1, 2]
  };

  let months = new Set();

  // Check for specific months first
  Object.entries(monthMap).forEach(([name, num]) => {
    if (str.includes(name)) months.add(num);
  });

  // Check for seasons (from most specific to least)
  const sortedSeasons = Object.entries(seasonMap).sort((a, b) => b[0].length - a[0].length);
  sortedSeasons.forEach(([name, nums]) => {
    if (str.includes(name)) nums.forEach(n => months.add(n));
  });

  // Handle range patterns like "June-September"
  const rangeMatch = str.match(/(\w+)\s*[-–]\s*(\w+)/);
  if (rangeMatch && months.size === 0) {
    const startMonth = monthMap[rangeMatch[1].toLowerCase()];
    const endMonth = monthMap[rangeMatch[2].toLowerCase()];
    if (startMonth && endMonth) {
      let current = startMonth;
      while (current !== endMonth) {
        months.add(current);
        current = current === 12 ? 1 : current + 1;
      }
      months.add(endMonth);
    }
  }

  const bloomMonths = Array.from(months).sort((a, b) => a - b);

  return {
    bloomMonths,
    interestMonths: bloomMonths,
    isEvergreen: false,
    interestType: 'bloom'
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// FORM & TEXTURE PAIRING RULES - Disney's Visual Harmony
// ═══════════════════════════════════════════════════════════════════════════════

export const FORM_PAIRING_RULES = {
  // Forms that work well together
  COMPLEMENTARY_PAIRS: [
    ['upright', 'mounding'],      // Vertical meets rounded
    ['upright', 'spreading'],     // Vertical meets horizontal
    ['mounding', 'spreading'],    // Rounded meets flat
    ['arching', 'mounding'],      // Fountain meets dome
    ['pyramidal', 'spreading'],   // Tall point meets ground
    ['weeping', 'upright'],       // Cascading meets vertical
    ['columnar', 'mounding'],     // Tall narrow meets rounded
  ],

  // Avoid too many of the same form
  MAX_SAME_FORM_PERCENT: 0.4, // No more than 40% of plants should be the same form

  // Minimum variety
  MIN_FORM_VARIETY: 3 // Design should have at least 3 different forms
};

export const TEXTURE_PAIRING_RULES = {
  // Texture contrast creates visual interest
  IDEAL_TRANSITIONS: [
    ['fine', 'medium'],    // Gradual transition
    ['medium', 'coarse'],  // Gradual transition
    ['fine', 'coarse'],    // High contrast (use sparingly)
    ['medium', 'bold'],    // Balanced contrast
  ],

  // Avoid monotony
  MAX_SAME_TEXTURE_PERCENT: 0.5, // No more than 50% same texture

  // Fine textures recede, coarse textures advance - use for depth
  DEPTH_RULE: 'Place fine textures in back, coarse/bold in front for perceived depth'
};

// Validate form variety in a design
export const validateFormVariety = (plants) => {
  if (plants.length === 0) return { valid: true, score: 100, issues: [] };

  const formCounts = {};
  plants.forEach(p => {
    const form = p.form || 'mounding';
    formCounts[form] = (formCounts[form] || 0) + 1;
  });

  const issues = [];
  const uniqueForms = Object.keys(formCounts).length;

  // Check minimum variety
  if (uniqueForms < FORM_PAIRING_RULES.MIN_FORM_VARIETY && plants.length >= 5) {
    issues.push(`Only ${uniqueForms} plant forms used. Add variety with different shapes.`);
  }

  // Check for dominance
  Object.entries(formCounts).forEach(([form, count]) => {
    const percent = count / plants.length;
    if (percent > FORM_PAIRING_RULES.MAX_SAME_FORM_PERCENT) {
      issues.push(`${Math.round(percent * 100)}% of plants are ${form}. Mix in contrasting forms.`);
    }
  });

  const score = Math.max(0, 100 - (issues.length * 15));

  return {
    valid: issues.length === 0,
    score,
    issues,
    formCounts,
    uniqueForms
  };
};

// Validate texture variety
export const validateTextureVariety = (plants) => {
  if (plants.length === 0) return { valid: true, score: 100, issues: [] };

  const textureCounts = {};
  plants.forEach(p => {
    const texture = p.texture || 'medium';
    textureCounts[texture] = (textureCounts[texture] || 0) + 1;
  });

  const issues = [];

  // Check for dominance
  Object.entries(textureCounts).forEach(([texture, count]) => {
    const percent = count / plants.length;
    if (percent > TEXTURE_PAIRING_RULES.MAX_SAME_TEXTURE_PERCENT) {
      issues.push(`${Math.round(percent * 100)}% of plants have ${texture} texture. Add contrast.`);
    }
  });

  const score = Math.max(0, 100 - (issues.length * 15));

  return {
    valid: issues.length === 0,
    score,
    issues,
    textureCounts
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// MASS PLANTING RULES - Disney's Drift System
// ═══════════════════════════════════════════════════════════════════════════════

export const MASS_PLANTING_RULES = {
  // Minimum quantities for visual impact
  DRIFT_SIZES: {
    groundcover: { min: 5, ideal: 7, label: 'Carpet in sweeps of 5-7+' },
    perennial: { min: 3, ideal: 5, label: 'Group in drifts of 3-5' },
    shrub: { min: 3, ideal: 5, label: 'Mass in groups of 3-5' },
    grass: { min: 3, ideal: 5, label: 'Cluster in groups of 3-5' },
    tree: { min: 1, ideal: 1, label: 'Use as specimens or groves of 3' }
  },

  // Odd numbers look more natural
  PREFER_ODD_NUMBERS: true,

  // Repetition creates rhythm
  REPETITION_RULE: 'Repeat key plants at least 3 times throughout the design',
  MIN_REPETITION: 3
};

// Analyze mass planting patterns
export const analyzeMassPlanting = (placedPlants, plantDatabase) => {
  const plantCounts = {};
  const issues = [];
  const suggestions = [];

  placedPlants.forEach(placed => {
    const plantData = plantDatabase.find(p => p.id === placed.plantId);
    if (plantData) {
      plantCounts[placed.plantId] = (plantCounts[placed.plantId] || 0) + 1;
    }
  });

  Object.entries(plantCounts).forEach(([plantId, count]) => {
    const plantData = plantDatabase.find(p => p.id === plantId);
    if (!plantData) return;

    const category = plantData.dbCategory || 'perennial';
    const rules = MASS_PLANTING_RULES.DRIFT_SIZES[category] || MASS_PLANTING_RULES.DRIFT_SIZES.perennial;

    if (count < rules.min && category !== 'trees') {
      issues.push({
        plantId,
        plantName: plantData.name,
        count,
        minNeeded: rules.min,
        message: `${plantData.name}: Only ${count} placed. ${rules.label}`
      });
    }

    // Check for even numbers (less natural)
    if (count > 1 && count % 2 === 0 && count < 8 && MASS_PLANTING_RULES.PREFER_ODD_NUMBERS) {
      suggestions.push({
        plantId,
        plantName: plantData.name,
        count,
        message: `${plantData.name}: ${count} is even. Add 1 more for natural grouping.`
      });
    }
  });

  // Check repetition rhythm
  const repeatedPlants = Object.entries(plantCounts).filter(([_, count]) => count >= MASS_PLANTING_RULES.MIN_REPETITION);
  if (repeatedPlants.length === 0 && Object.keys(plantCounts).length > 3) {
    issues.push({
      message: 'No plants repeated 3+ times. Repeat key plants to create visual rhythm.'
    });
  }

  const score = Math.max(0, 100 - (issues.length * 10) - (suggestions.length * 3));

  return {
    valid: issues.length === 0,
    score,
    issues,
    suggestions,
    plantCounts,
    repeatedPlants: repeatedPlants.length
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM SEQUENCE ANALYSIS - 52-Week Color
// ═══════════════════════════════════════════════════════════════════════════════

export const analyzeBloomSequence = (placedPlants, plantDatabase) => {
  const monthlyInterest = {};
  const monthlyBloom = {};

  // Initialize all months
  MONTHS.forEach(m => {
    monthlyInterest[m.id] = [];
    monthlyBloom[m.id] = [];
  });

  // Analyze each placed plant
  placedPlants.forEach(placed => {
    const plantData = plantDatabase.find(p => p.id === placed.plantId);
    if (!plantData) return;

    const bloomData = parseBloomTime(plantData.bloomTime);

    // Track interest months
    bloomData.interestMonths.forEach(month => {
      monthlyInterest[month].push({
        plant: plantData,
        type: bloomData.interestType,
        isEvergreen: bloomData.isEvergreen
      });
    });

    // Track bloom months specifically
    bloomData.bloomMonths.forEach(month => {
      monthlyBloom[month].push({
        plant: plantData,
        color: plantData.color
      });
    });
  });

  // Find gaps
  const bloomGaps = [];
  const interestGaps = [];

  MONTHS.forEach(m => {
    if (monthlyBloom[m.id].length === 0) {
      bloomGaps.push(m);
    }
    if (monthlyInterest[m.id].length === 0) {
      interestGaps.push(m);
    }
  });

  // Calculate seasonal coverage
  const seasonalCoverage = {};
  Object.entries(SEASONS).forEach(([key, season]) => {
    const monthsWithBloom = season.months.filter(m => monthlyBloom[m].length > 0).length;
    const monthsWithInterest = season.months.filter(m => monthlyInterest[m].length > 0).length;
    seasonalCoverage[season.id] = {
      bloomCoverage: monthsWithBloom / season.months.length,
      interestCoverage: monthsWithInterest / season.months.length,
      bloomMonths: monthsWithBloom,
      totalMonths: season.months.length
    };
  });

  // Calculate overall score
  const totalBloomMonths = 12 - bloomGaps.length;
  const totalInterestMonths = 12 - interestGaps.length;
  const bloomScore = (totalBloomMonths / 12) * 100;
  const interestScore = (totalInterestMonths / 12) * 100;

  // Generate recommendations
  const recommendations = [];

  if (bloomGaps.length > 0) {
    const gapSeasons = [...new Set(bloomGaps.map(m => m.season))];
    gapSeasons.forEach(season => {
      recommendations.push(`Add ${season} bloomers to fill color gaps in ${bloomGaps.filter(m => m.season === season).map(m => m.abbr).join(', ')}`);
    });
  }

  return {
    monthlyInterest,
    monthlyBloom,
    bloomGaps,
    interestGaps,
    seasonalCoverage,
    bloomScore,
    interestScore,
    recommendations,
    hasYearRoundInterest: interestGaps.length === 0,
    hasYearRoundBloom: bloomGaps.length === 0
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEIGHT TIER ANALYSIS - Proper Layering
// ═══════════════════════════════════════════════════════════════════════════════

export const analyzeHeightLayering = (placedPlants, plantDatabase, bedDimensions) => {
  const tierCounts = {};
  const issues = [];

  // Initialize tier counts
  Object.values(HEIGHT_TIERS).forEach(tier => {
    tierCounts[tier.id] = { count: 0, plants: [] };
  });

  // Categorize plants by tier
  placedPlants.forEach(placed => {
    const plantData = plantDatabase.find(p => p.id === placed.plantId);
    if (!plantData) return;

    const heightInches = parseHeightToInches(plantData.height);
    const tier = getHeightTier(heightInches);

    tierCounts[tier.id].count++;
    tierCounts[tier.id].plants.push({
      ...placed,
      plantData,
      heightInches,
      tier
    });
  });

  // Analyze tier distribution
  const activeTiers = Object.entries(tierCounts)
    .filter(([_, data]) => data.count > 0)
    .map(([id, _]) => parseInt(id));

  // Check for height gaps
  if (activeTiers.length > 1) {
    const minTier = Math.min(...activeTiers);
    const maxTier = Math.max(...activeTiers);

    for (let t = minTier + 1; t < maxTier; t++) {
      if (!activeTiers.includes(t)) {
        const tierInfo = Object.values(HEIGHT_TIERS).find(tier => tier.id === t);
        issues.push(`Missing ${tierInfo.name} plants (${tierInfo.label}). Add mid-height transitions.`);
      }
    }
  }

  // Check for proper front-to-back graduation
  // (Would need plant positions relative to bed edges for full analysis)

  // Calculate tier diversity score
  const tierDiversity = activeTiers.length;
  const idealTierCount = Math.min(5, Math.ceil(placedPlants.length / 3));
  const diversityScore = Math.min(100, (tierDiversity / idealTierCount) * 100);

  return {
    tierCounts,
    activeTiers,
    tierDiversity,
    diversityScore,
    issues,
    hasGroundLayer: tierCounts[1].count > 0 || tierCounts[2].count > 0,
    hasMiddleLayer: tierCounts[3].count > 0 || tierCounts[4].count > 0,
    hasUpperLayer: tierCounts[5].count > 0 || tierCounts[6].count > 0,
    hasFocalPoints: tierCounts[7].count > 0
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHOW READY SCORE - Comprehensive Disney Quality Check
// ═══════════════════════════════════════════════════════════════════════════════

export const SHOW_READY_CRITERIA = {
  COVERAGE: { weight: 20, label: 'Living Coverage', target: 95, unit: '%' },
  BLOOM_SEQUENCE: { weight: 20, label: 'Year-Round Color', target: 100, unit: '%' },
  HEIGHT_LAYERING: { weight: 15, label: 'Height Variety', target: 100, unit: '%' },
  FORM_VARIETY: { weight: 15, label: 'Form Variety', target: 100, unit: '%' },
  TEXTURE_VARIETY: { weight: 10, label: 'Texture Contrast', target: 100, unit: '%' },
  MASS_PLANTING: { weight: 10, label: 'Mass Planting', target: 100, unit: '%' },
  COLOR_HARMONY: { weight: 10, label: 'Color Harmony', target: 100, unit: '%' }
};

export const calculateShowReadyScore = (analysis) => {
  const {
    coveragePercent = 0,
    bloomSequence = {},
    heightLayering = {},
    formVariety = {},
    textureVariety = {},
    massPlanting = {},
    colorHarmony = { valid: true }
  } = analysis;

  const scores = {
    coverage: Math.min(100, (coveragePercent / SHOW_READY_CRITERIA.COVERAGE.target) * 100),
    bloomSequence: bloomSequence.interestScore || 0,
    heightLayering: heightLayering.diversityScore || 0,
    formVariety: formVariety.score || 0,
    textureVariety: textureVariety.score || 0,
    massPlanting: massPlanting.score || 0,
    colorHarmony: colorHarmony.valid ? 100 : 50
  };

  // Calculate weighted total
  const weightedTotal =
    (scores.coverage * SHOW_READY_CRITERIA.COVERAGE.weight / 100) +
    (scores.bloomSequence * SHOW_READY_CRITERIA.BLOOM_SEQUENCE.weight / 100) +
    (scores.heightLayering * SHOW_READY_CRITERIA.HEIGHT_LAYERING.weight / 100) +
    (scores.formVariety * SHOW_READY_CRITERIA.FORM_VARIETY.weight / 100) +
    (scores.textureVariety * SHOW_READY_CRITERIA.TEXTURE_VARIETY.weight / 100) +
    (scores.massPlanting * SHOW_READY_CRITERIA.MASS_PLANTING.weight / 100) +
    (scores.colorHarmony * SHOW_READY_CRITERIA.COLOR_HARMONY.weight / 100);

  // Determine rating
  let rating, ratingColor;
  if (weightedTotal >= 90) {
    rating = 'Show Ready';
    ratingColor = '#4CAF50';
  } else if (weightedTotal >= 75) {
    rating = 'Near Ready';
    ratingColor = '#8BC34A';
  } else if (weightedTotal >= 60) {
    rating = 'Good Progress';
    ratingColor = '#FFC107';
  } else if (weightedTotal >= 40) {
    rating = 'Needs Work';
    ratingColor = '#FF9800';
  } else {
    rating = 'Early Stage';
    ratingColor = '#F44336';
  }

  return {
    totalScore: Math.round(weightedTotal),
    scores,
    rating,
    ratingColor,
    isShowReady: weightedTotal >= 90
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANT ATTRIBUTE DEFAULTS - Used when adding attributes to existing plants
// ═══════════════════════════════════════════════════════════════════════════════

// Default form based on plant type/category
export const inferPlantForm = (plant) => {
  const name = (plant.name + ' ' + (plant.botanicalName || '')).toLowerCase();
  const category = plant.dbCategory || plant.category;

  // Grasses
  if (category === 'grasses') {
    if (name.includes('fountain') || name.includes('pennisetum')) return 'arching';
    if (name.includes('miscanthus') || name.includes('maiden')) return 'upright';
    if (name.includes('sedge') || name.includes('carex')) return 'mounding';
    if (name.includes('fescue')) return 'mounding';
    return 'arching';
  }

  // Ground covers
  if (category === 'groundcovers' || category === 'groundcover') {
    if (name.includes('juniper') || name.includes('spreading')) return 'spreading';
    if (name.includes('creeping') || name.includes('prostrate')) return 'prostrate';
    return 'spreading';
  }

  // Trees
  if (category === 'trees' || category === 'focal') {
    if (name.includes('weeping')) return 'weeping';
    if (name.includes('columnar') || name.includes('fastigiata')) return 'columnar';
    if (name.includes('oak') || name.includes('maple')) return 'vase';
    if (name.includes('pine') || name.includes('spruce') || name.includes('fir')) return 'pyramidal';
    if (name.includes('crape') || name.includes('crepe')) return 'vase';
    if (name.includes('magnolia')) return 'pyramidal';
    return 'vase';
  }

  // Shrubs
  if (category === 'shrubs' || category === 'back') {
    if (name.includes('boxwood') || name.includes('holly') || name.includes('ilex')) return 'mounding';
    if (name.includes('hydrangea')) return 'mounding';
    if (name.includes('juniper')) return 'spreading';
    if (name.includes('arborvitae') || name.includes('thuja')) return 'columnar';
    if (name.includes('spiraea') || name.includes('spirea')) return 'mounding';
    if (name.includes('forsythia')) return 'arching';
    if (name.includes('rose')) return 'mounding';
    return 'mounding';
  }

  // Perennials
  if (category === 'perennials' || category === 'middle' || category === 'front') {
    if (name.includes('hosta')) return 'mounding';
    if (name.includes('daylily') || name.includes('hemerocallis')) return 'arching';
    if (name.includes('astilbe')) return 'upright';
    if (name.includes('sedum') && !name.includes('tall')) return 'mounding';
    if (name.includes('salvia') || name.includes('sage')) return 'upright';
    if (name.includes('coneflower') || name.includes('echinacea')) return 'upright';
    if (name.includes('rudbeckia') || name.includes('black-eyed')) return 'upright';
    if (name.includes('lavender')) return 'mounding';
    if (name.includes('coral bell') || name.includes('heuchera')) return 'mounding';
    return 'mounding';
  }

  return 'mounding';
};

// Default texture based on plant characteristics
export const inferPlantTexture = (plant) => {
  const name = (plant.name + ' ' + (plant.botanicalName || '') + ' ' + (plant.description || '')).toLowerCase();
  const category = plant.dbCategory || plant.category;

  // Fine texture indicators
  if (name.includes('fine') || name.includes('feather') || name.includes('delicate') ||
      name.includes('fescue') || name.includes('muhly') || name.includes('maiden') ||
      name.includes('nassella') || name.includes('needle')) {
    return 'fine';
  }

  // Bold/Coarse texture indicators
  if (name.includes('bold') || name.includes('large') || name.includes('giant') ||
      name.includes('hosta') || name.includes('elephant') || name.includes('banana') ||
      name.includes('hydrangea') || name.includes('magnolia')) {
    return 'coarse';
  }

  // Category defaults
  if (category === 'grasses') return 'fine';
  if (category === 'groundcovers' && name.includes('moss')) return 'fine';
  if (category === 'trees') return 'coarse';

  return 'medium';
};

export default {
  HEIGHT_TIERS,
  PLANT_FORMS,
  PLANT_TEXTURES,
  MONTHS,
  SEASONS,
  FORM_PAIRING_RULES,
  TEXTURE_PAIRING_RULES,
  MASS_PLANTING_RULES,
  SHOW_READY_CRITERIA,
  getHeightTier,
  parseHeightToInches,
  parseBloomTime,
  validateFormVariety,
  validateTextureVariety,
  analyzeMassPlanting,
  analyzeBloomSequence,
  analyzeHeightLayering,
  calculateShowReadyScore,
  inferPlantForm,
  inferPlantTexture
};
