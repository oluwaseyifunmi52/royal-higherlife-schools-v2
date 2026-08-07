import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ParentDashboard() {
    const { user } = useAuth()
    const [children, setChildren] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import('../../api/axios')).default
                const res = await api.get('/api/parent/children')
                setChildren(res.data.data || [])
            } catch {
                // Fallback
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">
                {user?.firstName ? `${user.firstName}'s Dashboard` : 'Parent Dashboard'}
            </h1>
            <p className="mt-3 text-lg text-slate-400">Track your child&apos;s learning, fees, and school updates.</p>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Children</h2>
                        <p className="mt-2 text-sm text-slate-400">View your children&apos;s progress and academic records.</p>
                    </div>
                </div>

                {loading ? (
                    <p className="mt-6 text-sm text-slate-400">Loading children...</p>
                ) : children.length === 0 ? (
                    <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
                        <p>No children linked to your account yet. Children will appear here once linked by an admin.</p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {children.map((child) => (
                            <div key={child._id || child.id} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                                <p className="text-sm font-semibold text-white">{child.firstName} {child.lastName}</p>
                                <p className="mt-2 text-sm text-slate-400">Class: {child.class || 'N/A'}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">Active</span>
                                    <Link to="/parent/progress" className="text-sm font-semibold text-blue-300">View Progress</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/parent/payments" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Make Payment</Link>
                    <Link to="/parent/payment-history" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Payment History</Link>
                    <Link to="/parent/report" className="rounded-full border border-blue-400/30 px-6 py-3 font-semibold text-blue-300">Report Cards</Link>
                </div>
            </section>
        </main>
    )
}
