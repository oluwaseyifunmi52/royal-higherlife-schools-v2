import { useEffect, useState } from 'react'
import { getMyAnnouncements } from '../../services/studentService'

export default function StudentAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyAnnouncements().then(res => setAnnouncements(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const priorityColors = {
        urgent: 'border-red-500/30 bg-red-500/5',
        high: 'border-amber-500/30 bg-amber-500/5',
        normal: 'border-slate-800 bg-slate-900/80',
        low: 'border-slate-800 bg-slate-900/50',
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Announcements</h1>
            </div>

            {loading ? <p className="text-slate-400">Loading...</p> : announcements.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No announcements at this time.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((a) => (
                        <div key={a._id} className={'rounded-[2rem] border p-6 ' + (priorityColors[a.priority] || priorityColors.normal)}>
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">{a.audience}</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{a.content}</p>
                            <p className="mt-3 text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
