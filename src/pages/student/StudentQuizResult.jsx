import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getQuizAttemptResult } from '../../services/studentService'

export default function StudentQuizResult() {
    const { id: attemptId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })

    const fetchResult = async () => {
        setLoading(true)
        try {
            const res = await getQuizAttemptResult(attemptId)
            setResult(res.data.data)
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load result' })
            navigate('/student/quiz-results')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResult()
    }, [attemptId])

    if (loading) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-slate-400 text-center">Loading result...</p>
            </main>
        )
    }

    if (!result) return null

    const { quizId, score, totalMarks, percentage, grade, submittedAt, answers, timeTaken } = result

    return (
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link to="/student/quizzes" className="text-sm font-semibold text-amber-400 hover:text-amber-300">← Back to Quizzes</Link>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 mb-8">
                <div className="text-center mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Quiz Completed</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">{quizId?.title || 'Quiz Result'}</h1>
                    <p className="mt-2 text-slate-400">{quizId?.subject} - {quizId?.className}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
                        <p className="text-sm text-slate-400">Score</p>
                        <p className="mt-2 text-4xl font-bold text-white">{score} / {totalMarks}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
                        <p className="text-sm text-slate-400">Percentage</p>
                        <p className="mt-2 text-4xl font-bold text-amber-400">{percentage}%</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
                        <p className="text-sm text-slate-400">Grade</p>
                        <p className="mt-2 text-4xl font-bold text-white">
                            <span className={`px-4 py-1 rounded-full ${grade === 'A' ? 'bg-green-500/20 text-green-400' : grade === 'B' ? 'bg-blue-500/20 text-blue-400' : grade === 'C' ? 'bg-amber-500/20 text-amber-400' : grade === 'D' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                                {grade}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <p><span className="text-slate-400">Submitted:</span> <span className="text-white ml-2">{new Date(submittedAt).toLocaleString()}</span></p>
                    <p><span className="text-slate-400">Time Taken:</span> <span className="text-white ml-2">{timeTaken ? Math.floor(timeTaken / 60) + 'm ' + (timeTaken % 60) + 's' : 'N/A'}</span></p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {answers && answers.length > 0 && (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Question Review</h2>
                    <div className="space-y-6">
                        {answers.map((answer, idx) => {
                            const question = quizId?.questions?.[answer.questionIndex]
                            return (
                                <div key={answer.questionIndex} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="font-semibold text-white">{idx + 1}. {question?.questionText || 'Question'}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${answer.correct ? 'bg-green-500/20 text-green-400' : answer.autoGraded !== false ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {answer.autoGraded !== false ? (answer.correct ? 'Correct' : 'Incorrect') : 'Not Auto-Graded'}
                                        </span>
                                    </div>

                                    {question?.questionType === 'multiple_choice' && question.options && (
                                        <div className="grid gap-1 ml-4">
                                            {question.options.map((opt, oi) => (
                                                <div key={oi} className={`flex items-center gap-2 text-sm ${oi === answer.answer ? 'text-amber-400' : oi === question.correctAnswer ? 'text-green-400' : 'text-slate-300'}`}>
                                                    <span className="font-semibold w-8">{String.fromCharCode(65 + oi)}.</span>
                                                    <span>{opt}</span>
                                                    {oi === question.correctAnswer && <span className="text-green-400">✓ Correct</span>}
                                                    {oi === answer.answer && oi !== question.correctAnswer && <span className="text-red-400">✗ Your Answer</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {question?.questionType === 'true_false' && (
                                        <div className="ml-4 space-y-1">
                                            <p className="text-slate-300">Your Answer: <span className="font-semibold {answer.answer === question.correctAnswer ? 'text-green-400' : 'text-red-400'}">{answer.answer ? 'True' : 'False'}</span></p>
                                            <p className="text-slate-300">Correct Answer: <span className="font-semibold text-green-400">{question.correctAnswer ? 'True' : 'False'}</span></p>
                                        </div>
                                    )}

                                    {question?.questionType === 'short_answer' && (
                                        <div className="ml-4 space-y-1">
                                            <p className="text-slate-300">Your Answer: <span className="font-semibold">{answer.answer || 'No answer'}</span></p>
                                            <p className="text-slate-300">Expected: <span className="font-semibold text-green-400">{question.correctAnswer}</span></p>
                                        </div>
                                    )}

                                    {question?.questionType === 'essay' && (
                                        <div className="ml-4">
                                            <p className="text-slate-300 mb-2">Your Answer:</p>
                                            <p className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-slate-300 whitespace-pre-wrap">{answer.answer || 'No answer provided'}</p>
                                            {answer.feedback && (
                                                <p className="text-amber-400 mt-2 text-sm">Teacher Feedback: {answer.feedback}</p>
                                            )}
                                            {answer.score !== undefined && (
                                                <p className="text-white mt-2">Score: <span className="font-semibold text-amber-400">{answer.score} / {answer.maxScore}</span></p>
                                            )}
                                        </div>
                                    )}

                                    {answer.feedback && question?.questionType !== 'essay' && (
                                        <p className="mt-2 text-amber-400 text-sm">Feedback: {answer.feedback}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <Link to="/student/quizzes" className="rounded-full border border-slate-700 px-8 py-3 font-semibold text-white hover:border-amber-500 hover:text-amber-400 transition-colors">
                    Back to Quizzes
                </Link>
            </div>
        </main>
    )
}