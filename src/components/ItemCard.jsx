import { Link } from 'react-router-dom'

const categoryIcons = {
  electronics: 'laptop_mac',
  accessories: 'watch',
  clothing: 'checkroom',
  academic: 'menu_book',
  'id-cards': 'badge',
  personal: 'wallet',
  other: 'category',
}

export default function ItemCard({ item }) {
  const isLost = item.type === 'lost'
  const icon = categoryIcons[item.category] || 'category'
  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <Link
      to={`/item/${item.id}`}
      className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] cursor-pointer border border-outline-variant/30 hover:border-primary/30 flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 w-full bg-surface-muted overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-30">{icon}</span>
          </div>
        )}
        {/* Status Chip */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-xl font-heading text-xs uppercase tracking-wider font-black shadow-md flex items-center gap-1.5 border ${
            isLost
              ? 'bg-[#ff5722] text-white border-white/30 shadow-[#ff5722]/30'
              : 'bg-[#2e7d32] text-white border-white/30 shadow-[#2e7d32]/30'
          }`}
        >
          <span className="material-symbols-outlined text-[15px] font-bold">
            {isLost ? 'search' : 'check_circle'}
          </span>
          <span>{isLost ? 'LOST' : 'FOUND'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-1 flex-grow">
        <div className="flex items-center gap-1.5 mb-0.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[15px] text-primary">{icon}</span>
          <span className="font-body text-[11px] sm:text-xs font-semibold capitalize truncate">{item.category?.replace('-', ' ')}</span>
        </div>
        <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface line-clamp-1 leading-snug group-hover:text-primary transition-colors">
          {item.item_name}
        </h3>
        <div className="mt-auto pt-2 flex flex-col gap-1 text-on-surface-variant text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="material-symbols-outlined text-[15px] shrink-0">calendar_today</span>
            <span className="font-body truncate">{dateStr || 'Recent'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="material-symbols-outlined text-[15px] shrink-0">location_on</span>
            <span className="font-body truncate">{item.location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
