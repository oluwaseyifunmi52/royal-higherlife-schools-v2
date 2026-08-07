import { useEffect, useState } from 'react'
import { getMyAssignedClasses, getMyAssignedStudents } from '../../services/teacherService'

export default function ClassAnalytics() {
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clsRes, stuRes] = await Promise.allSettled([getMyAssignedClasses(), getMyAssignedStudents()])
                if (clsRes.status === 'fulfilled') setClasses(clsRes.value.data.data?.classes || clsRes.value.data.data || [])
                if (stuRes.status === 'fulfilled') setStudents(stuRes.value.data.data?.students || stuRes.value.data.data || [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Class Analytics</h1>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading analytics...</p>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Total Classes</p>
                            <p className="mt-2 text-2xl font-bold text-white">{classes.length}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Total Students</p>
                            <p className="mt-2 text-2xl font-bold text-white">{students.length}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Average per Class</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {classes.length > 0 ? Math.round(students.length / classes.length) : 0}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Class Breakdown</h2>
                        <div className="space-y-3">
                            {classes.map((cls) => {
                                const classStudents = students.filter((s) =>
                                    s.classId === cls._id || s.class === cls._id || s.studentProfile?.class === cls._id
                                )
                                return (
                                    <div key={cls._id} className="flex items-center justify-between rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                        <div>
                                            <p className="font-semibold text-white">{cls.name || cls.className}</p>
                                            <p className="text-sm text-slate-400">{cls.subject || 'Multiple Subjects'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">{classStudents.length}</p>
                                            <p className="text-xs text-slate-500">students</p>
                                        </div>
                                    </div>
                                )
                            })}
                            {classes.length === 0 && <p className="text-slate-400">No classes assigned.</p>}
                        </div>
                    </div>
                </>
            )}
        </main>
    )
}
