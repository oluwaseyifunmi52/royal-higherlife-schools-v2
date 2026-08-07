import { useEffect, useState } from 'react'

export default function ChildReportCard() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import('../../api/axios')).default
                const res = await api.get('/api/report-cards')
                setReports(res.data.data || [])
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
            <h1 className="text-3xl font-semibold text-white">Child Report Card</h1>
            <p className="mt-3 text-lg text-slate-400">View your child&apos;s report cards and academic records.</p>

            {loading ? (
                <p className="mt-8 text-sm text-slate-400">Loading report cards...</p>
            ) : reports.length === 0 ? (
                <p className="mt-8 text-sm text-slate-400">No report cards available yet.</p>
            ) : (
                <div className="mt-8 space-y-4">
                    {reports.map((report) => (
                        <div key={report._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-white">{report.term || 'Term'} - {report.session || 'Session'}</p>
                                    <p className="text-sm text-slate-400">Average: {report.average || 'N/A'}%</p>
                                </div>
                                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">Published</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
