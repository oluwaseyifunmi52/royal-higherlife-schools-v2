import { useEffect, useState } from 'react'
import { getMyAssignedClasses } from '../../services/teacherService'
import { getStudentsByClass } from '../../services/studentService'

export default function TeacherClassManagement() {
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState(null)
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [studentsLoading, setStudentsLoading] = useState(false)

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getMyAssignedClasses()
                setClasses(res.data.data?.classes || res.data.data || [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchClasses()
    }, [])

    const handleSelectClass = async (cls) => {
        setSelectedClass(cls)
        setStudentsLoading(true)
        try {
            const res = await getStudentsByClass(cls._id)
            setStudents(res.data.data?.students || res.data.data || [])
        } catch { /* ignore */ }
        finally { setStudentsLoading(false) }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Classes</h1>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading classes...</p>
            ) : classes.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <p className="text-slate-400">No classes assigned to you yet.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                        {classes.map((cls) => (
                            <button key={cls._id} onClick={() => handleSelectClass(cls)}
                                className={`rounded-[1.5rem] border bg-slate-900/80 p-5 text-left transition-colors ${
                                    selectedClass?._id === cls._id ? 'border-amber-500/50' : 'border-slate-800 hover:border-slate-700'
                                }`}>
                                <h3 className="font-semibold text-white">{cls.name || cls.className}</h3>
                                <p className="text-sm text-slate-400 mt-1">{cls.subject || 'Multiple Subjects'}</p>
                                <p className="text-xs text-slate-500 mt-1">{cls.studentsCount || '—'} students</p>
                            </button>
                        ))}
                    </div>

                    {selectedClass && (
                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Students in {selectedClass.name || selectedClass.className}
                            </h2>
                            {studentsLoading ? (
                                <p className="text-slate-400">Loading students...</p>
                            ) : students.length === 0 ? (
                                <p className="text-slate-400">No students found in this class.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-left text-slate-400">
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Admission No.</th>
                                                <th className="px-4 py-3">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((s) => (
                                                <tr key={s._id} className="border-t border-slate-800 text-slate-300">
                                                    <td className="px-4 py-3 font-semibold text-white">{s.name || `${s.firstName || ''} ${s.lastName || ''}`}</td>
                                                    <td className="px-4 py-3 font-mono text-xs">{s.studentProfile?.admissionNumber || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-slate-400">{s.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
