import PricingCard from './PricingCard'
import { Sparkles, Leaf, Crown, Gem, Building2 } from 'lucide-react'

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
    ],
    limitations: [
      'No theme bundles',
      'No save/export',
      'No AI Vision rendering',
      'No design analysis',
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
      'Apply bundles (1 swap)',
      '10 AI Vision renders/month',
      '1 export per project',
      'Design score analysis',
    ],
    limitations: [
      'No cloud save',
      'Watermark on exports',
      'No bundle plant preview',
      'No diagnosis/how-to guides',
    ],
    cta: 'Get Basic',
    highlighted: false,
    tier: 'basic',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For active designers',
    icon: Crown,
    features: [
      '15 projects per month',
      'Up to 100 plants per project',
      '5 bundle swaps per project',
      '30 AI Vision renders/month',
      '100 exports per month',
      'Cloud save & sync',
      'Design score analysis',
    ],
    limitations: [
      'Watermark on exports',
      'No bundle plant preview',
      'No diagnosis/how-to guides',
    ],
    cta: 'Get Pro',
    highlighted: false,
    tier: 'pro',
  },
  {
    name: 'Max',
    price: '$149.99',
    period: '/month',
    description: 'For serious designers',
    icon: Gem,
    features: [
      'Unlimited plants & projects',
      'Unlimited bundle swaps',
      'Preview bundle plant lists',
      'Unlimited AI Vision renders',
      'Unlimited exports',
      'Cloud save & sync',
      'No watermark',
      'Full design analysis',
      'Diagnosis & how-to guides',
      'Priority support',
    ],
    limitations: [],
    cta: 'Get Max',
    highlighted: true,
    tier: 'max',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams & companies',
    icon: Building2,
    features: [
      'Everything in Max',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto items-start">
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
