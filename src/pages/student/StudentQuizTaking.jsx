import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getQuizForTaking, submitQuizAttempt } from '../../services/studentService'

const STORAGE_KEY = 'quiz_timer_'

export default function StudentQuizTaking() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [quiz, setQuiz] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [answers, setAnswers] = useState({})
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [message, setMessage] = useState({ type: '', text: '' })
    const timerRef = useRef(null)
    const startTimeRef = useRef(null)

    const storageKey = STORAGE_KEY + id

    const fetchQuiz = async () => {
        setLoading(true)
        try {
            const res = await getQuizForTaking(id)
            setQuiz(res.data.data)
            
            if (res.data.data.timeLimit) {
                // Check if we have a saved timer state
                const savedState = localStorage.getItem(storageKey)
                if (savedState) {
                    const { startTime, timeLimit } = JSON.parse(savedState)
                    const elapsed = Math.floor((Date.now() - startTime) / 1000)
                    const remaining = Math.max(0, timeLimit * 60 - elapsed)
                    if (remaining > 0) {
                        setTimeRemaining(remaining)
                        startTimeRef.current = startTime
                    } else {
                        // Time expired, clear storage
                        localStorage.removeItem(storageKey)
                        setTimeRemaining(0)
                        startTimeRef.current = Date.now()
                    }
                } else {
                    // New quiz attempt
                    const startTime = Date.now()
                    startTimeRef.current = startTime
                    localStorage.setItem(storageKey, JSON.stringify({ startTime, timeLimit: res.data.data.timeLimit }))
                    setTimeRemaining(res.data.data.timeLimit * 60)
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load quiz' })
            if (err.response?.status === 403) {
                setTimeout(() => navigate('/student/quizzes'), 3000)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuiz()
    }, [id])

    useEffect(() => {
        if (timeRemaining !== null && timeRemaining > 0 && quiz) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        localStorage.removeItem(storageKey)
                        handleAutoSubmit()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [timeRemaining, quiz])

    const handleAutoSubmit = async () => {
        if (submitting) return
        setSubmitting(true)
        try {
            const timeTaken = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0
            await submitQuizAttempt(id, { answers, timeTaken })
            localStorage.removeItem(storageKey)
            navigate(`/student/quizzes/${id}/result`)
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' })
            setSubmitting(false)
        }
    }

    const handleSubmit = async () => {
        if (submitting) return
        const confirmed = window.confirm('Are you sure you want to submit this quiz?')
        if (!confirmed) return
        
        setSubmitting(true)
        try {
            const timeTaken = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0
            await submitQuizAttempt(id, { answers, timeTaken })
            localStorage.removeItem(storageKey)
            navigate(`/student/quizzes/${id}/result`)
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' })
            setSubmitting(false)
        }
    }

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }))
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-slate-400 text-center">Loading quiz...</p>
            </main>
        )
    }

    if (!quiz) return null

    return (
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                    <h1 className="mt-1 text-2xl font-semibold text-white">{quiz.title}</h1>
                </div>
                {quiz.timeLimit && (
                    <div className={`text-right ${timeRemaining !== null && timeRemaining < 60 ? 'text-red-400 animate-pulse' : ''}`}>
                        <p className="text-sm text-slate-400">Time Remaining</p>
                        <p className="text-2xl font-mono font-bold text-white">{formatTime(timeRemaining || 0)}</p>
                    </div>
                )}
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {quiz.description && (
                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-300">{quiz.description}</p>
                </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                <div className="space-y-6">
                    {quiz.questions.map((q, idx) => (
                        <div key={q._id || idx} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-sm font-semibold text-amber-400">Question {idx + 1}</span>
                                    <span className="text-sm text-slate-400 ml-2">({q.marks} mark{ q.marks > 1 ? 's' : '' })</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs capitalize ${q.questionType === 'essay' ? 'bg-purple-500/20 text-purple-400' : q.questionType === 'short_answer' ? 'bg-blue-500/20 text-blue-400' : q.questionType === 'true_false' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {q.questionType.replace('_', ' ')}
                                </span>
                            </div>
                            
                            <p className="text-lg text-white mb-4">{q.questionText}</p>

                            {q.questionType === 'multiple_choice' && q.options && (
                                <div className="grid gap-2">
                                    {q.options.map((opt, oi) => (
                                        <label key={oi} className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-amber-500 transition-colors cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`q${idx}`}
                                                value={oi}
                                                checked={answers[idx] === oi}
                                                onChange={(e) => handleAnswerChange(idx, parseInt(e.target.value))}
                                                className="w-5 h-5 text-amber-500 border-slate-600 focus:ring-amber-500"
                                            />
                                            <span className="font-semibold text-white w-8">{String.fromCharCode(65 + oi)}.</span>
                                            <span className="text-slate-300">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {q.questionType === 'true_false' && (
                                <div className="grid gap-2 md:grid-cols-2">
                                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-amber-500 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`q${idx}`}
                                            value={true}
                                            checked={answers[idx] === true}
                                            onChange={(e) => handleAnswerChange(idx, true)}
                                            className="w-5 h-5 text-amber-500 border-slate-600 focus:ring-amber-500"
                                        />
                                        <span className="font-semibold text-white">True</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-amber-500 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`q${idx}`}
                                            value={false}
                                            checked={answers[idx] === false}
                                            onChange={(e) => handleAnswerChange(idx, false)}
                                            className="w-5 h-5 text-amber-500 border-slate-600 focus:ring-amber-500"
                                        />
                                        <span className="font-semibold text-white">False</span>
                                    </label>
                                </div>
                            )}

                            {q.questionType === 'short_answer' && (
                                <input
                                    type="text"
                                    value={answers[idx] || ''}
                                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="Type your answer here..."
                                />
                            )}

                            {q.questionType === 'essay' && (
                                <textarea
                                    value={answers[idx] || ''}
                                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                    className="w-full min-h-[150px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="Write your essay answer here..."
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-amber-500 px-8 py-4 font-semibold text-slate-950 text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                </div>
            </form>
        </main>
    )
}