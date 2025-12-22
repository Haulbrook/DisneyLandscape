import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Flower2, ArrowLeft, Sparkles, Crown, Eye, ArrowRight } from 'lucide-react'

// Featured design examples (static for demo purposes)
const FEATURED_DESIGNS = [
  {
    id: 1,
    name: 'Augusta Classic Foundation',
    description: 'Southern golf course elegance with dogwoods, azaleas, and liriope borders.',
    style: 'Traditional',
    plants: 24,
    image: '/portfolio/augusta-classic.jpg',
    tags: ['Foundation', 'Southern', 'Classic'],
  },
  {
    id: 2,
    name: 'Tropical Paradise Entry',
    description: 'Bold tropical statement with birds of paradise, hibiscus, and elephant ears.',
    style: 'Tropical',
    plants: 18,
    image: '/portfolio/tropical-paradise.jpg',
    tags: ['Entry', 'Tropical', 'Bold'],
  },
  {
    id: 3,
    name: 'Japanese Zen Garden',
    description: 'Minimalist Japanese-inspired design with maples, bamboo, and moss.',
    style: 'Japanese',
    plants: 15,
    image: '/portfolio/japanese-zen.jpg',
    tags: ['Zen', 'Minimalist', 'Japanese'],
  },
  {
    id: 4,
    name: 'English Cottage Border',
    description: 'Romantic cottage garden with roses, lavender, and perennial layers.',
    style: 'Cottage',
    plants: 32,
    image: '/portfolio/english-cottage.jpg',
    tags: ['Cottage', 'Romantic', 'Perennials'],
  },
  {
    id: 5,
    name: 'Modern Minimalist',
    description: 'Clean lines with ornamental grasses, boxwood, and architectural plants.',
    style: 'Modern',
    plants: 12,
    image: '/portfolio/modern-minimalist.jpg',
    tags: ['Modern', 'Clean', 'Architectural'],
  },
  {
    id: 6,
    name: 'Desert Oasis',
    description: 'Drought-tolerant beauty with agave, yucca, and desert wildflowers.',
    style: 'Desert',
    plants: 20,
    image: '/portfolio/desert-oasis.jpg',
    tags: ['Desert', 'Xeriscape', 'Drought-tolerant'],
  },
]

export default function PortfolioPage() {
  const [selectedDesign, setSelectedDesign] = useState(null)

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sage-600 hover:text-sage-800">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <div className="h-6 w-px bg-sage-200" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sage-500 rounded-lg">
                <Flower2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sage-900">Design Portfolio</span>
            </div>
          </div>

          <Link
            to="/studio"
            className="bg-sage-500 hover:bg-sage-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Try the Studio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-sage-500 to-forest-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Professional Landscape Designs
          </h1>
          <p className="text-lg text-sage-100 max-w-2xl mx-auto mb-8">
            Explore our curated collection of landscape designs created with the Imagine Design Studio.
            Each design showcases professional techniques and plant combinations.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 bg-white text-sage-700 hover:bg-sage-50 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Start Designing
            </Link>
            <a
              href="#designs"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Gallery
            </a>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="designs" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-4">Featured Designs</h2>
            <p className="text-sage-600">
              Click on any design to see details. Each was created using our professional design tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_DESIGNS.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-2xl border border-sage-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedDesign(design)}
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-sage-200 to-forest-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flower2 className="w-16 h-16 text-sage-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-sage-700 px-4 py-2 rounded-lg font-medium">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sage-900">{design.name}</h3>
                    <span className="text-xs text-sage-500 bg-sage-100 px-2 py-1 rounded-full">
                      {design.style}
                    </span>
                  </div>
                  <p className="text-sm text-sage-600 mb-4 line-clamp-2">
                    {design.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-sage-500">{design.plants} plants</span>
                    <div className="flex gap-1">
                      {design.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-sage-500 bg-sage-50 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sage-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Crown className="w-12 h-12 text-olive-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-sage-900 mb-4">
            Ready to Create Your Own?
          </h2>
          <p className="text-lg text-sage-600 mb-8 max-w-2xl mx-auto">
            Join thousands of landscapers and designers using Imagine Design Studio
            to create professional landscape designs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/studio"
              className="inline-flex items-center justify-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Try Free Demo
            </Link>
            <Link
              to="/#pricing"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-sage-200 hover:border-sage-300 text-sage-700 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              View Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Design Detail Modal */}
      {selectedDesign && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-sage-200 to-forest-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Flower2 className="w-24 h-24 text-sage-400" />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-sage-900">{selectedDesign.name}</h2>
                  <span className="text-sage-500">{selectedDesign.style} Style</span>
                </div>
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="text-sage-400 hover:text-sage-600"
                >
                  &times;
                </button>
              </div>

              <p className="text-sage-600 mb-6">{selectedDesign.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedDesign.tags.map((tag) => (
                  <span key={tag} className="text-sm text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sage-200">
                <span className="text-sage-500">{selectedDesign.plants} plants used</span>
                <Link
                  to="/studio"
                  className="bg-sage-500 hover:bg-sage-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Create Similar Design
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-sage-900 text-sage-300 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-1.5 bg-sage-700 rounded-lg">
              <Flower2 className="w-4 h-4 text-sage-300" />
            </div>
            <span className="font-semibold text-white">Imagine Design Landscape Studio</span>
          </div>
          <p className="text-sm">
            Professional landscape design tools for everyone.
          </p>
        </div>
      </footer>
    </div>
  )
}
