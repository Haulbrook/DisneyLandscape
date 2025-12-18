import PricingCard from './PricingCard'
import { Sparkles, Users, Building2 } from 'lucide-react'

const PRICING_TIERS = [
  {
    name: 'Trial',
    price: 'Free',
    period: '',
    description: 'Try before you commit',
    icon: Sparkles,
    features: [
      '1 week free access',
      'OR 5 plans/exports (whichever first)',
      'Full plant database access',
      'Basic bed bundles',
      'Export to JSON',
    ],
    limitations: [
      'Vision rendering watermarked',
      'Limited to 5 exports',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For individual designers',
    icon: Users,
    features: [
      'Unlimited plans & exports',
      'Full plant database',
      'All theme bed bundles',
      'HD Vision rendering',
      'Priority support',
      'Export to PDF & PNG',
      'Custom bed bundles',
    ],
    limitations: [],
    cta: 'Get Pro',
    highlighted: true,
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
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
      'SSO integration',
    ],
    limitations: [],
    cta: 'Contact Sales',
    highlighted: false,
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
            Start with a free trial, upgrade when you're ready.
            No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* FAQ or trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sage-500">
            Questions? <a href="#contact" className="text-sage-700 underline hover:text-sage-900">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  )
}
