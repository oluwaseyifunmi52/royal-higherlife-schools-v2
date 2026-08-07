import { useEffect, useState } from 'react'
import { getFees, createFee, updateFee, deleteFee } from '../../services/feeService'
import { CLASS_CATEGORIES, ALL_CLASSES } from '../../config/classes'

export default function BursarFees() {
    const [fees, setFees] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', amount: '', class: '', term: '', session: '', description: '' })
    const [filterCategory, setFilterCategory] = useState('')

    const fetchFees = async () => {
        setLoading(true)
        try {
            const res = await getFees()
            setFees(res.data.data?.fees || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load fees' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchFees() }, [])

    const filteredFees = fees.filter(fee => {
        if (!filterCategory) return true
        const feeClass = fee.class
        if (!feeClass) return filterCategory === 'All'
        const category = Object.keys(CLASS_CATEGORIES).find(cat => CLASS_CATEGORIES[cat].includes(feeClass))
        return category === filterCategory || (filterCategory === 'All' && !category)
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateFee(editing._id, { ...form, amount: Number(form.amount) })
                setMessage({ type: 'success', text: 'Fee updated' })
            } else {
                await createFee({ ...form, amount: Number(form.amount) })
                setMessage({ type: 'success', text: 'Fee created' })
            }
            setShowForm(false)
            setEditing(null)
            setForm({ name: '', amount: '', class: '', term: '', session: '', description: '' })
            fetchFees()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this fee record?')) return
        try {
            await deleteFee(id)
            fetchFees()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Fee Management</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null) }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ Create Fee'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 flex flex-wrap gap-3">
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white">
                    <option value="">All Categories</option>
                    <option value="All">All Classes (including no class)</option>
                    {Object.keys(CLASS_CATEGORIES).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Fee' : 'Create Fee'}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Fee Name *</span>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="School Fees" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Amount (₦) *</span>
                            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="1"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="50000" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class *</span>
                            <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Class</option>
                                {Object.entries(CLASS_CATEGORIES).flatMap(([cat, classes]) => [
                                    <optgroup key={cat} label={cat}>
                                        {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                    </optgroup>
                                ])}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Term</span>
                            <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Term</option>
                                <option value="First Term">First Term</option>
                                <option value="Second Term">Second Term</option>
                                <option value="Third Term">Third Term</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Session</span>
                            <input value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="2026/2027" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Description</span>
                            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update' : 'Create Fee'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading fees...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Fee Name</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Term</th>
                                    <th className="px-4 py-3">Session</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFees.map((fee) => (
                                    <tr key={fee._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{fee.name}</td>
                                        <td className="px-4 py-3 font-semibold text-amber-400">₦{Number(fee.amount || 0).toLocaleString()}</td>
                                        <td className="px-4 py-3">{fee.class || 'All'}</td>
                                        <td className="px-4 py-3">{fee.term || 'N/A'}</td>
                                        <td className="px-4 py-3">{fee.session || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditing(fee); setForm({ name: fee.name, amount: fee.amount, class: fee.class || '', term: fee.term || '', session: fee.session || '', description: fee.description || '' }); setShowForm(true) }}
                                                    className="text-sm font-semibold text-amber-400">Edit</button>
                                                <button onClick={() => handleDelete(fee._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredFees.length === 0 && <p className="mt-4 text-sm text-slate-400">No fees found.</p>}
                </div>
            )}
        </main>
    )
}
