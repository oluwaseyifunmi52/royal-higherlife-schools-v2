import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const methodLabels = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  pos: 'POS',
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
  other: 'Other',
}

const feeTypeLabels = {
  tuition: 'Tuition',
  development: 'Development',
  exam: 'Examination',
  uniform: 'Uniform',
  books: 'Books',
  transport: 'Transport',
  lab: 'Laboratory',
  trip: 'Excursion/Trip',
  other: 'Other',
}

const statusColors = {
  paid: 'text-green-300 bg-green-500/10 border-green-500/30',
  pending: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  reversed: 'text-red-300 bg-red-500/10 border-red-500/30',
  cancelled: 'text-slate-300 bg-slate-500/10 border-slate-500/30',
}

export default function PaymentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReverseModal, setShowReverseModal] = useState(false)
  const [reverseReason, setReverseReason] = useState('')
  const [reversing, setReversing] = useState(false)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const api = (await import('../../api/axios')).default
        const res = await api.get(`/api/payments/${id}`)
        setPayment(res.data.data)
      } catch {
        setError('Payment not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPayment()
  }, [id])

  const handleReverse = async () => {
    if (!reverseReason.trim()) return
    setReversing(true)
    try {
      const api = (await import('../../api/axios')).default
      const res = await api.patch(`/api/payments/${id}/reverse`, { reason: reverseReason })
      setPayment(res.data.data)
      setShowReverseModal(false)
      setReverseReason('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reverse payment')
    } finally {
      setReversing(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-slate-400">Loading payment details...</p>
      </main>
    )
  }

  if (!payment) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-red-300">Payment not found.</p>
        <button onClick={() => navigate('/admin/payments')} className="mt-4 rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back to payments</button>
      </main>
    )
  }

  const fmt = (n) => `₦${Number(n).toLocaleString()}`
  const dateStr = new Date(payment.paymentDate).toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Payment Details</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Print Receipt</button>
          <button onClick={() => navigate('/admin/payments')} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Payment Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Receipt Number</span>
              <span className="font-mono font-semibold text-white">{payment.receiptNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Status</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[payment.status]}`}>{payment.status?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Amount</span>
              <span className="text-xl font-bold text-white">{fmt(payment.amount)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Payment Method</span>
              <span className="font-semibold text-white">{methodLabels[payment.paymentMethod] || payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Date</span>
              <span className="text-white">{dateStr}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Fee Type</span>
              <span className="text-white">{feeTypeLabels[payment.feeType] || payment.feeType}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Session</span>
              <span className="text-white">{payment.session}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Term</span>
              <span className="text-white">{payment.term}</span>
            </div>
            {payment.description && (
              <div className="border-b border-slate-800 pb-3">
                <span className="text-slate-400 block mb-1">Description</span>
                <span className="text-white">{payment.description}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Receipt Preview</h2>
            <div className="rounded-2xl border border-slate-700 bg-white p-6 text-slate-900">
              <div className="text-center border-b border-slate-200 pb-4 mb-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Royal Higher Life Schools</div>
                <div className="text-lg font-bold mt-1">PAYMENT RECEIPT</div>
                <div className="text-xs text-slate-500 mt-1">{payment.receiptNumber || 'N/A'}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student</span>
                  <span className="font-semibold">{payment.studentId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-lg">{fmt(payment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Type</span>
                  <span>{feeTypeLabels[payment.feeType] || payment.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method</span>
                  <span>{methodLabels[payment.paymentMethod] || payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span>{dateStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session</span>
                  <span>{payment.session}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Term</span>
                  <span>{payment.term}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Recorded by: {payment.recordedBy?.name || 'N/A'}</span>
                  <span>Status: PAID</span>
                </div>
                <div className="mt-6 flex justify-between">
                  <div className="text-center">
                    <div className="border-t border-slate-400 w-32 mt-8"></div>
                    <div className="text-xs text-slate-500 mt-1">Authorized Signature</div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-slate-400 w-32 mt-8"></div>
                    <div className="text-xs text-slate-500 mt-1">School Stamp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {payment.status === 'paid' && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
              <button
                onClick={() => setShowReverseModal(true)}
                className="rounded-full border border-red-500/50 bg-red-500/10 px-6 py-3 font-semibold text-red-300"
              >
                Reverse Payment
              </button>
            </div>
          )}

          {payment.status === 'reversed' && (
            <div className="rounded-[2rem] border border-red-500/30 bg-red-500/5 p-6">
              <h2 className="text-xl font-semibold text-red-300 mb-2">Reversed</h2>
              <p className="text-sm text-slate-400">Reason: {payment.reverseReason}</p>
              <p className="text-sm text-slate-400 mt-1">Reversed by: {payment.reversedBy?.name || 'N/A'}</p>
              <p className="text-sm text-slate-400 mt-1">Reversed at: {payment.reversedAt ? new Date(payment.reversedAt).toLocaleString() : 'N/A'}</p>
            </div>
          )}

          {payment.auditHistory?.length > 0 && (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Audit History</h2>
              <div className="space-y-3">
                {payment.auditHistory.map((entry, i) => (
                  <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-white capitalize">{entry.action}</span>
                      <span className="text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{entry.performedBy?.name || 'System'}</p>
                    {entry.details && <p className="text-sm text-slate-300 mt-1">{entry.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showReverseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">Reverse Payment</h2>
            <p className="mt-2 text-sm text-slate-400">This action cannot be undone. Please provide a reason.</p>
            <textarea
              value={reverseReason}
              onChange={(e) => setReverseReason(e.target.value)}
              className="mt-4 min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500"
              placeholder="Reason for reversal"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleReverse}
                disabled={!reverseReason.trim() || reversing}
                className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {reversing ? 'Reversing...' : 'Confirm Reverse'}
              </button>
              <button
                onClick={() => { setShowReverseModal(false); setReverseReason('') }}
                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
