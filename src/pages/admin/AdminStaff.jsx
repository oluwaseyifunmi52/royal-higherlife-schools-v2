import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStaff, getPendingStaff, updateStaffStatus, deleteStaff, getStaffMember, updateStaff } from '../../services/adminService'

const statusLabels = {
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
    rejected: 'Rejected',
}
const statusColors = {
    pending: 'bg-amber-500/10 text-amber-300',
    active: 'bg-green-500/10 text-green-300',
    inactive: 'bg-red-500/10 text-red-300',
    rejected: 'bg-red-500/10 text-red-400',
}

export default function AdminStaff() {
    const [allStaff, setAllStaff] = useState([])
    const [pendingStaff, setPendingStaff] = useState([])
    const [tab, setTab] = useState('all')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [editing, setEditing] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [allRes, pendingRes] = await Promise.allSettled([getStaff({ limit: 500 }), getPendingStaff()])
            if (allRes.status === 'fulfilled') setAllStaff(allRes.value.data?.data?.staff || [])
            if (pendingRes.status === 'fulfilled') setPendingStaff(pendingRes.value.data?.staff || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load staff' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleStatus = async (staff, status) => {
        setMessage({ type: '', text: '' })
        try {
            await updateStaffStatus(staff._id, status)
            setMessage({ type: 'success', text: `Status updated to ${status}` })
            fetchAll()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' })
        }
    }

    const handleDelete = async (staff) => {
        if (!window.confirm(`Delete ${staff.name || staff.email}?`)) return
        setDeleting(staff._id)
        try {
            await deleteStaff(staff._id)
            setMessage({ type: 'success', text: 'Staff deleted' })
            fetchAll()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        } finally {
            setDeleting(null)
        }
    }

    const openEdit = async (staff) => {
        try {
            const res = await getStaffMember(staff._id)
            const data = res.data?.data || res.data
            setEditing(data)
            setEditForm({ firstName: data.firstName || '', lastName: data.lastName || '', phone: data.phone || '' })
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Could not load staff' })
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateStaff(editing._id, editForm)
            setMessage({ type: 'success', text: 'Staff updated' })
            setEditing(null)
            fetchAll()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' })
        } finally {
            setSaving(false)
        }
    }

    const display = tab === 'pending' ? pendingStaff : allStaff

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Staff Management</h1>
                    <p className="mt-3 text-lg text-slate-400">View, approve, edit, and manage teachers and bursars.</p>
                </div>
                <Link to="/admin/dashboard" className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    Dashboard
                </Link>
            </div>

            {message.text && (
                <div
                    className={
                        'mb-6 rounded-2xl border px-4 py-3 text-sm ' +
                        (message.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300')
                    }
                >
                    {message.text}
                </div>
            )}

            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setTab('all')}
                    className={'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' + (tab === 'all' ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400 hover:text-white')}
                >
                    All Staff ({allStaff.length})
                </button>
                <button
                    onClick={() => setTab('pending')}
                    className={'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' + (tab === 'pending' ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400 hover:text-white')}
                >
                    Pending Approval ({pendingStaff.length})
                </button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading staff...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.15em] text-slate-400">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {display.map((s) => (
                                    <tr key={s._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{s.name || `${s.firstName || ''} ${s.lastName || ''}`}</td>
                                        <td className="px-4 py-3 capitalize">{s.role}</td>
                                        <td className="px-4 py-3 text-slate-400">{s.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={'inline-block rounded-full px-2.5 py-1 text-xs font-semibold ' + (statusColors[s.status] || statusColors.pending)}>
                                                {statusLabels[s.status] || s.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => openEdit(s)} className="text-xs font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                                {s.status === 'pending' && (
                                                    <button onClick={() => handleStatus(s, 'active')} className="text-xs font-semibold text-green-400 hover:text-green-300">Approve</button>
                                                )}
                                                {s.status !== 'rejected' && (
                                                    <button onClick={() => handleStatus(s, 'rejected')} className="text-xs font-semibold text-red-400 hover:text-red-300">Reject</button>
                                                )}
                                                {s.isActive !== false && s.status === 'active' && (
                                                    <button onClick={() => handleStatus(s, 'inactive')} className="text-xs font-semibold text-red-400 hover:text-red-300">Deactivate</button>
                                                )}
                                                {s.status === 'inactive' && (
                                                    <button onClick={() => handleStatus(s, 'active')} className="text-xs font-semibold text-green-400 hover:text-green-300">Activate</button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(s)}
                                                    disabled={deleting === s._id}
                                                    className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
                                                >
                                                    {deleting === s._id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {display.length === 0 && <p className="mt-4 text-sm text-slate-400">No staff found.</p>}
                    </div>
                </div>
            )}

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-white">Edit Staff</h2>
                        <p className="mt-1 text-sm text-slate-400">Role and account status cannot be changed here.</p>
                        <div className="mt-4 space-y-4">
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">First Name</span>
                                <input
                                    type="text"
                                    value={editForm.firstName || ''}
                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Last Name</span>
                                <input
                                    type="text"
                                    value={editForm.lastName || ''}
                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Phone</span>
                                <input
                                    type="tel"
                                    value={editForm.phone || ''}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                />
                            </label>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => setEditing(null)}
                                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
