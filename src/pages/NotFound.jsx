import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-8 sm:p-10 shadow-ambient border border-outline-variant/30 text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl">search_off</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-black tracking-widest text-primary uppercase">Error 404</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Page Not Found
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-sm mx-auto">
            The page you are looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            to="/"
            className="bg-primary text-on-primary font-body text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-surface-tint transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>Return to Home</span>
          </Link>
          <Link
            to="/login"
            className="bg-surface-muted text-on-surface hover:bg-surface-variant font-body text-sm font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Go to Login</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs font-body text-on-surface-variant pt-2 border-t border-outline-variant/20 w-full justify-center">
          <Link to="/lost" className="hover:text-primary transition-colors">Lost Items</Link>
          <span>•</span>
          <Link to="/found" className="hover:text-primary transition-colors">Found Items</Link>
          <span>•</span>
          <Link to="/signup" className="hover:text-primary transition-colors">Create Account</Link>
        </div>
      </div>
    </main>
  )
}
