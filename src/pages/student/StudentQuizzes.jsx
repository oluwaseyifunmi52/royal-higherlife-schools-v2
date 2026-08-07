import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getActiveQuizzes } from '../../services/studentService'

export default function StudentQuizzes() {
    const { user } = useAuth()
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })

    const fetchQuizzes = async () => {
        setLoading(true)
        try {
            const res = await getActiveQuizzes()
            setQuizzes(res.data.data || [])
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load quizzes' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuizzes()
    }, [])

    const formatTime = (minutes) => {
        if (!minutes) return 'No limit'
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return h > 0 ? `${h}h ${m}m` : `${m}m`
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center gap-6">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/30 bg-slate-800 flex-shrink-0">
                    {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400">
                            {(user?.firstName || 'S')[0]}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                    <h1 className="mt-1 text-3xl font-semibold text-white">
                        Available Quizzes
                    </h1>
                    <p className="mt-1 text-slate-400">
                        Class: <span className="font-semibold text-white">{user?.studentProfile?.class || 'N/A'}</span>
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {loading ? (
                <p className="text-slate-400">Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-12 text-center">
                    <p className="text-slate-400 text-lg">No active quizzes at the moment</p>
                    <p className="text-slate-500 mt-2">Check back later for new quizzes from your teachers</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Link key={quiz._id} to={`/student/quizzes/${quiz._id}`} className="block">
                            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 hover:border-amber-500/50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-white">{quiz.title}</h3>
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">Active</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-2">{quiz.subject}</p>
                                {quiz.topic && <p className="text-sm text-slate-500 mb-2">Topic: {quiz.topic}</p>}
                                {quiz.description && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{quiz.description}</p>}
                                
                                <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4">
                                    <span>{quiz.questions?.length || 0} questions</span>
                                    <span>{quiz.totalMarks || 0} marks</span>
                                    <span>{formatTime(quiz.timeLimit)}</span>
                                    <span>{quiz.attemptsAllowed} attempt(s)</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {quiz.attemptsUsed > 0 && (
                                            <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                                                {quiz.attemptsUsed}/{quiz.attemptsAllowed} used
                                            </span>
                                        )}
                                        {quiz.canAttempt === false && (
                                            <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                                                No attempts left
                                            </span>
                                        )}
                                    </div>
                                    {quiz.canAttempt && (
                                        <span className="px-4 py-2 rounded-full bg-amber-500 text-slate-950 text-sm font-semibold">
                                            Start Quiz
                                        </span>
                                    )}
                                </div>

                                {quiz.latestAttempt && (
                                    <div className="mt-3 pt-3 border-t border-slate-800">
                                        <p className="text-xs text-slate-400">Your last attempt:</p>
                                        <div className="flex gap-4 mt-1 text-sm">
                                            <span className="font-semibold text-amber-400">{quiz.latestAttempt.score}/{quiz.latestAttempt.totalMarks}</span>
                                            <span className="font-semibold text-white">{quiz.latestAttempt.percentage}%</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                quiz.latestAttempt.grade === 'A' ? 'bg-green-500/20 text-green-400' :
                                                quiz.latestAttempt.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                                                quiz.latestAttempt.grade === 'C' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {quiz.latestAttempt.grade}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}