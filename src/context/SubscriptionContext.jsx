import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext(null)

// Plan limits configuration
const PLAN_LIMITS = {
  free: {
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
  },
  basic: {
    maxPlants: 45,
    maxProjects: 3, // per month
    maxVisionRenders: 10, // per month
    maxExportsPerMonth: 1, // 1 export per project
    canUseBundles: true,
    canPreviewBundlePlants: false, // Can't see plant list before applying
    bundleSwapsPerProject: 1, // 1 re-bundle allowed (but only if >12 plants)
    canSaveToCloud: false,
    hasWatermark: true,
    canViewDesignScore: true,
    canViewAnalysisDiagnosis: false,
    canViewAnalysisHowTos: false,
  },
  pro: {
    maxPlants: 100,
    maxProjects: 15, // per month
    maxVisionRenders: 30, // per month
    maxExportsPerMonth: 100, // per month
    canUseBundles: true,
    canPreviewBundlePlants: false, // Pro can't preview bundle plant lists
    bundleSwapsPerProject: 5,
    canSaveToCloud: true,
    hasWatermark: true, // Pro still has watermark
    canViewDesignScore: true,
    canViewAnalysisDiagnosis: false, // Pro can't see diagnosis
    canViewAnalysisHowTos: false, // Pro can't see how-to's
  },
  max: {
    maxPlants: Infinity,
    maxProjects: Infinity,
    maxVisionRenders: Infinity,
    maxExportsPerMonth: Infinity,
    canUseBundles: true,
    canPreviewBundlePlants: true, // Max can preview bundle plant lists
    bundleSwapsPerProject: Infinity,
    canSaveToCloud: true,
    hasWatermark: false, // No watermark for Max
    canViewDesignScore: true,
    canViewAnalysisDiagnosis: true, // Max gets diagnosis
    canViewAnalysisHowTos: true, // Max gets how-to's
  },
}

