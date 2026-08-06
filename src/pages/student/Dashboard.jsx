import { Link } from 'react-router-dom'

const cards = [
    { title: 'Upcoming Lesson', value: 'Biology • Cell Structure' },
    { title: 'Assignments Due', value: '2 this week' },
    { title: 'Progress', value: '82% completed' },
]

export default function StudentDashboard() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">Student Dashboard</h1>
            <p className="mt-3 text-lg text-slate-400">Stay on top of lessons, assignments, and your learning progress.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
                {cards.map((card) => (
                    <div key={card.title} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-400">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/student/classes" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">View Classes</Link>
                <Link to="/student/assignments" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">View Assignments</Link>
                <Link to="/student/library" className="rounded-full border border-blue-400/40 px-6 py-3 font-semibold text-blue-300">Open Library</Link>
                <Link to="/student/payments" className="rounded-full border border-amber-400/40 px-6 py-3 font-semibold text-amber-300">Payments</Link>
            </div>
        </main>
    )
}
