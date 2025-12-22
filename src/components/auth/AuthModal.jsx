import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const { signIn, signUp, resetPassword, error, clearError } = useAuth()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(null)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [formError, setFormError] = useState('')

  if (!isOpen) return null

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setFormError('')
    setSuccess(null)
    clearError()
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setFormError('Please enter a valid email address')
      return false
    }

    if (activeTab !== 'reset') {
      if (!password || password.length < 6) {
        setFormError('Password must be at least 6 characters')
        return false
      }
    }

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        setFormError('Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSuccess(null)
    clearError()

    if (!validateForm()) return

    setLoading(true)

    try {
      if (activeTab === 'login') {
        await signIn(email, password)
        handleClose()
      } else if (activeTab === 'signup') {
        await signUp(email, password, fullName)
        setSuccess('Check your email to verify your account!')
      } else if (activeTab === 'reset') {
        await resetPassword(email)
        setSuccess('Password reset email sent! Check your inbox.')
      }
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-sage-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sage-200 bg-gradient-to-r from-sage-50 to-cream-50">
          <h2 className="text-xl font-semibold text-sage-900">
            {activeTab === 'login' && 'Welcome Back'}
            {activeTab === 'signup' && 'Create Account'}
            {activeTab === 'reset' && 'Reset Password'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-sage-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-sage-600" />
          </button>
        </div>

        {/* Tabs */}
        {activeTab !== 'reset' && (
          <div className="flex border-b border-sage-200">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-sage-700 border-b-2 border-sage-600 bg-sage-50'
                  : 'text-sage-500 hover:text-sage-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'signup'
                  ? 'text-sage-700 border-b-2 border-sage-600 bg-sage-50'
                  : 'text-sage-500 hover:text-sage-700'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {(formError || error) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{formError || error}</span>
            </div>
          )}

          {/* Full Name (Signup only) */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sage-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sage-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          {activeTab !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-sage-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Signup only) */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sage-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {activeTab === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => handleTabChange('reset')}
                className="text-sm text-sage-600 hover:text-sage-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sage-600 hover:bg-sage-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {activeTab === 'login' && 'Signing in...'}
                {activeTab === 'signup' && 'Creating account...'}
                {activeTab === 'reset' && 'Sending email...'}
              </>
            ) : (
              <>
                {activeTab === 'login' && 'Sign In'}
                {activeTab === 'signup' && 'Create Account'}
                {activeTab === 'reset' && 'Send Reset Email'}
              </>
            )}
          </button>

          {/* Back to Login (Reset only) */}
          {activeTab === 'reset' && (
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className="w-full py-2 text-sage-600 hover:text-sage-800 text-sm"
            >
              Back to Sign In
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 pt-0 text-center text-xs text-sage-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}

export default AuthModal
