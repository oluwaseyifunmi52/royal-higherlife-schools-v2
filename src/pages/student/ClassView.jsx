export default function ClassView() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">My Classes</h1>
            <p className="mt-3 text-lg text-slate-400">Lessons and materials for each class are listed here.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {['Mathematics', 'English', 'Science', 'ICT'].map((subject) => (
                    <div key={subject} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-lg font-semibold text-white">{subject}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-400">Live class, notes, and tasks are available in this subject room.</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
