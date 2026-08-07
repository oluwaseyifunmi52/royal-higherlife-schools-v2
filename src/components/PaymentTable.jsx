import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const methodLabels = {
    cash: 'Cash',
    bank_transfer: 'Bank Transfer',
    pos: 'POS',
    paystack: 'Paystack',
    flutterwave: 'Flutterwave',
    other: 'Other',
}

const methodColors = {
    cash: 'bg-green-500/10 text-green-300',
    bank_transfer: 'bg-blue-500/10 text-blue-300',
    pos: 'bg-purple-500/10 text-purple-300',
    paystack: 'bg-amber-500/10 text-amber-300',
    flutterwave: 'bg-red-500/10 text-red-300',
    other: 'bg-slate-500/10 text-slate-300',
}

const statusColors = {
    paid: 'bg-green-500/10 text-green-300',
    pending: 'bg-amber-500/10 text-amber-300',
    reversed: 'bg-red-500/10 text-red-300',
    cancelled: 'bg-slate-500/10 text-slate-400',
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatAmount(amount) {
    return `₦${Number(amount || 0).toLocaleString()}`
}

export default function PaymentTable({ payments = [], loading, searchable = true, showFilters = true, viewPath, pageSize = 15 }) {
    const [search, setSearch] = useState('')
    const [methodFilter, setMethodFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        let result = [...payments]
        if (search) {
            const q = search.toLowerCase()
            result = result.filter((p) =>
                (p.studentName || '').toLowerCase().includes(q) ||
                (p.admissionNumber || '').toLowerCase().includes(q) ||
                (p.receiptNumber || '').toLowerCase().includes(q) ||
                (p.reference || '').toLowerCase().includes(q) ||
                (p.feeType || '').toLowerCase().includes(q)
            )
        }
        if (methodFilter) result = result.filter((p) => p.paymentMethod === methodFilter)
        if (statusFilter) result = result.filter((p) => p.status === statusFilter)
        return result
    }, [payments, search, methodFilter, statusFilter])

    const totalPages = Math.ceil(filtered.length / pageSize)
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

    if (loading) {
        return (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 rounded-2xl bg-slate-800/50 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
            {(searchable || showFilters) && (
                <div className="mb-6 flex flex-wrap gap-3">
                    {searchable && (
                        <div className="relative flex-1 min-w-[200px]">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                className="w-full rounded-full border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500"
                                placeholder="Search by name, admission no., receipt no..."
                            />
                        </div>
                    )}
                    {showFilters && (
                        <>
                            <select value={methodFilter} onChange={(e) => { setMethodFilter(e.target.value); setPage(1) }}
                                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                <option value="">All Methods</option>
                                <option value="cash">Cash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="pos">POS</option>
                                <option value="paystack">Paystack</option>
                                <option value="flutterwave">Flutterwave</option>
                                <option value="other">Other</option>
                            </select>
                            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                <option value="">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="reversed">Reversed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </>
                    )}
                </div>
            )}

            {paginated.length === 0 ? (
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-8 text-center">
                    <FiFilter className="mx-auto text-2xl text-slate-600" />
                    <p className="mt-3 text-sm text-slate-400">No payments found.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.15em] text-slate-400">
                                    <th className="px-3 py-3">Date</th>
                                    <th className="px-3 py-3">Student</th>
                                    <th className="px-3 py-3">Fee Type</th>
                                    <th className="px-3 py-3 text-right">Amount</th>
                                    <th className="px-3 py-3">Method</th>
                                    <th className="px-3 py-3">Receipt</th>
                                    <th className="px-3 py-3">Status</th>
                                    {viewPath && <th className="px-3 py-3"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((p) => (
                                    <tr key={p._id || p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                        <td className="px-3 py-3 text-slate-300">{formatDate(p.paymentDate || p.createdAt)}</td>
                                        <td className="px-3 py-3">
                                            <p className="font-medium text-white">{p.studentName || `${p.student?.firstName || ''} ${p.student?.lastName || ''}`}</p>
                                            <p className="text-xs text-slate-500">{p.admissionNumber || p.student?.admissionNumber || ''}</p>
                                        </td>
                                        <td className="px-3 py-3 text-slate-300">{p.feeType || 'School Fees'}</td>
                                        <td className="px-3 py-3 text-right font-semibold text-white">{formatAmount(p.amount)}</td>
                                        <td className="px-3 py-3">
                                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${methodColors[p.paymentMethod] || 'bg-slate-500/10 text-slate-300'}`}>
                                                {methodLabels[p.paymentMethod] || p.paymentMethod || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 font-mono text-xs text-slate-400">{p.receiptNumber || p.reference || '—'}</td>
                                        <td className="px-3 py-3">
                                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[p.status] || 'bg-slate-500/10 text-slate-300'}`}>
                                                {p.status || 'N/A'}
                                            </span>
                                        </td>
                                        {viewPath && (
                                            <td className="px-3 py-3">
                                                <Link to={`${viewPath}/${p._id || p.id}`} className="text-sm font-semibold text-amber-400 hover:text-amber-300">
                                                    View
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-xs text-slate-500">
                                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="rounded-full border border-slate-700 p-2 text-slate-400 hover:text-white disabled:opacity-30">
                                    <FiChevronLeft />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum
                                    if (totalPages <= 5) pageNum = i + 1
                                    else if (page <= 3) pageNum = i + 1
                                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                                    else pageNum = page - 2 + i
                                    return (
                                        <button key={pageNum} onClick={() => setPage(pageNum)}
                                            className={`h-8 w-8 rounded-full text-xs font-medium ${page === pageNum ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400 hover:text-white'}`}>
                                            {pageNum}
                                        </button>
                                    )
                                })}
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="rounded-full border border-slate-700 p-2 text-slate-400 hover:text-white disabled:opacity-30">
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
