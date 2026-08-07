import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyPayments } from '../../services/paymentService'

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

export default function ParentPaymentHistory() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getMyPayments()
        setPayments(res.data.data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Parent portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Payment History</h1>
          <p className="mt-3 text-lg text-slate-400">Track every fee payment made for your child and download receipts.</p>
        </div>
        <Link to="/parent/payments" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back to payments</Link>
      </div>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
        {loading ? (
          <p className="text-slate-400">Loading payment history...</p>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No payment history found.</p>
            <Link to="/parent/payments" className="mt-4 inline-block rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Make a Payment</Link>
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
          </>
        )}
      </section>
    </main>
  )
}
