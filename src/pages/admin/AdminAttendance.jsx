import { useEffect, useState } from 'react'
import { getAttendance, updateAttendance } from '../../services/attendanceService'

export default function AdminAttendance() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [filters, setFilters] = useState({ class: '', date: '', term: '' })

    const fetchAttendance = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.class) params.class = filters.class
            if (filters.date) params.date = filters.date
            if (filters.term) params.term = filters.term
            const res = await getAttendance(params)
            setRecords(res.data.data?.attendance || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load attendance' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAttendance() }, [])

    const handleCorrect = async (id, newStatus) => {
        try {
            await updateAttendance(id, { status: newStatus })
            setMessage({ type: 'success', text: 'Attendance corrected' })
            fetchAttendance()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Correction failed' })
        }
    }

    const statusColors = {
        present: 'bg-green-500/10 text-green-300',
        absent: 'bg-red-500/10 text-red-300',
        late: 'bg-amber-500/10 text-amber-300',
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Attendance Records</h1>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Class</span>
                        <input value={filters.class} onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Date</span>
                        <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Term</span>
                        <select value={filters.term} onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Terms</option>
                            <option value="First Term">First Term</option>
                            <option value="Second Term">Second Term</option>
                            <option value="Third Term">Third Term</option>
                        </select>
                    </label>
                </div>
                <button onClick={fetchAttendance} disabled={loading}
                    className="mt-4 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                    {loading ? 'Loading...' : 'Search'}
                </button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading attendance...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Remarks</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((rec) => (
                                    <tr key={rec._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{rec.studentName || rec.studentId?.name || 'N/A'}</td>
                                        <td className="px-4 py-3">{rec.class || rec.classId?.name || 'N/A'}</td>
                                        <td className="px-4 py-3">{rec.date ? new Date(rec.date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[rec.status] || 'bg-slate-500/10 text-slate-400'}`}>
                                                {rec.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{rec.remarks || '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {rec.status !== 'present' && (
                                                    <button onClick={() => handleCorrect(rec._id, 'present')} className="text-xs font-semibold text-green-400">Present</button>
                                                )}
                                                {rec.status !== 'absent' && (
                                                    <button onClick={() => handleCorrect(rec._id, 'absent')} className="text-xs font-semibold text-red-400">Absent</button>
                                                )}
                                                {rec.status !== 'late' && (
                                                    <button onClick={() => handleCorrect(rec._id, 'late')} className="text-xs font-semibold text-amber-400">Late</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {records.length === 0 && <p className="mt-4 text-sm text-slate-400">No attendance records found.</p>}
                </div>
            )}
        </main>
    )
}
