import { useEffect, useState } from 'react'
import { getStudents, deactivateStudent, activateStudent } from '../../services/studentService'

export default function AdminStudents() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editingStudent, setEditingStudent] = useState(null)
    const [form, setForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const res = await getStudents({ limit: 500 })
            setStudents(res.data.data?.students || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load students' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStudents() }, [])

    const filtered = students.filter((s) => {
        const q = search.toLowerCase()
        return (
            s.name?.toLowerCase().includes(q) ||
            s.firstName?.toLowerCase().includes(q) ||
            s.lastName?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q) ||
            s.studentProfile?.admissionNumber?.toLowerCase().includes(q)
        )
    })

    const handleEdit = (student) => {
        setEditingStudent(student)
        setForm({
            firstName: student.firstName || student.name?.split(' ')[0] || '',
            lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || '',
            email: student.email || '',
            phone: student.phone || student.studentProfile?.phone || '',
            class: student.studentProfile?.class || student.class || '',
            house: student.studentProfile?.house || '',
            admissionNumber: student.studentProfile?.admissionNumber || '',
        })
        setMessage({ type: '', text: '' })
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const api = (await import('../../api/axios')).default
            await api.put(`/api/students/${editingStudent._id}`, form)
            setMessage({ type: 'success', text: 'Student updated successfully' })
            setEditingStudent(null)
            fetchStudents()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update student' })
        } finally {
            setSaving(false)
        }
    }

    const handleToggleActive = async (student) => {
        try {
            if (student.isActive === false || student.status === 'inactive') {
                await activateStudent(student._id)
            } else {
                await deactivateStudent(student._id)
            }
            fetchStudents()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Students</h1>
                    <p className="mt-3 text-lg text-slate-400">View, edit, and manage all student records.</p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500"
                    placeholder="Search by name, email, or admission number..."
                />
            </div>

            {loading ? (
                <p className="text-slate-400">Loading students...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Admission No.</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => (
                                    <tr key={s._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{s.name || `${s.firstName || ''} ${s.lastName || ''}`}</td>
                                        <td className="px-4 py-3 font-mono text-xs">{s.studentProfile?.admissionNumber || 'N/A'}</td>
                                        <td className="px-4 py-3">{s.studentProfile?.class || s.class || 'N/A'}</td>
                                        <td className="px-4 py-3 text-slate-400">{s.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                s.isActive !== false && s.status !== 'inactive' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
                                            }`}>
                                                {s.isActive !== false && s.status !== 'inactive' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(s)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                                <button onClick={() => handleToggleActive(s)} className="text-sm font-semibold text-red-400 hover:text-red-300">
                                                    {s.isActive !== false && s.status !== 'inactive' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && <p className="mt-4 text-sm text-slate-400">No students found.</p>}
                </div>
            )}

            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-white">Edit Student</h2>
                        <div className="mt-4 space-y-4">
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">First Name</span>
                                <input value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Last Name</span>
                                <input value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Email</span>
                                <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Phone</span>
                                <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Class</span>
                                <input value={form.class || ''} onChange={(e) => setForm({ ...form, class: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">House</span>
                                <input value={form.house || ''} onChange={(e) => setForm({ ...form, house: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={handleSave} disabled={saving}
                                className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditingStudent(null)}
                                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
