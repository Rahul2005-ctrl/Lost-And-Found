import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import gehuLogo from '../assets/gehu-logo.jpeg'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

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
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-50 w-full transition-all duration-300">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto h-16 md:h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl bg-white p-0.5 shadow-md border border-outline-variant/30 flex items-center justify-center group-hover:scale-105 group-hover:shadow-premium transition-all duration-300 shrink-0 overflow-hidden">
              <img
                src={gehuLogo}
                alt="Graphic Era Hill University Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-primary uppercase opacity-90">GEHU</span>
              <span className="font-heading text-base sm:text-xl md:text-2xl font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">
                Lost <span className="text-primary font-black">&</span> Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 lg:gap-4 items-center bg-surface-muted/50 p-1.5 rounded-2xl border border-outline-variant/20">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-semibold tracking-wide px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive(link.to)
                    ? 'text-primary bg-white shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-3 text-primary font-semibold text-sm hover:bg-surface-container-low px-2 py-1.5 pr-4 rounded-full border border-transparent hover:border-outline-variant/30 transition-all duration-300 group"
              >
                {profile?.profile_photo && profile.profile_photo !== '' ? (
                  <img src={profile.profile_photo} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                )}
                <span className="max-w-[120px] truncate">{profile?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-primary text-on-primary font-body text-sm font-bold px-7 py-2.5 rounded-xl shadow-md hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (iOS style floating dock) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 glass-panel border border-outline-variant/30 shadow-ambient rounded-[2rem] px-2 py-2 flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 ${
            isActive('/') ? 'text-primary bg-primary/10 scale-105' : 'text-on-surface-variant hover:text-primary hover:bg-surface-muted'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/') ? 'fill' : ''}`}>home</span>
          <span className="text-[10px] font-body font-semibold tracking-tight mt-0.5">Home</span>
        </Link>

        <Link
          to="/lost"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 ${
            isActive('/lost') ? 'text-status-lost-text bg-status-lost-bg/50 scale-105' : 'text-on-surface-variant hover:text-status-lost-text'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/lost') ? 'fill' : ''}`}>search</span>
          <span className="text-[10px] font-body font-semibold tracking-tight mt-0.5">Lost</span>
        </Link>

        {/* Highlighted Report Button */}
        <Link
          to="/report"
          className="flex flex-col items-center justify-center -mt-8 relative group"
        >
          <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-premium group-active:scale-95 transition-transform duration-300 relative z-10 border-[3px] border-white">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </div>
          <span className="text-[11px] font-body font-bold text-primary mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5">Report</span>
        </Link>

        <Link
          to="/found"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 ${
            isActive('/found') ? 'text-status-found-text bg-status-found-bg/50 scale-105' : 'text-on-surface-variant hover:text-status-found-text'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/found') ? 'fill' : ''}`}>volunteer_activism</span>
          <span className="text-[10px] font-body font-semibold tracking-tight mt-0.5">Found</span>
        </Link>

        <Link
          to={user ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 ${
            isActive('/profile') || isActive('/login') ? 'text-primary bg-primary/10 scale-105' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/profile') ? 'fill' : ''}`}>
            {user ? 'person' : 'account_circle'}
          </span>
          <span className="text-[10px] font-body font-semibold tracking-tight mt-0.5">{user ? 'Profile' : 'Login'}</span>
        </Link>
      </nav>
    </>
  )
}
