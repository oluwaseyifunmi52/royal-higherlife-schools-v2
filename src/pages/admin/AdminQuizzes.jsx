import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminQuizzes, deleteAdminQuiz, updateQuizStatus, getQuizResults } from '../../services/adminService'

export default function AdminQuizzes() {
    const navigate = useNavigate()
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ className: '', subject: '', status: '' })
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showResults, setShowResults] = useState(false)
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [results, setResults] = useState(null)

    const fetchQuizzes = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.className) params.className = filters.className
            if (filters.subject) params.subject = filters.subject
            if (filters.status) params.status = filters.status
            const res = await getAdminQuizzes(params)
            setQuizzes(res.data.data || res.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load quizzes' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchQuizzes() }, [])

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quiz?')) return
        try {
            await deleteAdminQuiz(id)
            setMessage({ type: 'success', text: 'Quiz deleted' })
            fetchQuizzes()
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete quiz' })
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateQuizStatus(id, status)
            setMessage({ type: 'success', text: `Quiz ${status}` })
            fetchQuizzes()
        } catch {
            setMessage({ type: 'error', text: 'Failed to update status' })
        }
    }

    const handleViewResults = async (quiz) => {
        setSelectedQuiz(quiz)
        try {
            const res = await getQuizResults(quiz._id)
            setResults(res.data.data)
            setShowResults(true)
        } catch {
            setMessage({ type: 'error', text: 'Failed to load results' })
        }
    }

    const getAllClasses = () => [
        'Creche', 'Nursery 1', 'Nursery 2', 'Kindergarten 1', 'Kindergarten 2',
        'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
        'JSS 1', 'JSS 2', 'JSS 3',
        'SS 1', 'SS 2', 'SS 3'
    ]

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Quizzes</h1>
                    <p className="mt-3 text-lg text-slate-400">View and manage all quizzes across the school.</p>
                </div>
                <button onClick={() => navigate('/admin/academics')} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:border-amber-400 hover:text-amber-300">
                    Back to Academics
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 flex flex-wrap gap-3">
                <select name="className" value={filters.className} onChange={handleFilterChange} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white">
                    <option value="">All Classes</option>
                    {getAllClasses().map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>
                <input name="subject" value={filters.subject} onChange={handleFilterChange} placeholder="Filter by subject..." className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500" />
                <select name="status" value={filters.status} onChange={handleFilterChange} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white">
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
                <button onClick={fetchQuizzes} className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-slate-950 text-sm">Apply</button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading quizzes...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Topic</th>
                                    <th className="px-4 py-3">Teacher</th>
                                    <th className="px-4 py-3">Questions</th>
                                    <th className="px-4 py-3">Marks</th>
                                    <th className="px-4 py-3">Time Limit</th>
                                    <th className="px-4 py-3">Attempts</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.map((q) => (
                                    <tr key={q._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{q.title || 'Untitled'}</td>
                                        <td className="px-4 py-3">{q.className || 'N/A'}</td>
                                        <td className="px-4 py-3">{q.subject || 'N/A'}</td>
                                        <td className="px-4 py-3">{q.topic || 'N/A'}</td>
                                        <td className="px-4 py-3">{q.teacherId?.name || q.teacherId?.firstName + ' ' + q.teacherId?.lastName || 'N/A'}</td>
                                        <td className="px-4 py-3">{q.questions?.length || 0}</td>
                                        <td className="px-4 py-3">{q.totalMarks || 0}</td>
                                        <td className="px-4 py-3">{q.timeLimit ? q.timeLimit + ' min' : 'No limit'}</td>
                                        <td className="px-4 py-3">{q.attemptsAllowed || 1}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${q.status === 'published' ? 'bg-green-500/20 text-green-400' : q.status === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {q.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusChange(q._id, q.status === 'published' ? 'draft' : 'published')} className="text-sm font-semibold text-slate-950 bg-amber-500 px-3 py-1.5 rounded-lg hover:bg-amber-400">
                                                    {q.status === 'published' ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button onClick={() => handleViewResults(q)} className="text-sm font-semibold text-blue-400 hover:text-blue-300">Results</button>
                                                <button onClick={() => handleDelete(q._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {quizzes.length === 0 && <p className="mt-4 text-sm text-slate-400">No quizzes found.</p>}
                </div>
            )}

            {showResults && selectedQuiz && results && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-[2rem] border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">{selectedQuiz.title} - Results</h2>
                            <button onClick={() => { setShowResults(false); setSelectedQuiz(null); setResults(null) }} className="text-slate-400 hover:text-white text-2xl">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-4 text-sm">
                                <div><p className="text-slate-400">Total Attempts</p><p className="font-semibold text-white">{results.attempts?.length || 0}</p></div>
                                <div><p className="text-slate-400">Average</p><p className="font-semibold text-amber-400">{results.attempts && results.attempts.length > 0 ? Math.round(results.attempts.reduce((s, a) => s + (a.percentage || 0), 0) / results.attempts.length) + '%' : 'N/A'}</p></div>
                                <div><p className="text-slate-400">Highest</p><p className="font-semibold text-green-400">{results.attempts && results.attempts.length > 0 ? Math.max(...results.attempts.map(a => a.percentage || 0)) + '%' : 'N/A'}</p></div>
                                <div><p className="text-slate-400">Quiz Marks</p><p className="font-semibold text-white">{selectedQuiz.totalMarks || 0}</p></div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-left text-slate-400">
                                            <th className="px-4 py-3">Student</th>
                                            <th className="px-4 py-3">Attempt</th>
                                            <th className="px-4 py-3">Score</th>
                                            <th className="px-4 py-3">%</th>
                                            <th className="px-4 py-3">Grade</th>
                                            <th className="px-4 py-3">Submitted</th>
                                            <th className="px-4 py-3">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.attempts?.map((a) => (
                                            <tr key={a._id} className="border-t border-slate-800 text-slate-300">
                                                <td className="px-4 py-3">{a.studentName}</td>
                                                <td className="px-4 py-3">#{a.attemptNumber}</td>
                                                <td className="px-4 py-3">{a.score} / {a.totalMarks}</td>
                                                <td className="px-4 py-3 font-semibold text-amber-400">{a.percentage}%</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${a.grade === 'A' ? 'bg-green-500/20 text-green-400' : a.grade === 'B' ? 'bg-blue-500/20 text-blue-400' : a.grade === 'C' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {a.grade}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{new Date(a.submittedAt).toLocaleString()}</td>
                                                <td className="px-4 py-3">{a.timeTaken ? Math.round(a.timeTaken / 60) + 'm' : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
