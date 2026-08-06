export default function ReadingProgress({ percent = 60 }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Reading Progress</span>
                <span>{percent}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}
