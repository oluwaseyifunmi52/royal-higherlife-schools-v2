import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPaymentDashboardStats, getAllPayments } from '../../services/paymentService'

const methodLabels = {
    cash: 'Cash', bank_transfer: 'Bank Transfer', pos: 'POS',
    paystack: 'Paystack', flutterwave: 'Flutterwave', other: 'Other',
}

export default function BursarDashboard() {
    const [stats, setStats] = useState(null)
    const [recentPayments, setRecentPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, paymentsRes] = await Promise.allSettled([
                    getPaymentDashboardStats({ session: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}` }),
                    getAllPayments({ limit: 10 }),
                ])
                if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data)
                if (paymentsRes.status === 'fulfilled') setRecentPayments(paymentsRes.value.data.data?.payments || [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Bursar Dashboard</h1>
                    <p className="mt-3 text-lg text-slate-400">Manage fees, payments, and financial reports.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/bursar/record-payment" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">+ Record Payment</Link>
                    <Link to="/bursar/reports" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Reports</Link>
                </div>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading dashboard data...</p>
            ) : (
                <>
                    <section className="grid gap-4 md:grid-cols-4 mb-8">
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Total Collected</p>
                            <p className="mt-2 text-2xl font-bold text-white">{fmt(stats?.totalCollected)}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Today&apos;s Collection</p>
                            <p className="mt-2 text-2xl font-bold text-white">{fmt(stats?.todayPayments?.total)}</p>
                            <p className="text-xs text-slate-500">{stats?.todayPayments?.count || 0} transactions</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-green-500/30 bg-green-500/5 p-5">
                            <p className="text-sm text-green-300">Fully Paid Students</p>
                            <p className="mt-2 text-2xl font-bold text-white">{stats?.fullyPaid || 0}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/5 p-5">
                            <p className="text-sm text-red-300">Outstanding Fees</p>
                            <p className="mt-2 text-2xl font-bold text-white">{stats?.unpaid || 0} students</p>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-5 mb-8">
                        {stats?.byMethod?.map((m) => (
                            <div key={m._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                                <p className="text-sm text-slate-400">{methodLabels[m._id] || m._id}</p>
                                <p className="mt-2 text-xl font-bold text-white">{fmt(m.total)}</p>
                                <p className="text-xs text-slate-500">{m.count} payments</p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-semibold text-white">Recent Payments</h2>
                            <Link to="/bursar/payment-history" className="text-sm font-semibold text-amber-400">View All</Link>
                        </div>
                        {recentPayments.length === 0 ? (
                            <p className="text-slate-400">No payments recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentPayments.map((p) => (
                                    <div key={p._id} className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                        <div>
                                            <p className="font-semibold text-white">{p.studentId?.name || 'Student'}</p>
                                            <p className="text-sm text-slate-400">{p.receiptNumber || 'N/A'} · {new Date(p.paymentDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">₦{p.amount?.toLocaleString()}</p>
                                            <p className="text-sm text-slate-400">{methodLabels[p.paymentMethod] || p.paymentMethod}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    )
}
