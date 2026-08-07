import { useEffect, useState } from 'react'
import { getCertificates, generateCertificate, verifyCertificate, deleteCertificate } from '../../services/certificateService'

export default function AdminCertificates() {
    const [certs, setCerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ studentId: '', title: '', type: 'completion', description: '' })
    const [verifyQuery, setVerifyQuery] = useState('')
    const [verifyResult, setVerifyResult] = useState(null)

    const fetchCerts = async () => {
        setLoading(true)
        try {
            const res = await getCertificates()
            setCerts(res.data.data?.certificates || res.data.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load certificates' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchCerts() }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await generateCertificate(form)
            setMessage({ type: 'success', text: 'Certificate generated' })
            setShowForm(false)
            setForm({ studentId: '', title: '', type: 'completion', description: '' })
            fetchCerts()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Generation failed' })
        }
    }

    const handleVerify = async () => {
        if (!verifyQuery) return
        try {
            const res = await verifyCertificate(verifyQuery)
            setVerifyResult(res.data.data || res.data)
            setMessage({ type: 'success', text: 'Certificate verified' })
        } catch {
            setVerifyResult(null)
            setMessage({ type: 'error', text: 'Certificate not found or invalid' })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certificate?')) return
        try {
            await deleteCertificate(id)
            fetchCerts()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Certificates</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowForm(!showForm)}
                        className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                        {showForm ? 'Cancel' : '+ Generate Certificate'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Verify Certificate</h2>
                <div className="flex gap-3">
                    <input value={verifyQuery} onChange={(e) => setVerifyQuery(e.target.value)}
                        className="flex-1 rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Enter certificate number" />
                    <button onClick={handleVerify} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Verify</button>
                </div>
                {verifyResult && (
                    <div className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/5 p-4">
                        <p className="text-sm text-green-300">Certificate Verified</p>
                        <p className="text-white font-semibold">{verifyResult.title || 'Certificate'}</p>
                        <p className="text-sm text-slate-400">Student: {verifyResult.studentName || verifyResult.studentId?.name || 'N/A'}</p>
                        <p className="text-sm text-slate-400">Number: {verifyResult.certificateNumber || 'N/A'}</p>
                    </div>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Generate Certificate</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Student ID *</span>
                            <input value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Certificate Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Type</span>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="completion">Completion</option>
                                <option value="achievement">Achievement</option>
                                <option value="participation">Participation</option>
                                <option value="excellence">Excellence</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Description</span>
                            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Generate</button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading certificates...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="space-y-3">
                        {certs.map((cert) => (
                            <div key={cert._id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4">
                                <div>
                                    <p className="font-semibold text-white">{cert.title || cert.type}</p>
                                    <p className="text-sm text-slate-400">
                                        {cert.studentName || cert.studentId?.name || 'N/A'} · {cert.certificateNumber || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDelete(cert._id)} className="text-sm font-semibold text-red-400">Delete</button>
                                </div>
                            </div>
                        ))}
                        {certs.length === 0 && <p className="text-slate-400">No certificates found.</p>}
                    </div>
                </div>
            )}
        </main>
    )
}
