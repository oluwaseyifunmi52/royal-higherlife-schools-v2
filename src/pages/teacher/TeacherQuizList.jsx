import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CLASS_CATEGORIES, ALL_CLASSES } from '../../config/classes'
import { getMyQuizzes, createQuiz, updateQuiz, deleteQuiz, publishQuiz } from '../../services/teacherService'

export default function TeacherQuizList() {
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        className: '',
        subject: '',
        topic: '',
        timeLimit: 30,
        startDate: '',
        endDate: '',
        attemptsAllowed: 1,
        randomizeQuestions: false,
        showCorrectAnswers: false,
        showResultsImmediately: true,
        questions: [],
    })
    const [assignedClasses, setAssignedClasses] = useState([])
    const [assignedSubjects, setAssignedSubjects] = useState([])
    const [availableQuestions, setAvailableQuestions] = useState([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [quizzesRes, classesRes, subjectsRes] = await Promise.allSettled([
                getMyQuizzes(),
                getMyAssignedClasses(),
                getMySubjects(),
            ])
            if (quizzesRes.status === 'fulfilled') setQuizzes(quizzesRes.value.data.data || quizzesRes.value.data || [])
            if (classesRes.status === 'fulfilled') setAssignedClasses(classesRes.value.data.data?.classes || classesRes.value.data.data || [])
            if (subjectsRes.status === 'fulfilled') setAssignedSubjects(subjectsRes.value.data.data?.subjects || subjectsRes.value.data?.subjects || subjectsRes.value.data.data || [])
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load data' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const handleClassSubjectChange = () => {
        if (form.className && form.subject) {
            fetchAvailableQuestions()
        }
    }

    const fetchAvailableQuestions = async () => {
        try {
            const api = (await import('../../api/axios')).default
            const res = await api.get('/api/questions', {
                params: { className: form.className, subject: form.subject, status: 'published' }
            })
            setAvailableQuestions(res.data.data || [])
        } catch (err) {
            console.error('Failed to fetch questions:', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { ...form }
            data.questions = data.questions.map((q, i) => ({ ...q, order: i }))
            if (editing) {
                await updateQuiz(editing._id, data)
                setMessage({ type: 'success', text: 'Quiz updated successfully' })
            } else {
                await createQuiz(data)
                setMessage({ type: 'success', text: 'Quiz created successfully' })
            }
            setShowForm(false)
            setEditing(null)
            resetForm()
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            className: '',
            subject: '',
            topic: '',
            timeLimit: 30,
            startDate: '',
            endDate: '',
            attemptsAllowed: 1,
            randomizeQuestions: false,
            showCorrectAnswers: false,
            showResultsImmediately: true,
            questions: [],
        })
        setAvailableQuestions([])
    }

    const handleEdit = (quiz) => {
        setEditing(quiz)
        setForm({
            title: quiz.title,
            description: quiz.description,
            className: quiz.className,
            subject: quiz.subject,
            topic: quiz.topic,
            timeLimit: quiz.timeLimit || 30,
            startDate: quiz.startDate ? new Date(quiz.startDate).toISOString().slice(0, 16) : '',
            endDate: quiz.endDate ? new Date(quiz.endDate).toISOString().slice(0, 16) : '',
            attemptsAllowed: quiz.attemptsAllowed || 1,
            randomizeQuestions: quiz.randomizeQuestions || false,
            showCorrectAnswers: quiz.showCorrectAnswers || false,
            showResultsImmediately: quiz.showResultsImmediately !== false,
            questions: quiz.questions || [],
        })
        fetchAvailableQuestions()
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return
        try {
            await deleteQuiz(id)
            setMessage({ type: 'success', text: 'Quiz deleted' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    const handlePublish = async (id, status) => {
        try {
            await publishQuiz(id, status)
            setMessage({ type: 'success', text: `Quiz ${status}` })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' })
        }
    }

    const addQuestionToQuiz = (question) => {
        if (form.questions.some(q => q.questionId === question._id)) return
        setForm({
            ...form,
            questions: [...form.questions, {
                questionId: question._id,
                questionText: question.questionText,
                questionType: question.questionType,
                options: question.options,
                correctAnswer: question.correctAnswer,
                marks: question.marks || 1,
            }]
        })
    }

    const removeQuestionFromQuiz = (index) => {
        setForm({ ...form, questions: form.questions.filter((_, i) => i !== index) })
    }

    const getAvailableClasses = () => {
        if (assignedClasses.length > 0) {
            return assignedClasses.map(c => c.name || c.className).filter(Boolean)
        }
        return ALL_CLASSES
    }

    const getAvailableSubjects = () => {
        if (assignedSubjects.length > 0) return assignedSubjects
        return ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'Physical Education', 'Creative Arts', 'French', 'Yoruba', 'Igbo', 'Hausa']
    }

    const totalMarks = form.questions.reduce((sum, q) => sum + (q.marks || 0), 0)

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Quizzes</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); resetForm() }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ Create Quiz'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Quiz' : 'Create Quiz'}</h2>
                    
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Quiz Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. Fractions Quiz 1" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class *</span>
                            <select value={form.className} onChange={(e) => { setForm({ ...form, className: e.target.value }); handleClassSubjectChange() }} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Class</option>
                                {getAvailableClasses().map((cls) => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject *</span>
                            <select value={form.subject} onChange={(e) => { setForm({ ...form, subject: e.target.value }); handleClassSubjectChange() }} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Subject</option>
                                {getAvailableSubjects().map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Topic</span>
                            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. Fractions" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Time Limit (minutes)</span>
                            <input type="number" min="1" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: parseInt(e.target.value) || 30 })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Attempts Allowed</span>
                            <input type="number" min="1" value={form.attemptsAllowed} onChange={(e) => setForm({ ...form, attemptsAllowed: parseInt(e.target.value) || 1 })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Start Date</span>
                            <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">End Date</span>
                            <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>

                    <label className="block text-sm text-slate-400 mb-2">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full min-h-[80px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white mb-6" placeholder="Quiz instructions..." />

                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input type="checkbox" checked={form.randomizeQuestions} onChange={(e) => setForm({ ...form, randomizeQuestions: e.target.checked })} />
                            Randomize Questions
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input type="checkbox" checked={form.showCorrectAnswers} onChange={(e) => setForm({ ...form, showCorrectAnswers: e.target.checked })} />
                            Show Correct Answers After Submission
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input type="checkbox" checked={form.showResultsImmediately} onChange={(e) => setForm({ ...form, showResultsImmediately: e.target.checked })} />
                            Show Results Immediately
                        </label>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Questions</h3>
                            {availableQuestions.length > 0 && (
                                <span className="text-sm text-slate-400">Select from question bank</span>
                            )}
                        </div>
                        
                        {availableQuestions.length > 0 && (
                            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 max-h-60 overflow-y-auto">
                                <p className="text-sm text-slate-400 mb-2">Available Questions (click to add):</p>
                                <div className="grid gap-2">
                                    {availableQuestions.map((q) => (
                                        <button
                                            key={q._id}
                                            type="button"
                                            onClick={() => addQuestionToQuiz(q)}
                                            className="text-left p-3 rounded-xl border border-slate-700 bg-slate-900 hover:border-amber-500 transition-colors"
                                        >
                                            <div className="font-semibold text-white text-sm">{q.questionText}</div>
                                            <div className="flex gap-4 mt-1 text-xs text-slate-400">
                                                <span>{q.questionType.replace('_', ' ')}</span>
                                                <span>{q.marks} mark(s)</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {form.questions.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-white mb-2">Quiz Questions ({form.questions.length} questions, {totalMarks} marks)</h4>
                                <div className="grid gap-2">
                                    {form.questions.map((q, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-900">
                                            <span className="text-amber-400 font-semibold w-6">{idx + 1}.</span>
                                            <span className="flex-1 text-sm text-slate-300">{q.questionText}</span>
                                            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">{q.questionType.replace('_', ' ')}</span>
                                            <span className="text-sm text-white">{q.marks} marks</span>
                                            <button type="button" onClick={() => removeQuestionFromQuiz(idx)} className="text-red-400 hover:text-red-300">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {form.questions.length === 0 && availableQuestions.length === 0 && (
                            <p className="text-slate-500 text-center py-4">Select a class and subject to load questions from your question bank, or create questions first in the Questions section.</p>
                        )}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update Quiz' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading quizzes...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    {quizzes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">No quizzes found</p>
                            <p className="text-slate-500 mt-2">Click "Create Quiz" to create your first quiz</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((quiz) => (
                                <Link key={quiz._id} to={`/teacher/quizzes/${quiz._id}`} className="block">
                                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 hover:border-amber-500/50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-white">{quiz.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${quiz.published ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {quiz.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-2">{quiz.className} - {quiz.subject}</p>
                                        {quiz.topic && <p className="text-sm text-slate-500 mb-2">Topic: {quiz.topic}</p>}
                                        <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">
                                            <span>{quiz.questions?.length || 0} questions</span>
                                            <span>{quiz.totalMarks || quiz.calculatedTotalMarks || 0} marks</span>
                                            {quiz.timeLimit && <span>{quiz.timeLimit} min</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.preventDefault(); handlePublish(quiz._id, quiz.published ? 'draft' : 'published') }}
                                                className="text-sm font-semibold text-slate-950 bg-amber-500 px-3 py-1.5 rounded-lg hover:bg-amber-400 flex-1 text-center"
                                            >
                                                {quiz.published ? 'Unpublish' : 'Publish'}
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleEdit(quiz) }}
                                                className="text-sm font-semibold text-amber-400 hover:text-amber-300 px-3 py-1.5"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDelete(quiz._id) }}
                                                className="text-sm font-semibold text-red-400 hover:text-red-300 px-3 py-1.5"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}

import { getMyAssignedClasses, getMySubjects } from '../../services/teacherService'