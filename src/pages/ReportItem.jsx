import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/ImageUpload'

const categories = [
  { value: 'electronics', label: 'Electronics (Phones, Laptops)' },
  { value: 'accessories', label: 'Accessories (Keys, Wallets)' },
  { value: 'clothing', label: 'Clothing & Wearables' },
  { value: 'academic', label: 'Academic (Books, Notes)' },
  { value: 'id-cards', label: 'ID Cards & Documents' },
  { value: 'personal', label: 'Personal Items' },
  { value: 'other', label: 'Other' },
]

const locations = [
  { value: 'Central Library', label: 'Central Library' },
  { value: 'Main Cafeteria', label: 'Main Cafeteria' },
  { value: 'Block A', label: 'Block A' },
  { value: 'Block B', label: 'Block B' },
  { value: 'Sports Ground', label: 'Sports Ground' },
  { value: 'Auditorium', label: 'Auditorium' },
  { value: 'Hostel', label: 'Hostel' },
  { value: 'Parking', label: 'Parking Area' },
  { value: 'Other', label: 'Other' },
]

const currentLocations = [
  { value: 'With me', label: 'With Me' },
  { value: 'College Security', label: 'College Security' },
  { value: 'Library Reception', label: 'Library Reception' },
  { value: 'Hostel Reception', label: 'Hostel Reception' },
  { value: 'Lost & Found Desk', label: 'Lost & Found Desk' },
  { value: 'Other', label: 'Other' },
]

