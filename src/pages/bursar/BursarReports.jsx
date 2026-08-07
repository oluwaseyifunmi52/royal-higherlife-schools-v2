import { useEffect, useState } from 'react'
import { getPaymentReports } from '../../services/paymentService'

const methodLabels = {
    cash: 'Cash', bank_transfer: 'Bank Transfer', pos: 'POS',
    paystack: 'Paystack', flutterwave: 'Flutterwave', other: 'Other',
}

export default function BursarReports() {
    const [payments, setPayments] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        startDate: '', endDate: '', paymentMethod: '', term: '',
        session: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    })

    const fetchReport = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.startDate) params.startDate = filters.startDate
            if (filters.endDate) params.endDate = filters.endDate
            if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod
            if (filters.term) params.term = filters.term
            if (filters.session) params.session = filters.session
            const res = await getPaymentReports(params)
            setPayments(res.data.data?.payments || [])
            setSummary(res.data.data?.summary || null)
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchReport() }, [])

    const handleExportCSV = () => {
        if (payments.length === 0) return
        const headers = ['Date', 'Student', 'Receipt No', 'Amount', 'Method', 'Fee Type', 'Term', 'Session']
        const rows = payments.map((p) => [
            new Date(p.paymentDate).toLocaleDateString(), p.studentId?.name || '', p.receiptNumber || '',
            p.amount, methodLabels[p.paymentMethod] || p.paymentMethod, p.feeType || '', p.term, p.session,
        ])
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bursar-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Payment Reports</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Print</button>
                    <button onClick={handleExportCSV} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Export CSV</button>
                </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 mb-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Start Date</span>
                        <input type="date" name="startDate" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">End Date</span>
                        <input type="date" name="endDate" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Payment Method</span>
                        <select name="paymentMethod" value={filters.paymentMethod} onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Methods</option>
                            {Object.entries(methodLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Term</span>
                        <select name="term" value={filters.term} onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Terms</option>
                            <option value="First Term">First Term</option>
                            <option value="Second Term">Second Term</option>
                            <option value="Third Term">Third Term</option>
                        </select>
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Session</span>
                        <input type="text" name="session" value={filters.session} onChange={(e) => setFilters({ ...filters, session: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                </div>
                <button onClick={fetchReport} disabled={loading}
                    className="mt-4 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                    {loading ? 'Loading...' : 'Generate Report'}
                </button>
            </div>

            {summary && (
                <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Total Collected</p>
                        <p className="mt-2 text-2xl font-bold text-white">₦{summary.total?.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">{summary.count} payments</p>
                    </div>
                    {summary.byMethod?.map((m) => (
                        <div key={m._id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">{methodLabels[m._id] || m._id}</p>
                            <p className="mt-2 text-2xl font-bold text-white">₦{m.total?.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">{m.count} payments</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Report Results</h2>
                {loading ? (
                    <p className="text-slate-400">Loading...</p>
                ) : payments.length === 0 ? (
                    <p className="text-slate-400">No payments found for the selected filters.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Receipt</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">Fee Type</th>
                                    <th className="px-4 py-3">Term</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{p.studentId?.name || 'N/A'}</td>
                                        <td className="px-4 py-3 font-mono text-xs">{p.receiptNumber || 'N/A'}</td>
                                        <td className="px-4 py-3 font-semibold">₦{p.amount?.toLocaleString()}</td>
                                        <td className="px-4 py-3">{methodLabels[p.paymentMethod] || p.paymentMethod}</td>
                                        <td className="px-4 py-3">{p.feeType || 'N/A'}</td>
                                        <td className="px-4 py-3">{p.term}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-700 font-bold text-white">
                                    <td className="px-4 py-3" colSpan={3}>TOTAL</td>
                                    <td className="px-4 py-3">₦{summary?.total?.toLocaleString() || '0'}</td>
                                    <td className="px-4 py-3" colSpan={3}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )
}
