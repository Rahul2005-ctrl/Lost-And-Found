import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function EditProfile() {
  const { profile, updateProfile, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/profile/edit' } })
    }
  }, [user, authLoading, navigate])
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    preferred_contact: profile?.preferred_contact || 'email',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo || null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Sync form when profile is loaded from AuthContext
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        preferred_contact: profile.preferred_contact || 'email',
      })
      if (!photoFile && !removePhoto) {
        setPhotoPreview(profile.profile_photo || null)
      }
    }
  }, [profile])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const updates = { ...form }

      // Delete old photo(s) from storage if replacing or removing
      if (photoFile || removePhoto) {
        try {
          const { data: existingFiles } = await supabase.storage.from('profile-photos').list(user.id)
          if (existingFiles && existingFiles.length > 0) {
            const filesToDelete = existingFiles.map((f) => `${user.id}/${f.name}`)
            await supabase.storage.from('profile-photos').remove(filesToDelete)
          }
        } catch (delErr) {
          console.warn('Failed to delete old photos from storage:', delErr)
        }
      }

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('profile-photos').upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: true,
        })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
        updates.profile_photo = urlData.publicUrl
      } else if (removePhoto) {
        updates.profile_photo = ''
      }

      await updateProfile(updates)
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 800)
    } catch (err) {
      console.error('Update profile error:', err)
      setError(err.message || 'Failed to update profile.')
    }
    setLoading(false)
  }

  if (authLoading || !user) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
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
          {/* Show current/preview photo or default avatar */}
          {(photoPreview || (!removePhoto && profile?.profile_photo && profile.profile_photo !== '')) ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-outline-variant bg-surface-muted shadow-sm">
                  <img src={photoPreview || profile?.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); setPhotoFile(null); setRemovePhoto(true); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-error/50 text-error bg-error-container/20 hover:bg-error-container/40 font-body text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Remove Photo
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('profilePhotoInput')?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-primary/50 text-primary bg-primary/5 hover:bg-primary/10 font-body text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-outline-variant bg-surface-muted shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">person</span>
              </div>
              <p className="font-body text-xs text-on-surface-variant">Using default avatar</p>
              <button
                type="button"
                onClick={() => document.getElementById('profilePhotoInput')?.click()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-body text-xs font-semibold shadow-sm hover:bg-surface-tint transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                Upload Photo
              </button>
            </div>
          )}
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
              if (!allowed.includes(file.type)) { alert('Please upload a JPG, PNG, or WEBP image.'); return; }
              if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }
              setPhotoFile(file);
              setRemovePhoto(false);
              const reader = new FileReader();
              reader.onload = (ev) => setPhotoPreview(ev.target.result);
              reader.readAsDataURL(file);
            }}
          />
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
              { value: 'email', label: 'Email', icon: 'mail' },
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
