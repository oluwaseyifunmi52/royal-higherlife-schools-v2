import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PaymentModal from '../../components/PaymentModal'

const initialFees = [
    { name: 'First Term Tuition', amount: '₦60,000', status: 'Unpaid' },
    { name: 'Books', amount: '₦15,000', status: 'Pending' },
    { name: 'Transport', amount: '₦10,000', status: 'Pending' },
]

export default function ParentPayments() {
    const [fees, setFees] = useState(initialFees)
    const [selectedFee, setSelectedFee] = useState(null)
    const [paymentHistory, setPaymentHistory] = useState([
        { date: '15 Jul 2026', fee: 'Books', amount: '₦15,000', status: 'Successful', receipt: 'Download' },
        { date: '10 Jun 2026', fee: 'Uniform', amount: '₦12,500', status: 'Successful', receipt: 'Download' },
    ])

    const totalDue = useMemo(() => fees.reduce((total, fee) => total + Number(fee.amount.replace(/[^\d]/g, '')), 0), [fees])

    const openModal = (fee) => {
        setSelectedFee(fee)
    }

    const handlePaymentSuccess = ({ method, amount, reference, note }) => {
        const formattedAmount = `₦${Number(amount).toLocaleString()}`
        setPaymentHistory((previous) => [
            { date: 'Today', fee: note, amount: formattedAmount, status: 'Successful', receipt: 'Download' },
            ...previous,
        ])

        setFees((previous) =>
            previous.map((fee) =>
                fee.name === selectedFee?.name ? { ...fee, status: 'Paid', amount: '₦0' } : fee
            )
        )

        setSelectedFee(null)
        window.alert(`Payment completed via ${method}. Reference: ${reference}`)
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Parent portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Payments</h1>
                    <p className="mt-3 text-lg text-slate-400">Manage your child’s school finance, pay outstanding fees, and track every transaction.</p>
                </div>
                <div className="rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
                    Outstanding balance: ₦85,000
                </div>
            </div>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                        <h2 className="text-xl font-semibold text-white">Assigned fees</h2>
                        <div className="mt-4 space-y-3">
                            {fees.map((fee) => (
                                <div key={fee.name} className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-900/70 px-4 py-4">
                                    <div>
                                        <p className="font-semibold text-white">{fee.name}</p>
                                        <p className="text-sm text-slate-400">{fee.status}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-amber-300">{fee.amount}</span>
                                        <button onClick={() => openModal(fee)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">Pay now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                            <h3 className="text-lg font-semibold text-white">Payment methods</h3>
                            <div className="mt-4 flex flex-col gap-3">
                                <button onClick={() => openModal({ name: 'Outstanding balance', amount: `₦${totalDue.toLocaleString()}` })} className="rounded-full bg-amber-500 px-4 py-3 font-semibold text-slate-950">Pay with Paystack</button>
                                <button onClick={() => openModal({ name: 'Outstanding balance', amount: `₦${totalDue.toLocaleString()}` })} className="rounded-full border border-slate-700 px-4 py-3 font-semibold text-white">Pay with Flutterwave</button>
                                <Link to="/parent/payment-history" className="rounded-full border border-blue-400/30 px-4 py-3 text-center font-semibold text-blue-300">View payment history</Link>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                            <h3 className="text-lg font-semibold text-white">Parent summary</h3>
                            <div className="mt-4 space-y-3 text-sm text-slate-400">
                                <div className="flex items-center justify-between">
                                    <span>Child</span>
                                    <span className="font-semibold text-white">Ama Boateng</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Class</span>
                                    <span className="font-semibold text-white">Basic 3</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Session</span>
                                    <span className="font-semibold text-white">2026/2027</span>
                                </div>
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
