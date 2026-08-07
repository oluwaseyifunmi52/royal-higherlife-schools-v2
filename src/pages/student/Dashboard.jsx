import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function StudentDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ results: 0, attendance: 0, assignments: 0, fees: null })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import('../../api/axios')).default
                const [resultsRes, attendanceRes, assignmentsRes, feesRes] = await Promise.allSettled([
                    api.get('/api/students/me/results'),
                    api.get('/api/students/me/attendance'),
                    api.get('/api/students/me/assignments'),
                    api.get('/api/students/me/fees'),
                ])
                setStats({
                    results: resultsRes.status === 'fulfilled' ? (resultsRes.value.data.data || []).length : 0,
                    attendance: attendanceRes.status === 'fulfilled' ? (attendanceRes.value.data.data || []).length : 0,
                    assignments: assignmentsRes.status === 'fulfilled' ? (assignmentsRes.value.data.data || []).length : 0,
                    fees: feesRes.status === 'fulfilled' ? feesRes.value.data.data : null,
                })
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const sp = user?.studentProfile || {}

    const cards = [
        { to: '/student/results', label: 'My Results', color: 'bg-blue-500', value: stats.results + ' records' },
        { to: '/student/attendance', label: 'Attendance', color: 'bg-green-500', value: stats.attendance + ' records' },
        { to: '/student/assignments', label: 'Assignments', color: 'bg-purple-500', value: stats.assignments + ' pending' },
        { to: '/student/fees', label: 'School Fees', color: 'bg-red-500', value: stats.fees ? '₦' + (stats.fees.balance || 0).toLocaleString() + ' balance' : 'Loading...' },
        { to: '/student/payments', label: 'Payment History', color: 'bg-indigo-500', value: 'View payments' },
        { to: '/student/awards', label: 'Awards', color: 'bg-yellow-500', value: 'View awards' },
        { to: '/student/certificates', label: 'Certificates', color: 'bg-pink-500', value: 'View certificates' },
        { to: '/student/materials', label: 'Learning Materials', color: 'bg-orange-500', value: 'Access materials' },
        { to: '/student/announcements', label: 'Announcements', color: 'bg-cyan-500', value: 'View updates' },
        { to: '/student/ai-assistant', label: 'AI Study Assistant', color: 'bg-violet-500', value: 'Ask questions' },
        { to: '/student/videos', label: 'Video Lessons', color: 'bg-red-500', value: 'Watch lessons' },
        { to: '/student/quizzes', label: 'Quizzes', color: 'bg-pink-500', value: 'Take quizzes' },
        { to: '/student/quiz-results', label: 'My Quiz Results', color: 'bg-blue-500', value: 'View results' },
    ]

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center gap-6">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/30 bg-slate-800 flex-shrink-0">
                    {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400">
                            {(user?.firstName || 'S')[0]}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                    <h1 className="mt-1 text-3xl font-semibold text-white">
                        Welcome, {user?.firstName || 'Student'}
                    </h1>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-400">
                        <span>Admission: <span className="font-semibold text-white">{sp.admissionNumber || 'N/A'}</span></span>
                        <span>Class: <span className="font-semibold text-white">{sp.class || 'N/A'}</span></span>
                        <span>Session: <span className="font-semibold text-white">{sp.session || 'N/A'}</span></span>
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading dashboard data...</p>
            ) : (
                <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link
                            key={card.to}
                            to={card.to}
                            className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 transition-colors"
                        >
                            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${card.color}/20 mb-3`}>
                                <div className={`h-3 w-3 rounded-full ${card.color}`}></div>
                            </div>
                            <p className="font-semibold text-white">{card.label}</p>
                            <p className="mt-1 text-xs text-slate-500">{card.value}</p>
                        </Link>
                    ))}
                </section>
            )}
        </main>
    )
}
