import { useEffect, useState } from 'react'

export default function ReviewAdmissions() {
    const [admissions, setAdmissions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import('../../api/axios')).default
                const res = await api.get('/api/admissions')
                setAdmissions(res.data.data || [])
            } catch {
                // Fallback
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleAction = async (id, action) => {
        try {
            const api = (await import('../../api/axios')).default
            await api.put(`/api/admissions/${id}/${action}`)
            setAdmissions((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a))
            )
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed')
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-white">Review Admissions</h1>
            <p className="mt-3 text-lg text-slate-400">Review applications and approve or reject admissions.</p>

            {loading ? (
                <p className="mt-8 text-sm text-slate-400">Loading admissions...</p>
            ) : admissions.length === 0 ? (
                <p className="mt-8 text-sm text-slate-400">No admission applications found.</p>
            ) : (
                <div className="mt-8 space-y-4">
                    {admissions.map((adm) => (
                        <div key={adm._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-white">{adm.firstName} {adm.lastName}</p>
                                    <p className="text-sm text-slate-400">{adm.email} - Class: {adm.classApplyingFor} - {adm.academicSession}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-3 py-1 text-sm ${
                                        adm.status === 'approved' ? 'bg-green-500/10 text-green-300' :
                                        adm.status === 'rejected' ? 'bg-red-500/10 text-red-300' :
                                        'bg-blue-500/10 text-blue-300'
                                    }`}>
                                        {adm.status || 'pending'}
                                    </span>
                                    {(!adm.status || adm.status === 'pending') && (
                                        <>
                                            <button onClick={() => handleAction(adm._id, 'approve')} className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">Approve</button>
                                            <button onClick={() => handleAction(adm._id, 'reject')} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">Reject</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
