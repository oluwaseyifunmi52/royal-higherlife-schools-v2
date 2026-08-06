export default function ProgressBar({ value = 0 }) {
    return (
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${value}%` }} />
        </div>
    )
}
