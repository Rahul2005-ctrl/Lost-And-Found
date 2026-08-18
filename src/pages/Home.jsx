import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ItemCard from '../components/ItemCard'
import homeBanner from '../assets/home-banner.webp'

const categories = [
  { icon: 'badge', label: 'ID Cards', value: 'id-cards' },
  { icon: 'wallet', label: 'Wallets', value: 'personal' },
  { icon: 'smartphone', label: 'Phones', value: 'electronics' },
  { icon: 'laptop_mac', label: 'Laptops', value: 'electronics' },
  { icon: 'menu_book', label: 'Books', value: 'academic' },
  { icon: 'more_horiz', label: 'Others', value: 'other' },
]

export default function Home() {
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentItems()
  }, [])

  async function fetchRecentItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(4)
    setRecentItems(data || [])
    setLoading(false)
  }

  return (
    <main className="bg-dots pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative w-full min-h-[540px] sm:min-h-[580px] md:min-h-[660px] flex items-center justify-center overflow-hidden py-14 sm:py-16 md:py-24">
        {/* Responsive Background Banner Image & Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={homeBanner}
            alt="GEHU Campus Banner"
            className="w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.82] contrast-[1.05]"
            loading="eager"
          />
          {/* Subtle gradient overlays for flawless text legibility across all screen sizes */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/70" />
          <div className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto flex flex-col items-center w-full">
          <div className="backdrop-blur-md bg-black/30 p-6 sm:p-10 md:p-14 rounded-3xl md:rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col items-center w-full max-w-4xl animate-fade-in">
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 border border-white/25 shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">school</span>
              <span>Graphic Era Hill University</span>
            </div>

            {/* BIG Bold Lost & Found Title */}
            <div className="flex flex-col items-center mb-4">
              <span className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] text-primary-fixed-dim uppercase mb-1">
                Official Campus Portal
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-black tracking-tight leading-none uppercase drop-shadow-md">
                Lost <span className="text-primary-fixed-dim font-black">&</span> Found
              </h1>
            </div>

            {/* Aesthetic Tagline */}
            <p className="font-heading text-lg sm:text-2xl md:text-3xl text-white/95 font-semibold mb-2 tracking-tight">
              Find what you lost. <span className="text-primary-fixed-dim">Return what you found.</span>
            </p>
            <p className="font-body text-xs sm:text-sm md:text-base text-white/80 mb-8 max-w-xl leading-relaxed">
              Connect with fellow students and campus security to recover lost items across Haldwani campus.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
              <Link
                to="/lost"
                className="w-full sm:w-auto bg-[#ff5722] hover:bg-[#e64a19] text-white font-heading text-base font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group"
              >
                <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">search</span>
                <span>I Lost Something</span>
              </Link>
              <Link
                to="/report"
                className="w-full sm:w-auto bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-heading text-base font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group"
              >
                <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">volunteer_activism</span>
                <span>I Found Something</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto -mt-8 sm:-mt-12 md:-mt-16 relative z-20 mb-12 md:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link
            to="/report?type=lost"
            className="bg-surface-container-lowest rounded-2xl md:rounded-[2rem] p-6 sm:p-8 shadow-level-1 hover:shadow-2xl transition-all border-2 border-status-lost-text/20 hover:border-status-lost-text group cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-status-lost-bg text-status-lost-text flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs shrink-0">
                <span className="material-symbols-outlined fill text-3xl">travel_explore</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-status-lost-text bg-status-lost-bg px-2.5 py-0.5 rounded-full">Report Missing</span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface">Lost Something?</h3>
              </div>
            </div>
            <p className="font-body text-sm sm:text-base text-on-surface-variant mb-4 leading-relaxed">
              Report an item you lost on campus. The student community and security staff will help you find it.
            </p>
            <span className="text-status-lost-text font-heading text-sm font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              Report Lost Item <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </Link>

          <Link
            to="/report?type=found"
            className="bg-surface-container-lowest rounded-2xl md:rounded-[2rem] p-6 sm:p-8 shadow-level-1 hover:shadow-2xl transition-all border-2 border-status-found-text/20 hover:border-status-found-text group cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-status-found-bg text-status-found-text flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs shrink-0">
                <span className="material-symbols-outlined fill text-3xl">check_circle</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-status-found-text bg-status-found-bg px-2.5 py-0.5 rounded-full">Help Someone</span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface">Found Something?</h3>
              </div>
            </div>
            <p className="font-body text-sm sm:text-base text-on-surface-variant mb-4 leading-relaxed">
              Help a fellow GEHU student recover their belongings quickly by posting the details here.
            </p>
            <span className="text-status-found-text font-heading text-sm font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              Report Found Item <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Recently Added */}
      <section className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto mb-12 md:mb-20">
        <div className="flex justify-between items-end mb-6 border-b border-surface-muted pb-3">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">Recently Added</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-body mt-0.5">Latest lost & found items on campus</p>
          </div>
          <Link to="/lost" className="text-primary font-body text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-container-low/40 rounded-2xl border border-outline-variant/30 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-40">inbox</span>
            <p className="font-body text-base">No active items reported yet. Be the first to help!</p>
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto mb-12 md:mb-20">
        <h2 className="font-heading text-xl sm:text-2xl font-semibold text-on-surface mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={`/lost?category=${cat.value}`}
              className="flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl bg-surface-muted hover:bg-surface-container-high transition-all text-on-surface-variant hover:text-primary border border-outline-variant/20 hover:border-primary/30 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">{cat.icon}</span>
              <span className="font-body text-xs font-semibold text-center truncate w-full">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-surface-container-low py-12 md:py-20 border-y border-outline-variant/30">
        <div className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {[
              { num: '1', title: 'Report', desc: 'Submit details about the item you lost or found. Upload clear photos for quick identification.', filled: true },
              { num: '2', title: 'Browse & Match', desc: 'Search through the active lost and found database with real-time campus categories.', filled: false },
              { num: '3', title: 'Connect & Return', desc: 'Contact the person via WhatsApp, Phone call, or Email to safely arrange item handover.', filled: false },
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center text-center p-5 sm:p-6 bg-surface-container-lowest/80 rounded-2xl border border-outline-variant/30 shadow-sm">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-heading text-xl sm:text-2xl mb-4 shadow-sm ${
                    step.filled
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest border-2 border-primary text-primary'
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-on-surface mb-2">{step.title}</h3>
                <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
