import { Link } from 'react-router-dom'

const paymentHistory = [
    { date: '15 Aug 2026', fee: 'Admission Fee', amount: '₦25,000', status: 'Successful', receipt: 'Download' },
    { date: '10 Sep 2026', fee: 'Tuition', amount: '₦60,000', status: 'Pending', receipt: '—' },
    { date: '10 Sep 2026', fee: 'Books', amount: '₦15,000', status: 'Pending', receipt: '—' },
]

export default function StudentPaymentHistory() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Payment history</h1>
                    <p className="mt-3 text-lg text-slate-400">Review all fee payments, statuses, and receipts for your child’s account.</p>
                </div>
                <Link to="/student/payments" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back to payments</Link>
            </div>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-800">
                    <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.6fr] bg-slate-950/90 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        <span>Date</span>
                        <span>Fee</span>
                        <span>Amount</span>
                        <span>Status</span>
                        <span>Receipt</span>
                    </div>
                    {paymentHistory.map((item) => (
                        <div key={`${item.date}-${item.fee}`} className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.6fr] border-t border-slate-800 bg-slate-950/70 px-4 py-4 text-sm text-slate-300">
                            <span>{item.date}</span>
                            <span>{item.fee}</span>
                            <span>{item.amount}</span>
                            <span className={item.status === 'Successful' ? 'text-green-300' : 'text-amber-300'}>{item.status}</span>
                            <span>{item.receipt}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
