import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'
import { getPublicTeachers } from '../services/teacherService'

export default function OurStaff() {
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await getPublicTeachers()
                setTeachers(res.data.data?.teachers || [])
            } catch {
                setTeachers([])
            } finally {
                setLoading(false)
            }
        }
        fetchTeachers()
    }, [])

    return (
        <main className="space-y-20 pb-16">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <SectionHeading
                    eyebrow="Our team"
                    title="Meet our dedicated educators."
                    description="Our teachers are passionate professionals committed to nurturing every student's academic growth and character development."
                />

                {loading ? (
                    <p className="mt-12 text-center text-slate-400">Loading staff...</p>
                ) : teachers.length === 0 ? (
                    <p className="mt-12 text-center text-slate-400">No staff profiles available at this time.</p>
                ) : (
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {teachers.map((t, i) => {
                            const tp = t.teacherProfile || {}
                            const display = tp.publicProfileData || {}
                            return (
                                <motion.div
                                    key={t._id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-center"
                                >
                                    <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-amber-500/20 bg-slate-800">
                                        {(display.profilePhoto || t.profilePhoto) ? (
                                            <img src={display.profilePhoto || t.profilePhoto} alt={t.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-amber-400">
                                                {(t.firstName || 'T')[0]}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-white">
                                        {display.fullName || t.name || `${t.firstName || ''} ${t.lastName || ''}`}
                                    </h3>
                                    <p className="text-sm text-amber-400">{display.qualification || tp.qualification || ''}</p>
                                    <p className="text-sm text-slate-400">{display.specialization || tp.specialization || ''} {display.department || tp.department ? 'Teacher' : ''}</p>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-400 line-clamp-3">
                                        {display.bio || tp.bio || 'Dedicated educator at Royal Higherlife Schools.'}
                                    </p>
                                    <button
                                        onClick={() => setSelected(t)}
                                        className="mt-4 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        View Profile
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </section>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-amber-500/20 bg-slate-800">
                                {((selected.teacherProfile?.publicProfileData?.profilePhoto) || selected.profilePhoto) ? (
                                    <img src={selected.teacherProfile?.publicProfileData?.profilePhoto || selected.profilePhoto} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-amber-400">
                                        {(selected.firstName || 'T')[0]}
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-white">
                                {selected.teacherProfile?.publicProfileData?.fullName || selected.name || `${selected.firstName || ''} ${selected.lastName || ''}`}
                            </h3>
                            <p className="text-sm text-amber-400">{selected.teacherProfile?.publicProfileData?.qualification || selected.teacherProfile?.qualification}</p>
                            <p className="text-sm text-slate-400">{selected.teacherProfile?.publicProfileData?.specialization || selected.teacherProfile?.specialization}</p>
                            <p className="text-sm text-slate-400">{selected.teacherProfile?.publicProfileData?.department || selected.teacherProfile?.department}</p>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-white mb-2">About</h4>
                            <p className="text-sm leading-relaxed text-slate-400">
                                {selected.teacherProfile?.publicProfileData?.bio || selected.teacherProfile?.bio || 'No bio available.'}
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setSelected(null)}
                                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
