import {
  Palette,
  Layers,
  CheckCircle2,
  Download,
  Sparkles,
  LayoutGrid
} from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Curated Plant Database',
    description: '30+ Disney-approved plants organized by category: focal points, topiary, back row, middle row, front row, and ground cover.'
  },
  {
    icon: Layers,
    title: 'Theme Bed Bundles',
    description: 'Pre-designed plant combinations for Main Street USA, Tropical Paradise, Fantasy Garden, and more. Scalable to any bed size.'
  },
  {
    icon: CheckCircle2,
    title: 'Disney Quality Validation',
    description: 'Real-time checking against Disney standards: 95%+ coverage, height graduation, color harmony, and focal point requirements.'
  },
  {
    icon: LayoutGrid,
    title: 'Interactive Canvas',
    description: 'Drag-and-drop plant placement with grid overlay, rulers, zoom controls, and customizable bed dimensions.'
  },
  {
    icon: Sparkles,
    title: 'Vision Rendering',
    description: 'Preview your design with AI-powered vision rendering to see how your landscape will look when mature.'
  },
  {
    icon: Download,
    title: 'Professional Export',
    description: 'Export complete blueprints with plant schedules, coverage data, and quality scores ready for installation.'
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Professional tools designed for landscape architects who demand
            Disney-level perfection in every design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-sage-100 hover:border-sage-200 transition-colors hover:shadow-lg"
            >
              <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-sage-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-sage-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
