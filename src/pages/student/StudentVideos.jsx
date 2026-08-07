import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getVideosByClass } from '../../services/studentService'

export default function StudentVideos() {
    const { user } = useAuth()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [filterSubject, setFilterSubject] = useState('')
    const [selectedVideo, setSelectedVideo] = useState(null)

    const fetchVideos = async () => {
        const sp = user?.studentProfile || {}
        if (!sp.class) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const res = await getVideosByClass(sp.class, filterSubject)
            setVideos(res.data.data || [])
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load videos' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [filterSubject])

    const subjects = [...new Set(videos.map(v => v.subject).filter(Boolean))]

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center gap-6">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/30 bg-slate-800 flex-shrink-0">
                    {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400">
                            {(user?.firstName || 'S')[0]}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                    <h1 className="mt-1 text-3xl font-semibold text-white">
                        Video Lessons
                    </h1>
                    <p className="mt-1 text-slate-400">
                        Class: <span className="font-semibold text-white">{user?.studentProfile?.class || 'N/A'}</span>
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}>{message.text}</div>
            )}

            {loading ? (
                <p className="text-slate-400">Loading videos...</p>
            ) : videos.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-12 text-center">
                    <p className="text-slate-400 text-lg">No video lessons available for your class</p>
                    <p className="text-slate-500 mt-2">Your teachers will add videos here when available</p>
                </div>
            ) : (
                <>
                    {subjects.length > 1 && (
                        <div className="mb-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4">
                            <p className="text-sm font-semibold text-slate-400 mb-2">Filter by Subject:</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterSubject('')}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${filterSubject === '' ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-amber-500'}`}
                                >
                                    All
                                </button>
                                {subjects.map((sub) => (
                                    <button
                                        key={sub}
                                        onClick={() => setFilterSubject(sub)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${filterSubject === sub ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-amber-500'}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {videos.map((video) => (
                            <div key={video._id} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 hover:border-amber-500/50 transition-colors">
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
                                <p className="text-sm text-slate-400 mt-1">{video.subject}</p>
                                {video.topic && <p className="text-sm text-slate-500">Topic: {video.topic}</p>}
                                {video.description && (
                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{video.description}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-2">By: {video.teacherId?.name || video.teacherId?.firstName + ' ' + video.teacherId?.lastName || 'Teacher'}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </main>
    )
}