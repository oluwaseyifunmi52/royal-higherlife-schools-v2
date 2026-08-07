import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminVideos, deleteAdminVideo, updateVideoStatus } from '../../services/adminService'

export default function AdminVideos() {
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ className: '', subject: '', status: '' })
    const [message, setMessage] = useState({ type: '', text: '' })

    const fetchVideos = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.className) params.className = filters.className
            if (filters.subject) params.subject = filters.subject
            if (filters.status) params.status = filters.status
            const res = await getAdminVideos(params)
            setVideos(res.data.data || res.data || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load videos' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchVideos() }, [])

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this video?')) return
        try {
            await deleteAdminVideo(id)
            setMessage({ type: 'success', text: 'Video deleted' })
            fetchVideos()
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete video' })
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateVideoStatus(id, status)
            setMessage({ type: 'success', text: `Video ${status}` })
            fetchVideos()
        } catch {
            setMessage({ type: 'error', text: 'Failed to update status' })
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage YouTube Lessons</h1>
                    <p className="mt-3 text-lg text-slate-400">View and manage all video lessons across the school.</p>
                </div>
                <button onClick={() => navigate('/admin/academics')} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:border-amber-400 hover:text-amber-300">
                    Back to Academics
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            <div className="mb-6 flex flex-wrap gap-3">
                <select name="className" value={filters.className} onChange={handleFilterChange} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white">
                    <option value="">All Classes</option>
                    <option value="Creche">Creche</option>
                    <option value="Nursery 1">Nursery 1</option>
                    <option value="Nursery 2">Nursery 2</option>
                    <option value="Kindergarten 1">Kindergarten 1</option>
                    <option value="Kindergarten 2">Kindergarten 2</option>
                    <option value="Primary 1">Primary 1</option>
                    <option value="Primary 2">Primary 2</option>
                    <option value="Primary 3">Primary 3</option>
                    <option value="Primary 4">Primary 4</option>
                    <option value="Primary 5">Primary 5</option>
                    <option value="Primary 6">Primary 6</option>
                    <option value="JSS 1">JSS 1</option>
                    <option value="JSS 2">JSS 2</option>
                    <option value="JSS 3">JSS 3</option>
                    <option value="SS 1">SS 1</option>
                    <option value="SS 2">SS 2</option>
                    <option value="SS 3">SS 3</option>
                </select>
                <input name="subject" value={filters.subject} onChange={handleFilterChange} placeholder="Filter by subject..." className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500" />
                <select name="status" value={filters.status} onChange={handleFilterChange} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <button onClick={fetchVideos} className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-slate-950 text-sm">Apply</button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading videos...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Topic</th>
                                    <th className="px-4 py-3">Teacher</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map((v) => (
                                    <tr key={v._id} className="border-t border-slate-800 text-slate-300">
                                        <td className="px-4 py-3 font-semibold text-white">{v.title || 'Untitled'}</td>
                                        <td className="px-4 py-3">{v.className || 'N/A'}</td>
                                        <td className="px-4 py-3">{v.subject || 'N/A'}</td>
                                        <td className="px-4 py-3">{v.topic || 'N/A'}</td>
                                        <td className="px-4 py-3">{v.teacherId?.name || v.teacherId?.firstName + ' ' + v.teacherId?.lastName || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${v.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusChange(v._id, v.status === 'published' ? 'draft' : 'published')} className="text-sm font-semibold text-slate-950 bg-amber-500 px-3 py-1.5 rounded-lg hover:bg-amber-400">
                                                    {v.status === 'published' ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button onClick={() => handleDelete(v._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {videos.length === 0 && <p className="mt-4 text-sm text-slate-400">No videos found.</p>}
                </div>
            )}
        </main>
    )
}
