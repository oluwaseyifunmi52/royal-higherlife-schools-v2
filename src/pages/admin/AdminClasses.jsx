import { useEffect, useState } from 'react'
import { getClasses, createClass, updateClass, deleteClass } from '../../services/classService'

export default function AdminClasses() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', section: '', teacher: '', capacity: '' })

    const fetchClasses = async () => {
        setLoading(true)
        try {
            const res = await getClasses()
            setClasses(res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load classes' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchClasses() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateClass(editing._id, form)
                setMessage({ type: 'success', text: 'Class updated successfully' })
            } else {
                await createClass(form)
                setMessage({ type: 'success', text: 'Class created successfully' })
            }
            setShowForm(false)
            setEditing(null)
            setForm({ name: '', section: '', teacher: '', capacity: '' })
            fetchClasses()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const handleEdit = (cls) => {
        setEditing(cls)
        setForm({ name: cls.name || '', section: cls.section || '', teacher: cls.teacher?.name || cls.teacher || '', capacity: cls.capacity || '' })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this class?')) return
        try {
            await deleteClass(id)
            setMessage({ type: 'success', text: 'Class deleted' })
            fetchClasses()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Classes</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', section: '', teacher: '', capacity: '' }) }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Class'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Class' : 'Create Class'}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class Name *</span>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. Basic 5" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Section</span>
                            <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. A" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Assigned Teacher</span>
                            <input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Teacher name or ID" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Capacity</span>
                            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="40" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update Class' : 'Create Class'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading classes...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        {classes.map((cls) => (
                            <div key={cls._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                                <h3 className="text-lg font-semibold text-white">{cls.name}</h3>
                                {cls.section && <p className="text-sm text-slate-400">Section: {cls.section}</p>}
                                <p className="text-sm text-slate-400">Teacher: {cls.teacher?.name || cls.teacher || 'Unassigned'}</p>
                                {cls.capacity && <p className="text-sm text-slate-400">Capacity: {cls.capacity}</p>}
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => handleEdit(cls)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                    <button onClick={() => handleDelete(cls._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                </div>
                            </div>
                        ))}
                        {classes.length === 0 && <p className="text-slate-400">No classes found.</p>}
                    </div>
                </div>
            )}
        </main>
    )
}
