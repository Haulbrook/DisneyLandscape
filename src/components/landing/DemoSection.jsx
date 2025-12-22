import { Flower2, Package, Wand2, Crown, Download, Sparkles } from 'lucide-react'
import AnimatedDemo from './AnimatedDemo'

const FEATURES = [
  {
    icon: Flower2,
    title: 'Smart Plant Placement',
    description: 'Drag and drop from 30+ curated plants with real-time quality scoring',
    color: 'bg-sage-500',
  },
  {
    icon: Package,
    title: 'Theme Bundles',
    description: 'One-click professional designs: Augusta, Tropical, Cottage & more',
    color: 'bg-olive-500',
  },
  {
    icon: Wand2,
    title: 'AI Vision Rendering',
    description: 'Transform your blueprint into photorealistic garden previews',
    color: 'bg-purple-500',
  },
  {
    icon: Crown,
    title: 'Pro Analysis',
    description: 'Get design scores, color harmony checks, and expert recommendations',
    color: 'bg-amber-500',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'PDF blueprints, high-res images, and detailed plant lists',
    color: 'bg-forest-500',
  },
]

export default function DemoSection() {
  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Interactive Preview
          </div>
          <h2 className="text-4xl font-bold text-sage-900 mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Watch how easy it is to create professional landscape designs.
            Our tools guide you from placement to photorealistic rendering.
          </p>
        </div>

        {/* Animated Demo */}
        <AnimatedDemo />

        {/* Feature Cards */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-cream-50 rounded-xl p-5 border border-sage-100 hover:border-sage-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-10 h-10 ${feature.color} text-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sage-900 mb-1 text-sm">{feature.title}</h3>
              <p className="text-sage-600 text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 py-6 border-y border-sage-100">
          {[
            { value: '30+', label: 'Curated Plants' },
            { value: '5', label: 'Theme Bundles' },
            { value: 'AI', label: 'Vision Rendering' },
            { value: 'PDF', label: 'Export Ready' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-sage-800">{stat.value}</div>
              <div className="text-xs text-sage-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
