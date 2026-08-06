const outstandingFees = [
    { name: 'First Term Tuition', amount: '₦75,000', status: 'Unpaid' },
    { name: 'Books', amount: '₦15,000', status: 'Paid' },
    { name: 'Transport', amount: '₦20,000', status: 'Pending' },
]

const paymentHistory = [
    { reference: 'RF-1001', fee: 'Books', amount: '₦15,000', date: '15 Jul 2026', status: 'Successful' },
    { reference: 'RF-1002', fee: 'Uniform', amount: '₦12,500', date: '10 Jun 2026', status: 'Successful' },
]

export default function ParentDashboard() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">Parent Dashboard</h1>
            <p className="mt-3 text-lg text-slate-400">Track your child&apos;s learning, fees, and school updates.</p>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Payment Dashboard</h2>
                        <p className="mt-2 text-sm text-slate-400">Parents can view outstanding fees, pay securely, and download receipts.</p>
                    </div>
                    <div className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">Outstanding Balance: ₦110,000</div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {outstandingFees.map((fee) => (
                        <div key={fee.name} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                            <p className="text-sm font-semibold text-white">{fee.name}</p>
                            <p className="mt-2 text-sm text-slate-400">Amount: {fee.amount}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">{fee.status}</span>
                                {fee.status !== 'Paid' ? <button className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">Pay Now</button> : null}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-white">Payment History</h2>
                    <Link to="/parent/payments" className="rounded-full border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-300">Open payment portal</Link>
                </div>
                <div className="mt-6 space-y-3">
                    {paymentHistory.map((item) => (
                        <div key={item.reference} className="flex flex-wrap items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-950/70 px-4 py-4">
                            <div>
                                <p className="font-semibold text-white">{item.fee}</p>
                                <p className="text-sm text-slate-400">Reference: {item.reference} • {item.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-300">{item.amount}</span>
                                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
