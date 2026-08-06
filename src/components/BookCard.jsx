export default function BookCard({ title, type, level }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">{type}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">{level}</p>
        </div>
    )
}
