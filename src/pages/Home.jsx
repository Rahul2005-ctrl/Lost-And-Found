import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ItemCard from '../components/ItemCard'
import homeBanner from '../assets/home-banner.webp'
import gehuLogo from '../assets/gehu-logo.jpeg'

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
    <main className="bg-background pb-20 md:pb-0 overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Full-Width Campus Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={homeBanner}
            alt="Graphic Era Hill University Campus"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Centered Content Box */}
        <div className="relative z-10 text-center px-6 sm:px-12 py-10 sm:py-14 mx-4 max-w-3xl w-full bg-black/25 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl animate-fade-in-up">
          <img src={gehuLogo} alt="GEHU" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-6 ring-2 ring-white/30 shadow-lg" />
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-white mb-4">
            Lost <span className="text-gradient">&</span> Found
          </h1>
          <p className="font-body text-base sm:text-lg text-white/70 max-w-md mx-auto mb-10">
            GEHU Haldwani Campus — Find what you lost, return what you found.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/report?type=lost"
              className="bg-white/10 backdrop-blur-sm text-white font-heading text-sm sm:text-base font-bold px-8 py-3.5 rounded-full border border-white/25 hover:bg-[#ff5722] hover:border-[#ff5722] hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5 group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:-rotate-12 transition-transform duration-300">search</span>
              I Lost Something
            </Link>
            <Link
              to="/report?type=found"
              className="bg-white/10 backdrop-blur-sm text-white font-heading text-sm sm:text-base font-bold px-8 py-3.5 rounded-full border border-white/25 hover:bg-[#2e7d32] hover:border-[#2e7d32] hover:shadow-[0_0_30px_rgba(46,125,50,0.5)] hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5 group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform duration-300">volunteer_activism</span>
              I Found Something
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Box Layout for Quick Actions & Categories */}
      <section className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto -mt-2 relative z-20 mb-20 md:mb-32 pt-14 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          
          {/* Main Action 1 */}
          <Link
            to="/report?type=lost"
            className="md:col-span-6 glass-card bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-premium group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[280px]"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-status-lost-text/5 rounded-full transition-transform group-hover:scale-[2] duration-700" />
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-[1.25rem] bg-status-lost-bg text-status-lost-text flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-sm border border-status-lost-text/20">
                <span className="material-symbols-outlined fill text-4xl">travel_explore</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-status-lost-text bg-status-lost-bg/80 px-3 py-1.5 rounded-full border border-status-lost-text/10 backdrop-blur-sm">Report Missing</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-heading text-3xl lg:text-4xl font-black text-on-surface tracking-tight mb-3">Lost Something?</h3>
              <p className="font-body text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed opacity-90 max-w-sm">
                Report an item you lost on campus. The student community and security staff will help you find it.
              </p>
              <span className="text-status-lost-text font-heading text-base font-bold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                File a Report <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </span>
            </div>
          </Link>

          {/* Main Action 2 */}
          <Link
            to="/report?type=found"
            className="md:col-span-6 glass-card bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-premium group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[280px]"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-status-found-text/5 rounded-full transition-transform group-hover:scale-[2] duration-700" />
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-[1.25rem] bg-status-found-bg text-status-found-text flex items-center justify-center group-hover:-rotate-12 transition-transform duration-500 shadow-sm border border-status-found-text/20">
                <span className="material-symbols-outlined fill text-4xl">check_circle</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-status-found-text bg-status-found-bg/80 px-3 py-1.5 rounded-full border border-status-found-text/10 backdrop-blur-sm">Help Someone</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-heading text-3xl lg:text-4xl font-black text-on-surface tracking-tight mb-3">Found Something?</h3>
              <p className="font-body text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed opacity-90 max-w-sm">
                Help a fellow GEHU student recover their belongings quickly by posting the details here.
              </p>
              <span className="text-status-found-text font-heading text-base font-bold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Register Found Item <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </span>
            </div>
          </Link>

          {/* Category Bento Cells */}
          <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-2">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={`/lost?category=${cat.value}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-[1.5rem] bg-surface-muted hover:bg-white hover:shadow-ambient transition-all duration-300 text-on-surface-variant hover:text-primary border border-outline-variant/30 active:scale-95"
              >
                <div className="w-14 h-14 rounded-[1.25rem] bg-surface-container border border-outline-variant/20 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform duration-300 text-primary">{cat.icon}</span>
                </div>
                <span className="font-heading text-sm font-bold text-center w-full">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added List */}
      <section className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto mb-20 md:mb-32">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface tracking-tight mb-2">Live Feed</h2>
            <p className="text-base text-on-surface-variant font-body opacity-90">The latest lost and found updates from around the campus.</p>
          </div>
          <Link to="/lost" className="text-primary font-heading text-sm font-bold hover:underline flex items-center gap-1.5 shrink-0 group bg-primary/5 px-5 py-2.5 rounded-full border border-primary/10 hover:bg-primary/10 transition-colors">
            View the Board <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-muted/50 rounded-[2rem] border border-outline-variant/30 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">inbox</span>
            <p className="font-heading text-xl font-bold">No items actively listed right now.</p>
            <p className="font-body text-sm mt-2 opacity-80">Be the first to help someone by reporting a found item.</p>
          </div>
        )}
      </section>

      {/* Modern Workflow Section */}
      <section className="relative py-24 md:py-32 border-t border-outline-variant/20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 bg-dots opacity-40 z-0" />
        <div className="px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3 block">Simple Process</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-on-surface tracking-tight">How it works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Minimal Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-outline-variant to-transparent z-0" />
            
            {[
              { icon: 'add_a_photo', title: '1. File a Report', desc: 'Provide details and images of the item you lost or found.' },
              { icon: 'manage_search', title: '2. Search & Match', desc: 'Browse the live feed or wait for the community to find a match.' },
              { icon: 'handshake', title: '3. Connect & Return', desc: 'Securely contact the finder/owner to safely return the item.' },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center p-8 bg-surface-muted rounded-[2rem] border border-outline-variant/30 hover:bg-white hover:shadow-premium transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-20 h-20 rounded-[1.5rem] bg-white border border-outline-variant/30 flex items-center justify-center font-heading text-3xl font-black mb-6 shadow-sm text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-on-surface mb-3 tracking-tight">{step.title}</h3>
                <p className="font-body text-base text-on-surface-variant leading-relaxed opacity-90">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
