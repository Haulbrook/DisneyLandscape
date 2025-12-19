import { Flower2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-sage-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sage-700 rounded-xl">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">Imagine Design Landscape Studio</span>
            </div>
            <p className="text-sage-300 max-w-md leading-relaxed">
              Professional landscape design tool built with theme park quality standards.
              Create beautiful, professional garden beds with ease.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sage-200">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sage-400 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="text-sage-400 hover:text-white transition-colors">Pricing</a>
              </li>
              <li>
                <Link to="/studio" className="text-sage-400 hover:text-white transition-colors">Launch Studio</Link>
              </li>
              <li>
                <a href="#demo" className="text-sage-400 hover:text-white transition-colors">Watch Demo</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sage-200">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sage-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="text-sage-400 hover:text-white transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="text-sage-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sage-400 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-sage-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sage-400 text-sm">
            &copy; {new Date().getFullYear()} Imagine Design Landscape Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
