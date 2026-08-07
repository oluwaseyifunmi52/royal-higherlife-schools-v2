import { useEffect, useState } from 'react'
import { getMyAttendance } from '../../services/studentService'

export default function StudentAttendance() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyAttendance().then(res => setRecords(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const statusColors = {
        present: 'bg-green-500/10 text-green-300',
        absent: 'bg-red-500/10 text-red-300',
        late: 'bg-amber-500/10 text-amber-300',
        excused: 'bg-blue-500/10 text-blue-300',
    }

    const present = records.filter(r => r.status === 'present').length
    const total = records.length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Attendance</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Total Days</p>
                    <p className="mt-2 text-2xl font-bold text-white">{total}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Present</p>
                    <p className="mt-2 text-2xl font-bold text-green-300">{present}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Attendance Rate</p>
                    <p className="mt-2 text-2xl font-bold text-amber-400">{rate}%</p>
                </div>
            </div>

            {loading ? <p className="text-slate-400">Loading...</p> : records.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No attendance records found.</p>
                </div>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Remarks</th>
                                    <th className="px-4 py-3">Term</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-white">{r.class}</td>
                                        <td className="px-4 py-3">
                                            <span className={'rounded-full px-2.5 py-1 text-xs font-semibold ' + (statusColors[r.status] || '')}>
                                                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{r.remarks || '-'}</td>
                                        <td className="px-4 py-3 text-slate-400">{r.term} {r.session}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    )
}
