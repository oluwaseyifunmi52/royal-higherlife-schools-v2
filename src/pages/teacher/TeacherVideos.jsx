import { useEffect, useState } from 'react'
import { CLASS_CATEGORIES, ALL_CLASSES } from '../../config/classes'
import { getMyVideos, createVideo, updateVideo, deleteVideo, publishVideo } from '../../services/teacherService'

export default function TeacherVideos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        title: '',
        youtubeUrl: '',
        description: '',
        className: '',
        subject: '',
        topic: '',
    })
    const [assignedClasses, setAssignedClasses] = useState([])
    const [assignedSubjects, setAssignedSubjects] = useState([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [videosRes, classesRes, subjectsRes] = await Promise.allSettled([
                getMyVideos(),
                getMyAssignedClasses(),
                getMySubjects(),
            ])
            if (videosRes.status === 'fulfilled') setVideos(videosRes.value.data.data || videosRes.value.data || [])
            if (classesRes.status === 'fulfilled') setAssignedClasses(classesRes.value.data.data?.classes || classesRes.value.data.data || [])
            if (subjectsRes.status === 'fulfilled') setAssignedSubjects(subjectsRes.value.data.data?.subjects || subjectsRes.value.data?.subjects || subjectsRes.value.data.data || [])
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load data' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateVideo(editing._id, form)
                setMessage({ type: 'success', text: 'Video updated successfully' })
            } else {
                await createVideo(form)
                setMessage({ type: 'success', text: 'Video added successfully' })
            }
            setShowForm(false)
            setEditing(null)
            setForm({ title: '', youtubeUrl: '', description: '', className: '', subject: '', topic: '' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' })
        }
    }

    const handleEdit = (video) => {
        setEditing(video)
        setForm({ title: video.title, youtubeUrl: video.youtubeUrl, description: video.description, className: video.className, subject: video.subject, topic: video.topic })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return
        try {
            await deleteVideo(id)
            setMessage({ type: 'success', text: 'Video deleted' })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' })
        }
    }

    const handlePublish = async (id, status) => {
        try {
            await publishVideo(id, status)
            setMessage({ type: 'success', text: `Video ${status}` })
            fetchData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' })
        }
    }

    const getAvailableClasses = () => {
        if (assignedClasses.length > 0) {
            return assignedClasses.map(c => c.name || c.className).filter(Boolean)
        }
        return ALL_CLASSES
    }

    const getAvailableSubjects = () => {
        if (assignedSubjects.length > 0) return assignedSubjects
        return ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'Physical Education', 'Creative Arts', 'French', 'Yoruba', 'Igbo', 'Hausa']
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">YouTube Lessons</h1>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', youtubeUrl: '', description: '', className: '', subject: '', topic: '' }) }}
                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    {showForm ? 'Cancel' : '+ Add Video'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Video' : 'Add YouTube Video'}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Video Title *</span>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. Introduction to Fractions" />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">YouTube URL *</span>
                            <input value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="https://www.youtube.com/watch?v=..." />
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Class *</span>
                            <select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Class</option>
                                {getAvailableClasses().map((cls) => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            <span className="mb-2 block">Subject *</span>
                            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                <option value="">Select Subject</option>
                                {getAvailableSubjects().map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400 md:col-span-2">
                            <span className="mb-2 block">Topic</span>
                            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="e.g. Fractions" />
                        </label>
                        <label className="block text-sm text-slate-400 md:col-span-2">
                            <span className="mb-2 block">Description</span>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Brief description of the video content..." />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="submit" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                            {editing ? 'Update Video' : 'Add Video'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-slate-400">Loading videos...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    {videos.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">No videos found</p>
                            <p className="text-slate-500 mt-2">Click "Add Video" to create your first YouTube lesson</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {videos.map((video) => (
                                <div key={video._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                                    <div className="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden mb-3 relative">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
                                            title={video.title}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <h3 className="font-semibold text-white">{video.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{video.className} - {video.subject}</p>
                                    {video.topic && <p className="text-sm text-slate-500">Topic: {video.topic}</p>}
                                    <p className="text-xs text-slate-500 mt-2">Status: <span className={`font-semibold ${video.status === 'published' ? 'text-green-400' : 'text-amber-400'}`}>{video.status}</span></p>
                                    <div className="mt-3 flex gap-2">
                                        <button onClick={() => handlePublish(video._id, video.status === 'published' ? 'draft' : 'published')}
                                            className="text-sm font-semibold text-slate-950 bg-amber-500 px-3 py-1.5 rounded-lg hover:bg-amber-400">
                                            {video.status === 'published' ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <button onClick={() => handleEdit(video)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                        <button onClick={() => handleDelete(video._id)} className="text-sm font-semibold text-red-400 hover:text-red-300">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}

// Import services at the top
import { getMyAssignedClasses, getMySubjects } from '../../services/teacherService'