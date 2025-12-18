import Hero from '../components/landing/Hero'
import DemoSection from '../components/landing/DemoSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import PricingSection from '../components/landing/PricingSection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Hero />
      <DemoSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  )
}
