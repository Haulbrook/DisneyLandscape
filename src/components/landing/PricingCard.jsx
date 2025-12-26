import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createCheckoutSession } from '../../lib/stripe'
import { AuthModal } from '../auth/AuthModal'

export default function PricingCard({ tier }) {
  const Icon = tier.icon
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handlePaidPlanClick = async (e, plan) => {
    e.preventDefault()

    // If not authenticated, show auth modal
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    // Start checkout
    setLoading(true)
    try {
      const { url } = await createCheckoutSession(user.id, user.email, plan)
      window.location.href = url
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getButtonContent = () => {
    if (tier.tier === 'pro' || tier.tier === 'basic') {
      if (loading) {
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
            Starting checkout...
          </>
        )
      }
      return tier.cta
    }
    return tier.cta
  }

  const renderButton = () => {
    // Demo tier - link to studio
    if (tier.tier === 'demo') {
      return (
        <Link
          to="/studio"
          className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all ${
            tier.highlighted
              ? 'bg-white text-sage-600 hover:bg-sage-50 shadow-lg'
              : 'bg-sage-500 text-white hover:bg-sage-600'
          }`}
        >
          {tier.cta}
        </Link>
      )
    }

    // Basic tier - checkout button
    if (tier.tier === 'basic') {
      return (
        <button
          onClick={(e) => handlePaidPlanClick(e, 'basic')}
          disabled={loading}
          className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            tier.highlighted
              ? 'bg-white text-sage-600 hover:bg-sage-50 shadow-lg'
              : 'bg-sage-500 text-white hover:bg-sage-600'
          }`}
        >
          {getButtonContent()}
        </button>
      )
    }

    // Pro tier - checkout button
    if (tier.tier === 'pro') {
      return (
        <button
          onClick={(e) => handlePaidPlanClick(e, 'pro')}
          disabled={loading}
          className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            tier.highlighted
              ? 'bg-white text-sage-600 hover:bg-sage-50 shadow-lg'
              : 'bg-sage-500 text-white hover:bg-sage-600'
          }`}
        >
          {getButtonContent()}
        </button>
      )
    }

    // Enterprise tier - external link
    if (tier.tier === 'enterprise') {
      return (
        <a
          href={tier.ctaLink || 'mailto:sales@imaginelandscape.design'}
          className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all ${
            tier.highlighted
              ? 'bg-white text-sage-600 hover:bg-sage-50 shadow-lg'
              : 'bg-sage-500 text-white hover:bg-sage-600'
          }`}
        >
          {tier.cta}
        </a>
      )
    }

    // Fallback
    return (
      <Link
        to="/studio"
        className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all ${
          tier.highlighted
            ? 'bg-white text-sage-600 hover:bg-sage-50 shadow-lg'
            : 'bg-sage-500 text-white hover:bg-sage-600'
        }`}
      >
        {tier.cta}
      </Link>
    )
  }

  return (
    <>
      <div className={`rounded-2xl p-8 transition-all ${
        tier.highlighted
          ? 'bg-sage-500 text-white shadow-2xl shadow-sage-500/30 scale-105 relative z-10'
          : 'bg-white border border-sage-200 hover:border-sage-300 hover:shadow-lg'
      }`}>
        {tier.highlighted && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-olive-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            Most Popular
          </div>
        )}

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          tier.highlighted ? 'bg-white/20' : 'bg-sage-100'
        }`}>
          <Icon className={`w-6 h-6 ${tier.highlighted ? 'text-white' : 'text-sage-500'}`} />
        </div>

        <h3 className={`text-xl font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-sage-900'}`}>
          {tier.name}
        </h3>
        <p className={`text-sm mb-6 ${tier.highlighted ? 'text-sage-100' : 'text-sage-500'}`}>
          {tier.description}
        </p>

        <div className="mb-6">
          <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : 'text-sage-900'}`}>
            {tier.price}
          </span>
          <span className={tier.highlighted ? 'text-sage-100' : 'text-sage-500'}>
            {tier.period}
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className={`w-5 h-5 shrink-0 mt-0.5 ${
                tier.highlighted ? 'text-sage-200' : 'text-sage-500'
              }`} />
              <span className={`text-sm ${tier.highlighted ? 'text-sage-100' : 'text-sage-600'}`}>
                {feature}
              </span>
            </li>
          ))}
          {tier.limitations?.map((limitation, i) => (
            <li key={`lim-${i}`} className="flex items-start gap-3 opacity-60">
              <X className={`w-5 h-5 shrink-0 mt-0.5 ${
                tier.highlighted ? 'text-sage-200' : 'text-sage-400'
              }`} />
              <span className={`text-sm ${tier.highlighted ? 'text-sage-200' : 'text-sage-500'}`}>
                {limitation}
              </span>
            </li>
          ))}
        </ul>

        {renderButton()}
      </div>

      {/* Auth Modal for Pro upgrade */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </>
  )
}
