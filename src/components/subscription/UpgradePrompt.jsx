import { useState } from 'react'
import { X, Crown, Check, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createCheckoutSession, redirectToCheckout } from '../../lib/stripe'
import { AuthModal } from '../auth/AuthModal'

const PRO_FEATURES = [
  'Unlimited plant placement',
  'All theme bundles unlocked',
  'HD AI Vision rendering',
  'Cloud save & sync',
  'Export to PDF & PNG',
  'Advanced design analysis',
  'Priority support'
]

export function UpgradePrompt({ isOpen, onClose, context = 'default' }) {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!isOpen) return null

  // Get context-specific messaging
  const getContextMessage = () => {
    switch (context) {
      case 'plantLimit':
        return {
          title: 'Plant Limit Reached',
          subtitle: "You've placed 5 plants - the demo limit",
          icon: '🌱'
        }
      case 'bundles':
        return {
          title: 'Unlock Theme Bundles',
          subtitle: 'Pre-designed landscape packages await',
          icon: '🎨'
        }
      case 'save':
        return {
          title: 'Save Your Design',
          subtitle: 'Keep your work safe in the cloud',
          icon: '💾'
        }
      case 'export':
        return {
          title: 'Export Your Design',
          subtitle: 'Download as PDF or high-res PNG',
          icon: '📄'
        }
      case 'vision':
        return {
          title: 'AI Vision Rendering',
          subtitle: 'See your landscape come to life',
          icon: '✨'
        }
      default:
        return {
          title: 'Upgrade to Pro',
          subtitle: 'Unlock the full design experience',
          icon: '🚀'
        }
    }
  }

  const { title, subtitle, icon } = getContextMessage()

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { url } = await createCheckoutSession(user.id, user.email)
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-sage-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-sage-600 to-forest-700 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <span className="text-4xl">{icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sage-100 mt-1">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Pro Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-olive-500" />
              <span className="text-2xl font-bold text-sage-900">
                Pro Plan
              </span>
              <span className="text-sage-500">-</span>
              <span className="text-2xl font-bold text-sage-900">
                $49<span className="text-lg font-normal">/month</span>
              </span>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {PRO_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-sage-600" />
                  </div>
                  <span className="text-sage-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sage-600 to-forest-600 hover:from-sage-700 hover:to-forest-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting checkout...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {isAuthenticated ? 'Upgrade Now' : 'Sign Up & Upgrade'}
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-sage-600 hover:text-sage-800 text-sm"
              >
                Continue with demo
              </button>
            </div>

            {/* Trust indicators */}
            <p className="mt-4 text-center text-xs text-sage-500">
              Cancel anytime. Secure payment via Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal (if needed) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </>
  )
}

export default UpgradePrompt
