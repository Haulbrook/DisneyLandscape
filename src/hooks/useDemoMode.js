import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'

export function useDemoMode() {
  const { user, isAdmin } = useAuth()
  const {
    hasFullAccess,
    isPro,
    isBasic,
    isFree,
    planLimits,
    visionRendersRemaining,
    incrementVisionRenderCount,
    canUseVisionRender
  } = useSubscription()

  // Track per-project state (resets on new project)
  const [bundleSwapsUsed, setBundleSwapsUsed] = useState(0)
  const [exportsUsed, setExportsUsed] = useState(0)
  const [hasAppliedBundle, setHasAppliedBundle] = useState(false)
  const [showReBundleWarning, setShowReBundleWarning] = useState(false)

  // Demo mode = free tier (not logged in OR logged in without subscription)
  const isDemoMode = !hasFullAccess && !isBasic
  const isBasicMode = isBasic

  // Get current limits based on plan
  const limits = planLimits || {
    maxPlants: 5,
    maxProjects: 1,
    maxVisionRenders: 0,
    maxExportsPerProject: 0,
    canUseBundles: false,
    canPreviewBundlePlants: false,
    bundleSwapsPerProject: 0,
    canSaveToCloud: false,
    hasWatermark: true,
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
    // Basic: Can apply if haven't applied yet, OR if have swaps remaining
    if (isBasic) {
      if (!hasAppliedBundle) return true
      return bundleSwapsUsed < limits.bundleSwapsPerProject
    }
    return false
  }, [hasFullAccess, limits.canUseBundles, limits.bundleSwapsPerProject, isBasic, hasAppliedBundle, bundleSwapsUsed])

  // Check if refresh/clear would use a swap (only if >12 plants)
  const wouldRefreshUseSwap = useCallback((plantCount) => {
    if (hasFullAccess) return false
    if (!isBasic) return false
    if (!hasAppliedBundle) return false
    return plantCount > 12
  }, [hasFullAccess, isBasic, hasAppliedBundle])

  // Get remaining bundle swaps
  const getRemainingSwaps = useCallback(() => {
    if (hasFullAccess) return Infinity
    if (!isBasic) return 0
    return Math.max(0, limits.bundleSwapsPerProject - bundleSwapsUsed)
  }, [hasFullAccess, isBasic, limits.bundleSwapsPerProject, bundleSwapsUsed])

  // Mark bundle as applied
  const markBundleApplied = useCallback(() => {
    setHasAppliedBundle(true)
  }, [])

  // Use a bundle swap (when refreshing with >12 plants)
  const useSwap = useCallback(() => {
    setBundleSwapsUsed(prev => prev + 1)
  }, [])

  // Check if user can export
  const canExport = useCallback(() => {
    if (hasFullAccess) return true
    if (!limits.maxExportsPerProject) return false
    return exportsUsed < limits.maxExportsPerProject
  }, [hasFullAccess, limits.maxExportsPerProject, exportsUsed])

  // Use an export
  const useExport = useCallback(() => {
    setExportsUsed(prev => prev + 1)
  }, [])

  // Get remaining exports for this project
  const getRemainingExports = useCallback(() => {
    if (hasFullAccess) return Infinity
    return Math.max(0, limits.maxExportsPerProject - exportsUsed)
  }, [hasFullAccess, limits.maxExportsPerProject, exportsUsed])

  // Check if user can use vision render
  const canUseVision = useCallback(() => {
    if (hasFullAccess) return true
    return canUseVisionRender()
  }, [hasFullAccess, canUseVisionRender])

  // Reset project state (call when starting new project)
  const resetProjectState = useCallback(() => {
    setBundleSwapsUsed(0)
    setExportsUsed(0)
    setHasAppliedBundle(false)
  }, [])

  // Get message for blocked feature
  const getBlockedFeatureMessage = useCallback((feature) => {
    const tier = isBasic ? 'Basic' : 'Pro'
    const messages = {
      plants: isBasic
        ? `Plant limit reached (${limits.maxPlants} plants max for Basic). Upgrade to Pro for unlimited plants.`
        : `Demo limit reached (${limits.maxPlants} plants max). Upgrade for more plants.`,
      bundles: isDemoMode
        ? 'Theme bundles require a subscription. Upgrade to unlock bundles.'
        : 'You\'ve used your bundle swap. Upgrade to Pro for unlimited swaps.',
      save: 'Cloud save requires a Pro subscription. Upgrade to save your designs.',
      export: isBasic && exportsUsed >= limits.maxExportsPerProject
        ? 'You\'ve used your export for this project. Upgrade to Pro for unlimited exports.'
        : 'Export requires a subscription. Upgrade to export your designs.',
      vision: isBasic && visionRendersRemaining <= 0
        ? 'You\'ve used all AI renders this month. Upgrade to Pro for unlimited renders.'
        : 'AI Vision rendering requires a subscription. Upgrade for HD renders.',
      analysis: 'Advanced analysis requires a Pro subscription. Upgrade for full insights.'
    }
    return messages[feature] || 'This feature requires a subscription.'
  }, [isBasic, isDemoMode, limits, exportsUsed, visionRendersRemaining])

  // Get upgrade prompt for specific context
  const getUpgradePrompt = useCallback((context) => {
    const prompts = {
      plantLimit: {
        title: 'Plant Limit Reached',
        message: isBasic
          ? `You've placed ${limits.maxPlants} plants (Basic limit).`
          : `You've placed ${limits.maxPlants} plants in demo mode.`,
        cta: isBasic ? 'Upgrade to Pro for unlimited plants' : 'Get Basic for 45 plants or Pro for unlimited'
      },
      bundles: {
        title: hasAppliedBundle ? 'Bundle Swap Used' : 'Bundles Locked',
        message: hasAppliedBundle
          ? 'You\'ve used your re-bundle for this project.'
          : 'Pre-designed theme bundles require a subscription.',
        cta: hasAppliedBundle ? 'Upgrade to Pro for unlimited swaps' : 'Upgrade to unlock bundles'
      },
      bundleSwapWarning: {
        title: 'Re-Bundle Warning',
        message: 'You have more than 12 plants. Refreshing will use your 1 bundle swap.',
        cta: 'Continue and use swap'
      },
      save: {
        title: 'Save to Cloud',
        message: 'Save your designs to the cloud and access them anywhere.',
        cta: 'Upgrade to Pro to save designs'
      },
      export: {
        title: 'Export Limit Reached',
        message: isBasic
          ? 'You\'ve used your 1 export for this project.'
          : 'Export your landscape design as PDF or PNG.',
        cta: isBasic ? 'Upgrade to Pro for unlimited exports' : 'Upgrade to export'
      },
      vision: {
        title: 'AI Vision Limit',
        message: isBasic && visionRendersRemaining <= 0
          ? 'You\'ve used all 10 AI renders this month.'
          : 'Generate photorealistic renders of your landscape.',
        cta: isBasic ? 'Upgrade to Pro for unlimited renders' : 'Upgrade for AI renders'
      }
    }
    return prompts[context] || {
      title: 'Subscription Required',
      message: 'This feature requires a subscription.',
      cta: 'View Plans'
    }
  }, [isBasic, limits, hasAppliedBundle, visionRendersRemaining])

  return {
    // Mode detection
    isDemoMode,
    isBasicMode,
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
    canExport,
    useExport,
    getRemainingExports,
    exportsUsed,

    // Save limits
    canSave: limits.canSaveToCloud,

    // Watermark
    hasWatermark: limits.hasWatermark,
    watermarkImages: limits.hasWatermark,

    // Analysis
    canUseAdvancedAnalysis: hasFullAccess,

    // Helpers
    getBlockedFeatureMessage,
    getUpgradePrompt,
    resetProjectState
  }
}

export default useDemoMode
