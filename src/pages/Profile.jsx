import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile, signOut, loading: authLoading, fetchProfile } = useAuth()
  const navigate = useNavigate()
  const [lostCount, setLostCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [loadingCounts, setLoadingCounts] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/profile' } })
    }
    if (user) {
      fetchProfile(user.id)
      fetchCounts()
    }
  }, [user, authLoading])

  async function fetchCounts() {
    setLoadingCounts(true)
    try {
      const { count: lost } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'lost')
      const { count: found } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'found')
      setLostCount(lost || 0)
      setFoundCount(found || 0)
    } catch (err) {
      console.warn('Error fetching counts:', err)
    } finally {
      setLoadingCounts(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!user) return null

  const displayProfile = profile || {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
    email: user.email,
    phone: user.user_metadata?.phone || null,
    profile_photo: null,
    preferred_contact: 'email',
  }

  return (
    <main className="flex-grow pt-6 sm:pt-8 pb-24 md:pb-16 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto w-full flex flex-col gap-6 sm:gap-8">
      {/* Profile Header Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Main Profile Card */}
        <div className="col-span-1 md:col-span-8 bg-surface-container-lowest shadow-level-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border border-outline-variant/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          {/* Photo */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-surface-muted border-4 border-surface shadow-md overflow-hidden flex items-center justify-center">
              {displayProfile.profile_photo && displayProfile.profile_photo !== '' ? (
                <img src={displayProfile.profile_photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl sm:text-5xl">person</span>
                </div>
              )}
            </div>
          </div>
          {/* Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10 min-w-0 w-full">
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-on-surface mb-2 truncate max-w-full">
              {displayProfile.name}
            </h1>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm mb-1.5 truncate max-w-full">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">mail</span>
              <span className="font-body truncate">{displayProfile.email}</span>
            </div>
            {displayProfile.phone && (
              <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0">phone_iphone</span>
                <span className="font-body">{displayProfile.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Preference Card */}
        <div className="col-span-1 md:col-span-4 bg-surface-container-lowest shadow-level-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-center border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px] fill">connect_without_contact</span>
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-on-surface">Contact Method</h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-4">
            How students will reach you for matching items.
          </p>
          <div className="bg-surface-muted rounded-xl p-3.5 flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                {displayProfile.preferred_contact === 'phone' ? 'phone' : displayProfile.preferred_contact === 'whatsapp' ? 'chat' : 'mail'}
              </span>
              <span className="font-body text-xs sm:text-sm font-bold text-on-surface capitalize">{displayProfile.preferred_contact || 'Email'}</span>
            </div>
            <span className="material-symbols-outlined text-status-found-text fill text-[20px]">check_circle</span>
          </div>
        </div>
      </section>

      {/* Activity Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* My Lost Items */}
        <Link
          to="/profile/my-items?type=lost"
          className="group block bg-surface-container-lowest shadow-level-1 rounded-2xl p-5 sm:p-6 border border-outline-variant/30 hover:border-primary/30 transition-all hover:shadow-lg relative overflow-hidden active:scale-[0.99]"
        >
          <div className="absolute right-0 top-0 w-28 h-28 bg-status-lost-bg rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-status-lost-bg flex items-center justify-center text-status-lost-text">
              <span className="material-symbols-outlined text-[22px]">travel_explore</span>
            </div>
            <span className="font-heading text-4xl sm:text-5xl font-bold text-on-surface">{loadingCounts ? '-' : lostCount}</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">My Lost Items</h3>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-4">Items you are currently searching for.</p>
          <div className="flex items-center text-primary font-body text-xs sm:text-sm font-semibold uppercase tracking-wider">
            View active reports <span className="material-symbols-outlined ml-1 text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </Link>

        {/* My Found Items */}
        <Link
          to="/profile/my-items?type=found"
          className="group block bg-surface-container-lowest shadow-level-1 rounded-2xl p-5 sm:p-6 border border-outline-variant/30 hover:border-status-found-text/30 transition-all hover:shadow-lg relative overflow-hidden active:scale-[0.99]"
        >
          <div className="absolute right-0 top-0 w-28 h-28 bg-status-found-bg rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-status-found-bg flex items-center justify-center text-status-found-text">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
            <span className="font-heading text-4xl sm:text-5xl font-bold text-on-surface">{loadingCounts ? '-' : foundCount}</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface mb-1 group-hover:text-status-found-text transition-colors">My Found Items</h3>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-4">Items you've reported finding on campus.</p>
          <div className="flex items-center text-status-found-text font-body text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Manage items <span className="material-symbols-outlined ml-1 text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </Link>

        {/* Edit Profile */}
        <Link
          to="/profile/edit"
          className="group block bg-surface-container-lowest shadow-level-1 rounded-2xl p-5 sm:p-6 border border-outline-variant/30 hover:border-outline-variant transition-all hover:shadow-lg flex flex-col justify-between active:scale-[0.99]"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-surface-muted flex items-center justify-center text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface mb-1">Edit Profile</h3>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant">Update your contact details and preferred method.</p>
          </div>
          <div className="mt-4 w-full py-2.5 bg-surface-muted text-center rounded-xl font-body text-xs sm:text-sm font-semibold text-on-surface group-hover:bg-surface-variant transition-colors">
            Open Settings
          </div>
        </Link>
      </section>

      {/* Logout */}
      <section className="flex justify-center pt-2">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 border-2 border-primary bg-transparent text-primary px-8 py-3 rounded-xl font-body text-sm font-semibold hover:bg-error-container/30 transition-colors active:scale-95 min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Log Out</span>
        </button>
      </section>
    </main>
  )
}
