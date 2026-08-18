import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ImageUpload from '../components/ImageUpload'
import gehuLogo from '../assets/gehu-logo.jpeg'

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const { signUp, resendVerification } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/profile'

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResendSuccess('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const data = await signUp({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        profilePhoto,
      })

      // If Supabase required email verification (session is null)
      if (!data?.session) {
        setEmailSent(true)
      } else {
        navigate(redirectTo, { replace: true })
      }
    } catch (err) {
      // Check if error mentions confirmation or email
      if (err.message && (err.message.toLowerCase().includes('confirmation') || err.message.toLowerCase().includes('verify'))) {
        setEmailSent(true)
      } else {
        setError(err.message)
      }
    }
    setLoading(false)
  }

  async function handleResend() {
    setError('')
    setResendSuccess('')
    setResending(true)
    try {
      await resendVerification(form.email)
      setResendSuccess('A new verification email has been sent. Please check your inbox.')
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.')
    }
    setResending(false)
  }

  // Email Confirmation Screen
  if (emailSent) {
    return (
      <main className="min-h-screen flex items-center justify-center p-margin-mobile md:p-gutter relative overflow-hidden py-12">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-surface-variant/40 blur-3xl pointer-events-none" />

        <div className="bg-surface-container-lowest w-full max-w-[480px] rounded-2xl p-stack-lg md:p-8 shadow-ambient flex flex-col items-center text-center gap-6 animate-fade-in relative z-10 border border-outline-variant/30">
          {/* Animated Email Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner relative">
            <span className="material-symbols-outlined text-4xl animate-pulse">mark_email_unread</span>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-status-found-bg text-status-found-text rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Verify Your Email
            </h1>
            <p className="font-body text-base text-on-surface-variant">
              We've sent a verification link to:
            </p>
            <div className="inline-block bg-surface-muted text-primary font-semibold font-mono text-sm px-4 py-2 rounded-lg border border-outline-variant/40 break-all">
              {form.email}
            </div>
          </div>

          {resendSuccess && (
            <div className="w-full bg-status-found-bg text-status-found-text px-4 py-3 rounded-lg font-body text-sm text-center">
              {resendSuccess}
            </div>
          )}

          {error && (
            <div className="w-full bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body text-sm text-center">
              {error}
            </div>
          )}

          <div className="w-full bg-surface-container/50 p-4 rounded-xl text-left flex flex-col gap-3 text-sm text-on-surface-variant border border-outline-variant/20">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">mail</span>
              <span>Open your inbox and look for an email from <strong>GEHU Lost & Found</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">touch_app</span>
              <span>Click the <strong>Confirm your mail</strong> link to activate your account.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">folder_open</span>
              <span>Don't see it? Please check your <strong>Spam / Junk</strong> folder.</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 pt-2">
            <Link
              to="/login"
              state={{ from: redirectTo }}
              className="w-full bg-primary text-on-primary font-body text-sm font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-surface-tint hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Login</span>
              <span className="material-symbols-outlined text-[20px]">login</span>
            </Link>

            <Link
              to="/"
              className="w-full bg-surface-muted text-on-surface hover:bg-surface-variant font-body text-sm font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Back to Home</span>
            </Link>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full bg-surface-muted text-on-surface hover:bg-surface-variant font-body text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {resending ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setEmailSent(false); setError(''); setResendSuccess('') }}
              className="text-xs font-body text-on-surface-variant hover:text-primary transition-colors underline mt-1"
            >
              Entered the wrong email? Click here to re-enter
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-margin-mobile md:p-gutter relative overflow-hidden py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-surface-variant/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-error-container/30 blur-3xl pointer-events-none" />

      <div className="bg-surface-container-lowest w-full max-w-[480px] rounded-xl p-stack-lg md:p-8 shadow-ambient flex flex-col gap-stack-lg animate-fade-in relative z-10">
        {/* Back to Home Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-surface-muted -ml-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Home</span>
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
        </div>

        {/* Branding Header */}
        <Link to="/" className="flex flex-col items-center text-center gap-1 mb-2 group">
          <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md shadow-black/10 border border-outline-variant/30 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src={gehuLogo}
              alt="Graphic Era Hill University Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span className="text-xs font-black tracking-widest text-primary uppercase">GEHU LOST & FOUND</span>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">
            Create Account
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Join the campus community to report and recover lost items.
          </p>
        </Link>

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md w-full">
          {/* Profile Photo */}
          <div>
            <label className="font-body text-sm font-semibold text-on-surface-variant mb-2 block">
              Profile Photo (optional)
            </label>
            <ImageUpload onFileSelect={setProfilePhoto} preview={photoPreview} setPreview={setPhotoPreview} />
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-on-surface" htmlFor="name">Full Name</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">person</span>
              <input id="name" type="text" value={form.name} onChange={update('name')} placeholder="Aarav Sharma" required className="input-field pl-10" />
            </div>
          </div>

          {/* College Email */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-on-surface" htmlFor="email">College Email</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">mail</span>
              <input id="email" type="email" value={form.email} onChange={update('email')} placeholder="student@gehu.ac.in" required className="input-field pl-10" />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-on-surface" htmlFor="phone">Phone (optional)</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">phone</span>
              <input id="phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" className="input-field pl-10" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-on-surface" htmlFor="password">Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">lock</span>
              <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="••••••••" required minLength={6} className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-on-surface" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">lock</span>
              <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="••••••••" required className="input-field pl-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary font-body text-sm font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-surface-tint hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-2 border-t border-outline-variant/30 pt-stack-md">
          <p className="font-body text-base text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" state={{ from: redirectTo }} className="font-body text-sm font-semibold text-primary hover:underline ml-1">
              Log In
            </Link>
          </p>
        </div>

        {/* Quick return to Home */}
        <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
          <span>•</span>
          <Link to="/lost" className="hover:text-primary transition-colors">
            Browse Lost Items
          </Link>
          <span>•</span>
          <Link to="/found" className="hover:text-primary transition-colors">
            Found Items
          </Link>
        </div>
      </div>
    </main>
  )
}
