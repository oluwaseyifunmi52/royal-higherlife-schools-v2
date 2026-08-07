import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyPayments, getStudentFeeSummary } from '../../services/paymentService'
import { getFees } from '../../services/feeService'
import PaymentModal from '../../components/PaymentModal'
import FeeSummary from '../../components/FeeSummary'

export default function ParentPayments() {
    const [fees, setFees] = useState([])
    const [payments, setPayments] = useState([])
    const [summary, setSummary] = useState(null)
    const [selectedFee, setSelectedFee] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feesRes, paymentsRes, summaryRes] = await Promise.allSettled([
                    getFees(),
                    getMyPayments(),
                    getStudentFeeSummary(),
                ])
                if (feesRes.status === 'fulfilled') setFees(feesRes.value.data.data || [])
                if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data.data || paymentsRes.value.data || [])
                if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data.data || summaryRes.value.data)
            } catch {
                // silent
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
            { _id: Date.now().toString(), amount: Number(amount), method, reference, note, status: 'paid', paymentDate: new Date().toISOString(), createdAt: new Date().toISOString() },
            ...prev,
        ])
        setSelectedFee(null)
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Parent portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Payments</h1>
                    <p className="mt-3 text-lg text-slate-400">Manage your child&apos;s school fees, pay outstanding balances, and track transactions.</p>
                </div>
                <div className="rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
                    Outstanding: ₦{totalDue.toLocaleString()}
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Assigned Fees</h2>
                        {loading ? (
                            <p className="mt-4 text-sm text-slate-400">Loading fees...</p>
                        ) : fees.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-400">No fees assigned.</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {fees.map((fee) => (
                                    <div key={fee._id || fee.name} className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-950/70 px-4 py-4">
                                        <div>
                                            <p className="font-semibold text-white">{fee.name || fee.title}</p>
                                            <p className="text-sm text-slate-400">{fee.status || 'Pending'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-amber-300">₦{(fee.amount || 0).toLocaleString()}</span>
                                            {fee.status !== 'paid' && (
                                                <button onClick={() => openModal(fee)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">Pay now</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <FeeSummary summary={summary} loading={loading} />

                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                        <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            <button onClick={() => openModal({ name: 'Outstanding balance', amount: totalDue })} className="rounded-full bg-amber-500 px-4 py-3 font-semibold text-slate-950">Pay with Paystack</button>
                            <button onClick={() => openModal({ name: 'Outstanding balance', amount: totalDue })} className="rounded-full border border-slate-700 px-4 py-3 font-semibold text-white">Pay with Flutterwave</button>
                            <Link to="/parent/payment-history" className="rounded-full border border-blue-400/30 px-4 py-3 text-center font-semibold text-blue-300">View Payment History</Link>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={Boolean(selectedFee)}
                fee={selectedFee}
                onClose={() => setSelectedFee(null)}
                onSuccess={handlePaymentSuccess}
            />
        </main>
    )
}
