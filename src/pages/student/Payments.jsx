import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PaymentModal from '../../components/PaymentModal'

const methodLabels = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  pos: 'POS',
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
  other: 'Other',
}

export default function StudentPayments() {
  const { user } = useAuth()
  const [fees, setFees] = useState([])
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(null)
  const [selectedFee, setSelectedFee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = (await import('../../api/axios')).default
        const [feesRes, paymentsRes, summaryRes] = await Promise.allSettled([
          api.get('/api/fees'),
          api.get('/api/payments/my'),
          api.get('/api/payments/my/summary'),
        ])
        if (feesRes.status === 'fulfilled') setFees(feesRes.value.data.data || [])
        if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data.data || [])
        if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalDue = useMemo(
    () => fees.reduce((total, fee) => total + (fee.amount || 0), 0),
    [fees]
  )

  const openModal = (fee) => setSelectedFee(fee)

  const handlePaymentSuccess = ({ method, amount, reference, note }) => {
    setPayments((prev) => [
      { _id: Date.now().toString(), amount: Number(amount), paymentMethod: method?.toLowerCase(), reference, description: note, status: 'paid', paymentDate: new Date().toISOString() },
      ...prev,
    ])
    setSelectedFee(null)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">My Fees</h1>
          <p className="mt-3 text-lg text-slate-400">Review your school fees, settle balances, and keep your records up to date.</p>
        </div>
        <Link to="/student/payment-history" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Payment History</Link>
      </div>

      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Student</p>
            <p className="mt-2 font-bold text-white">{user?.name || 'N/A'}</p>
          </div>
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
            {summary.status === 'paid' ? (
              <span className="text-xs text-green-300">✅ PAID</span>
            ) : (
              <span className="text-xs text-amber-300">⚠️ BALANCE DUE</span>
            )}
          </div>
        </div>
      )}

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Outstanding Fees</h2>
            {loading ? (
              <p className="mt-4 text-sm text-slate-400">Loading fees...</p>
            ) : fees.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No outstanding fees.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {fees.map((fee) => (
                  <div key={fee._id || fee.name} className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-900/70 px-4 py-4">
                    <div>
                      <p className="font-semibold text-white">{fee.name || fee.title}</p>
                      <p className="text-sm text-slate-400">{fee.type || 'Fee'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-amber-300">₦{(fee.amount || 0).toLocaleString()}</span>
                      <button onClick={() => openModal(fee)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">Pay</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => openModal({ name: 'Outstanding balance', amount: totalDue })} className="rounded-full bg-amber-500 px-4 py-3 font-semibold text-slate-950">Pay with Paystack</button>
                <button onClick={() => openModal({ name: 'Outstanding balance', amount: totalDue })} className="rounded-full border border-slate-700 px-4 py-3 font-semibold text-white">Pay with Flutterwave</button>
                <Link to="/student/payment-history" className="rounded-full border border-blue-400/30 px-4 py-3 text-center font-semibold text-blue-300">View payment history</Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Recent Payments</h3>
              <div className="mt-4 space-y-3">
                {payments.length === 0 ? (
                  <p className="text-sm text-slate-400">No payments yet.</p>
                ) : (
                  payments.slice(0, 5).map((p) => (
                    <div key={p._id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                      <div>
                        <p className="text-sm text-white">{p.description || p.feeId?.title || 'Payment'}</p>
                        <p className="text-xs text-slate-400">{new Date(p.paymentDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">₦{p.amount?.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">{methodLabels[p.paymentMethod] || p.paymentMethod}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={Boolean(selectedFee)}
        fee={selectedFee}
        onClose={() => setSelectedFee(null)}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  )
}
