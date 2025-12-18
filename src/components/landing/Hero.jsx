import { Link } from 'react-router-dom'
import { Flower2, Play, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-50 to-cream-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-forest-200/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sage-500 rounded-xl shadow-lg shadow-sage-500/20">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-sage-900">Disney Landscape Studio</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sage-700 hover:text-sage-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sage-700 hover:text-sage-900 transition-colors">Pricing</a>
          <button className="text-sage-700 hover:text-sage-900 transition-colors">Sign In</button>
          <Link
            to="/studio"
            className="bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-sage-500/20"
          >
            Try Free
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-sage-200 mb-8">
          <Sparkles className="w-4 h-4 text-olive-500" />
          <span className="text-sm font-medium text-sage-700">Professional Landscape Design Tool</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-sage-900 mb-6 leading-tight">
          Create Disney-Quality<br />
          <span className="text-sage-500">Landscape Designs</span>
        </h1>
        <p className="text-xl text-sage-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Professional landscape design tool built with theme park perfection standards.
          Create stunning blueprints, vision renderings, and scalable bed bundles in minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/studio"
            className="inline-flex items-center justify-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-sage-500/25 transition-all hover:shadow-sage-500/40 hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Start Free Trial
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-sage-200 hover:border-sage-300 text-sage-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-sage-900">30+</div>
            <div className="text-sage-600">Curated Plants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sage-900">5</div>
            <div className="text-sage-600">Theme Bundles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sage-900">100%</div>
            <div className="text-sage-600">Disney Standards</div>
          </div>
        </div>
      </div>
    </section>
  )
}
