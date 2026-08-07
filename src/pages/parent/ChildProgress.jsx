import { useEffect, useState } from 'react'

export default function ChildProgress() {
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import('../../api/axios')).default
                const res = await api.get('/api/progress/overall')
                setProgress(res.data.data || [])
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
            <h1 className="text-3xl font-semibold text-white">Child Progress</h1>
            <p className="mt-3 text-lg text-slate-400">Track your child&apos;s academic progress across subjects.</p>

            {loading ? (
                <p className="mt-8 text-sm text-slate-400">Loading progress...</p>
            ) : progress.length === 0 ? (
                <p className="mt-8 text-sm text-slate-400">No progress data available yet.</p>
            ) : (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {progress.map((item, i) => (
                        <div key={item._id || i} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6">
                            <p className="font-semibold text-white">{item.subject || item.className || 'Subject'}</p>
                            <p className="mt-2 text-sm text-slate-400">Score: {item.score || item.percentage || 'N/A'}%</p>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                                <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.score || item.percentage || 0}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
