export default function ReportCardView({ studentName, term }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6">
            <h3 className="text-lg font-semibold text-white">{studentName}</h3>
            <p className="mt-2 text-sm text-slate-400">{term}</p>
        </div>
    )
}
