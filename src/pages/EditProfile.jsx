import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ImageUpload from '../components/ImageUpload'

export default function EditProfile() {
  const { profile, updateProfile, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    preferred_contact: profile?.preferred_contact || 'email',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const updates = { ...form }

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('profile-photos').upload(filePath, photoFile)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
        updates.profile_photo = urlData.publicUrl
      }

      await updateProfile(updates)
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="flex-grow w-full px-4 sm:px-6 max-w-xl mx-auto py-6 sm:py-10 pb-24 md:pb-12">
      <div className="text-center sm:text-left mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mb-1 tracking-tight">Edit Profile</h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">Update your contact information and preferences.</p>
      </div>

      {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl font-body text-sm mb-4">{error}</div>}
      {success && <div className="bg-status-found-bg text-status-found-text px-4 py-3 rounded-xl font-body text-sm mb-4">Profile updated successfully!</div>}

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl sm:rounded-3xl shadow-level-1 p-4 sm:p-6 md:p-8 border border-outline-variant/30 space-y-4 sm:space-y-6">
        {/* Photo */}
        <div>
          <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5">Profile Photo</label>
          <ImageUpload onFileSelect={setPhotoFile} preview={photoPreview} setPreview={setPhotoPreview} />
        </div>

        {/* Name */}
        <div>
          <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="name">Full Name</label>
          <input id="name" className="input-field" value={form.name} onChange={update('name')} required />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5" htmlFor="phone">Phone (for WhatsApp / Calls)</label>
          <input id="phone" className="input-field" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
        </div>

        {/* Preferred Contact */}
        <div>
          <label className="block font-body text-xs sm:text-sm font-semibold text-on-surface-variant mb-2">Preferred Contact Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { value: 'email', label: 'University Email', icon: 'mail' },
              { value: 'phone', label: 'Phone Call', icon: 'call' },
              { value: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  form.preferred_contact === opt.value
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-outline-variant/30 bg-surface-muted hover:border-outline-variant text-on-surface'
                }`}
              >
                <input
                  type="radio"
                  name="preferred_contact"
                  value={opt.value}
                  checked={form.preferred_contact === opt.value}
                  onChange={update('preferred_contact')}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                <span className="font-body text-xs sm:text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/profile')} className="flex-1 py-3 px-4 border-2 border-outline-variant/40 text-on-surface font-body text-sm font-semibold rounded-xl hover:bg-surface-muted transition-colors min-h-[48px]">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-primary text-on-primary font-body text-sm font-semibold py-3 px-4 rounded-xl shadow-sm hover:bg-surface-tint hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 min-h-[48px]">
            {loading ? <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </main>
  )
}
