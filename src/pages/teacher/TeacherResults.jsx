import { useEffect, useState } from 'react'
import { enterBatchScores } from '../../services/resultService'
import { getMyAssignedClasses, getMyAssignedStudents } from '../../services/teacherService'

export default function TeacherResults() {
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState('')
    const [students, setStudents] = useState([])
    const [scores, setScores] = useState({})
    const [term, setTerm] = useState('First Term')
    const [session, setSession] = useState(`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getMyAssignedClasses()
                setClasses(res.data.data?.classes || res.data.data || [])
            } catch { /* ignore */ }
        }
        fetchClasses()
    }, [])

    const fetchStudents = async (classId) => {
        setLoading(true)
        try {
            const res = await getMyAssignedStudents()
            const allStudents = res.data.data?.students || res.data.data || []
            const classStudents = classId
                ? allStudents.filter((s) => s.classId === classId || s.class === classId || s.studentProfile?.class === classId)
                : allStudents
            setStudents(classStudents)
            const initial = {}
            classStudents.forEach((s) => { initial[s._id] = { caScore: '', examScore: '', subject: '', remarks: '' } })
            setScores(initial)
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    useEffect(() => {
        if (selectedClass) fetchStudents(selectedClass)
    }, [selectedClass])

    const handleChange = (studentId, field, value) => {
        setScores((prev) => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }))
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const records = Object.entries(scores)
                .filter(([, s]) => s.caScore !== '' || s.examScore !== '')
                .map(([studentId, s]) => ({
                    studentId,
                    classId: selectedClass,
                    caScore: Number(s.caScore) || 0,
                    examScore: Number(s.examScore) || 0,
                    totalScore: (Number(s.caScore) || 0) + (Number(s.examScore) || 0),
                    subject: s.subject,
                    remarks: s.remarks,
                    term,
                    session,
                }))
            await enterBatchScores({ records })
            setMessage({ type: 'success', text: 'Scores saved successfully' })
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save scores' })
        } finally { setSaving(false) }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Enter Results</h1>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Select Class</span>
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">Choose a class</option>
                            {classes.map((cls) => <option key={cls._id} value={cls._id}>{cls.name || cls.className}</option>)}
                        </select>
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Term</span>
                        <select value={term} onChange={(e) => setTerm(e.target.value)}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="First Term">First Term</option>
                            <option value="Second Term">Second Term</option>
                            <option value="Third Term">Third Term</option>
                        </select>
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Session</span>
                        <input value={session} onChange={(e) => setSession(e.target.value)}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                </div>
            </div>

            {selectedClass && (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Enter Scores</h2>
                    {loading ? (
                        <p className="text-slate-400">Loading students...</p>
                    ) : students.length === 0 ? (
                        <p className="text-slate-400">No students in this class.</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-left text-slate-400">
                                            <th className="px-4 py-3">Student</th>
                                            <th className="px-4 py-3">Subject</th>
                                            <th className="px-4 py-3">CA Score</th>
                                            <th className="px-4 py-3">Exam Score</th>
                                            <th className="px-4 py-3">Total</th>
                                            <th className="px-4 py-3">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => {
                                            const s = scores[student._id] || { caScore: '', examScore: '', subject: '', remarks: '' }
                                            const total = (Number(s.caScore) || 0) + (Number(s.examScore) || 0)
                                            return (
                                                <tr key={student._id} className="border-t border-slate-800 text-slate-300">
                                                    <td className="px-4 py-3 font-semibold text-white">{student.name || `${student.firstName || ''} ${student.lastName || ''}`}</td>
                                                    <td className="px-4 py-3">
                                                        <input value={s.subject} onChange={(e) => handleChange(student._id, 'subject', e.target.value)}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" placeholder="Subject" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input type="number" min="0" max="40" value={s.caScore}
                                                            onChange={(e) => handleChange(student._id, 'caScore', e.target.value)}
                                                            className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" placeholder="0" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input type="number" min="0" max="60" value={s.examScore}
                                                            onChange={(e) => handleChange(student._id, 'examScore', e.target.value)}
                                                            className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" placeholder="0" />
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-white">{total}</td>
                                                    <td className="px-4 py-3">
                                                        <input value={s.remarks} onChange={(e) => handleChange(student._id, 'remarks', e.target.value)}
                                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" placeholder="Remarks" />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button onClick={handleSave} disabled={saving}
                                    className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-slate-950 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Scores'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </main>
    )
}
