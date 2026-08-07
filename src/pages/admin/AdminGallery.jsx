import { useEffect, useState } from 'react'
import { getGalleryItems, uploadGalleryItem, deleteGalleryItem } from '../../services/galleryService'

export default function AdminGallery() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', category: '', image: null })
    const [preview, setPreview] = useState(null)

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await getGalleryItems()
            setItems(res.data.data?.gallery || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load gallery' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchItems() }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setForm({ ...form, image: file })
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('category', form.category)
        if (form.image) formData.append('image', form.image)
        try {
            await uploadGalleryItem(formData)
            setMessage({ type: 'success', text: 'Gallery item uploaded' })
            setShowForm(false)
            setForm({ title: '', description: '', category: '', image: null })
            setPreview(null)
            fetchItems()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this gallery item?')) return
        try {
            await deleteGalleryItem(id)
            fetchItems()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Gallery Management</h1>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ Upload Image'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleUpload} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Upload Image</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Category</span>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select</option>
                                <option value="events">Events</option>
                                <option value="activities">Activities</option>
                                <option value="facilities">Facilities</option>
                                <option value="celebrations">Celebrations</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Description</span>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Image File *</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        {preview && (
                            <div className="sm:col-span-2">
                                <img src={preview} alt="Preview" className="max-h-48 rounded-2xl object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Upload</button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading gallery...</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    {items.map((item) => (
                        <div key={item._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 overflow-hidden">
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover" />
                            )}
                            <div className="p-5">
                                <h3 className="font-semibold text-white">{item.title}</h3>
                                {item.category && <p className="text-sm text-slate-400">{item.category}</p>}
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => handleDelete(item._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-slate-400">No gallery items found.</p>}
                </div>
            )}
        </main>
    )
}
