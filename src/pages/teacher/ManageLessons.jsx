import { useEffect, useState } from 'react'
import { getLessons, createLesson, deleteLesson } from '../../services/lessonService'
import { getMyAssignedClasses } from '../../services/teacherService'

export default function ManageLessons() {
    const [classes, setClasses] = useState([])
    const [lessons, setLessons] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [form, setForm] = useState({ title: '', description: '', classId: '', subject: '', type: 'notes', content: '' })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [clsRes, lessonRes] = await Promise.allSettled([getMyAssignedClasses(), getLessons()])
            if (clsRes.status === 'fulfilled') setClasses(clsRes.value.data.data?.classes || clsRes.value.data.data || [])
            if (lessonRes.status === 'fulfilled') setLessons(lessonRes.value.data.data?.lessons || lessonRes.value.data.data || [])
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await createLesson(form)
            setMessage({ type: 'success', text: 'Lesson created' })
            setShowForm(false)
            setForm({ title: '', description: '', classId: '', subject: '', type: 'notes', content: '' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create lesson' })
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this lesson?')) return
        try { await deleteLesson(id); fetchData() } catch { /* ignore */ }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Lessons</h1>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Lesson'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Create Lesson</h2>
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
                            <span className="mb-2 block">Type</span>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="notes">Notes</option>
                                <option value="video">Video</option>
                                <option value="pdf">PDF</option>
                                <option value="link">Link</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Content / URL</span>
                            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" disabled={saving}
                            className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                            {saving ? 'Creating...' : 'Create Lesson'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading lessons...</p>
            ) : (
                <div className="space-y-4">
                    {lessons.map((lesson) => (
                        <div key={lesson._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-white">{lesson.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{lesson.description || 'No description'}</p>
                                    <p className="text-xs text-slate-500 mt-1">{lesson.classId?.name || lesson.className || 'N/A'} · {lesson.subject || 'N/A'} · {lesson.type || 'notes'}</p>
                                </div>
                                <button onClick={() => handleDelete(lesson._id)} className="text-sm font-semibold text-red-400">Delete</button>
                            </div>
                        </div>
                    ))}
                    {lessons.length === 0 && <p className="text-slate-400">No lessons found.</p>}
                </div>
            )}
        </main>
    )
}
