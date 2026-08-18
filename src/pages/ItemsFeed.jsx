import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ItemCard from '../components/ItemCard'

export default function ItemsFeed({ feedType }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 12
  const isLost = feedType === 'lost'

  useEffect(() => {
    let isCurrent = true
    setPage(0)
    fetchItems(0, true, isCurrent)
    return () => { isCurrent = false }
  }, [feedType, category, dateFilter])

  async function fetchItems(pageNum = 0, reset = false, isCurrent = true) {
    setLoading(true)
    try {
      let query = supabase
        .from('items')
        .select('*')
        .eq('type', feedType)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (category) query = query.eq('category', category)

      if (dateFilter) {
        const today = new Date()
        let dateLimit
        if (dateFilter === 'today') {
          dateLimit = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
        } else if (dateFilter === 'week') {
          const past = new Date(today)
          past.setDate(past.getDate() - 7)
          dateLimit = past.toISOString()
        } else if (dateFilter === 'month') {
          const past = new Date(today)
          past.setMonth(past.getMonth() - 1)
          dateLimit = past.toISOString()
        }
        if (dateLimit) query = query.gte('created_at', dateLimit)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error querying items:', error)
      }
      if (isCurrent) {
        const newItems = data || []
        setItems(prev => reset ? newItems : [...prev, ...newItems])
        setHasMore(newItems.length === PAGE_SIZE)
      }
    } catch (err) {
      console.error('Failed to fetch items:', err)
    } finally {
      if (isCurrent) {
        setLoading(false)
      }
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchItems(nextPage, false, true)
  }

  const clearFilters = () => {
    setCategory('')
    setDateFilter('')
  }

  return (
    <main className="flex-grow w-full px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto py-6 md:py-12 pb-24 md:pb-12 flex flex-col gap-6 md:gap-10 bg-dots min-h-screen">
      {/* Header & Filter Controls */}
      <section className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isLost ? 'bg-[#ff5722] text-white shadow-xs' : 'bg-[#2e7d32] text-white shadow-xs'
              }`}>
                {isLost ? 'MISSING REPORTS' : 'FOUND ITEMS'}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight uppercase">
              {isLost ? 'Lost Items' : 'Found Items'}
            </h1>
            <p className="font-body text-sm sm:text-base text-on-surface-variant">
              {isLost
                ? 'Browse all items reported lost by students across GEHU Haldwani campus.'
                : 'Browse all items found and reported by students across GEHU Haldwani campus.'}
            </p>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-44">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field appearance-none pr-8 py-2 text-xs sm:text-sm min-h-[44px]"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
                <option value="clothing">Clothing</option>
                <option value="academic">Academic</option>
                <option value="id-cards">ID Cards</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
            </div>

            <div className="relative w-full sm:w-40">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field appearance-none pr-8 py-2 text-xs sm:text-sm min-h-[44px]"
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
            </div>

            {(category || dateFilter) && (
              <button
                onClick={clearFilters}
                className="col-span-2 sm:col-span-1 px-3 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors flex items-center justify-center gap-1 min-h-[44px]"
                title="Reset filters"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Item Grid */}
      <section className="w-full">
        {loading && items.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {hasMore && (
              <div className="w-full flex justify-center mt-8 md:mt-10">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full sm:w-auto bg-transparent border-2 border-primary text-primary font-body text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-surface-container-low transition-all active:scale-95 disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? 'Loading...' : 'Load More Items'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="w-full bg-surface-container-lowest/80 rounded-2xl md:rounded-[32px] py-16 sm:py-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant/40 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <span className="material-symbols-outlined text-4xl">search_off</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-on-surface mb-2">No items found</h3>
            <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-md mb-6 leading-relaxed">
              We couldn't find any {isLost ? 'lost' : 'found'} items matching your current filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-primary text-on-primary font-body text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-surface-tint active:scale-95 transition-all min-h-[44px]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
