import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { User, Mail, Crown, CreditCard, Settings, LogOut, Flower2, ArrowLeft, Loader2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import { openCustomerPortal } from '../lib/stripe'

export default function AccountPage() {
  const { user, profile, isAuthenticated, loading: authLoading, signOut, updatePassword } = useAuth()
  const { subscription, isPro, hasFullAccess, getStatusMessage, subscriptionEndDate } = useSubscription()
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [openingPortal, setOpeningPortal] = useState(false)

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/" />
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sage-500" />
      </div>
    )
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setSavingPassword(true)
    try {
      await updatePassword(newPassword)
      setPasswordSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordChange(false)
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      alert('No active subscription to manage')
      return
    }

    setOpeningPortal(true)
    try {
      await openCustomerPortal(user.id)
    } catch (err) {
      console.error('Portal error:', err)
      alert('Failed to open subscription portal')
      setOpeningPortal(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
              <span className="font-semibold text-sage-900">Account Settings</span>
            </div>
          </div>

          <Link
            to="/studio"
            className="bg-sage-500 hover:bg-sage-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Open Studio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl border border-sage-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-sage-100 bg-sage-50">
              <h2 className="font-semibold text-sage-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sage-900">{profile?.full_name || 'User'}</p>
                  <p className="text-sage-500 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  {profile?.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-olive-100 text-olive-700 text-xs font-medium rounded-full">
                      <Crown className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="bg-white rounded-2xl border border-sage-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-sage-100 bg-sage-50">
              <h2 className="font-semibold text-sage-900 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Subscription
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${isPro ? 'text-sage-900' : 'text-sage-600'}`}>
                      {getStatusMessage()}
                    </span>
                    {hasFullAccess && (
                      <span className="px-2 py-0.5 bg-sage-100 text-sage-700 text-xs font-medium rounded-full">
                        Full Access
                      </span>
                    )}
                  </div>
                  {subscriptionEndDate && isPro && (
                    <p className="text-sm text-sage-500 mt-1">
                      {subscription?.cancel_at_period_end
                        ? `Access until ${subscriptionEndDate.toLocaleDateString()}`
                        : `Renews on ${subscriptionEndDate.toLocaleDateString()}`}
                    </p>
                  )}
                  {!isPro && !profile?.role === 'admin' && (
                    <p className="text-sm text-sage-500 mt-1">
                      Upgrade to unlock all features
                    </p>
                  )}
                </div>

                {isPro ? (
                  <button
                    onClick={handleManageSubscription}
                    disabled={openingPortal}
                    className="flex items-center gap-2 px-4 py-2 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {openingPortal ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Manage Subscription
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/#pricing"
                    className="flex items-center gap-2 px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-2xl border border-sage-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-sage-100 bg-sage-50">
              <h2 className="font-semibold text-sage-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Security
              </h2>
            </div>
            <div className="p-6">
              {!showPasswordChange ? (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="text-sage-600 hover:text-sage-800 font-medium"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2 rounded-lg border border-sage-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-4 py-2 rounded-lg border border-sage-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
                      required
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}

                  {passwordSuccess && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Password updated successfully
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {savingPassword ? 'Saving...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordChange(false)
                        setNewPassword('')
                        setConfirmPassword('')
                        setPasswordError('')
                      }}
                      className="px-4 py-2 text-sage-600 hover:text-sage-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Sign Out */}
          <div className="flex justify-end">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
