const fees = [
    { name: 'First Term Tuition', className: 'Basic 3', amount: '₦75,000', status: 'Pending' },
    { name: 'Registration Fee', className: 'Basic 2', amount: '₦15,000', status: 'Published' },
    { name: 'Books', className: 'Basic 1', amount: '₦10,000', status: 'Paid' },
]

export default function AdminDashboard() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
            <p className="mt-3 text-lg text-slate-400">Oversee admissions, school settings, and institutional activity.</p>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Fee Management</h2>
                        <p className="mt-2 text-sm text-slate-400">Create, edit, and monitor school fees assigned to parents and students.</p>
                    </div>
                    <button className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Create New Fee</button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {fees.map((fee) => (
                        <div key={fee.name} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                            <p className="text-sm font-semibold text-white">{fee.name}</p>
                            <p className="mt-2 text-sm text-slate-400">Class: {fee.className}</p>
                            <p className="mt-2 text-sm text-slate-400">Amount: {fee.amount}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">{fee.status}</span>
                                <button className="text-sm font-semibold text-blue-300">Manage</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-white">Payment Oversight</h2>
                    <a href="/admin/payments" className="rounded-full border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-300">Open payment dashboard</a>
                </div>
                <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
                    <p>Admins can view receipts, approve payments, and monitor school income by fee type, class, and term.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-green-300">Totals by Term</span>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-300">Receipts</span>
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-300">Outstanding Balances</span>
                    </div>
                </div>
            </section>
        </main>
    )
}
