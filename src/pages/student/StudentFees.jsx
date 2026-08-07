import { useEffect, useState } from 'react'
import { getMyFees } from '../../services/studentService'

export default function StudentFees() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyFees().then(res => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false))
    }, [])

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">School Fees</h1>
            </div>

            {loading ? <p className="text-slate-400">Loading...</p> : !data ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No fee information available.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Total Fees</p>
                            <p className="mt-2 text-2xl font-bold text-white">₦{(data.totalFees || 0).toLocaleString()}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Amount Paid</p>
                            <p className="mt-2 text-2xl font-bold text-green-300">₦{(data.totalPaid || 0).toLocaleString()}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Outstanding Balance</p>
                            <p className="mt-2 text-2xl font-bold text-amber-400">₦{(data.balance || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    {data.fees?.length > 0 && (
                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Fee Structure</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-left text-slate-400">
                                            <th className="px-4 py-3">Fee Type</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Term</th>
                                            <th className="px-4 py-3">Session</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.fees.map((f) => (
                                            <tr key={f._id} className="border-t border-slate-800 text-slate-300">
                                                <td className="px-4 py-3 font-semibold text-white">{f.name}</td>
                                                <td className="px-4 py-3">₦{f.amount?.toLocaleString()}</td>
                                                <td className="px-4 py-3">{f.term || '-'}</td>
                                                <td className="px-4 py-3">{f.session || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
