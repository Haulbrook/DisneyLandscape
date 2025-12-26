import PricingCard from './PricingCard'
import { Sparkles, Leaf, Crown, Building2 } from 'lucide-react'

const PRICING_TIERS = [
  {
    name: 'Demo',
    price: 'Free',
    period: '',
    description: 'Try the basics',
    icon: Sparkles,
    features: [
      'Place up to 5 plants',
      'Basic design canvas',
      'View full plant database',
      'Basic design analysis',
    ],
    limitations: [
      'No theme bundles',
      'No save/export',
      'No AI Vision rendering',
    ],
    cta: 'Try Demo',
    ctaLink: '/studio',
    highlighted: false,
    tier: 'demo',
  },
  {
    name: 'Basic',
    price: '$15',
    period: '/month',
    description: 'For hobbyists',
    icon: Leaf,
    features: [
      '3 projects per month',
      'Up to 45 plants per project',
      'Apply 1 bundle per project',
      '1 re-bundle swap allowed',
      '10 AI Vision renders/month',
      '1 export per project',
      'Full plant database',
    ],
    limitations: [
      'No cloud save',
      'Watermark on canvas & exports',
      'No bundle plant preview',
    ],
    cta: 'Get Basic',
    highlighted: false,
    tier: 'basic',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For serious designers',
    icon: Crown,
    features: [
      'Unlimited plants & projects',
      'All theme bed bundles',
      'Unlimited bundle swaps',
      'Unlimited AI Vision renders',
      'Unlimited exports',
      'Cloud save & sync',
      'No watermark',
      'Preview bundle plants',
      'Advanced design analysis',
      'Priority support',
    ],
    limitations: [],
    cta: 'Get Pro',
    highlighted: true,
    tier: 'pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams & companies',
    icon: Building2,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Shared project library',
      'Custom branding on exports',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
      'SSO integration',
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: 'mailto:sales@imaginelandscape.design',
    highlighted: false,
    tier: 'enterprise',
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Start with a free demo, upgrade when you're ready.
            No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex justify-center gap-8 text-sage-500 text-sm">
            <span>Secure payment via Stripe</span>
            <span>Cancel anytime</span>
            <span>30-day money-back guarantee</span>
          </div>
          <p className="text-sage-500">
            Questions? <a href="mailto:support@imaginelandscape.design" className="text-sage-700 underline hover:text-sage-900">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  )
}
