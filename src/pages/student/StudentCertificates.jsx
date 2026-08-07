import { useEffect, useState } from 'react'
import { getMyCertificates } from '../../services/studentService'

export default function StudentCertificates() {
    const [certs, setCerts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyCertificates().then(res => setCerts(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
    }, [])

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Certificates</h1>
            </div>

            {loading ? <p className="text-slate-400">Loading...</p> : certs.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center">
                    <p className="text-slate-400">No certificates issued yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {certs.map((c) => (
                        <div key={c._id} className="rounded-[2rem] border border-amber-500/20 bg-slate-900/80 p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Certificate</p>
                                    <h3 className="mt-2 text-xl font-semibold text-white">{c.title}</h3>
                                    <p className="text-sm text-slate-400 capitalize">{c.type} Certificate</p>
                                </div>
                                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                                    {c.certificateNumber}
                                </span>
                            </div>
                            {c.description && <p className="mt-3 text-sm text-slate-400">{c.description}</p>}
                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>Issued: {c.issuedDate ? new Date(c.issuedDate).toLocaleDateString() : 'N/A'}</span>
                                <span>Royal Higherlife Schools</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
