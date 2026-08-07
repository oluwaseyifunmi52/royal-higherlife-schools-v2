import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile } from '../../services/teacherService'

export default function TeacherProfile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile()
                setProfile(res.data.data)
            } catch {
                setProfile(user)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [user])

    if (loading) return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-slate-400">Loading profile...</p>
        </main>
    )

    const p = profile || user
    const tp = p?.teacherProfile || {}

    const statusColors = {
        approved: 'bg-green-500/10 text-green-300 border-green-500/30',
        pending: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        rejected: 'bg-red-500/10 text-red-300 border-red-500/30',
        none: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Profile</h1>
                <p className="mt-3 text-lg text-slate-400">View and manage your professional profile.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-center">
                    <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-amber-500/30 bg-slate-800">
                        {p?.profilePhoto ? (
                            <img src={p.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-amber-400">
                                {(p?.firstName || 'T')[0]}
                            </div>
                        )}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-white">{p?.name || `${p?.firstName || ''} ${p?.lastName || ''}`}</h2>
                    <p className="text-sm text-slate-400">{tp.employeeId || 'No ID assigned'}</p>
                    <p className="text-sm text-slate-400">{p?.email}</p>
                    <div className="mt-4">
                        <span className={'inline-block rounded-full border px-3 py-1 text-xs font-semibold ' + (statusColors[tp.profileStatus] || statusColors.none)}>
                            Profile: {(tp.profileStatus || 'none').charAt(0).toUpperCase() + (tp.profileStatus || 'none').slice(1)}
                        </span>
                    </div>
                    <Link to="/teacher/profile/edit" className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 transition-colors">
                        Edit Profile
                    </Link>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-400">Full Name</p>
                                <p className="font-medium text-white">{p?.name || `${p?.firstName || ''} ${p?.lastName || ''}`}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Email</p>
                                <p className="font-medium text-white">{p?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Phone</p>
                                <p className="font-medium text-white">{p?.phone || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Teacher ID</p>
                                <p className="font-medium text-white">{tp.employeeId || 'Not assigned'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-400">Department</p>
                                <p className="font-medium text-white">{tp.department || 'Not assigned'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Qualification</p>
                                <p className="font-medium text-white">{tp.qualification || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Specialization</p>
                                <p className="font-medium text-white">{tp.specialization || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Employment Status</p>
                                <p className="font-medium text-white capitalize">{tp.employmentStatus || 'active'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm text-slate-400">Assigned Subjects</p>
                                <p className="font-medium text-white">{tp.subjects?.join(', ') || 'None'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">School Section</p>
                                <p className="font-medium text-white">{tp.section || tp.schoolSection || 'None'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Assigned Class</p>
                                <p className="font-medium text-white">{tp.assignedClass || 'None'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
                        <p className="text-slate-400 leading-relaxed">{tp.bio || 'No bio added yet. Click "Edit Profile" to add one.'}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
