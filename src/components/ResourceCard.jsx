export default function ResourceCard({ title, description }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
    )
}
