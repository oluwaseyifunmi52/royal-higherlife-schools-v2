import { useEffect, useState } from 'react'
import { createAssignment, getAssignments, deleteAssignment } from '../../services/assignmentService'
import { getMyAssignedClasses } from '../../services/teacherService'

export default function CreateAssignment() {
    const [classes, setClasses] = useState([])
    const [assignments, setAssignments] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [form, setForm] = useState({ title: '', description: '', classId: '', subject: '', deadline: '', maxScore: '10' })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [clsRes, assignRes] = await Promise.allSettled([getMyAssignedClasses(), getAssignments()])
            if (clsRes.status === 'fulfilled') setClasses(clsRes.value.data.data?.classes || clsRes.value.data.data || [])
            if (assignRes.status === 'fulfilled') setAssignments(assignRes.value.data.data?.assignments || assignRes.value.data.data || [])
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await createAssignment(form)
            setMessage({ type: 'success', text: 'Assignment created' })
            setShowForm(false)
            setForm({ title: '', description: '', classId: '', subject: '', deadline: '', maxScore: '10' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create assignment' })
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this assignment?')) return
        try {
            await deleteAssignment(id)
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Assignments</h1>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Assignment'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Create Assignment</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Description *</span>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
                                className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class *</span>
                            <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select class</option>
                                {classes.map((c) => <option key={c._id} value={c._id}>{c.name || c.className}</option>)}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject</span>
                            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Deadline</span>
                            <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Max Score</span>
                            <input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" disabled={saving}
                            className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                            {saving ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading assignments...</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map((a) => (
                        <div key={a._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-white">{a.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{a.description}</p>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {a.classId?.name || a.className || 'N/A'} · {a.subject || 'N/A'}
                                        {a.deadline && ` · Due: ${new Date(a.deadline).toLocaleDateString()}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDelete(a._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {assignments.length === 0 && <p className="text-slate-400">No assignments found.</p>}
                </div>
            )}
        </main>
    )
}
