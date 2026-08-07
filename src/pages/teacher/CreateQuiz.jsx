import { useEffect, useState } from 'react'
import { createQuiz, getQuizzes, getQuizById, deleteQuiz, updateQuiz } from '../../services/quizService'
import { getMyAssignedClasses, getMyQuestions, getQuestionById } from '../../services/teacherService'
import { getAllClasses } from '../../config/classes'

export default function CreateQuiz() {
    const [classes, setClasses] = useState([])
    const [quizzes, setQuizzes] = useState([])
    const [questionBank, setQuestionBank] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [showQuestionBank, setShowQuestionBank] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        classId: '',
        subject: '',
        topic: '',
        timeLimit: '',
        attemptsAllowed: '',
        startDate: '',
        endDate: '',
        randomizeQuestions: false,
        showAnswersAfterSubmission: true,
        published: false,
        questions: [],
        totalMarks: '10',
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [clsRes, quizRes, qBankRes] = await Promise.allSettled([
                getMyAssignedClasses(),
                getQuizzes(),
                getMyQuestions(),
            ])
            if (clsRes.status === 'fulfilled') setClasses(clsRes.value.data.data?.classes || clsRes.value.data.data || [])
            if (quizRes.status === 'fulfilled') setQuizzes(quizRes.value.data.data?.quizzes || quizRes.value.data.data || [])
            if (qBankRes.status === 'fulfilled') {
                const data = qBankRes.value.data.data || qBankRes.value.data || []
                setQuestionBank(Array.isArray(data) ? data : [])
            }
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const resetForm = () => {
        setForm({
            title: '', description: '', classId: '', subject: '', topic: '', timeLimit: '',
            attemptsAllowed: '', startDate: '', endDate: '', randomizeQuestions: false,
            showAnswersAfterSubmission: true, published: false, questions: [], totalMarks: '10',
        })
        setEditingId(null)
        setShowForm(false)
        setShowQuestionBank(false)
    }

    const addQuestionFromBank = async (q) => {
        try {
            const res = await getQuestionById(q._id)
            const fullQ = res.data.data || res.data
            const questionObj = {
                questionType: fullQ.questionType || fullQ.question_type || 'multiple_choice',
                questionText: fullQ.questionText || fullQ.question || '',
                options: fullQ.options || [],
                correctAnswer: fullQ.correctAnswer ?? fullQ.correct_answer ?? '',
                marks: fullQ.marks || 1,
            }
            setForm({ ...form, questions: [...form.questions, questionObj] })
        } catch {
            setMessage({ type: 'error', text: 'Failed to load question details' })
        }
    }

    const removeQuestion = (index) => {
        setForm({ ...form, questions: form.questions.filter((_, i) => i !== index) })
    }

    const totalQuestions = form.questions.length
    const totalMarks = form.questions.reduce((sum, q) => sum + (q.marks || 0), 0)

    const handleSubmit = async (e, publishedOverride) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                title: form.title,
                description: form.description,
                classId: form.classId,
                subject: form.subject,
                topic: form.topic,
                timeLimit: form.timeLimit ? Number(form.timeLimit) : null,
                attemptsAllowed: form.attemptsAllowed ? Number(form.attemptsAllowed) : null,
                startDate: form.startDate || null,
                endDate: form.endDate || null,
                randomizeQuestions: form.randomizeQuestions,
                showAnswersAfterSubmission: form.showAnswersAfterSubmission,
                published: publishedOverride ?? form.published,
                questions: form.questions,
            }
            if (editingId) {
                await updateQuiz(editingId, payload)
                setMessage({ type: 'success', text: 'Quiz updated' })
            } else {
                await createQuiz(payload)
                setMessage({ type: 'success', text: 'Quiz created' })
            }
            resetForm()
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        } finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quiz?')) return
        try { await deleteQuiz(id); fetchData() } catch { /* ignore */ }
    }

    const handleEdit = (quiz) => {
        setForm({
            title: quiz.title || '',
            description: quiz.description || '',
            classId: quiz.classId?._id || quiz.classId || quiz.class_id || '',
            subject: quiz.subject || '',
            topic: quiz.topic || '',
            timeLimit: quiz.timeLimit ? String(quiz.timeLimit) : '',
            attemptsAllowed: quiz.attemptsAllowed ? String(quiz.attemptsAllowed) : '',
            startDate: quiz.startDate ? quiz.startDate.split('T')[0] : '',
            endDate: quiz.endDate ? quiz.endDate.split('T')[0] : '',
            randomizeQuestions: !!quiz.randomizeQuestions,
            showAnswersAfterSubmission: quiz.showAnswersAfterSubmission ?? true,
            published: !!quiz.published,
            questions: quiz.questions || [],
            totalMarks: String(quiz.totalMarks || '10'),
        })
        setEditingId(quiz._id)
        setShowForm(true)
    }

    const allClasses = classes.length > 0 ? classes : getAllClasses()

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Quizzes</h1>
                </div>
                <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ New Quiz'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={(e) => handleSubmit(e, form.status)} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Quiz' : 'Create Quiz'}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400 sm:col-span-2">
                            <span className="mb-2 block">Description</span>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class *</span>
                            <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select class</option>
                                {allClasses.map((c) => <option key={c._id || c} value={c._id || c}>{c.name || c}</option>)}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject *</span>
                            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Topic</span>
                            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Time Limit (minutes)</span>
                            <input type="number" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: e.target.value })} min="1"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Number of Attempts</span>
                            <input type="number" value={form.attemptsAllowed} onChange={(e) => setForm({ ...form, attemptsAllowed: e.target.value })} min="1"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Start Date</span>
                            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">End Date</span>
                            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-400">
                            <input type="checkbox" checked={form.randomizeQuestions} onChange={(e) => setForm({ ...form, randomizeQuestions: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500" />
                            <span>Randomize Questions</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-400">
                            <input type="checkbox" checked={form.showAnswersAfterSubmission} onChange={(e) => setForm({ ...form, showAnswersAfterSubmission: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500" />
                            <span>Show Correct Answers After Submission</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-400">
                            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500" />
                            <span>Published</span>
                        </label>
                    </div>

                    <div className="mt-6 border-t border-slate-800 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-semibold text-white">Questions ({totalQuestions}) · {totalMarks} marks</h3>
                            <button type="button" onClick={() => setShowQuestionBank(!showQuestionBank)} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300">
                                {showQuestionBank ? 'Hide Question Bank' : 'Select from Question Bank'}
                            </button>
                        </div>

                        {showQuestionBank && (
                            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                <h4 className="text-sm font-semibold text-white mb-3">Question Bank</h4>
                                {questionBank.length === 0 ? (
                                    <p className="text-sm text-slate-400">No questions in bank.</p>
                                ) : (
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                        {questionBank.map((q) => (
                                            <div key={q._id} className="flex items-start justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                                                <div>
                                                    <p className="text-sm text-white">{q.question}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{q.subject} · {q.topic} · {q.marks || 1} marks</p>
                                                </div>
                                                <button type="button" onClick={() => addQuestionFromBank(q)}
                                                    className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-950">
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {form.questions.map((q, i) => (
                            <div key={i} className="mb-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm text-white"><span className="text-amber-400">Q{i + 1}.</span> {q.question}</p>
                                    <button type="button" onClick={() => removeQuestion(i)} className="text-xs text-red-400">Remove</button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{q.subject} · {q.topic} · {q.marks || 1} marks</p>
                            </div>
                        ))}

                        {form.questions.length === 0 && (
                            <p className="text-sm text-slate-400">No questions selected. Use the question bank above or add questions inline.</p>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button type="submit" disabled={saving}
                            className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                            {saving ? 'Saving...' : (form.published ? 'Publish Quiz' : 'Save as Draft')}
                        </button>
                        {form.published && (
                            <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={saving}
                                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:border-amber-400 hover:text-amber-300 disabled:opacity-50">
                                Save as Draft
                            </button>
                        )}
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading quizzes...</p>
            ) : (
                <div className="space-y-4">
                    {quizzes.map((q) => (
                        <div key={q._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-white">{q.title}</h3>
                                         <span className={`rounded-full border px-2 py-1 text-xs font-semibold capitalize ${q.published ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
                                             {q.published ? 'Published' : 'Draft'}
                                         </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{q.questions?.length || 0} questions · {q.totalMarks || 'N/A'} marks</p>
                                    <p className="text-xs text-slate-500 mt-1">{(q.classId?.name || q.className || 'N/A')} · {q.subject || 'N/A'} · {q.topic || 'N/A'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(q)} className="text-sm font-semibold text-amber-400">Edit</button>
                                    <button onClick={() => handleDelete(q._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {quizzes.length === 0 && <p className="text-slate-400">No quizzes found.</p>}
                </div>
            )}
        </main>
    )
}