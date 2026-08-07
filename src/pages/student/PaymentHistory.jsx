import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const methodLabels = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  pos: 'POS',
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
  other: 'Other',
}

const statusColors = {
  paid: 'text-green-300',
  pending: 'text-amber-300',
  reversed: 'text-red-300',
  cancelled: 'text-slate-400',
}

export default function StudentPaymentHistory() {
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = (await import('../../api/axios')).default
        const [paymentsRes, summaryRes] = await Promise.allSettled([
          api.get('/api/payments/my'),
          api.get('/api/payments/my/summary'),
        ])
        if (paymentsRes.status === 'fulfilled') {
          setPayments(paymentsRes.value.data.data || [])
        }
        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data.data)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalPaid = useMemo(
    () => payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0),
    [payments]
  )

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Payment History</h1>
          <p className="mt-3 text-lg text-slate-400">Review all fee payments, statuses, and receipts for your account.</p>
        </div>
        <Link to="/student/payments" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back to payments</Link>
      </div>

      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Total Fees</p>
            <p className="mt-2 text-2xl font-bold text-white">₦{summary.totalFees?.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
            <p className="text-sm text-green-300">Amount Paid</p>
            <p className="mt-2 text-2xl font-bold text-white">₦{summary.totalPaid?.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
            <p className="text-sm text-amber-300">Balance</p>
            <p className="mt-2 text-2xl font-bold text-white">₦{summary.balance?.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <p className={`mt-2 text-2xl font-bold ${summary.status === 'paid' ? 'text-green-300' : summary.status === 'partial' ? 'text-amber-300' : 'text-red-300'}`}>
              {summary.status === 'paid' ? '✅ PAID' : summary.status === 'partial' ? '⚠️ PARTIAL' : '❌ UNPAID'}
            </p>
          </div>
        </div>
      )}

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
        {loading ? (
          <p className="text-slate-400">Loading payment history...</p>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No payments found.</p>
            <Link to="/student/payments" className="mt-4 inline-block rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Make a Payment</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id} className="border-t border-slate-800 text-slate-300">
                      <td className="px-4 py-3">{new Date(p.paymentDate).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3">{p.description || p.feeId?.title || 'School Fees'}</td>
                      <td className="px-4 py-3 font-semibold text-white">₦{p.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3">{methodLabels[p.paymentMethod] || p.paymentMethod}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.receiptNumber || p.reference || 'N/A'}</td>
                      <td className={`px-4 py-3 font-semibold capitalize ${statusColors[p.status]}`}>{p.status}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-700 font-bold text-white">
                    <td className="px-4 py-3" colSpan={2}>TOTAL PAID</td>
                    <td className="px-4 py-3">₦{totalPaid.toLocaleString()}</td>
                    <td className="px-4 py-3" colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {summary && (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center">
                <span className="text-sm text-slate-400">
                  Balance: <span className="font-bold text-white">₦{summary.balance?.toLocaleString()}</span>
                  {summary.status === 'paid' && <span className="ml-2 text-green-300">✅ FULLY PAID</span>}
                  {summary.status === 'partial' && <span className="ml-2 text-amber-300">⚠️ BALANCE DUE</span>}
                  {summary.status === 'unpaid' && <span className="ml-2 text-red-300">❌ UNPAID</span>}
                </span>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
