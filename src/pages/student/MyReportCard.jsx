export default function MyReportCard() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">My Report Card</h1>
            <p className="mt-3 text-lg text-slate-400">Review academic performance and teacher comments.</p>

            <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                <h2 className="text-xl font-semibold text-white">Term 1 • Grade 6</h2>
                <p className="mt-4 text-sm leading-8 text-slate-400">Mathematics: A • English: B+ • Science: A-</p>
            </div>
        </main>
    )
}
