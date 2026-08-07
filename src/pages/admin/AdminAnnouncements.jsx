import { useEffect, useState } from 'react'
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, publishAnnouncement } from '../../services/announcementService'

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ title: '', content: '', audience: 'all', priority: 'normal' })

    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            const res = await getAnnouncements()
            setAnnouncements(res.data.data?.announcements || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load announcements' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAnnouncements() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateAnnouncement(editing._id, form)
                setMessage({ type: 'success', text: 'Announcement updated' })
            } else {
                await createAnnouncement(form)
                setMessage({ type: 'success', text: 'Announcement created' })
            }
            setShowForm(false)
            setEditing(null)
            setForm({ title: '', content: '', audience: 'all', priority: 'normal' })
            fetchAnnouncements()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const handlePublish = async (id) => {
        try {
            await publishAnnouncement(id)
            setMessage({ type: 'success', text: 'Announcement published' })
            fetchAnnouncements()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Publish failed' })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return
        try {
            await deleteAnnouncement(id)
            fetchAnnouncements()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Announcements</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null) }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Announcement'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Content *</span>
                            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required
                                className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Audience</span>
                            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="all">All</option>
                                <option value="students">Students</option>
                                <option value="teachers">Teachers</option>
                                <option value="parents">Parents</option>
                                <option value="staff">Staff</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Priority</span>
                            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading announcements...</p>
            ) : (
                <div className="space-y-4">
                    {announcements.map((ann) => (
                        <div key={ann._id} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">{ann.title}</h3>
                                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{ann.content}</p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                        <span className="rounded-full bg-slate-800 px-3 py-1">{ann.audience || 'All'}</span>
                                        <span className="rounded-full bg-slate-800 px-3 py-1">{ann.priority || 'Normal'}</span>
                                        {ann.createdAt && <span>{new Date(ann.createdAt).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        ann.status === 'published' ? 'bg-green-500/10 text-green-300' : 'bg-slate-500/10 text-slate-400'
                                    }`}>{ann.status || 'draft'}</span>
                                    {ann.status !== 'published' && (
                                        <button onClick={() => handlePublish(ann._id)} className="text-sm font-semibold text-green-400">Publish</button>
                                    )}
                                    <button onClick={() => { setEditing(ann); setForm({ title: ann.title, content: ann.content, audience: ann.audience || 'all', priority: ann.priority || 'normal' }); setShowForm(true) }}
                                        className="text-sm font-semibold text-amber-400">Edit</button>
                                    <button onClick={() => handleDelete(ann._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && <p className="text-slate-400">No announcements found.</p>}
                </div>
            )}
        </main>
    )
}
