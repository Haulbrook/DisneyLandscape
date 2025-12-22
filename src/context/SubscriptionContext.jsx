import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext(null)

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
  const isPro = subscription?.status === 'active' && subscription?.plan === 'pro'
  const isTrialing = subscription?.status === 'trialing'
  const isPastDue = subscription?.status === 'past_due'
  const isCanceled = subscription?.status === 'canceled'
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end

  // Admin always has full access
  const hasFullAccess = isAdmin || isPro || isTrialing

  // Format subscription end date
  const subscriptionEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null

  const value = {
    subscription,
    loading,
    isPro,
    isTrialing,
    isPastDue,
    isCanceled,
    cancelAtPeriodEnd,
    hasFullAccess,
    subscriptionEndDate,
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
