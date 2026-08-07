import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyAssignedClasses, getMyAssignedStudents, getMySubjects } from '../../services/teacherService'

export default function TeacherDashboard() {
    const { user } = useAuth()
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, studentsRes, subjectsRes] = await Promise.allSettled([
                    getMyAssignedClasses(),
                    getMyAssignedStudents(),
                    getMySubjects(),
                ])
                if (classesRes.status === 'fulfilled') setClasses(classesRes.value.data.data?.classes || classesRes.value.data.data || [])
                if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data.data?.students || studentsRes.value.data.data || [])
                if (subjectsRes.status === 'fulfilled') setSubjects(subjectsRes.value.data.data?.subjects || subjectsRes.value.data?.subjects || subjectsRes.value.data.data || [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const tp = user?.teacherProfile || {}
    const profileStatusColors = {
        approved: 'text-green-300',
        pending: 'text-amber-300',
        rejected: 'text-red-300',
        none: 'text-slate-500',
    }

    const quickActions = [
        { to: '/teacher/profile', label: 'My Profile', color: 'bg-indigo-500' },
        { to: '/teacher/classes', label: 'My Classes', color: 'bg-amber-500' },
        { to: '/teacher/attendance', label: 'Mark Attendance', color: 'bg-green-500' },
        { to: '/teacher/report-scores', label: 'Enter Scores', color: 'bg-blue-500' },
        { to: '/teacher/assignments', label: 'Assignments', color: 'bg-purple-500' },
        { to: '/teacher/quizzes', label: 'Quizzes', color: 'bg-pink-500' },
        { to: '/teacher/submissions', label: 'Review Work', color: 'bg-cyan-500' },
        { to: '/teacher/resources', label: 'Materials', color: 'bg-orange-500' },
        { to: '/teacher/meetings', label: 'Meetings', color: 'bg-teal-500' },
        { to: '/teacher/videos', label: 'YouTube Lessons', color: 'bg-red-500' },
        { to: '/teacher/questions', label: 'Questions', color: 'bg-indigo-500' },
    ]

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center gap-6">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/30 bg-slate-800 flex-shrink-0">
                    {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400">
                            {(user?.firstName || 'T')[0]}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-1 text-3xl font-semibold text-white">
                        {user?.firstName ? `${user.firstName}'s Dashboard` : 'Teacher Dashboard'}
                    </h1>
                    <p className="mt-1 text-slate-400">
                        {tp.department || 'Department'} {tp.employeeId ? '| ' + tp.employeeId : ''}
                        {tp.profileStatus && tp.profileStatus !== 'none' && (
                            <span className={'ml-2 text-xs font-semibold ' + (profileStatusColors[tp.profileStatus] || '')}>
                                Profile: {tp.profileStatus.charAt(0).toUpperCase() + tp.profileStatus.slice(1)}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading dashboard data...</p>
            ) : (
                <>
                    <section className="grid gap-4 md:grid-cols-3 mb-8">
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">My Classes</p>
                            <p className="mt-2 text-2xl font-bold text-white">{classes.length}</p>
                            <p className="text-xs text-slate-500">Assigned classes</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">My Students</p>
                            <p className="mt-2 text-2xl font-bold text-white">{students.length}</p>
                            <p className="text-xs text-slate-500">Students in my classes</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-sm text-slate-400">Assigned Subject</p>
                            <p className="mt-2 text-2xl font-bold text-amber-400">{subjects.length > 0 ? subjects[0] : (tp.subjects?.length > 0 ? tp.subjects[0] : 'N/A')}</p>
                            <p className="text-xs text-slate-500">{tp.assignedClass || 'Class not assigned'}</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="grid gap-4 md:grid-cols-4">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.to}
                                    to={action.to}
                                    className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 transition-colors"
                                >
                                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${action.color}/20 mb-3`}>
                                        <div className={`h-3 w-3 rounded-full ${action.color}`}></div>
                                    </div>
                                    <p className="font-semibold text-white">{action.label}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {classes.length > 0 && (
                        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Assigned Classes</h2>
                            <div className="grid gap-4 md:grid-cols-3">
                                {classes.map((cls) => (
                                    <div key={cls._id || cls.id} className="rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                        <h3 className="font-semibold text-white">{cls.name || cls.className}</h3>
                                        <p className="text-sm text-slate-400">{cls.subject || 'Multiple Subjects'}</p>
                                        <p className="text-sm text-slate-400">{cls.studentsCount || '---'} students</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </main>
    )
}
