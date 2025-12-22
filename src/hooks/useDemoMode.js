import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'

// Demo mode limitations
const DEMO_LIMITS = {
  maxPlants: 5,
  canSave: false,
  canExport: false,
  canUseBundles: false,
  canUseVision: false,
  canUseAdvancedAnalysis: false,
  watermarkImages: true
}

// Full access (Pro) features
const FULL_ACCESS = {
  maxPlants: Infinity,
  canSave: true,
  canExport: true,
  canUseBundles: true,
  canUseVision: true,
  canUseAdvancedAnalysis: true,
  watermarkImages: false
}

export function useDemoMode() {
  const { user, isAdmin } = useAuth()
  const { hasFullAccess, isPro } = useSubscription()

  // Demo mode = not logged in OR logged in without pro subscription
  // Admin always has full access
  const isDemoMode = !hasFullAccess

  // Get current limits based on access level
  const limits = isDemoMode ? DEMO_LIMITS : FULL_ACCESS

  // Check if user can place another plant
  const canPlacePlant = (currentPlantCount) => {
    if (!isDemoMode) return true
    return currentPlantCount < DEMO_LIMITS.maxPlants
  }

  // Get remaining plant slots in demo mode
  const getRemainingPlants = (currentPlantCount) => {
    if (!isDemoMode) return Infinity
    return Math.max(0, DEMO_LIMITS.maxPlants - currentPlantCount)
  }

  // Get message for blocked feature
  const getBlockedFeatureMessage = (feature) => {
    const messages = {
      plants: `Demo limit reached (${DEMO_LIMITS.maxPlants} plants max). Upgrade to Pro for unlimited plants.`,
      bundles: 'Theme bundles require a Pro subscription. Upgrade to unlock all bundles.',
      save: 'Save to cloud requires a Pro subscription. Upgrade to save your designs.',
      export: 'Export requires a Pro subscription. Upgrade to export your designs.',
      vision: 'AI Vision rendering requires a Pro subscription. Upgrade for HD renders.',
      analysis: 'Advanced analysis requires a Pro subscription. Upgrade for full insights.'
    }
    return messages[feature] || 'This feature requires a Pro subscription.'
  }

  // Get upgrade prompt for specific context
  const getUpgradePrompt = (context) => {
    const prompts = {
      plantLimit: {
        title: 'Plant Limit Reached',
        message: `You've placed ${DEMO_LIMITS.maxPlants} plants in demo mode.`,
        cta: 'Upgrade to Pro for unlimited plants'
      },
      bundles: {
        title: 'Bundles Locked',
        message: 'Pre-designed theme bundles are a Pro feature.',
        cta: 'Upgrade to unlock all bundles'
      },
      save: {
        title: 'Save to Cloud',
        message: 'Save your designs to the cloud and access them anywhere.',
        cta: 'Upgrade to save designs'
      },
      export: {
        title: 'Export Design',
        message: 'Export your landscape design as PDF or PNG.',
        cta: 'Upgrade to export'
      },
      vision: {
        title: 'AI Vision Rendering',
        message: 'Generate photorealistic renders of your landscape.',
        cta: 'Upgrade for HD renders'
      }
    }
    return prompts[context] || {
      title: 'Pro Feature',
      message: 'This feature requires a Pro subscription.',
      cta: 'Upgrade to Pro'
    }
  }

  return {
    isDemoMode,
    limits,
    canPlacePlant,
    getRemainingPlants,
    getBlockedFeatureMessage,
    getUpgradePrompt,
    // Direct access to limits for convenience
    maxPlants: limits.maxPlants,
    canSave: limits.canSave,
    canExport: limits.canExport,
    canUseBundles: limits.canUseBundles,
    canUseVision: limits.canUseVision,
    canUseAdvancedAnalysis: limits.canUseAdvancedAnalysis,
    watermarkImages: limits.watermarkImages
  }
}

export default useDemoMode
