import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PaymentModal from '../../components/PaymentModal'

const initialOutstandingFees = [
    { name: 'First Term Tuition', amount: '₦60,000', status: 'Pending' },
    { name: 'Books', amount: '₦15,000', status: 'Pending' },
    { name: 'ICT Fee', amount: '₦10,000', status: 'Pending' },
    { name: 'Transport', amount: '₦10,000', status: 'Pending' },
]

export default function StudentPayments() {
    const [outstandingFees, setOutstandingFees] = useState(initialOutstandingFees)
    const [selectedFee, setSelectedFee] = useState(null)
    const [paymentHistory, setPaymentHistory] = useState([
        { date: '15 Aug 2026', fee: 'Admission Fee', amount: '₦25,000', status: 'Successful', receipt: 'Download' },
        { date: '10 Sep 2026', fee: 'Tuition', amount: '₦60,000', status: 'Pending', receipt: '—' },
    ])

    const totalDue = useMemo(() => outstandingFees.reduce((total, fee) => total + Number(fee.amount.replace(/[^\d]/g, '')), 0), [outstandingFees])

    const openModal = (fee) => {
        setSelectedFee(fee)
    }

    const handlePaymentSuccess = ({ method, amount, reference, note }) => {
        const formattedAmount = `₦${Number(amount).toLocaleString()}`
        setPaymentHistory((previous) => [
            { date: 'Today', fee: note, amount: formattedAmount, status: 'Successful', receipt: 'Download' },
            ...previous,
        ])

        setOutstandingFees((previous) =>
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
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Payments</h1>
                    <p className="mt-3 text-lg text-slate-400">Review your school fees, settle balances, and keep your records up to date.</p>
                </div>
                <div className="rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
                    Outstanding balance: ₦95,000
                </div>
            </div>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                        <h2 className="text-xl font-semibold text-white">Payment dashboard</h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[1.25rem] border border-slate-800 bg-slate-900/70 p-4">
                                <p className="text-sm text-slate-400">Student</p>
                                <p className="mt-2 font-semibold text-white">John Doe</p>
                            </div>
                            <div className="rounded-[1.25rem] border border-slate-800 bg-slate-900/70 p-4">
                                <p className="text-sm text-slate-400">Admission No.</p>
                                <p className="mt-2 font-semibold text-white">RHS20260015</p>
                            </div>
                            <div className="rounded-[1.25rem] border border-slate-800 bg-slate-900/70 p-4">
                                <p className="text-sm text-slate-400">Class</p>
                                <p className="mt-2 font-semibold text-white">Basic 3</p>
                            </div>
                            <div className="rounded-[1.25rem] border border-slate-800 bg-slate-900/70 p-4">
                                <p className="text-sm text-slate-400">Academic Session</p>
                                <p className="mt-2 font-semibold text-white">2026/2027</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-white">Outstanding fees</h3>
                            <div className="mt-4 space-y-3">
                                {outstandingFees.map((fee) => (
                                    <div key={fee.name} className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-900/70 px-4 py-4">
                                        <div>
                                            <p className="font-semibold text-white">{fee.name}</p>
                                            <p className="text-sm text-slate-400">{fee.status}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-amber-300">{fee.amount}</span>
                                            <button onClick={() => openModal(fee)} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">Pay</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                            <h3 className="text-lg font-semibold text-white">Quick actions</h3>
                            <div className="mt-4 flex flex-col gap-3">
                                <button onClick={() => openModal({ name: 'Outstanding balance', amount: `₦${totalDue.toLocaleString()}` })} className="rounded-full bg-amber-500 px-4 py-3 font-semibold text-slate-950">Pay with Paystack</button>
                                <button onClick={() => openModal({ name: 'Outstanding balance', amount: `₦${totalDue.toLocaleString()}` })} className="rounded-full border border-slate-700 px-4 py-3 font-semibold text-white">Pay with Flutterwave</button>
                                <Link to="/student/payment-history" className="rounded-full border border-blue-400/30 px-4 py-3 text-center font-semibold text-blue-300">View payment history</Link>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                            <h3 className="text-lg font-semibold text-white">Summary</h3>
                            <div className="mt-4 space-y-3 text-sm text-slate-400">
                                <div className="flex items-center justify-between">
                                    <span>Total due</span>
                                    <span className="font-semibold text-white">₦{totalDue.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Paid this term</span>
                                    <span className="font-semibold text-white">₦25,000</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Balance</span>
                                    <span className="font-semibold text-amber-300">₦70,000</span>
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
