import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [resendVerificationSent, setResendVerificationSent] = useState(false)
  const [resendingVerification, setResendingVerification] = useState(false)
  const { user, signIn, resetPassword, resendVerification } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  useEffect(() => {
    // Check if coming from email confirmation or auth hash
    const hash = window.location.hash || ''
    if (hash.includes('type=signup') || hash.includes('type=email_confirmation') || hash.includes('access_token')) {
      setSuccessMessage('Email verified successfully! You can now log in.')
    } else if (hash.includes('type=recovery')) {
      setSuccessMessage('Password recovery link verified. Please log in with your updated credentials.')
    }
  }, [])

  const isEmailNotConfirmed = error && error.toLowerCase().includes('email not confirmed')

  async function handleResendVerification() {
    if (!email) {
      setError('Please enter your college email first.')
      return
    }
    setResendingVerification(true)
    setError('')
    try {
      await resendVerification(email)
      setResendVerificationSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send verification email.')
    }
    setResendingVerification(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setResendVerificationSent(false)
    setLoading(true)
    try {
      if (resetMode) {
        await resetPassword(email)
        setResetSent(true)
      } else {
        await signIn({ email, password })
        navigate(redirectTo, { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-margin-mobile md:p-gutter relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-surface-variant/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-error-container/30 blur-3xl pointer-events-none" />

      <div className="bg-surface-container-lowest w-full max-w-[420px] rounded-xl p-stack-lg md:p-8 shadow-ambient flex flex-col gap-stack-lg animate-fade-in relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center gap-1 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-2">
            <span className="material-symbols-outlined text-3xl fill">school</span>
          </div>
          <span className="text-xs font-black tracking-widest text-primary uppercase">GEHU CAMPUS</span>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-on-surface tracking-tight uppercase">
            Lost <span className="text-primary font-black">&</span> Found
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            {resetMode ? 'Enter your college email to reset your password.' : 'Welcome back! Please log in to continue.'}
          </p>
        </div>

        {successMessage && (
          <div className="bg-status-found-bg text-status-found-text px-4 py-3 rounded-lg font-body text-sm text-center">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body text-sm flex flex-col gap-2">
            <div>{error}</div>
            {isEmailNotConfirmed && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="text-xs font-semibold text-primary underline text-left hover:opacity-80"
              >
                {resendingVerification ? 'Sending...' : 'Click here to resend verification email'}
              </button>
            )}
          </div>
        )}

        {resendVerificationSent && (
          <div className="bg-status-found-bg text-status-found-text px-4 py-3 rounded-lg font-body text-sm text-center">
            Verification email resent! Please check your inbox and confirm your email.
          </div>
        )}

        {resetSent ? (
          <div className="bg-status-found-bg text-status-found-text px-4 py-3 rounded-lg font-body text-sm text-center">
            Password reset email sent! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md w-full">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-sm font-semibold text-on-surface" htmlFor="email">
                College Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gehu.ac.in"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            {!resetMode && (
              <>
                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-on-surface" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">
                      lock
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end w-full">
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="font-body text-sm font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-body text-sm font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-surface-tint hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{resetMode ? 'Send Reset Link' : 'Log In'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>

            {resetMode && (
              <button
                type="button"
                onClick={() => { setResetMode(false); setResetSent(false); setError('') }}
                className="font-body text-sm text-on-surface-variant hover:text-primary text-center"
              >
                Back to Login
              </button>
            )}
          </form>
        )}

        {/* Sign Up Link */}
        {!resetMode && (
          <div className="text-center mt-2 border-t border-outline-variant/30 pt-stack-md">
            <p className="font-body text-base text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/signup" state={{ from: redirectTo }} className="font-body text-sm font-semibold text-primary hover:underline ml-1">
                Create Account
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
