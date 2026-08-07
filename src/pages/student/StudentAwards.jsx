import { useEffect, useState } from 'react'
import { getMyAwards } from '../../services/studentService'

export default function StudentAwards() {
    const [awards, setAwards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyAwards().then(res => setAwards(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const categoryIcons = {
        academic: '📚',
        behavioral: '🌟',
        sports: '🏅',
        attendance: '✅',
        other: '🏆',
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Awards</h1>
            </div>

            {loading ? <p className="text-slate-400">Loading...</p> : awards.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No awards yet. Keep up the good work!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {awards.map((a) => (
                        <div key={a._id} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <div className="text-3xl mb-3">{categoryIcons[a.category] || '🏆'}</div>
                            <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                            <p className="text-sm text-amber-400 capitalize">{a.category} Award</p>
                            {a.description && <p className="mt-2 text-sm text-slate-400">{a.description}</p>}
                            <p className="mt-3 text-xs text-slate-500">{a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
