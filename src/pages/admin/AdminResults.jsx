import { useEffect, useState } from 'react'
import { getResults, approveResult, publishResult } from '../../services/resultService'

export default function AdminResults() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [filters, setFilters] = useState({ class: '', term: '', session: '', status: '' })

    const fetchResults = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.class) params.class = filters.class
            if (filters.term) params.term = filters.term
            if (filters.session) params.session = filters.session
            if (filters.status) params.status = filters.status
            const res = await getResults(params)
            setResults(res.data.data?.results || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load results' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchResults() }, [])

    const handleApprove = async (id) => {
        try {
            await approveResult(id)
            setMessage({ type: 'success', text: 'Result approved' })
            fetchResults()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Approval failed' })
        }
    }

    const handlePublish = async (id) => {
        try {
            await publishResult(id)
            setMessage({ type: 'success', text: 'Result published' })
            fetchResults()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Publish failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Results Management</h1>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Class</span>
                        <input value={filters.class} onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. Basic 5" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Term</span>
                        <select value={filters.term} onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Terms</option>
                            <option value="First Term">First Term</option>
                            <option value="Second Term">Second Term</option>
                            <option value="Third Term">Third Term</option>
                        </select>
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Session</span>
                        <input value={filters.session} onChange={(e) => setFilters({ ...filters, session: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="2026/2027" />
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Status</span>
                        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="approved">Approved</option>
                            <option value="published">Published</option>
                        </select>
                    </label>
                </div>
                <button onClick={fetchResults} disabled={loading}
                    className="mt-4 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                    {loading ? 'Loading...' : 'Apply Filters'}
                </button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading results...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">CA</th>
                                    <th className="px-4 py-3">Exam</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r) => (
                                    <tr key={r._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{r.studentName || r.studentId?.name || 'N/A'}</td>
                                        <td className="px-4 py-3">{r.class || r.classId?.name || 'N/A'}</td>
                                        <td className="px-4 py-3">{r.subject || r.subjectId?.name || 'N/A'}</td>
                                        <td className="px-4 py-3">{r.caScore ?? 'N/A'}</td>
                                        <td className="px-4 py-3">{r.examScore ?? 'N/A'}</td>
                                        <td className="px-4 py-3 font-semibold text-white">{r.totalScore ?? ((r.caScore || 0) + (r.examScore || 0))}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                r.status === 'published' ? 'bg-green-500/10 text-green-300' :
                                                r.status === 'approved' ? 'bg-blue-500/10 text-blue-300' :
                                                'bg-slate-500/10 text-slate-400'
                                            }`}>{r.status || 'draft'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {r.status !== 'approved' && r.status !== 'published' && (
                                                    <button onClick={() => handleApprove(r._id)} className="text-sm font-semibold text-green-400 hover:text-green-300">Approve</button>
                                                )}
                                                {r.status === 'approved' && (
                                                    <button onClick={() => handlePublish(r._id)} className="text-sm font-semibold text-blue-400 hover:text-blue-300">Publish</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {results.length === 0 && <p className="mt-4 text-sm text-slate-400">No results found.</p>}
                </div>
            )}
        </main>
    )
}
