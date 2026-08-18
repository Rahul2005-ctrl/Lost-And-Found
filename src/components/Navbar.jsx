import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/lost', label: 'Lost Items', icon: 'search' },
    { to: '/found', label: 'Found Items', icon: 'volunteer_activism' },
    { to: '/report', label: 'Report Item', icon: 'add_circle' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-surface/95 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto h-16 md:h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-3xl fill">school</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-primary uppercase">GEHU</span>
              <span className="font-heading text-base sm:text-xl md:text-2xl font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                Lost <span className="text-primary font-black">&</span> Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-semibold tracking-wide px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 text-primary font-semibold text-sm hover:bg-surface-container-low px-3 py-2 rounded-xl transition-colors"
              >
                {profile?.profile_photo ? (
                  <img src={profile.profile_photo} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-primary/20" />
                ) : (
                  <span className="material-symbols-outlined text-2xl">account_circle</span>
                )}
                <span className="max-w-[120px] truncate">{profile?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-primary text-on-primary font-body text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:bg-surface-tint hover:shadow-md transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-on-surface p-2 rounded-xl hover:bg-surface-muted transition-colors flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-28px">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-surface border-t border-outline-variant/30 animate-fade-in shadow-xl">
            <div className="flex flex-col p-4 gap-1.5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-base py-3 px-4 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/10 font-bold'
                      : 'text-on-surface-variant hover:bg-surface-muted'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              <hr className="border-outline-variant/30 my-2" />

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-base py-3 px-4 rounded-xl text-primary font-semibold hover:bg-surface-muted flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-[22px]">person</span>
                    <span>My Profile ({profile?.name?.split(' ')[0] || 'Account'})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-body text-base py-3 px-4 rounded-xl text-error font-semibold hover:bg-error-container/20 text-left flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-on-primary font-body text-base font-semibold py-3.5 px-4 rounded-xl text-center shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1"
                >
                  <span>Log In / Sign Up</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar (Fixed for quick 1-thumb reach) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/40 shadow-ambient px-2 py-1.5 flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/') ? 'fill' : ''}`}>home</span>
          <span className="text-[10px] font-body tracking-tight mt-0.5">Home</span>
        </Link>

        <Link
          to="/lost"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/lost') ? 'text-status-lost-text font-bold' : 'text-on-surface-variant hover:text-status-lost-text'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/lost') ? 'fill' : ''}`}>search</span>
          <span className="text-[10px] font-body tracking-tight mt-0.5">Lost</span>
        </Link>

        {/* Highlighted Report Button in the Center */}
        <Link
          to="/report"
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[26px]">add</span>
          </div>
          <span className="text-[10px] font-body font-semibold text-primary mt-1">Report</span>
        </Link>

        <Link
          to="/found"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/found') ? 'text-status-found-text font-bold' : 'text-on-surface-variant hover:text-status-found-text'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/found') ? 'fill' : ''}`}>volunteer_activism</span>
          <span className="text-[10px] font-body tracking-tight mt-0.5">Found</span>
        </Link>

        <Link
          to={user ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/profile') || isActive('/login') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined text-[22px] ${isActive('/profile') ? 'fill' : ''}`}>
            {user ? 'person' : 'account_circle'}
          </span>
          <span className="text-[10px] font-body tracking-tight mt-0.5">{user ? 'Profile' : 'Login'}</span>
        </Link>
      </nav>
    </>
  )
}
