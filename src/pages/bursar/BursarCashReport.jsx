import { useEffect, useState } from 'react'
import { getCashReport } from '../../services/paymentService'

export default function BursarCashReport() {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        session: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        term: '',
    })

    const fetchReport = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.date) params.date = filters.date
            if (filters.session) params.session = filters.session
            if (filters.term) params.term = filters.term
            const res = await getCashReport(params)
            setReport(res.data.data)
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchReport() }, [])

    const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Cash Report</h1>
            </div>

            <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Date</span>
                        <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Session</span>
                        <input value={filters.session} onChange={(e) => setFilters({ ...filters, session: e.target.value })}
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
                <button onClick={fetchReport} disabled={loading}
                    className="mt-4 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                    {loading ? 'Loading...' : 'Generate Report'}
                </button>
            </div>

            {report && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Total Cash Collected</p>
                        <p className="mt-2 text-2xl font-bold text-white">{fmt(report.totalCash)}</p>
                        <p className="text-xs text-slate-500">{report.cashCount || 0} payments</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Cash Payments Today</p>
                        <p className="mt-2 text-2xl font-bold text-white">{fmt(report.todayCash)}</p>
                        <p className="text-xs text-slate-500">{report.todayCashCount || 0} transactions</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Report Period</p>
                        <p className="mt-2 text-lg font-bold text-white">{filters.date || 'All Time'}</p>
                        <p className="text-xs text-slate-500">{filters.session} {filters.term}</p>
                    </div>
                </div>
            )}
        </main>
    )
}
