import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import('../../api/axios')).default
                const res = await api.get('/api/admin/dashboard')
                setStats(res.data.data)
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
                {user?.firstName ? `${user.firstName}'s Dashboard` : 'Admin Dashboard'}
            </h1>
            <p className="mt-3 text-lg text-slate-400">Oversee admissions, school settings, and institutional activity.</p>

            {loading ? (
                <p className="mt-8 text-sm text-slate-400">Loading dashboard data...</p>
            ) : stats ? (
                <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white">Overview</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                        {[
                            { label: 'Total Students', value: stats.students || 0 },
                            { label: 'Total Teachers', value: stats.teachers || 0 },
                            { label: 'Total Classes', value: stats.classes || 0 },
                            { label: 'Admissions', value: stats.admissions || 0 },
                        ].map((item) => (
                            <div key={item.label} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                                <p className="text-sm text-slate-400">{item.label}</p>
                                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <p className="text-sm text-slate-400">Unable to load dashboard stats. Please try again later.</p>
                </section>
            )}
        </main>
    )
}
