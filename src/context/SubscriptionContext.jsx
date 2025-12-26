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
    maxExportsPerProject: 0,
    canUseBundles: false,
    canPreviewBundlePlants: false,
    bundleSwapsPerProject: 0,
    canSaveToCloud: false,
    hasWatermark: true,
  },
  basic: {
    maxPlants: 45,
    maxProjects: 3, // per month
    maxVisionRenders: 10, // per month
    maxExportsPerProject: 1,
    canUseBundles: true,
    canPreviewBundlePlants: false, // Can't see plant list before applying
    bundleSwapsPerProject: 1, // 1 re-bundle allowed (but only if >12 plants)
    canSaveToCloud: false,
    hasWatermark: true,
  },
  pro: {
    maxPlants: Infinity,
    maxProjects: Infinity,
    maxVisionRenders: Infinity,
    maxExportsPerProject: Infinity,
    canUseBundles: true,
    canPreviewBundlePlants: true,
    bundleSwapsPerProject: Infinity,
    canSaveToCloud: true,
    hasWatermark: false,
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

      // Check if we need to reset monthly counters
      if (data && data.plan === 'basic') {
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
              month_reset_date: nextReset.toISOString()
            })
            .eq('user_id', user.id)

          data.projects_this_month = 0
          data.vision_renders_this_month = 0
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
  const isPro = currentPlan === 'pro'
  const isBasic = currentPlan === 'basic'
  const isFree = currentPlan === 'free'
  const isTrialing = subscription?.status === 'trialing'
  const isPastDue = subscription?.status === 'past_due'
  const isCanceled = subscription?.status === 'canceled'
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end

  // Get plan limits (admin gets pro limits)
  const planLimits = isAdmin ? PLAN_LIMITS.pro : PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free

  // Admin always has full access, Pro has full access
  const hasFullAccess = isAdmin || isPro || isTrialing

  // Format subscription end date
  const subscriptionEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null

  // Usage tracking for Basic tier
  const projectsThisMonth = subscription?.projects_this_month || 0
  const visionRendersThisMonth = subscription?.vision_renders_this_month || 0
  const projectsRemaining = isBasic ? Math.max(0, planLimits.maxProjects - projectsThisMonth) : planLimits.maxProjects
  const visionRendersRemaining = isBasic ? Math.max(0, planLimits.maxVisionRenders - visionRendersThisMonth) : planLimits.maxVisionRenders

  // Increment usage counters (for Basic tier)
  const incrementProjectCount = useCallback(async () => {
    if (!supabase || !user || !isBasic) return

    await supabase
      .from('subscriptions')
      .update({ projects_this_month: projectsThisMonth + 1 })
      .eq('user_id', user.id)

    fetchSubscription()
  }, [user, isBasic, projectsThisMonth, fetchSubscription])

  const incrementVisionRenderCount = useCallback(async () => {
    if (!supabase || !user || !isBasic) return

    await supabase
      .from('subscriptions')
      .update({ vision_renders_this_month: visionRendersThisMonth + 1 })
      .eq('user_id', user.id)

    fetchSubscription()
  }, [user, isBasic, visionRendersThisMonth, fetchSubscription])

  // Check if user can perform actions
  const canCreateProject = () => {
    if (hasFullAccess) return true
    if (isBasic) return projectsRemaining > 0
    return true // Free users can create 1 project (no save)
  }

  const canUseVisionRender = () => {
    if (hasFullAccess) return true
    if (isBasic) return visionRendersRemaining > 0
    return false // Free users can't use Vision
  }

  const value = {
    subscription,
    loading,
    currentPlan,
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
    projectsRemaining,
    visionRendersRemaining,
    // Actions
    incrementProjectCount,
    incrementVisionRenderCount,
    canCreateProject,
    canUseVisionRender,
    refreshSubscription: fetchSubscription,
    // Helper to get subscription status message
    getStatusMessage: () => {
      if (isAdmin) return 'Admin Access'
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
