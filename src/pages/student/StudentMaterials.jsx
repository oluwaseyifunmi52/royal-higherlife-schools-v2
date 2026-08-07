import { useEffect, useState } from 'react'
import { getMyMaterials } from '../../services/studentService'

export default function StudentMaterials() {
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyMaterials().then(res => setMaterials(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const typeIcons = { notes: '📝', video: '🎥', pdf: '📄', link: '🔗' }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Learning Materials</h1>
            </div>

            {loading ? <p className="text-slate-400">Loading...</p> : materials.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No materials available for your class yet.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {materials.map((m) => (
                        <div key={m._id} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{typeIcons[m.type] || '📄'}</span>
                                <div>
                                    <p className="font-semibold text-white">{m.title}</p>
                                    <p className="text-xs text-slate-400 capitalize">{m.type} - {m.subject || 'General'}</p>
                                </div>
                            </div>
                            {m.description && <p className="text-sm text-slate-400 line-clamp-2">{m.description}</p>}
                            {m.fileUrl && (
                                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer"
                                    className="mt-3 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300">
                                    Open Material
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
