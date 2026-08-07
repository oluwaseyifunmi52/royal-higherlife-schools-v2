import { useEffect, useState } from 'react'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../services/subjectService'

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', code: '', description: '', category: '' })

    const fetchSubjects = async () => {
        setLoading(true)
        try {
            const res = await getSubjects()
            setSubjects(res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load subjects' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSubjects() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateSubject(editing._id, form)
                setMessage({ type: 'success', text: 'Subject updated' })
            } else {
                await createSubject(form)
                setMessage({ type: 'success', text: 'Subject created' })
            }
            setShowForm(false)
            setEditing(null)
            setForm({ name: '', code: '', description: '', category: '' })
            fetchSubjects()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this subject?')) return
        try {
            await deleteSubject(id)
            fetchSubjects()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Subjects</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', code: '', description: '', category: '' }) }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Subject'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Subject' : 'Create Subject'}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject Name *</span>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Mathematics" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject Code</span>
                            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="MATH" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Category</span>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Category</option>
                                <option value="core">Core</option>
                                <option value="elective">Elective</option>
                                <option value="vocational">Vocational</option>
                                <option value="extracurricular">Extracurricular</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Description</span>
                            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update' : 'Create Subject'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading subjects...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        {subjects.map((subj) => (
                            <div key={subj._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                                <h3 className="text-lg font-semibold text-white">{subj.name}</h3>
                                {subj.code && <p className="text-sm text-slate-400">Code: {subj.code}</p>}
                                {subj.category && <p className="text-sm text-slate-400">Category: {subj.category}</p>}
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => { setEditing(subj); setForm({ name: subj.name, code: subj.code || '', description: subj.description || '', category: subj.category || '' }); setShowForm(true) }}
                                        className="text-sm font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                    <button onClick={() => handleDelete(subj._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                </div>
                            </div>
                        ))}
                        {subjects.length === 0 && <p className="text-slate-400">No subjects found.</p>}
                    </div>
                </div>
            )}
        </main>
    )
}
