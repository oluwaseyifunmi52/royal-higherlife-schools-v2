import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyQuizzes, getMyQuizById, submitMyQuiz } from '../../services/studentService'

export default function QuizPage() {
    const [quizzes, setQuizzes] = useState([])
    const [activeQuiz, setActiveQuiz] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true)
            try {
                const res = await getMyQuizzes()
                const data = res.data.data || res.data || []
                setQuizzes(Array.isArray(data) ? data : [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchQuizzes()
    }, [])

    useEffect(() => {
        if (timeLeft <= 0 || !activeQuiz?.timeLimit) return
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return t - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft, activeQuiz])

    useEffect(() => {
        if (timeLeft === 0 && activeQuiz && !submitted) {
            handleAutoSubmit()
        }
    }, [timeLeft, activeQuiz, submitted])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    const startQuiz = async (quiz) => {
        try {
            const res = await getMyQuizById(quiz._id)
            const data = res.data.data || res.data
            setActiveQuiz(data)
            setCurrentQuestion(0)
            setAnswers({})
            setTimeLeft(data.timeLimit ? data.timeLimit * 60 : 0)
            setSubmitted(false)
            setResult(null)
        } catch { /* ignore */ }
    }

    const handleAutoSubmit = async () => {
        if (!activeQuiz || submitted) return
        await handleSubmit()
    }

    const handleSubmit = async () => {
        if (!activeQuiz) return
        setSubmitting(true)
        try {
            const answersArray = activeQuiz.questions.map((q, i) => ({
                selectedAnswer: answers[i] ?? '',
            }))
            const res = await submitMyQuiz(activeQuiz._id, {
                answers: answersArray,
                timeTaken: activeQuiz.timeLimit ? (activeQuiz.timeLimit * 60 - timeLeft) : 0,
            })
            setResult(res.data.data || res.data)
            setSubmitted(true)
        } catch { /* ignore */ }
        finally { setSubmitting(false) }
    }

    const selectAnswer = (questionIndex, value) => {
        setAnswers((prev) => ({ ...prev, [questionIndex]: value }))
    }

    if (loading) return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-slate-400">Loading quizzes...</p></main>

    if (submitted && result) {
        const percentage = result.percentage ?? 0
        const grade = percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : 'F'
        return (
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Quiz Completed</p>
                    <h1 className="mt-4 text-4xl font-bold text-white">{activeQuiz?.title || 'Quiz'}</h1>
                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                            <p className="text-sm text-slate-400">Score</p>
                            <p className="mt-2 text-3xl font-bold text-white">{result.earnedMarks ?? result.score ?? 0} / {(result.totalMarks ?? (activeQuiz?.questions?.length || 0))}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                            <p className="text-sm text-slate-400">Percentage</p>
                            <p className="mt-2 text-3xl font-bold text-white">{percentage}%</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                            <p className="text-sm text-slate-400">Grade</p>
                            <p className="mt-2 text-3xl font-bold text-amber-400">{grade}</p>
                        </div>
                    </div>
                    {activeQuiz?.showAnswersAfterSubmission && (
                        <div className="mt-8 text-left">
                            <h2 className="text-xl font-semibold text-white mb-4">Review Answers</h2>
                            <div className="space-y-4">
                                {activeQuiz.questions?.map((q, i) => (
                                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                        <p className="text-sm text-white font-medium">Q{i + 1}. {q.questionText || q.question}</p>
                                        <p className="text-sm text-slate-400 mt-1">Your answer: {answers[i] ?? 'Not answered'}</p>
                                        <p className="text-sm text-green-400 mt-1">Correct answer: {q.correctAnswer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/student/quizzes" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Back to Quizzes</Link>
                        <Link to="/student/quiz-results" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:border-amber-400 hover:text-amber-300">View Results</Link>
                    </div>
                </div>
            </main>
        )
    }

    if (activeQuiz) {
        const question = activeQuiz.questions[currentQuestion]
        const totalQuestions = activeQuiz.questions?.length || 0
        const selectedAnswer = answers[currentQuestion]

        return (
            <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                        <h1 className="mt-2 text-2xl font-semibold text-white">{activeQuiz.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {timeLeft > 0 && (
                            <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${timeLeft < 60 ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-slate-700 bg-slate-950 text-white'}`}>
                                Time Remaining: {formatTime(timeLeft)}
                            </div>
                        )}
                        <span className="text-sm text-slate-400">{currentQuestion + 1} / {totalQuestions}</span>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
                    <div className="mb-6">
                        <span className="rounded-full border border-amber-500/30 px-2 py-1 text-xs text-amber-300 capitalize">{question?.questionType || 'question'}</span>
                        <span className="ml-2 rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">{question?.marks || 1} marks</span>
                    </div>
                    <p className="text-lg text-white mb-6">{question?.questionText || question?.question || 'Question'}</p>

                    {question?.questionType === 'multiple_choice' && question?.options && (
                        <div className="space-y-3">
                            {question.options.map((opt, j) => (
                                <button key={j} onClick={() => selectAnswer(currentQuestion, j)}
                                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${selectedAnswer === j ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-700 bg-slate-950 text-white hover:border-slate-600'}`}>
                                    <span className="font-semibold mr-2">{String.fromCharCode(65 + j)}.</span> {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {question?.questionType === 'true_false' && (
                        <div className="space-y-3">
                            {['True', 'False'].map((opt, j) => (
                                <button key={j} onClick={() => selectAnswer(currentQuestion, String(opt))}
                                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${selectedAnswer === String(opt) ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-700 bg-slate-950 text-white hover:border-slate-600'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {(question?.questionType === 'short_answer' || question?.questionType === 'essay') && (
                        <textarea
                            value={selectedAnswer ?? ''}
                            onChange={(e) => selectAnswer(currentQuestion, e.target.value)}
                            className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                            placeholder={question.questionType === 'essay' ? 'Write your essay here...' : 'Write your answer here...'}
                        />
                    )}

                    <div className="mt-8 flex flex-wrap justify-between gap-3">
                        <button type="button" onClick={() => setCurrentQuestion((q) => Math.max(q - 1, 0))} disabled={currentQuestion === 0}
                            className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white disabled:opacity-50 hover:border-amber-400 hover:text-amber-300">
                            Previous
                        </button>
                        {currentQuestion < totalQuestions - 1 ? (
                            <button type="button" onClick={() => setCurrentQuestion((q) => Math.min(q + 1, totalQuestions - 1))}
                                className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                                Next
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={submitting}
                                className="rounded-full bg-green-500 px-6 py-3 font-semibold text-white disabled:opacity-50">
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Quizzes</h1>
                <p className="mt-1 text-slate-400">Take your quizzes and test your knowledge.</p>
            </div>

            {quizzes.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-12 text-center">
                    <p className="text-slate-400">No quizzes available yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <h3 className="font-semibold text-white">{quiz.title}</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                {(quiz.classId?.name || 'N/A')} · {quiz.subject || 'N/A'} · {quiz.topic || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                                {quiz.questions?.length || 0} questions · {quiz.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0} marks · {quiz.timeLimit ? quiz.timeLimit + ' min' : 'No limit'}
                            </p>
                            <button onClick={() => startQuiz(quiz)}
                                className="mt-4 rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400">
                                Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
