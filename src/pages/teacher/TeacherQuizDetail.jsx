import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getMyQuizzes, updateQuiz, deleteQuiz, publishQuiz, getQuizResults } from '../../services/teacherService'

export default function TeacherQuizDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState(null)

    const fetchQuiz = async () => {
        setLoading(true)
        try {
            const api = (await import('../../api/axios')).default
            const res = await api.get(`/api/quizzes/${id}`)
            setQuiz(res.data.data)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load quiz' })
            navigate('/teacher/quizzes')
        } finally {
            setLoading(false)
        }
    }

    const fetchResults = async () => {
        try {
            const res = await getQuizResults(id)
            setResults(res.data.data)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load results' })
        }
    }

    useEffect(() => {
        fetchQuiz()
    }, [id])

    const handlePublish = async (status) => {
        try {
            await publishQuiz(id, status)
            setMessage({ type: 'success', text: `Quiz ${status}` })
            fetchQuiz()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' })
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return
        try {
            await deleteQuiz(id)
            setMessage({ type: 'success', text: 'Quiz deleted' })
            navigate('/teacher/quizzes')
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-slate-400">Loading quiz...</p>
            </main>
        )
    }

    if (!quiz) return null

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">{quiz.title}</h1>
                </div>
                <div className="flex gap-3">
                    <Link to="/teacher/quizzes" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back to Quizzes</Link>
                    <button onClick={() => handlePublish(quiz.published ? 'draft' : 'published')}
                        className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                        {quiz.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={handleDelete} className="rounded-full border border-red-500 px-6 py-3 font-semibold text-red-400 hover:bg-red-500/10">Delete</button>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Quiz Details</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-400">Class</p>
                                <p className="text-white font-semibold">{quiz.className}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Subject</p>
                                <p className="text-white font-semibold">{quiz.subject}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Topic</p>
                                <p className="text-white font-semibold">{quiz.topic || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Time Limit</p>
                                <p className="text-white font-semibold">{quiz.timeLimit ? quiz.timeLimit + ' minutes' : 'No limit'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Marks</p>
                                <p className="text-white font-semibold">{quiz.totalMarks || quiz.calculatedTotalMarks || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Questions</p>
                                <p className="text-white font-semibold">{quiz.questions?.length || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Attempts Allowed</p>
                                <p className="text-white font-semibold">{quiz.attemptsAllowed || 1}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Status</p>
                                <p className="text-white font-semibold">
                                    <span className={`px-2 py-1 rounded-full text-xs ${quiz.published ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {quiz.published ? 'Published' : 'Draft'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        {quiz.startDate && (
                            <div className="mt-4">
                                <p className="text-sm text-slate-400">Start Date</p>
                                <p className="text-white font-semibold">{new Date(quiz.startDate).toLocaleString()}</p>
                            </div>
                        )}
                        {quiz.endDate && (
                            <div className="mt-4">
                                <p className="text-sm text-slate-400">End Date</p>
                                <p className="text-white font-semibold">{new Date(quiz.endDate).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    {quiz.description && (
                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
                            <p className="text-slate-300 whitespace-pre-wrap">{quiz.description}</p>
                        </div>
                    )}

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Questions ({quiz.questions?.length || 0})</h2>
                        {quiz.questions && quiz.questions.length > 0 ? (
                            <div className="space-y-4">
                                {quiz.questions.map((q, idx) => (
                                    <div key={q._id || idx} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-semibold text-white">{idx + 1}. {q.questionText}</span>
                                            <span className="text-sm text-amber-400">{q.marks} mark(s)</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2 capitalize">{q.questionType.replace('_', ' ')}</p>
                                        
                                        {q.questionType === 'multiple_choice' && q.options && (
                                            <div className="grid gap-1 ml-4">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className={`flex items-center gap-2 text-sm ${oi === q.correctAnswer ? 'text-green-400' : 'text-slate-300'}`}>
                                                        <span className="font-semibold w-6">{String.fromCharCode(65 + oi)}.</span>
                                                        <span>{opt}</span>
                                                        {oi === q.correctAnswer && <span className="text-green-400">✓ Correct</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {q.questionType === 'true_false' && (
                                            <p className="text-slate-300 ml-4">Correct Answer: <span className="font-semibold text-green-400 capitalize">{q.correctAnswer}</span></p>
                                        )}
                                        
                                        {q.questionType === 'short_answer' && (
                                            <p className="text-slate-300 ml-4">Expected Answer: <span className="font-semibold text-green-400">{q.correctAnswer}</span></p>
                                        )}
                                        
                                        {q.questionType === 'essay' && (
                                            <p className="text-slate-500 ml-4 italic">Essay question - manually graded</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No questions added yet</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Randomize Questions</span>
                                <input type="checkbox" checked={quiz.randomizeQuestions} disabled className="w-5 h-5 text-amber-500" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Show Correct Answers</span>
                                <input type="checkbox" checked={quiz.showCorrectAnswers} disabled className="w-5 h-5 text-amber-500" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Show Results Immediately</span>
                                <input type="checkbox" checked={quiz.showResultsImmediately !== false} disabled className="w-5 h-5 text-amber-500" />
                            </label>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
                        <div className="space-y-3">
                            <Link to={`/teacher/quizzes/${id}/results`} className="block w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-amber-500 transition-colors">
                                <p className="font-semibold text-white">View Results</p>
                                <p className="text-sm text-slate-400">See student attempts and grades</p>
                            </Link>
                            <Link to={`/teacher/quizzes`} className="block w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-amber-500 transition-colors">
                                <p className="font-semibold text-white">Back to Quiz List</p>
                            </Link>
                        </div>
                    </div>

                    {showResults && results && (
                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Results Summary</h2>
                            <p className="text-slate-300">{results.attempts?.length || 0} attempt(s)</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}