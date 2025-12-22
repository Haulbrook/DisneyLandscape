import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

let stripePromise = null

export const getStripe = () => {
  if (!stripePublishableKey) {
    console.warn('Stripe publishable key not configured. Payment features will be disabled.')
    return null
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }

  return stripePromise
}

// Helper to check if Stripe is configured
export const isStripeConfigured = () => !!stripePublishableKey

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId) => {
  const stripe = await getStripe()
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const { error } = await stripe.redirectToCheckout({ sessionId })
  if (error) {
    throw error
  }
}

// Create checkout session via Netlify function
export const createCheckoutSession = async (userId, email) => {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create checkout session')
  }

  return response.json()
}

// Open customer portal for subscription management
export const openCustomerPortal = async (userId) => {
  const response = await fetch('/.netlify/functions/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to open customer portal')
  }

  const { url } = await response.json()
  window.location.href = url
}
