import { useEffect, useState } from 'react'
import { getAwards, createAward, updateAward, deleteAward, approveAward } from '../../services/awardService'

export default function AdminAwards() {
    const [awards, setAwards] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ title: '', description: '', studentId: '', category: '', date: '' })

    const fetchAwards = async () => {
        setLoading(true)
        try {
            const res = await getAwards()
            setAwards(res.data.data?.awards || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load awards' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAwards() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateAward(editing._id, form)
                setMessage({ type: 'success', text: 'Award updated' })
            } else {
                await createAward(form)
                setMessage({ type: 'success', text: 'Award created' })
            }
            setShowForm(false)
            setEditing(null)
            setForm({ title: '', description: '', studentId: '', category: '', date: '' })
            fetchAwards()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const handleApprove = async (id) => {
        try {
            await approveAward(id)
            setMessage({ type: 'success', text: 'Award approved' })
            fetchAwards()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Approval failed' })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this award?')) return
        try {
            await deleteAward(id)
            fetchAwards()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Awards Management</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null) }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Award'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Award' : 'Create Award'}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Award Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Category</span>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select</option>
                                <option value="academic">Academic</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="sports">Sports</option>
                                <option value="attendance">Attendance</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Description</span>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update' : 'Create Award'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading awards...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="space-y-3">
                        {awards.map((award) => (
                            <div key={award._id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                <div>
                                    <p className="font-semibold text-white">{award.title}</p>
                                    <p className="text-sm text-slate-400">{award.studentName || 'N/A'} · {award.category || 'General'} · {award.date ? new Date(award.date).toLocaleDateString() : ''}</p>
                                    {award.description && <p className="text-sm text-slate-400 mt-1">{award.description}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        award.status === 'approved' ? 'bg-green-500/10 text-green-300' : 'bg-amber-500/10 text-amber-300'
                                    }`}>{award.status || 'pending'}</span>
                                    {award.status !== 'approved' && (
                                        <button onClick={() => handleApprove(award._id)} className="text-sm font-semibold text-green-400">Approve</button>
                                    )}
                                    <button onClick={() => { setEditing(award); setForm({ title: award.title, description: award.description || '', category: award.category || '', date: award.date || '', studentId: award.studentId || '' }); setShowForm(true) }}
                                        className="text-sm font-semibold text-amber-400">Edit</button>
                                    <button onClick={() => handleDelete(award._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                </div>
                            </div>
                        ))}
                        {awards.length === 0 && <p className="text-slate-400">No awards found.</p>}
                    </div>
                </div>
            )}
        </main>
    )
}