export default function ReportItem() {
  const [searchParams] = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') || 'lost')
  const [form, setForm] = useState({
    item_name: '', category: '', date: '', time: '', location: '',
    specific_location: '', description: '', current_location: '', contact_method: 'email',
    contact_phone: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  // Pre-fill phone from profile when available
  useEffect(() => {
    if (profile?.phone && !form.contact_phone) {
      setForm(prev => ({ ...prev, contact_phone: profile.phone }))
    }
  }, [profile])

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/report' } })
    }
  }, [user, navigate])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const isLost = type === 'lost'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(filePath, imageFile)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('item-images').getPublicUrl(filePath)
        imageUrl = urlData.publicUrl
      }

      // Ensure profile exists
      if (profile || user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          name: profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
          email: user.email,
          phone: form.contact_phone || profile?.phone || user.user_metadata?.phone || null,
          profile_photo: profile?.profile_photo || null,
          preferred_contact: form.contact_method || profile?.preferred_contact || 'email',
        })
      }

      const { error: insertError } = await supabase.from('items').insert({
        user_id: user.id,
        type,
        item_name: form.item_name,
        category: form.category,
        image_url: imageUrl,
        date: form.date,
        time: form.time || null,
        location: form.location,
        specific_location: form.specific_location || null,
        description: form.description || null,
        current_location: type === 'found' ? form.current_location : null,
        contact_method: form.contact_method,
        contact_phone: (form.contact_method === 'phone' || form.contact_method === 'whatsapp') ? (form.contact_phone || null) : null,
        contact_email: user.email || null,
        status: 'active',
      })
      if (insertError) throw insertError
      navigate(type === 'lost' ? '/lost' : '/found')
    } catch (err) {
      console.error('Error posting item:', err)
      setError(err.message || 'Failed to post item. Please try again.')
    }
    setLoading(false)
  }

  if (!user) return null

  return (
    <main className="flex-grow w-full px-4 sm:px-6 max-w-3xl mx-auto py-6 sm:py-10 pb-24 md:pb-12">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-on-surface mb-2 tracking-tight">
          Report an Item
        </h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto">
          Help keep our GEHU campus connected. Fill in the details below to notify others.
        </p>
      </div>

      {/* Type Toggle */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => setType('lost')}
          className={`group relative rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-200 hover:shadow-md active:scale-95 border-2 min-h-[90px] ${
            isLost
              ? 'bg-status-lost-bg border-status-lost-text shadow-sm'
              : 'bg-surface-muted border-transparent opacity-75 hover:opacity-100'
          }`}
        >
          <span className={`material-symbols-outlined text-3xl sm:text-4xl ${isLost ? 'text-status-lost-text fill' : 'text-on-surface-variant'}`}>search</span>
          <span className={`font-heading text-xs sm:text-base font-bold uppercase tracking-wider ${isLost ? 'text-status-lost-text' : 'text-on-surface-variant'}`}>
            I Lost Something
          </span>
        </button>
        <button
          type="button"
          onClick={() => setType('found')}
          className={`group relative rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-200 hover:shadow-md active:scale-95 border-2 min-h-[90px] ${
            !isLost
              ? 'bg-status-found-bg border-status-found-text shadow-sm'
              : 'bg-surface-muted border-transparent opacity-75 hover:opacity-100'
          }`}
        >
          <span className={`material-symbols-outlined text-3xl sm:text-4xl ${!isLost ? 'text-status-found-text fill' : 'text-on-surface-variant'}`}>volunteer_activism</span>
          <span className={`font-heading text-xs sm:text-base font-bold uppercase tracking-wider ${!isLost ? 'text-status-found-text' : 'text-on-surface-variant'}`}>
            I Found Something
          </span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl shadow-level-1 p-4 sm:p-6 md:p-8 border border-outline-variant/30 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-300 ${isLost ? 'bg-status-lost-text' : 'bg-status-found-text'}`} />

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl font-body text-sm mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="itemName">Item Name *</label>
              <input id="itemName" className="input-field" value={form.item_name} onChange={update('item_name')} placeholder="e.g., Blue Hydro Flask / ID Card" required />
            </div>
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="category">Category *</label>
              <div className="relative">
                <select id="category" className="input-field appearance-none pr-10" value={form.category} onChange={update('category')} required>
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5">Upload Photo (Optional)</label>
            <ImageUpload onFileSelect={setImageFile} preview={imagePreview} setPreview={setImagePreview} />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="date">
                Date {isLost ? 'Lost' : 'Found'} *
              </label>
              <input id="date" type="date" className="input-field" value={form.date} onChange={update('date')} required />
            </div>
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="time">
                Approximate Time (Optional)
              </label>
              <input id="time" type="time" className="input-field" value={form.time} onChange={update('time')} />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="location">
                Location on Campus *
              </label>
              <div className="relative">
                <select id="location" className="input-field appearance-none pr-10" value={form.location} onChange={update('location')} required>
                  <option value="" disabled>Where was it seen/found?</option>
                  {locations.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="specificSpot">Specific Spot (Optional)</label>
              <input id="specificSpot" className="input-field" value={form.specific_location} onChange={update('specific_location')} placeholder="e.g., Table 4, 2nd Floor" />
            </div>
          </div>

          {/* Found-only: Current Location */}
          {!isLost && (
            <div>
              <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="currentLocation">Current Location of the Item</label>
              <div className="relative">
                <select id="currentLocation" className="input-field appearance-none pr-10" value={form.current_location} onChange={update('current_location')}>
                  <option value="" disabled>Where is the item right now?</option>
                  {currentLocations.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="description">
              Description & Identifying Marks
            </label>
            <textarea
              id="description"
              className="input-field resize-none py-2.5"
              rows="3"
              value={form.description}
              onChange={update('description')}
              placeholder={isLost ? 'Provide any identifying features (color, brand, case, scratches) to help recognize it.' : 'Provide visible condition and identifying features.'}
            />
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-2">Preferred Contact Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { value: 'email', label: 'Email', icon: 'mail' },
                { value: 'phone', label: 'Phone Call', icon: 'call' },
                { value: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    form.contact_method === opt.value
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-outline-variant/30 bg-surface-muted hover:border-outline-variant text-on-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="contact"
                    value={opt.value}
                    checked={form.contact_method === opt.value}
                    onChange={update('contact_method')}
                    className="hidden"
                  />
                  <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                  <span className="font-body text-xs sm:text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Phone Number Input (shown when phone or whatsapp is selected) */}
            {(form.contact_method === 'phone' || form.contact_method === 'whatsapp') && (
              <div className="mt-3">
                <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="contactPhone">
                  Your Phone Number {form.contact_method === 'whatsapp' ? '(WhatsApp)' : '(for Calls)'} *
                </label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none">
                    {form.contact_method === 'whatsapp' ? 'chat' : 'call'}
                  </span>
                  <input
                    id="contactPhone"
                    type="tel"
                    className="input-field pl-11"
                    value={form.contact_phone}
                    onChange={update('contact_phone')}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <p className="font-body text-[11px] text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  This number will be shared with people who want to contact you about this item.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-on-primary font-heading text-base sm:text-lg font-bold py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 min-h-[50px] ${
                isLost ? 'bg-primary hover:bg-primary-container' : 'bg-status-found-text hover:bg-status-found-text/90'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[22px]">{isLost ? 'search' : 'volunteer_activism'}</span>
                  <span>Post {isLost ? 'Lost' : 'Found'} Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
