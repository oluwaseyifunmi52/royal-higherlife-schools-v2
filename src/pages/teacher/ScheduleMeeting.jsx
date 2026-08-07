import { useEffect, useState } from 'react'
import { getMeetings, createMeeting, deleteMeeting } from '../../services/meetingService'

export default function ScheduleMeeting() {
    const [meetings, setMeetings] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [form, setForm] = useState({ title: '', description: '', date: '', time: '', type: 'parent-teacher', participants: '' })

    const fetchMeetings = async () => {
        setLoading(true)
        try {
            const res = await getMeetings()
            setMeetings(res.data.data?.meetings || res.data.data || [])
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchMeetings() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await createMeeting(form)
            setMessage({ type: 'success', text: 'Meeting scheduled' })
            setShowForm(false)
            setForm({ title: '', description: '', date: '', time: '', type: 'parent-teacher', participants: '' })
            fetchMeetings()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to schedule meeting' })
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Cancel this meeting?')) return
        try { await deleteMeeting(id); fetchMeetings() } catch { /* ignore */ }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Schedule Meetings</h1>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ Schedule Meeting'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">New Meeting</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Description</span>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Date *</span>
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Time *</span>
                            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Type</span>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="parent-teacher">Parent-Teacher</option>
                                <option value="staff">Staff Meeting</option>
                                <option value="department">Department</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Participants</span>
                            <input value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Names or class" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" disabled={saving}
                            className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                            {saving ? 'Scheduling...' : 'Schedule Meeting'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading meetings...</p>
            ) : (
                <div className="space-y-4">
                    {meetings.map((m) => (
                        <div key={m._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-white">{m.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{m.description || 'No description'}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {m.date ? new Date(m.date).toLocaleDateString() : 'N/A'}
                                        {m.time ? ` at ${m.time}` : ''} · {m.type || 'N/A'}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(m._id)} className="text-sm font-semibold text-red-400">Cancel</button>
                            </div>
                        </div>
                    ))}
                    {meetings.length === 0 && <p className="text-slate-400">No meetings scheduled.</p>}
                </div>
            )}
        </main>
    )
}
