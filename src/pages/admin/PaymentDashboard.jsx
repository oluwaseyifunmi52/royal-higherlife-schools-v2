const feeCategories = [
    'Admission Fee',
    'Tuition Fee',
    'Registration Fee',
    'Books Fee',
    'ICT Fee',
    'Examination Fee',
    'Library Fee',
    'Uniform Fee',
    'Sports Fee',
    'Transport Fee',
    'Meal Fee',
    'PTA Levy',
    'Graduation Fee',
    'Excursion Fee',
    'Hostel Fee',
    'Summer School',
    'Other Charges',
]

const recentPayments = [
    { student: 'John Doe', fee: 'Tuition', amount: '₦60,000', status: 'Successful' },
    { student: 'Ama Boateng', fee: 'Books', amount: '₦15,000', status: 'Pending' },
    { student: 'Kofi Mensah', fee: 'Transport', amount: '₦10,000', status: 'Successful' },
]

export default function PaymentDashboard() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Payments</h1>
                <p className="mt-3 text-lg text-slate-400">Create fees, review payment activity, and monitor outstanding balances across the school.</p>
            </div>

            <section className="mt-8 grid gap-4 md:grid-cols-4">
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Total revenue</p>
                    <p className="mt-2 text-2xl font-semibold text-white">₦4.2M</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Today&apos;s payments</p>
                    <p className="mt-2 text-2xl font-semibold text-white">₦180,000</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Outstanding fees</p>
                    <p className="mt-2 text-2xl font-semibold text-white">₦1.8M</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Students owing</p>
                    <p className="mt-2 text-2xl font-semibold text-white">148</p>
                </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white">Create new fee</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <label className="text-sm text-slate-400">
                            <span className="mb-2 block">Fee name</span>
                            <input className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. ICT Fee" />
                        </label>
                        <label className="text-sm text-slate-400">
                            <span className="mb-2 block">Amount</span>
                            <input className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="₦10,000" />
                        </label>
                        <label className="text-sm text-slate-400">
                            <span className="mb-2 block">Category</span>
                            <select className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                {feeCategories.map((category) => (
                                    <option key={category}>{category}</option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm text-slate-400">
                            <span className="mb-2 block">Academic session</span>
                            <input className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="2026/2027" />
                        </label>
                        <label className="text-sm text-slate-400">
                            <span className="mb-2 block">Term</span>
                            <input className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="First Term" />
                        </label>
                        <label className="text-sm text-slate-400">
                            <span className="mb-2 block">Class</span>
                            <input className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Basic 3" />
                        </label>
                        <label className="text-sm text-slate-400 md:col-span-2">
                            <span className="mb-2 block">Due date</span>
                            <input type="date" className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="text-sm text-slate-400 md:col-span-2">
                            <span className="mb-2 block">Description</span>
                            <textarea className="min-h-[120px] w-full rounded-[1.25rem] border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Add a short description" />
                        </label>
                    </div>
                    <button className="mt-6 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Publish fee</button>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Fee categories</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {feeCategories.map((category) => (
                                <span key={category} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300">{category}</span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Recent payments</h2>
                        <div className="mt-4 space-y-3">
                            {recentPayments.map((payment) => (
                                <div key={`${payment.student}-${payment.fee}`} className="rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-white">{payment.student}</p>
                                            <p className="text-sm text-slate-400">{payment.fee}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-white">{payment.amount}</p>
                                            <p className={payment.status === 'Successful' ? 'text-sm text-green-300' : 'text-sm text-amber-300'}>{payment.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
