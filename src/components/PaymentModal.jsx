import { useEffect, useState } from 'react'

export default function PaymentModal({ isOpen, fee, onClose, onSuccess }) {
    const [method, setMethod] = useState('Paystack')
    const [amount, setAmount] = useState('')
    const [reference, setReference] = useState('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (fee) {
            setMethod('Paystack')
            setAmount(fee.amount?.replace(/[^\d]/g, '') || '')
            setReference(`RHS-${Date.now().toString().slice(-6)}`)
            setNote(`Payment for ${fee.name}`)
        }
    }, [fee, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')
        try {
            const api = (await import('../api/axios')).default
            await api.post('/api/payments/initiate', {
                feeId: fee._id || fee.id || undefined,
                amount: Number(amount),
                method,
                reference,
                note,
            })
            onSuccess({ method, amount, reference, note })
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Payment initiation failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
            <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Secure payment</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Complete school payment</h2>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Close</button>
                </div>

                {error && (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Payment method</span>
                        <select value={method} onChange={(event) => setMethod(event.target.value)} className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="Paystack">Paystack</option>
                            <option value="Flutterwave">Flutterwave</option>
                        </select>
                    </label>

                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Amount</span>
                        <input value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Enter amount" required />
                    </label>

                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Reference</span>
                        <input value={reference} onChange={(event) => setReference(event.target.value)} className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" required />
                    </label>

                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Note</span>
                        <textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-28 w-full rounded-[1.25rem] border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Add a note for the payment" />
                    </label>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <button type="submit" disabled={loading} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                            {loading ? 'Processing...' : 'Complete payment'}
                        </button>
                        <button type="button" onClick={onClose} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
