export default function Resources() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">Learning Resources</h1>
            <p className="mt-3 text-lg text-slate-400">Download notes, worksheets, and study materials.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {['Revision Notes', 'Past Questions', 'Study Guide'].map((resource) => (
                    <div key={resource} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-lg font-semibold text-white">{resource}</h2>
                    </div>
                ))}
            </div>
        </main>
    )
}
