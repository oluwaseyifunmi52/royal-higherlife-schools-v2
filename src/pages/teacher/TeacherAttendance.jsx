import { useEffect, useState } from 'react'
import { markBulkAttendance } from '../../services/attendanceService'
import { getMyAssignedClasses, getMyAssignedStudents } from '../../services/teacherService'

export default function TeacherAttendance() {
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState('')
    const [students, setStudents] = useState([])
    const [attendance, setAttendance] = useState({})
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
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
            classStudents.forEach((s) => { initial[s._id] = 'present' })
            setAttendance(initial)
        } catch {
            setMessage({ type: 'error', text: 'Failed to load students' })
        } finally { setLoading(false) }
    }

    useEffect(() => {
        if (selectedClass) fetchStudents(selectedClass)
    }, [selectedClass])

    const handleStatusChange = (studentId, status) => {
        setAttendance((prev) => ({ ...prev, [studentId]: status }))
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId, classId: selectedClass, date, status,
            }))
            await markBulkAttendance({ records, date, classId: selectedClass })
            setMessage({ type: 'success', text: 'Attendance saved successfully' })
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save attendance' })
        } finally { setSaving(false) }
    }

    const statusColors = { present: 'bg-green-500/20 text-green-300 border-green-500/30', absent: 'bg-red-500/20 text-red-300 border-red-500/30', late: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Attendance</h1>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Select Class</span>
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                            <option value="">Choose a class</option>
                            {classes.map((cls) => <option key={cls._id} value={cls._id}>{cls.name || cls.className}</option>)}
                        </select>
                    </label>
                    <label className="block text-sm text-slate-400">
                        <span className="mb-2 block">Date</span>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                    </label>
                </div>
            </div>

            {selectedClass && (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Mark Attendance</h2>
                    {loading ? (
                        <p className="text-slate-400">Loading students...</p>
                    ) : students.length === 0 ? (
                        <p className="text-slate-400">No students in this class.</p>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {students.map((student) => (
                                    <div key={student._id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                        <div>
                                            <p className="font-semibold text-white">{student.name || `${student.firstName || ''} ${student.lastName || ''}`}</p>
                                            <p className="text-xs text-slate-500">{student.studentProfile?.admissionNumber || ''}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {['present', 'absent', 'late'].map((status) => (
                                                <button key={status} onClick={() => handleStatusChange(student._id, status)}
                                                    className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                                                        attendance[student._id] === status ? statusColors[status] : 'border-slate-700 text-slate-400 hover:text-white'
                                                    }`}>
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button onClick={handleSave} disabled={saving}
                                    className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-slate-950 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </main>
    )
}
