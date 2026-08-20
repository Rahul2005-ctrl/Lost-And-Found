import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ItemCard from '../components/ItemCard'

export default function MyItems() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'lost'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: `/profile/my-items?type=${type}` } })
    }
    if (user) fetchItems()
  }, [user, authLoading, type, navigate])

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', type)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const isLost = type === 'lost'

  if (authLoading || !user) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="flex-grow w-full px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto py-6 sm:py-10 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            My {isLost ? 'Lost' : 'Found'} Items
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-0.5">
            {isLost ? 'Items you have reported as lost on campus.' : 'Items you have reported finding on campus.'}
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            to="/profile/my-items?type=lost"
            className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl font-body text-xs sm:text-sm font-semibold transition-colors min-h-[40px] flex items-center justify-center ${isLost ? 'bg-status-lost-bg text-status-lost-text font-bold shadow-xs' : 'bg-surface-muted text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Lost Items ({isLost ? items.length : '•'})
          </Link>
          <Link
            to="/profile/my-items?type=found"
            className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl font-body text-xs sm:text-sm font-semibold transition-colors min-h-[40px] flex items-center justify-center ${!isLost ? 'bg-status-found-bg text-status-found-text font-bold shadow-xs' : 'bg-surface-muted text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Found Items ({!isLost ? items.length : '•'})
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20 px-4 bg-surface-container-lowest/80 rounded-2xl md:rounded-[32px] border-2 border-dashed border-outline-variant/40 shadow-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl sm:text-6xl mb-3 block opacity-30">inbox</span>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface mb-1">No {isLost ? 'lost' : 'found'} items</h3>
          <p className="font-body text-xs sm:text-sm mb-5">You haven't reported any {isLost ? 'lost' : 'found'} items yet.</p>
          <Link
            to={`/report?type=${type}`}
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-body text-sm font-semibold px-6 py-3 rounded-xl hover:bg-surface-tint shadow-sm active:scale-95 transition-all min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Report an Item</span>
          </Link>
        </div>
      )}
    </main>
  )
}
