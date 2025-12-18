import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PricingCard({ tier }) {
  const Icon = tier.icon

  return (
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

      <Link
        to={tier.cta === 'Contact Sales' ? '#contact' : '/studio'}
        className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all ${
          tier.highlighted
            ? 'bg-white text-sage-600 hover:bg-sage-50 shadow-lg'
            : 'bg-sage-500 text-white hover:bg-sage-600'
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  )
}
