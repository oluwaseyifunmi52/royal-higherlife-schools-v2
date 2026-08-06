export default function PDFViewer({ title }) {
    return (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">PDF preview area for uploaded reading resources.</p>
        </div>
    )
}
