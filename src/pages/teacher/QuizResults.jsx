import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getQuizResults, getQuizAttempt, gradeQuizAttempt } from '../../services/teacherService'

export default function QuizResults() {
    const { id } = useParams()
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [selectedAttempt, setSelectedAttempt] = useState(null)
    const [grading, setGrading] = useState({ attemptId: '', questionIndex: -1, score: '', feedback: '' })

    const fetchResults = async () => {
        setLoading(true)
        try {
            const res = await getQuizResults(id)
            setResults(res.data.data)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load results' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResults()
    }, [id])

    const handleViewAttempt = async (attempt) => {
        try {
            const res = await getQuizAttempt(attempt._id)
            setSelectedAttempt(res.data.data)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load attempt details' })
        }
    }

    const handleGrade = async (attemptId, questionIndex, score, feedback) => {
        try {
            await gradeQuizAttempt(attemptId, { questionIndex, score: parseFloat(score), feedback })
            setMessage({ type: 'success', text: 'Question graded successfully' })
            // Refresh the selected attempt
            const res = await getQuizAttempt(attemptId)
            setSelectedAttempt(res.data.data)
            // Refresh results list
            fetchResults()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Grading failed' })
        }
        setGrading({ attemptId: '', questionIndex: -1, score: '', feedback: '' })
    }

    const startGrading = (attemptId, questionIndex, maxScore, currentScore) => {
        setGrading({ attemptId, questionIndex, score: currentScore, feedback: '' })
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-slate-400">Loading results...</p>
            </main>
        )
    }

    if (!results) return null

    const { quiz, attempts } = results

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">{quiz.title} - Results</h1>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 mb-8">
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Total Attempts</p>
                        <p className="text-2xl font-bold text-white">{attempts?.length || 0}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Average Score</p>
                        <p className="text-2xl font-bold text-amber-400">
                            {attempts && attempts.length > 0
                                ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length) + '%'
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Highest Score</p>
                        <p className="text-2xl font-bold text-green-400">
                            {attempts && attempts.length > 0
                                ? Math.max(...attempts.map(a => a.percentage || 0)) + '%'
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Quiz Status</p>
                        <p className="text-2xl font-bold text-white">
                            <span className={`px-2 py-1 rounded-full text-xs ${quiz.published ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {quiz.published ? 'Published' : 'Draft'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Student Attempts</h2>
                {attempts && attempts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                                    <th className="pb-3 font-semibold text-white">Student</th>
                                    <th className="pb-3 font-semibold text-white">Attempt</th>
                                    <th className="pb-3 font-semibold text-white">Score</th>
                                    <th className="pb-3 font-semibold text-white">Percentage</th>
                                    <th className="pb-3 font-semibold text-white">Grade</th>
                                    <th className="pb-3 font-semibold text-white">Submitted</th>
                                    <th className="pb-3 font-semibold text-white">Time Taken</th>
                                    <th className="pb-3 font-semibold text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map((attempt) => (
                                    <tr key={attempt._id} className="border-b border-slate-800/50 hover:bg-slate-950/50">
                                        <td className="py-3 text-sm text-white">{attempt.studentName}</td>
                                        <td className="py-3 text-sm text-slate-400">#{attempt.attemptNumber}</td>
                                        <td className="py-3 text-sm font-semibold text-white">{attempt.score} / {attempt.totalMarks}</td>
                                        <td className="py-3 text-sm font-semibold text-amber-400">{attempt.percentage}%</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                attempt.grade === 'A' ? 'bg-green-500/20 text-green-400' :
                                                attempt.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                                                attempt.grade === 'C' ? 'bg-amber-500/20 text-amber-400' :
                                                attempt.grade === 'D' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {attempt.grade}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-slate-400">{new Date(attempt.submittedAt).toLocaleString()}</td>
                                        <td className="py-3 text-sm text-slate-400">
                                            {attempt.timeTaken ? Math.round(attempt.timeTaken / 60) + 'm ' + (attempt.timeTaken % 60) + 's' : 'N/A'}
                                        </td>
                                        <td className="py-3">
                                            <button onClick={() => handleViewAttempt(attempt)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-8">No attempts yet</p>
                )}
            </div>

            {selectedAttempt && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-[2rem] border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Attempt Details - {selectedAttempt.studentName}</h2>
                            <button onClick={() => setSelectedAttempt(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid gap-4 md:grid-cols-4 text-sm">
                                <div><p className="text-slate-400">Score</p><p className="font-semibold text-white">{selectedAttempt.score} / {selectedAttempt.totalMarks}</p></div>
                                <div><p className="text-slate-400">Percentage</p><p className="font-semibold text-amber-400">{selectedAttempt.percentage}%</p></div>
                                <div><p className="text-slate-400">Grade</p><p className="font-semibold text-white">{selectedAttempt.grade}</p></div>
                                <div><p className="text-slate-400">Submitted</p><p className="font-semibold text-white">{new Date(selectedAttempt.submittedAt).toLocaleString()}</p></div>
                            </div>

                            <h3 className="text-lg font-semibold text-white">Answers</h3>
                            <div className="space-y-4">
                                {selectedAttempt.answers?.map((answer, idx) => {
                                    const question = selectedAttempt.quizId?.questions?.[answer.questionIndex]
                                    return (
                                        <div key={answer.questionIndex} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="font-semibold text-white">{idx + 1}. {question?.questionText || 'Question'}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${answer.correct ? 'bg-green-500/20 text-green-400' : answer.autoGraded ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                    {answer.autoGraded ? (answer.correct ? 'Correct' : 'Incorrect') : 'Needs Grading'}
                                                </span>
                                            </div>
                                            
                                            {question?.questionType === 'multiple_choice' && question.options && (
                                                <div className="grid gap-1 ml-4 mb-3">
                                                    {question.options.map((opt, oi) => (
                                                        <div key={oi} className={`flex items-center gap-2 text-sm ${oi === answer.answer ? 'text-amber-400' : oi === question.correctAnswer ? 'text-green-400' : 'text-slate-300'}`}>
                                                            <span className="font-semibold w-6">{String.fromCharCode(65 + oi)}.</span>
                                                            <span>{opt}</span>
                                                            {oi === question.correctAnswer && <span className="text-green-400">✓</span>}
                                                            {oi === answer.answer && oi !== question.correctAnswer && <span className="text-red-400">✗</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {question?.questionType === 'true_false' && (
                                                <p className="text-slate-300 ml-4 mb-3">Student Answer: <span className="font-semibold">{answer.answer ? 'True' : 'False'}</span></p>
                                            )}
                                            
                                            {question?.questionType === 'short_answer' && (
                                                <p className="text-slate-300 ml-4 mb-3">Student Answer: <span className="font-semibold">{answer.answer || 'No answer'}</span></p>
                                            )}
                                            
                                            {question?.questionType === 'essay' && (
                                                <div className="ml-4 mb-3">
                                                    <p className="text-slate-300">Student Answer:</p>
                                                    <p className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-slate-300 whitespace-pre-wrap">{answer.answer || 'No answer provided'}</p>
                                                </div>
                                            )}

                                            {!answer.autoGraded && (
                                                <div className="flex gap-3 mt-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={question?.marks || 1}
                                                        step="0.5"
                                                        value={grading.attemptId === selectedAttempt._id && grading.questionIndex === answer.questionIndex ? grading.score : answer.score}
                                                        onChange={(e) => setGrading({ ...grading, attemptId: selectedAttempt._id, questionIndex: answer.questionIndex, score: e.target.value })}
                                                        className="w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm"
                                                        placeholder="Score"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={grading.attemptId === selectedAttempt._id && grading.questionIndex === answer.questionIndex ? grading.feedback : answer.feedback || ''}
                                                        onChange={(e) => setGrading({ ...grading, attemptId: selectedAttempt._id, questionIndex: answer.questionIndex, feedback: e.target.value })}
                                                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm"
                                                        placeholder="Feedback (optional)"
                                                    />
                                                    {grading.attemptId === selectedAttempt._id && grading.questionIndex === answer.questionIndex ? (
                                                        <>
                                                            <button onClick={() => handleGrade(selectedAttempt._id, answer.questionIndex, grading.score, grading.feedback)} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-400">Save</button>
                                                            <button onClick={() => setGrading({ attemptId: '', questionIndex: -1, score: '', feedback: '' })} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500">Cancel</button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => startGrading(selectedAttempt._id, answer.questionIndex, question?.marks || 1, answer.score)} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400">Grade</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}