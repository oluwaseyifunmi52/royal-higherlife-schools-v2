import { useNavigate } from 'react-router-dom'

export default function AdminAcademics() {
    const navigate = useNavigate()

    const cards = [
        { title: 'YouTube Lessons', desc: 'Manage video lessons across all classes and subjects.', path: '/admin/academics/videos', icon: '▶' },
        { title: 'Questions', desc: 'Manage the question bank for quizzes and assessments.', path: '/admin/academics/questions', icon: '?' },
        { title: 'Quizzes', desc: 'Manage quizzes, publish or unpublish, and view results.', path: '/admin/academics/quizzes', icon: '✦' },
    ]

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Academic Content</h1>
                <p className="mt-3 text-lg text-slate-400">Manage learning materials, questions, and quizzes.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <button key={card.path} onClick={() => navigate(card.path)} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6 text-left hover:border-amber-500/40 transition">
                        <div className="text-3xl text-amber-400 mb-4">{card.icon}</div>
                        <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                        <p className="mt-2 text-sm text-slate-400">{card.desc}</p>
                    </button>
                ))}
            </div>
        </main>
    )
}
