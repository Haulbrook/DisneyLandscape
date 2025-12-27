import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'

export function useDemoMode() {
  const { user, isAdmin } = useAuth()
  const {
    hasFullAccess,
    isMax,
    isPro,
    isBasic,
    isFree,
    planLimits,
    visionRendersRemaining,
    exportsRemaining,
    incrementVisionRenderCount,
    incrementExportCount,
    canUseVisionRender,
    canExport
  } = useSubscription()

  // Track per-project state (resets on new project)
  const [bundleSwapsUsed, setBundleSwapsUsed] = useState(0)
  const [exportsUsed, setExportsUsed] = useState(0)
  const [hasAppliedBundle, setHasAppliedBundle] = useState(false)
  const [showReBundleWarning, setShowReBundleWarning] = useState(false)

  // Mode detection
  const isDemoMode = !hasFullAccess && !isBasic && !isPro // Free/demo users
  const isBasicMode = isBasic
  const isProMode = isPro
  const isMaxMode = isMax || hasFullAccess

  // Get current limits based on plan
  const limits = planLimits || {
    maxPlants: 5,
    maxProjects: 1,
    maxVisionRenders: 0,
    maxExportsPerMonth: 0,
    canUseBundles: false,
    canPreviewBundlePlants: false,
    bundleSwapsPerProject: 0,
    canSaveToCloud: false,
    hasWatermark: true,
    canViewDesignScore: false,
    canViewAnalysisDiagnosis: false,
    canViewAnalysisHowTos: false,
  }

  // Check if user can place another plant
  const canPlacePlant = useCallback((currentPlantCount) => {
    if (hasFullAccess) return true
    return currentPlantCount < limits.maxPlants
  }, [hasFullAccess, limits.maxPlants])

  // Get remaining plant slots
  const getRemainingPlants = useCallback((currentPlantCount) => {
    if (hasFullAccess) return Infinity
    return Math.max(0, limits.maxPlants - currentPlantCount)
  }, [hasFullAccess, limits.maxPlants])

  // Check if user can apply a bundle
  const canApplyBundle = useCallback(() => {
    if (hasFullAccess) return true
    if (!limits.canUseBundles) return false
    // Basic or Pro: Can apply if haven't applied yet, OR if have swaps remaining
    if (isBasic || isPro) {
      if (!hasAppliedBundle) return true
      return bundleSwapsUsed < limits.bundleSwapsPerProject
    }
    return false
  }, [hasFullAccess, limits.canUseBundles, limits.bundleSwapsPerProject, isBasic, isPro, hasAppliedBundle, bundleSwapsUsed])

  // Check if refresh/clear would use a swap (only if >12 plants)
  const wouldRefreshUseSwap = useCallback((plantCount) => {
    if (hasFullAccess) return false
    if (!isBasic && !isPro) return false
    if (!hasAppliedBundle) return false
    return plantCount > 12
  }, [hasFullAccess, isBasic, isPro, hasAppliedBundle])

  // Get remaining bundle swaps
  const getRemainingSwaps = useCallback(() => {
    if (hasFullAccess) return Infinity
    if (!isBasic && !isPro) return 0
    return Math.max(0, limits.bundleSwapsPerProject - bundleSwapsUsed)
  }, [hasFullAccess, isBasic, isPro, limits.bundleSwapsPerProject, bundleSwapsUsed])

  // Mark bundle as applied
  const markBundleApplied = useCallback(() => {
    setHasAppliedBundle(true)
  }, [])

  // Use a bundle swap (when refreshing with >12 plants)
  const useSwap = useCallback(() => {
    setBundleSwapsUsed(prev => prev + 1)
  }, [])

  // Check if user can export (now uses monthly limit from subscription context)
  const checkCanExport = useCallback(() => {
    if (hasFullAccess) return true
    return canExport()
  }, [hasFullAccess, canExport])

  // Use an export (delegates to subscription context for monthly tracking)
  const useExportAction = useCallback(() => {
    incrementExportCount()
  }, [incrementExportCount])

  // Get remaining exports (from subscription context)
  const getRemainingExports = useCallback(() => {
    if (hasFullAccess) return Infinity
    return exportsRemaining
  }, [hasFullAccess, exportsRemaining])

  // Check if user can use vision render
  const canUseVision = useCallback(() => {
    if (hasFullAccess) return true
    return canUseVisionRender()
  }, [hasFullAccess, canUseVisionRender])

  // Analysis permissions
  const canViewDesignScore = limits.canViewDesignScore
  const canViewAnalysisDiagnosis = limits.canViewAnalysisDiagnosis
  const canViewAnalysisHowTos = limits.canViewAnalysisHowTos

  // Reset project state (call when starting new project)
  const resetProjectState = useCallback(() => {
    setBundleSwapsUsed(0)
    setExportsUsed(0)
    setHasAppliedBundle(false)
  }, [])

  // Get message for blocked feature
  const getBlockedFeatureMessage = useCallback((feature) => {
    const messages = {
      plants: isPro
        ? `Plant limit reached (${limits.maxPlants} plants max for Pro). Upgrade to Max for unlimited plants.`
        : isBasic
        ? `Plant limit reached (${limits.maxPlants} plants max for Basic). Upgrade to Pro for more plants.`
        : `Demo limit reached (${limits.maxPlants} plants max). Upgrade for more plants.`,
      bundles: isDemoMode
        ? 'Theme bundles require a subscription. Upgrade to unlock bundles.'
        : isPro
        ? 'You\'ve used all bundle swaps. Upgrade to Max for unlimited swaps.'
        : 'You\'ve used your bundle swap. Upgrade to Pro for more swaps.',
      save: isPro
        ? 'Your cloud saves are syncing.'
        : 'Cloud save requires a Pro subscription. Upgrade to save your designs.',
      export: (isBasic || isPro) && exportsRemaining <= 0
        ? `You've used all exports this month. Upgrade to Max for unlimited exports.`
        : 'Export requires a subscription. Upgrade to export your designs.',
      vision: (isBasic || isPro) && visionRendersRemaining <= 0
        ? 'You\'ve used all AI renders this month. Upgrade to Max for unlimited renders.'
        : 'AI Vision rendering requires a subscription. Upgrade for HD renders.',
      analysis: isBasic
        ? 'Full design analysis requires Pro or higher. Upgrade for design scores.'
        : isPro
        ? 'Detailed diagnosis and how-to guides require Max. Upgrade for full insights.'
        : 'Design analysis requires a subscription. Upgrade for insights.',
      diagnosis: 'Detailed diagnosis requires Max subscription. Upgrade for full analysis.',
      howtos: 'How-to guides require Max subscription. Upgrade for step-by-step fixes.'
    }
    return messages[feature] || 'This feature requires a subscription.'
  }, [isBasic, isPro, isDemoMode, limits, exportsRemaining, visionRendersRemaining])

  // Get upgrade prompt for specific context
  const getUpgradePrompt = useCallback((context) => {
    const prompts = {
      plantLimit: {
        title: 'Plant Limit Reached',
        message: isPro
          ? `You've placed ${limits.maxPlants} plants (Pro limit).`
          : isBasic
          ? `You've placed ${limits.maxPlants} plants (Basic limit).`
          : `You've placed ${limits.maxPlants} plants in demo mode.`,
        cta: isPro ? 'Upgrade to Max for unlimited plants' : isBasic ? 'Upgrade to Pro for more plants' : 'Get Basic for 45 plants or Pro for 100'
      },
      bundles: {
        title: hasAppliedBundle ? 'Bundle Swaps Used' : 'Bundles Locked',
        message: hasAppliedBundle
          ? isPro
            ? `You've used all ${limits.bundleSwapsPerProject} bundle swaps for this project.`
            : 'You\'ve used your re-bundle for this project.'
          : 'Pre-designed theme bundles require a subscription.',
        cta: hasAppliedBundle
          ? (isPro ? 'Upgrade to Max for unlimited swaps' : 'Upgrade to Pro for 5 swaps')
          : 'Upgrade to unlock bundles'
      },
      bundleSwapWarning: {
        title: 'Re-Bundle Warning',
        message: `You have more than 12 plants. Refreshing will use 1 of your ${getRemainingSwaps()} remaining swaps.`,
        cta: 'Continue and use swap'
      },
      save: {
        title: 'Save to Cloud',
        message: 'Save your designs to the cloud and access them anywhere.',
        cta: isBasic ? 'Upgrade to Pro to save designs' : 'Upgrade for cloud save'
      },
      export: {
        title: 'Export Limit Reached',
        message: isPro
          ? `You've used all ${limits.maxExportsPerMonth} exports this month.`
          : isBasic
          ? 'You\'ve used your 1 export for this project.'
          : 'Export your landscape design as PDF or PNG.',
        cta: isPro ? 'Upgrade to Max for unlimited exports' : isBasic ? 'Upgrade to Pro for 100 exports/month' : 'Upgrade to export'
      },
      vision: {
        title: 'AI Vision Limit',
        message: (isBasic || isPro) && visionRendersRemaining <= 0
          ? `You've used all ${isPro ? '30' : '10'} AI renders this month.`
          : 'Generate photorealistic renders of your landscape.',
        cta: (isBasic || isPro) ? 'Upgrade to Max for unlimited renders' : 'Upgrade for AI renders'
      },
      analysis: {
        title: 'Full Analysis Locked',
        message: isPro
          ? 'You can see design scores, but detailed diagnosis requires Max.'
          : 'Get design scores and analysis with a subscription.',
        cta: isPro ? 'Upgrade to Max for full analysis' : 'Upgrade for design analysis'
      },
      diagnosis: {
        title: 'Diagnosis Locked',
        message: 'Detailed problem diagnosis is a Max-only feature.',
        cta: 'Upgrade to Max for diagnosis'
      },
      howtos: {
        title: 'How-To Guides Locked',
        message: 'Step-by-step fix guides are a Max-only feature.',
        cta: 'Upgrade to Max for how-to guides'
      }
    }
    return prompts[context] || {
      title: 'Subscription Required',
      message: 'This feature requires a subscription.',
      cta: 'View Plans'
    }
  }, [isBasic, isPro, limits, hasAppliedBundle, visionRendersRemaining, getRemainingSwaps])

  return {
    // Mode detection
    isDemoMode,
    isBasicMode,
    isProMode,
    isMaxMode,
    hasFullAccess,

    // Limits
    limits,

    // Plant limits
    canPlacePlant,
    getRemainingPlants,
    maxPlants: limits.maxPlants,

    // Bundle limits
    canUseBundles: limits.canUseBundles,
    canPreviewBundlePlants: limits.canPreviewBundlePlants,
    canApplyBundle,
    wouldRefreshUseSwap,
    getRemainingSwaps,
    markBundleApplied,
    useSwap,
    hasAppliedBundle,
    bundleSwapsUsed,
    showReBundleWarning,
    setShowReBundleWarning,

    // Vision limits
    canUseVision,
    visionRendersRemaining: hasFullAccess ? Infinity : visionRendersRemaining,
    incrementVisionRenderCount,

    // Export limits
    canExport: checkCanExport,
    useExport: useExportAction,
    getRemainingExports,
    exportsRemaining: hasFullAccess ? Infinity : exportsRemaining,

    // Save limits
    canSave: limits.canSaveToCloud,

    // Watermark
    hasWatermark: limits.hasWatermark,
    watermarkImages: limits.hasWatermark,

    // Analysis permissions
    canViewDesignScore,
    canViewAnalysisDiagnosis,
    canViewAnalysisHowTos,
    canUseAdvancedAnalysis: hasFullAccess, // Full access = Max tier

    // Helpers
    getBlockedFeatureMessage,
    getUpgradePrompt,
    resetProjectState
  }
}

export default useDemoMode
