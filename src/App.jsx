import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import LandingPage from './pages/LandingPage'
import StudioPage from './pages/StudioPage'
import AccountPage from './pages/AccountPage'
import PortfolioPage from './pages/PortfolioPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </SubscriptionProvider>
    </AuthProvider>
  )
}
