export default function MyAssignments() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">My Assignments</h1>
            <p className="mt-3 text-lg text-slate-400">Track submitted and pending assignment work.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {['Essay Writing', 'Math Practice', 'Science Experiment'].map((assignment) => (
                    <div key={assignment} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h2 className="text-lg font-semibold text-white">{assignment}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-400">Due tomorrow • Submitted: No</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
