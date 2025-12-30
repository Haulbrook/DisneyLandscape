import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Flower2, ArrowLeft, Sparkles, Crown, Eye, ArrowRight } from 'lucide-react'

// Featured design examples showcasing all theme bundles
const FEATURED_DESIGNS = [
  // Southern & Traditional
  {
    id: 'augusta-classic',
    name: 'Augusta Classic',
    description: 'Southern golf course elegance with magnolias, dogwoods, azaleas, and pristine evergreen structure.',
    style: 'Southern Traditional',
    plants: 56,
    image: '/portfolio/augusta-classic.png',
    tags: ['Southern', 'Golf Course', 'Azaleas'],
  },
  {
    id: 'main-street-classic',
    name: 'Main Street Classic',
    description: 'Tight lines, bright seasonal beds, and maximum curb appeal. Quintessential American front yard.',
    style: 'Classic Americana',
    plants: 58,
    image: '/portfolio/main-street-classic.png',
    tags: ['Americana', 'Curb Appeal', 'Roses'],
  },
  // Asian Inspired
  {
    id: 'japanese-zen',
    name: 'Japanese Zen Garden',
    description: 'Restrained blooms, layered evergreens, and the art of negative space. Japanese maples as living sculptures.',
    style: 'Zen Asian',
    plants: 47,
    image: '/portfolio/japanese-zen.png',
    tags: ['Zen', 'Japanese', 'Maples'],
  },
  {
    id: 'japan-pavilion',
    name: 'Japan Pavilion',
    description: 'True Japanese garden with cloud-pruned pines, maples, azaleas, and contemplative design.',
    style: 'EPCOT World Showcase',
    plants: 53,
    image: '/portfolio/japan-pavilion.png',
    tags: ['EPCOT', 'Temple', 'Authentic'],
  },
  {
    id: 'china-pavilion',
    name: 'China Pavilion',
    description: 'True Chinese garden with ginkgos, dawn redwoods, peonies - plants native to China.',
    style: 'EPCOT World Showcase',
    plants: 54,
    image: '/portfolio/china-pavilion.png',
    tags: ['EPCOT', 'Temple', 'Peonies'],
  },
  // European Gardens
  {
    id: 'england-pavilion',
    name: 'England Pavilion',
    description: 'True English garden with native oaks, hawthorns, yew hedges, and romantic cottage perennials.',
    style: 'EPCOT World Showcase',
    plants: 61,
    image: '/portfolio/england-pavilion.png',
    tags: ['EPCOT', 'Cottage', 'Roses'],
  },
  {
    id: 'france-pavilion',
    name: 'France Pavilion',
    description: 'True French garden with formal boxwood parterres, Provence lavender fields, and romantic roses.',
    style: 'EPCOT World Showcase',
    plants: 72,
    image: '/portfolio/france-pavilion.png',
    tags: ['EPCOT', 'Versailles', 'Lavender'],
  },
  {
    id: 'italy-pavilion',
    name: 'Italy Pavilion',
    description: 'True Italian garden with iconic cypress columns, stone pines, bay laurel, and Mediterranean herbs.',
    style: 'EPCOT World Showcase',
    plants: 49,
    image: '/portfolio/italy-pavilion.png',
    tags: ['EPCOT', 'Tuscan', 'Mediterranean'],
  },
  {
    id: 'germany-pavilion',
    name: 'Germany Pavilion',
    description: 'True German garden with European beech, lindens, and the famous Karl Foerster grass.',
    style: 'EPCOT World Showcase',
    plants: 55,
    image: '/portfolio/germany-pavilion.png',
    tags: ['EPCOT', 'Bavarian', 'Grasses'],
  },
  {
    id: 'norway-pavilion',
    name: 'Norway Pavilion',
    description: 'True Scandinavian woodland with Norway spruce, mountain ash, heather, and lingonberries.',
    style: 'EPCOT World Showcase',
    plants: 54,
    image: '/portfolio/norway-pavilion.png',
    tags: ['EPCOT', 'Nordic', 'Woodland'],
  },
  // Mediterranean & Desert
  {
    id: 'morocco-pavilion',
    name: 'Morocco Pavilion',
    description: 'True Moorish garden with Atlas cedars, pomegranates, oleanders - plants of the Maghreb.',
    style: 'EPCOT World Showcase',
    plants: 47,
    image: '/portfolio/morocco-pavilion.png',
    tags: ['EPCOT', 'Riad', 'Mediterranean'],
  },
  {
    id: 'mexico-pavilion',
    name: 'Mexico Pavilion',
    description: 'True Mexican garden with native agaves, desert blooms, and plants that thrive in arid climates.',
    style: 'EPCOT World Showcase',
    plants: 56,
    image: '/portfolio/mexico-pavilion.png',
    tags: ['EPCOT', 'Hacienda', 'Desert'],
  },
  {
    id: 'drought-smart',
    name: 'Drought Smart',
    description: 'Beautiful without the water bill. Drought-tolerant plants that thrive on neglect.',
    style: 'Xeriscape',
    plants: 48,
    image: '/portfolio/drought-smart.png',
    tags: ['Xeriscape', 'Low Water', 'Succulents'],
  },
  // Native & Ecological
  {
    id: 'modern-prairie',
    name: 'Modern Prairie',
    description: 'Coneflowers, black-eyed susans, and ornamental grasses. Native prairie meets modern design.',
    style: 'Native Prairie',
    plants: 62,
    image: '/portfolio/modern-prairie.png',
    tags: ['Native', 'Prairie', 'Grasses'],
  },
  {
    id: 'pollinator-paradise',
    name: 'Pollinator Paradise',
    description: 'Nectar-rich plants for butterflies, bees, and hummingbirds. A living ecosystem.',
    style: 'Wildlife Garden',
    plants: 55,
    image: '/portfolio/pollinator-paradise.png',
    tags: ['Pollinators', 'Butterflies', 'Native'],
  },
  {
    id: 'rain-garden',
    name: 'Rain Garden',
    description: 'For wet areas, drainage swales, or rain gardens. Plants that thrive with wet feet.',
    style: 'Water Feature',
    plants: 48,
    image: '/portfolio/rain-garden.png',
    tags: ['Rain Garden', 'Wet Soil', 'Native'],
  },
  {
    id: 'woodland-edge',
    name: 'Woodland Edge',
    description: 'Where lawn meets forest - native plants that create a natural woodland edge.',
    style: 'Native Woodland',
    plants: 52,
    image: '/portfolio/woodland-edge.png',
    tags: ['Woodland', 'Native', 'Shade'],
  },
  // Tropical & Coastal
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    description: 'Bold tropical foliage for that resort vacation feel right at home.',
    style: 'Tropical',
    plants: 42,
    image: '/portfolio/tropical-paradise.png',
    tags: ['Tropical', 'Bold', 'Resort'],
  },
  {
    id: 'lowcountry-coastal',
    name: 'Lowcountry Coastal',
    description: 'Inspired by Georgia/Carolina coast - wax myrtle, muhly grass, and salt-tolerant beauties.',
    style: 'Coastal Southern',
    plants: 48,
    image: '/portfolio/lowcountry-coastal.png',
    tags: ['Coastal', 'Southern', 'Salt-tolerant'],
  },
  // Specialty Gardens
  {
    id: 'shade-sanctuary',
    name: 'Shade Sanctuary',
    description: 'For those challenging shady spots - hostas, ferns, and shade-loving beauties.',
    style: 'Shade Garden',
    plants: 52,
    image: '/portfolio/shade-sanctuary.png',
    tags: ['Shade', 'Hostas', 'Ferns'],
  },
  {
    id: 'cottage-charm',
    name: 'Cottage Charm',
    description: 'Overflowing cottage garden with romantic perennials and old-fashioned charm.',
    style: 'Cottage',
    plants: 56,
    image: '/portfolio/cottage-charm.png',
    tags: ['Cottage', 'Romantic', 'Peonies'],
  },
  {
    id: 'four-seasons',
    name: 'Four Season Color',
    description: 'Carefully sequenced for year-round color. Winter camellia, spring azalea, summer hydrangea, fall grasses.',
    style: 'Continuous Bloom',
    plants: 78,
    image: '/portfolio/four-seasons.png',
    tags: ['Year-round', 'Seasonal', 'Color'],
  },
  // Functional & Modern
  {
    id: 'evergreen-foundation',
    name: 'Evergreen Foundation',
    description: 'Classic evergreen foundation planting. Clean, professional, always green.',
    style: 'Foundation',
    plants: 44,
    image: '/portfolio/evergreen-foundation.png',
    tags: ['Foundation', 'Evergreen', 'Classic'],
  },
  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    description: 'Architectural plants, ornamental grasses, and a restrained color palette.',
    style: 'Modern',
    plants: 38,
    image: '/portfolio/minimalist-modern.png',
    tags: ['Modern', 'Minimalist', 'Grasses'],
  },
  {
    id: 'privacy-screen',
    name: 'Privacy Screen',
    description: 'For when you need privacy ASAP. Fast-growing, dense evergreen screens.',
    style: 'Functional',
    plants: 36,
    image: '/portfolio/privacy-screen.png',
    tags: ['Privacy', 'Screen', 'Fast-growing'],
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
                {/* Design Image */}
                <div className="aspect-video bg-gradient-to-br from-sage-200 to-forest-200 relative overflow-hidden">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 items-center justify-center hidden">
                    <Flower2 className="w-16 h-16 text-sage-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-sage-700 px-4 py-2 rounded-lg font-medium shadow-lg">
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
            <div className="aspect-video bg-gradient-to-br from-sage-200 to-forest-200 relative overflow-hidden">
              <img
                src={selectedDesign.image}
                alt={selectedDesign.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 items-center justify-center hidden">
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
