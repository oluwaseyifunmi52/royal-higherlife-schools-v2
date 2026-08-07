import { useEffect, useState } from 'react'
import { getMyResults } from '../../services/studentService'

export default function StudentResults() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyResults().then(res => setResults(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const gradeScore = (total) => {
        if (total >= 70) return { grade: 'A', color: 'text-green-300' }
        if (total >= 60) return { grade: 'B', color: 'text-blue-300' }
        if (total >= 50) return { grade: 'C', color: 'text-amber-300' }
        if (total >= 40) return { grade: 'D', color: 'text-orange-300' }
        return { grade: 'F', color: 'text-red-300' }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Results</h1>
                <p className="mt-3 text-lg text-slate-400">View your academic performance across all subjects.</p>
            </div>

            {loading ? <p className="text-slate-400">Loading results...</p> : results.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No results available yet.</p>
                </div>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">CA (40)</th>
                                    <th className="px-4 py-3">Exam (60)</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Grade</th>
                                    <th className="px-4 py-3">Remarks</th>
                                    <th className="px-4 py-3">Term</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r) => {
                                    const g = gradeScore(r.totalScore || 0)
                                    return (
                                        <tr key={r._id} className="border-t border-slate-800 text-slate-300">
                                            <td className="px-4 py-3 font-semibold text-white">{r.subject}</td>
                                            <td className="px-4 py-3">{r.caScore}</td>
                                            <td className="px-4 py-3">{r.examScore}</td>
                                            <td className="px-4 py-3 font-semibold text-white">{r.totalScore}</td>
                                            <td className={'px-4 py-3 font-bold ' + g.color}>{g.grade}</td>
                                            <td className="px-4 py-3 text-slate-400">{r.remarks || '-'}</td>
                                            <td className="px-4 py-3 text-slate-400">{r.term} {r.session}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    )
}
