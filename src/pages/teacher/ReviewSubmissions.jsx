import { useEffect, useState } from 'react'
import { reviewSubmission } from '../../services/assignmentService'

export default function ReviewSubmissions() {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [grading, setGrading] = useState({})

    const fetchSubmissions = async () => {
        setLoading(true)
        try {
            const api = (await import('../../api/axios')).default
            const res = await api.get('/api/assignments/submissions/all')
            setSubmissions(res.data.data?.submissions || res.data.data || [])
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchSubmissions() }, [])

    const handleGrade = async (submissionId) => {
        const g = grading[submissionId]
        if (!g) return
        try {
            await reviewSubmission(submissionId, { score: Number(g.score), feedback: g.feedback, status: 'reviewed' })
            setMessage({ type: 'success', text: 'Submission graded' })
            fetchSubmissions()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Grading failed' })
        }
    }

    const updateGrading = (id, field, value) => {
        setGrading((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Review Submissions</h1>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {loading ? (
                <p className="text-slate-400">Loading submissions...</p>
            ) : submissions.length === 0 ? (
                <p className="text-slate-400">No submissions to review.</p>
            ) : (
                <div className="space-y-4">
                    {submissions.map((sub) => (
                        <div key={sub._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-semibold text-white">{sub.studentName || sub.studentId?.name || 'Student'}</p>
                                    <p className="text-sm text-slate-400 mt-1">Assignment: {sub.assignmentTitle || sub.assignmentId?.title || 'N/A'}</p>
                                    <p className="text-sm text-slate-400 mt-1">Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}</p>
                                    {sub.content && <p className="text-sm text-slate-300 mt-2">{sub.content}</p>}
                                </div>
                                <div className="w-full sm:w-auto">
                                    {sub.status === 'reviewed' ? (
                                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">Graded: {sub.score}</span>
                                    ) : (
                                        <div className="space-y-2">
                                            <input type="number" placeholder="Score" value={grading[sub._id]?.score || ''}
                                                onChange={(e) => updateGrading(sub._id, 'score', e.target.value)}
                                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" />
                                            <input placeholder="Feedback" value={grading[sub._id]?.feedback || ''}
                                                onChange={(e) => updateGrading(sub._id, 'feedback', e.target.value)}
                                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" />
                                            <button onClick={() => handleGrade(sub._id)}
                                                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950">
                                                Grade
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
