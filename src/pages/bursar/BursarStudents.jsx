import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchStudents } from '../../services/studentService'
import { getStudentFeeSummary, getStudentPayments } from '../../services/paymentService'

export default function BursarStudents() {
    const [query, setQuery] = useState('')
    const [students, setStudents] = useState([])
    const [selected, setSelected] = useState(null)
    const [summary, setSummary] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchDone, setSearchDone] = useState(false)

    const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

    const runSearch = async (q) => {
        if (!q || q.trim().length < 2) { setStudents([]); return }
        setLoading(true)
        setSearchDone(true)
        try {
            const res = await searchStudents({ q })
            const data = res.data?.data || res.data || []
            setStudents(Array.isArray(data) ? data : (data.students || []))
        } catch {
            setStudents([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const t = setTimeout(() => runSearch(query), 250)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    const viewStudent = async (student) => {
        setSelected(student)
        setSummary(null)
        setHistory([])
        try {
            const [sRes, hRes] = await Promise.allSettled([
                getStudentFeeSummary(student._id),
                getStudentPayments(student._id, { limit: 50 }),
            ])
            if (sRes.status === 'fulfilled') setSummary(sRes.value.data?.data || sRes.value.data)
            if (hRes.status === 'fulfilled') setHistory(hRes.value.data?.data?.payments || hRes.value.data?.payments || [])
        } catch { /* ignore */ }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Students</h1>
                    <p className="mt-3 text-lg text-slate-400">
                        Search students by name, admission number, or class to view fee balances and payment history.
                    </p>
                </div>
                <Link to="/bursar/dashboard" className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    Dashboard
                </Link>
            </div>

            <div className="mb-6">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full max-w-md rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500"
                    placeholder="Search by name or admission number (min 2 chars)..."
                />
            </div>

            {loading && <p className="text-slate-400">Searching students...</p>}

            {!selected && searchDone && !loading && (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    {students.length === 0 ? (
                        <p className="text-slate-400">No students found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.15em] text-slate-400">
                                        <th className="px-3 py-3">Student</th>
                                        <th className="px-3 py-3">Admission</th>
                                        <th className="px-3 py-3">Class</th>
                                        <th className="px-3 py-3">Email</th>
                                        <th className="px-3 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s._id} className="border-t border-slate-800 text-slate-300">
                                            <td className="px-3 py-3 font-medium text-white">{s.name || s.firstName}</td>
                                            <td className="px-3 py-3 text-slate-400">{s.studentProfile?.admissionNumber || '—'}</td>
                                            <td className="px-3 py-3">{s.studentProfile?.class || '—'}</td>
                                            <td className="px-3 py-3 text-slate-400">{s.email || '—'}</td>
                                            <td className="px-3 py-3 text-right">
                                                <button
                                                    onClick={() => viewStudent(s)}
                                                    className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400"
                                                >
                                                    View Fees
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {selected && (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">
                                {selected.studentProfile?.admissionNumber || '—'}
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold text-white">{selected.name || selected.firstName}</h2>
                            <p className="text-slate-400">{selected.studentProfile?.class || 'No class assigned'}</p>
                        </div>
                        <button
                            onClick={() => setSelected(null)}
                            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            ← Back to Search
                        </button>
                    </div>

                    {summary && (
                        <div className="grid gap-4 mb-8 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                                <p className="text-sm text-slate-400">Total Fees</p>
                                <p className="mt-2 text-2xl font-bold text-white">{fmt(summary.totalFees)}</p>
                            </div>
                            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
                                <p className="text-sm text-green-300">Total Paid</p>
                                <p className="mt-2 text-2xl font-bold text-white">{fmt(summary.totalPaid)}</p>
                            </div>
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                                <p className="text-sm text-red-300">Outstanding</p>
                                <p className="mt-2 text-2xl font-bold text-white">{fmt(summary.balance)}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-white">Payment History</h3>
                        {history.length === 0 ? (
                            <p className="text-slate-400">No payments recorded for this student.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.15em] text-slate-400">
                                            <th className="px-3 py-3">Date</th>
                                            <th className="px-3 py-3">Receipt</th>
                                            <th className="px-3 py-3">Amount</th>
                                            <th className="px-3 py-3">Method</th>
                                            <th className="px-3 py-3">Fee Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((p) => (
                                            <tr key={p._id} className="border-t border-slate-800 text-slate-300">
                                                <td className="px-3 py-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                                <td className="px-3 py-3 font-mono text-xs text-slate-400">{p.receiptNumber || '—'}</td>
                                                <td className="px-3 py-3 font-semibold text-white">{fmt(p.amount)}</td>
                                                <td className="px-3 py-3">{p.paymentMethod || '—'}</td>
                                                <td className="px-3 py-3">{p.feeType || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    )
}
