import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyQuizAttempts } from '../../services/studentService'

export default function StudentQuizAttempts() {
    const [attempts, setAttempts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAttempts = async () => {
            setLoading(true)
            try {
                const res = await getMyQuizAttempts()
                const data = res.data.data || []
                setAttempts(Array.isArray(data) ? data : [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchAttempts()
    }, [])

    const getGrade = (percentage) => {
        if (percentage >= 90) return 'A'
        if (percentage >= 80) return 'B'
        if (percentage >= 70) return 'C'
        if (percentage >= 60) return 'D'
        if (percentage >= 50) return 'E'
        return 'F'
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Quiz Results</h1>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading results...</p>
            ) : attempts.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-12 text-center">
                    <p className="text-slate-400">No quiz attempts yet.</p>
                    <Link to="/student/quizzes" className="mt-4 inline-block rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                        Take a Quiz
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {attempts.map((attempt) => {
                        const quiz = attempt.quizId || {}
                        const score = attempt.score ?? 0
                        const total = attempt.totalMarks ?? 10
                        const percentage = attempt.percentage ?? (total > 0 ? Math.round((score / total) * 100) : 0)
                        const grade = attempt.grade || getGrade(percentage)
                        return (
                            <div key={attempt._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-white">{quiz.title || 'Quiz'}</h3>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Score: {score} / {total} · {percentage}% · Grade: {grade}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${grade === 'A' ? 'border-green-500/30 bg-green-500/10 text-green-300' : grade === 'F' ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
                                        {grade}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </main>
    )
}
