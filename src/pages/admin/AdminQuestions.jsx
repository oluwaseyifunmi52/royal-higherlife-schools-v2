import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminQuestions, deleteAdminQuestion, updateQuestionStatus } from '../../services/adminService'

export default function AdminQuestions() {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ className: '', subject: '', topic: '', status: '' })
    const [message, setMessage] = useState({ type: '', text: '' })

    const fetchQuestions = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.className) params.className = filters.className
            if (filters.subject) params.subject = filters.subject
            if (filters.topic) params.topic = filters.topic
            if (filters.status) params.status = filters.status
            const res = await getAdminQuestions(params)
            setQuestions(res.data.data || res.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load questions' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchQuestions() }, [])

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return
        try {
            await deleteAdminQuestion(id)
            setMessage({ type: 'success', text: 'Question deleted' })
            fetchQuestions()
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete question' })
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateQuestionStatus(id, status)
            setMessage({ type: 'success', text: `Question ${status}` })
            fetchQuestions()
        } catch {
            setMessage({ type: 'error', text: 'Failed to update status' })
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
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Questions</h1>
                    <p className="mt-3 text-lg text-slate-400">View and manage all questions across the school.</p>
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
                <input name="topic" value={filters.topic} onChange={handleFilterChange} placeholder="Filter by topic..." className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500" />
                <select name="status" value={filters.status} onChange={handleFilterChange} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="private">Private</option>
                </select>
                <button onClick={fetchQuestions} className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-slate-950 text-sm">Apply</button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading questions...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Question</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Topic</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Marks</th>
                                    <th className="px-4 py-3">Difficulty</th>
                                    <th className="px-4 py-3">Teacher</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q) => (
                                    <tr key={q._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white max-w-xs truncate">{q.questionText || q.text || q.question || 'Untitled'}</td>
                                        <td className="px-4 py-3">{q.className || 'N/A'}</td>
                                        <td className="px-4 py-3">{q.subject || 'N/A'}</td>
                                        <td className="px-4 py-3">{q.topic || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 capitalize">{q.questionType?.replace('_', ' ') || 'N/A'}</span>
                                        </td>
                                        <td className="px-4 py-3">{q.marks || 1}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {q.difficulty || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{q.teacherId?.name || q.teacherId?.firstName + ' ' + q.teacherId?.lastName || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${q.status === 'published' ? 'bg-green-500/20 text-green-400' : q.status === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                {q.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusChange(q._id, q.status === 'published' ? 'draft' : 'published')} className="text-sm font-semibold text-slate-950 bg-amber-500 px-3 py-1.5 rounded-lg hover:bg-amber-400">
                                                    {q.status === 'published' ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button onClick={() => handleDelete(q._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {questions.length === 0 && <p className="mt-4 text-sm text-slate-400">No questions found.</p>}
                </div>
            )}
        </main>
    )
}
