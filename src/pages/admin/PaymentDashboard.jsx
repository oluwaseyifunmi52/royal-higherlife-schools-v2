import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const methodLabels = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  pos: 'POS',
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
  other: 'Other',
}

export default function PaymentDashboard() {
  const [stats, setStats] = useState(null)
  const [recentPayments, setRecentPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`)
  const [term, setTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = (await import('../../api/axios')).default
        const params = {}
        if (session) params.session = session
        if (term) params.term = term

        const [statsRes, paymentsRes] = await Promise.allSettled([
          api.get('/api/payments/dashboard-stats', { params }),
          api.get('/api/payments', { params: { ...params, limit: 10 } }),
        ])
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data.data)
        }
        if (paymentsRes.status === 'fulfilled') {
          setRecentPayments(paymentsRes.value.data.data?.payments || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [session, term])

  const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Payment Management</h1>
          <p className="mt-3 text-lg text-slate-400">Monitor all payments, record manual transactions, and generate reports.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/payments/record" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">+ Record Payment</Link>
          <Link to="/admin/payments/reports" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Reports</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <label className="text-sm text-slate-400">
          <span className="mb-1 block">Session</span>
          <input value={session} onChange={(e) => setSession(e.target.value)} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-white" placeholder="2026/2027" />
        </label>
        <label className="text-sm text-slate-400">
          <span className="mb-1 block">Term</span>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-white">
            <option value="">All Terms</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading dashboard...</p>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-4 mb-8">
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Total Collected</p>
              <p className="mt-2 text-2xl font-bold text-white">{fmt(stats?.totalCollected)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Today&apos;s Payments</p>
              <p className="mt-2 text-2xl font-bold text-white">{fmt(stats?.todayPayments?.total)}</p>
              <p className="text-xs text-slate-500">{stats?.todayPayments?.count || 0} transactions</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">This Week</p>
              <p className="mt-2 text-2xl font-bold text-white">{fmt(stats?.weekPayments?.total)}</p>
              <p className="text-xs text-slate-500">{stats?.weekPayments?.count || 0} transactions</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">This Month</p>
              <p className="mt-2 text-2xl font-bold text-white">{fmt(stats?.monthPayments?.total)}</p>
              <p className="text-xs text-slate-500">{stats?.monthPayments?.count || 0} transactions</p>
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

          <section className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="rounded-[1.5rem] border border-green-500/30 bg-green-500/5 p-5">
              <p className="text-sm text-green-300">Fully Paid Students</p>
              <p className="mt-2 text-2xl font-bold text-white">{stats?.fullyPaid || 0}</p>
            </div>
            <div className="rounded-[1.5rem] border border-amber-500/30 bg-amber-500/5 p-5">
              <p className="text-sm text-amber-300">Partially Paid</p>
              <p className="mt-2 text-2xl font-bold text-white">{stats?.partiallyPaid || 0}</p>
            </div>
            <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/5 p-5">
              <p className="text-sm text-red-300">Unpaid Students</p>
              <p className="mt-2 text-2xl font-bold text-white">{stats?.unpaid || 0}</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Payments</h2>
            {recentPayments.length === 0 ? (
              <p className="text-slate-400">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((p) => (
                  <Link
                    key={p._id}
                    to={`/admin/payments/${p._id}`}
                    className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-white">{p.studentId?.name || 'Student'}</p>
                      <p className="text-sm text-slate-400">{p.receiptNumber || 'N/A'} · {new Date(p.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₦{p.amount?.toLocaleString()}</p>
                      <p className="text-sm text-slate-400">{methodLabels[p.paymentMethod] || p.paymentMethod}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}
