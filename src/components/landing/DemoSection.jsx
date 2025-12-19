import AnimatedDemo from './AnimatedDemo'

export default function DemoSection() {
  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-sage-900 mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Watch how easy it is to design professional landscapes in minutes,
            not hours.
          </p>
        </div>

        {/* Animated Demo */}
        <AnimatedDemo />

        {/* Demo Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-cream-50 rounded-xl border border-sage-100">
            <div className="w-10 h-10 bg-sage-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              1
            </div>
            <h3 className="font-semibold text-sage-900 mb-1">Select Plants</h3>
            <p className="text-sage-600 text-sm">Choose from our curated plant database</p>
          </div>
          <div className="text-center p-6 bg-cream-50 rounded-xl border border-sage-100">
            <div className="w-10 h-10 bg-sage-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              2
            </div>
            <h3 className="font-semibold text-sage-900 mb-1">Design Your Bed</h3>
            <p className="text-sage-600 text-sm">Place plants on the interactive canvas</p>
          </div>
          <div className="text-center p-6 bg-cream-50 rounded-xl border border-sage-100">
            <div className="w-10 h-10 bg-sage-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              3
            </div>
            <h3 className="font-semibold text-sage-900 mb-1">Export Blueprint</h3>
            <p className="text-sage-600 text-sm">Download your professional design</p>
          </div>
        </div>
      </div>
    </section>
  )
}
