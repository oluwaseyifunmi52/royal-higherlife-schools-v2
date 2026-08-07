import { useEffect, useState } from 'react'
import { CLASS_CATEGORIES, ALL_CLASSES } from '../../config/classes'
import { getMyQuestions, createQuestion, updateQuestion, deleteQuestion, getQuestionById } from '../../services/teacherService'

export default function TeacherQuestions() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        questionText: '',
        questionType: 'multiple_choice',
        options: ['', ''],
        correctAnswer: '',
        marks: 1,
        difficulty: 'medium',
        className: '',
        subject: '',
        topic: '',
    })
    const [assignedClasses, setAssignedClasses] = useState([])
    const [assignedSubjects, setAssignedSubjects] = useState([])
    const [filter, setFilter] = useState({ className: '', subject: '', topic: '', questionType: '' })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [questionsRes, classesRes, subjectsRes] = await Promise.allSettled([
                getMyQuestions(),
                getMyAssignedClasses(),
                getMySubjects(),
            ])
            if (questionsRes.status === 'fulfilled') setQuestions(questionsRes.value.data.data || questionsRes.value.data || [])
            if (classesRes.status === 'fulfilled') setAssignedClasses(classesRes.value.data.data?.classes || classesRes.value.data.data || [])
            if (subjectsRes.status === 'fulfilled') setAssignedSubjects(subjectsRes.value.data.data?.subjects || subjectsRes.value.data?.subjects || subjectsRes.value.data.data || [])
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load data' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const filteredQuestions = questions.filter(q => {
        if (filter.className && q.className !== filter.className) return false
        if (filter.subject && q.subject !== filter.subject) return false
        if (filter.topic && q.topic !== filter.topic) return false
        if (filter.questionType && q.questionType !== filter.questionType) return false
        return true
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { ...form }
            if (data.questionType === 'multiple_choice') {
                data.options = data.options.filter(o => o.trim())
                if (data.options.length < 2) {
                    setMessage({ type: 'error', text: 'Multiple choice requires at least 2 options' })
                    return
                }
                data.correctAnswer = parseInt(data.correctAnswer)
            } else if (data.questionType === 'true_false') {
                data.correctAnswer = data.correctAnswer === 'true' || data.correctAnswer === true
            }
            if (editing) {
                await updateQuestion(editing._id, data)
                setMessage({ type: 'success', text: 'Question updated successfully' })
            } else {
                await createQuestion(data)
                setMessage({ type: 'success', text: 'Question added successfully' })
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
            questionText: '',
            questionType: 'multiple_choice',
            options: ['', ''],
            correctAnswer: '',
            marks: 1,
            difficulty: 'medium',
            className: '',
            subject: '',
            topic: '',
        })
    }

    const handleEdit = (question) => {
        setEditing(question)
        const newForm = {
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.options || ['', ''],
            correctAnswer: question.correctAnswer,
            marks: question.marks,
            difficulty: question.difficulty,
            className: question.className,
            subject: question.subject,
            topic: question.topic,
        }
        if (newForm.questionType === 'true_false') {
            newForm.correctAnswer = newForm.correctAnswer ? 'true' : 'false'
        }
        setForm(newForm)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return
        try {
            await deleteQuestion(id)
            setMessage({ type: 'success', text: 'Question deleted' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    const addOption = () => {
        setForm({ ...form, options: [...form.options, ''] })
    }

    const removeOption = (index) => {
        if (form.options.length <= 2) return
        const newOptions = form.options.filter((_, i) => i !== index)
        setForm({ ...form, options: newOptions })
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

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Question Bank</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); resetForm() }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ Add Question'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {!showForm && (
                <div className="mb-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <select value={filter.className} onChange={(e) => setFilter({ ...filter, className: e.target.value })}
                            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Classes</option>
                            {getAvailableClasses().map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                        <select value={filter.subject} onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Subjects</option>
                            {getAvailableSubjects().map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                        <input value={filter.topic} onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
                            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Filter by Topic" />
                        <select value={filter.questionType} onChange={(e) => setFilter({ ...filter, questionType: e.target.value })}
                            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">All Types</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                            <option value="short_answer">Short Answer</option>
                            <option value="essay">Essay</option>
                        </select>
                    </div>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Question' : 'Add Question'}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm text-slate-400 md:col-span-2">
                            <span className="mb-2 block">Question Text *</span>
                            <textarea value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} required
                                className="w-full min-h-[80px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Enter the question..." />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Question Type *</span>
                            <select value={form.questionType} onChange={(e) => setForm({ ...form, questionType: e.target.value, options: e.target.value === 'multiple_choice' ? ['', ''] : [''] })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="true_false">True/False</option>
                                <option value="short_answer">Short Answer</option>
                                <option value="essay">Essay</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class *</span>
                            <select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Class</option>
                                {getAvailableClasses().map((cls) => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject *</span>
                            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
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
                            <span className="mb-2 block">Marks</span>
                            <input type="number" min="1" value={form.marks} onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value) || 1 })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Difficulty</span>
                            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </label>
                    </div>

                    {form.questionType === 'multiple_choice' && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-white">Options</span>
                                <button type="button" onClick={addOption} className="text-sm text-amber-400 hover:text-amber-300">+ Add Option</button>
                            </div>
                            <div className="grid gap-2">
                                {form.options.map((opt, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input type="radio" name="correctAnswer" value={idx} checked={form.correctAnswer == idx} onChange={(e) => setForm({ ...form, correctAnswer: idx })} className="mt-2" />
                                        <input value={opt} onChange={(e) => {
                                            const newOptions = [...form.options]
                                            newOptions[idx] = e.target.value
                                            setForm({ ...form, options: newOptions })
                                        }}
                                            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder={`Option ${String.fromCharCode(65 + idx)}`} />
                                        {form.options.length > 2 && (
                                            <button type="button" onClick={() => removeOption(idx)} className="text-red-400 hover:text-red-300 mt-2">✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {form.questionType === 'true_false' && (
                        <div className="mt-4">
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Correct Answer</span>
                                <select value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </label>
                        </div>
                    )}

                    {form.questionType === 'short_answer' && (
                        <div className="mt-4">
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Correct Answer (exact match)</span>
                                <input value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Exact answer expected" />
                            </label>
                        </div>
                    )}

                    {form.questionType === 'essay' && (
                        <div className="mt-4">
                            <p className="text-sm text-slate-400">Essay questions are manually graded by the teacher.</p>
                        </div>
                    )}

                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update Question' : 'Add Question'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading questions...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    {filteredQuestions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">No questions found</p>
                            <p className="text-slate-500 mt-2">Click "Add Question" to create your first question</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                                        <th className="pb-3 font-semibold text-white">Question</th>
                                        <th className="pb-3 font-semibold text-white">Class</th>
                                        <th className="pb-3 font-semibold text-white">Subject</th>
                                        <th className="pb-3 font-semibold text-white">Topic</th>
                                        <th className="pb-3 font-semibold text-white">Type</th>
                                        <th className="pb-3 font-semibold text-white">Marks</th>
                                        <th className="pb-3 font-semibold text-white">Difficulty</th>
                                        <th className="pb-3 font-semibold text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuestions.map((q) => (
                                        <tr key={q._id} className="border-b border-slate-800/50 hover:bg-slate-950/50">
                                            <td className="py-3 text-sm text-slate-300 max-w-xs truncate">{q.questionText}</td>
                                            <td className="py-3 text-sm text-white">{q.className}</td>
                                            <td className="py-3 text-sm text-white">{q.subject}</td>
                                            <td className="py-3 text-sm text-slate-400">{q.topic || '-'}</td>
                                            <td className="py-3">
                                                <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 capitalize">{q.questionType.replace('_', ' ')}</span>
                                            </td>
                                            <td className="py-3 text-sm text-white">{q.marks}</td>
                                            <td className="py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs ${q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {q.difficulty}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(q)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                                    <button onClick={() => handleDelete(q._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}

import { getMyAssignedClasses, getMySubjects } from '../../services/teacherService'