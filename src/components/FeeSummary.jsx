import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

function formatAmount(amount) {
    return `₦${Number(amount || 0).toLocaleString()}`
}

export default function FeeSummary({ summary, loading }) {
    if (loading) {
        return (
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 rounded-xl bg-slate-800/50 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!summary) return null

    const totalFees = summary.totalFees || 0
    const amountPaid = summary.amountPaid || 0
    const balance = totalFees - amountPaid
    const isFullyPaid = amountPaid >= totalFees && totalFees > 0
    const isPartial = amountPaid > 0 && !isFullyPaid
    const percentage = totalFees > 0 ? Math.min(100, Math.round((amountPaid / totalFees) * 100)) : 0

    return (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Fee Summary</h3>

            <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Total Fees</span>
                    <span className="font-semibold text-white">{formatAmount(totalFees)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Amount Paid</span>
                    <span className="font-semibold text-green-400">{formatAmount(amountPaid)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                    <span className="text-sm text-slate-400">Balance</span>
                    <span className={`font-semibold ${isFullyPaid ? 'text-green-400' : 'text-amber-400'}`}>
                        {isFullyPaid ? '₦0' : formatAmount(balance)}
                    </span>
                </div>
            </div>

            {totalFees > 0 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Payment progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: isFullyPaid ? '#4ade80' : '#f59e0b',
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="mt-4">
                {isFullyPaid ? (
                    <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                        <FiCheckCircle /> PAID
                    </div>
                ) : isPartial ? (
                    <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
                        <FiAlertCircle /> BALANCE DUE — {formatAmount(balance)}
                    </div>
                ) : totalFees > 0 ? (
                    <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
                        <FiAlertCircle /> UNPAID — {formatAmount(totalFees)}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 rounded-full bg-slate-500/10 px-4 py-2 text-sm text-slate-400">
                        No fees assigned
                    </div>
                )}
            </div>
        </div>
    )
}