export function SubscriptionProvider({ children }) {
  const { user, isAdmin } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch subscription from database
  const fetchSubscription = useCallback(async () => {
    if (!supabase || !user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error)
      }

      // Check if we need to reset monthly counters (for Basic and Pro tiers)
      if (data && (data.plan === 'basic' || data.plan === 'pro')) {
        const resetDate = new Date(data.month_reset_date)
        const now = new Date()
        if (now >= resetDate) {
          // Reset monthly counters
          const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          await supabase
            .from('subscriptions')
            .update({
              projects_this_month: 0,
              vision_renders_this_month: 0,
              exports_this_month: 0,
              month_reset_date: nextReset.toISOString()
            })
            .eq('user_id', user.id)

          data.projects_this_month = 0
          data.vision_renders_this_month = 0
          data.exports_this_month = 0
          data.month_reset_date = nextReset.toISOString()
        }
      }

      setSubscription(data)
    } catch (err) {
      console.error('Error fetching subscription:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch subscription when user changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    fetchSubscription()
  }, [fetchSubscription])

  // Listen for subscription changes (real-time)
  useEffect(() => {
    if (!supabase || !user) return

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            setSubscription(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Derived subscription states
  const currentPlan = subscription?.status === 'active' ? subscription?.plan : 'free'
  const isMax = currentPlan === 'max'
  const isPro = currentPlan === 'pro'
  const isBasic = currentPlan === 'basic'
  const isFree = currentPlan === 'free'
  const isTrialing = subscription?.status === 'trialing'
  const isPastDue = subscription?.status === 'past_due'
  const isCanceled = subscription?.status === 'canceled'
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end

  // Get plan limits (admin gets max limits)
  const planLimits = isAdmin ? PLAN_LIMITS.max : PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free

  // Admin and Max have truly unlimited access
  const hasFullAccess = isAdmin || isMax || isTrialing

  // Format subscription end date
  const subscriptionEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null

  // Usage tracking for Basic and Pro tiers (both have monthly limits now)
  const hasMonthlyLimits = isBasic || isPro
  const projectsThisMonth = subscription?.projects_this_month || 0
  const visionRendersThisMonth = subscription?.vision_renders_this_month || 0
  const exportsThisMonth = subscription?.exports_this_month || 0

  const projectsRemaining = hasMonthlyLimits ? Math.max(0, planLimits.maxProjects - projectsThisMonth) : planLimits.maxProjects
  const visionRendersRemaining = hasMonthlyLimits ? Math.max(0, planLimits.maxVisionRenders - visionRendersThisMonth) : planLimits.maxVisionRenders
  const exportsRemaining = hasMonthlyLimits ? Math.max(0, planLimits.maxExportsPerMonth - exportsThisMonth) : planLimits.maxExportsPerMonth

  // Increment usage counters (for Basic and Pro tiers)
  const incrementProjectCount = useCallback(async () => {
    if (!supabase || !user || !hasMonthlyLimits) return

    await supabase
      .from('subscriptions')
      .update({ projects_this_month: projectsThisMonth + 1 })
      .eq('user_id', user.id)

    fetchSubscription()
  }, [user, hasMonthlyLimits, projectsThisMonth, fetchSubscription])

  const incrementVisionRenderCount = useCallback(async () => {
    if (!supabase || !user || !hasMonthlyLimits) return

    await supabase
      .from('subscriptions')
      .update({ vision_renders_this_month: visionRendersThisMonth + 1 })
      .eq('user_id', user.id)

    fetchSubscription()
  }, [user, hasMonthlyLimits, visionRendersThisMonth, fetchSubscription])

  const incrementExportCount = useCallback(async () => {
    if (!supabase || !user || !hasMonthlyLimits) return

    await supabase
      .from('subscriptions')
      .update({ exports_this_month: exportsThisMonth + 1 })
      .eq('user_id', user.id)

    fetchSubscription()
  }, [user, hasMonthlyLimits, exportsThisMonth, fetchSubscription])

  // Check if user can perform actions
  const canCreateProject = () => {
    if (hasFullAccess) return true
    if (hasMonthlyLimits) return projectsRemaining > 0
    return true // Free users can create 1 project (no save)
  }

  const canUseVisionRender = () => {
    if (hasFullAccess) return true
    if (hasMonthlyLimits) return visionRendersRemaining > 0
    return false // Free users can't use Vision
  }

  const canExport = () => {
    if (hasFullAccess) return true
    if (hasMonthlyLimits) return exportsRemaining > 0
    return false // Free users can't export
  }

  const value = {
    subscription,
    loading,
    currentPlan,
    isMax,
    isPro,
    isBasic,
    isFree,
    isTrialing,
    isPastDue,
    isCanceled,
    cancelAtPeriodEnd,
    hasFullAccess,
    planLimits,
    subscriptionEndDate,
    // Usage tracking
    projectsThisMonth,
    visionRendersThisMonth,
    exportsThisMonth,
    projectsRemaining,
    visionRendersRemaining,
    exportsRemaining,
    // Actions
    incrementProjectCount,
    incrementVisionRenderCount,
    incrementExportCount,
    canCreateProject,
    canUseVisionRender,
    canExport,
    refreshSubscription: fetchSubscription,
    // Helper to get subscription status message
    getStatusMessage: () => {
      if (isAdmin) return 'Admin Access'
      if (isMax) {
        if (cancelAtPeriodEnd) {
          return `Max (cancels ${subscriptionEndDate?.toLocaleDateString()})`
        }
        return `Max (renews ${subscriptionEndDate?.toLocaleDateString()})`
      }
      if (isPro) {
        if (cancelAtPeriodEnd) {
          return `Pro (cancels ${subscriptionEndDate?.toLocaleDateString()})`
        }
        return `Pro (renews ${subscriptionEndDate?.toLocaleDateString()})`
      }
      if (isBasic) {
        if (cancelAtPeriodEnd) {
          return `Basic (cancels ${subscriptionEndDate?.toLocaleDateString()})`
        }
        return `Basic (renews ${subscriptionEndDate?.toLocaleDateString()})`
      }
      if (isTrialing) return 'Trial'
      if (isPastDue) return 'Payment Past Due'
      if (isCanceled) return 'Canceled'
      return 'Free'
    }
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export default SubscriptionContext
