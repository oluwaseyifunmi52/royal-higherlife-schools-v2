export default function MyBadges() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">My Badges</h1>
            <p className="mt-3 text-lg text-slate-400">Celebrate progress, participation, and achievements.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
                {['Excellence', 'Leadership', 'Consistency'].map((badge) => (
                    <div key={badge} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-center">
                        <h2 className="text-lg font-semibold text-white">{badge}</h2>
                    </div>
                ))}
            </div>
        </main>
    )
}
