import { useEffect, useState } from 'react'
import { getTeachers, activateTeacher, deactivateTeacher, approveTeacherProfile, rejectTeacherProfile, getPendingTeachers } from '../../services/teacherService'
import api from '../../api/axios'
import { CLASS_CATEGORIES, CLASS_CATEGORIES_LIST, ALL_CLASSES } from '../../config/classes'

export default function AdminTeachers() {
    const [teachers, setTeachers] = useState([])
    const [pendingTeachers, setPendingTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    const [viewing, setViewing] = useState(null)
    const [form, setForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [tab, setTab] = useState('all')
    const [showAdd, setShowAdd] = useState(false)
    const [newTeacher, setNewTeacher] = useState({
        fullName: '', email: '', phone: '', schoolSection: '', classTeaching: '', subject: '', password: '',
    })
    const [adding, setAdding] = useState(false)

    const getClassOptions = (section) => {
        return CLASS_CATEGORIES[section] || []
    }

    const newTeacherClassOptions = getClassOptions(newTeacher.schoolSection)
    const editFormClassOptions = getClassOptions(form.schoolSection)

    const fetchTeachers = async () => {
        setLoading(true)
        try {
            const [teachersRes, pendingRes] = await Promise.allSettled([
                getTeachers({ limit: 500 }),
                getPendingTeachers(),
            ])
            if (teachersRes.status === 'fulfilled') setTeachers(teachersRes.value.data.data?.teachers || teachersRes.value.data.data || [])
            if (pendingRes.status === 'fulfilled') setPendingTeachers(pendingRes.value.data.data?.teachers || [])
        } catch {
            setMessage({ type: 'error', text: 'Failed to load teachers' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTeachers() }, [])

    const handleAdd = async (e) => {
        e.preventDefault()
        const fullName = (newTeacher.fullName || '').trim()
        const firstName = fullName.split(' ')[0] || ''
        const lastName = fullName.split(' ').slice(1).join(' ') || ''
        if (!firstName || !newTeacher.email || !newTeacher.password) {
            setMessage({ type: 'error', text: 'Full name, email and password are required' })
            return
        }
        if (newTeacher.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }
        setAdding(true)
        setMessage({ type: '', text: '' })
        try {
            await api.post('/api/admin/teachers', {
                firstName,
                lastName,
                email: newTeacher.email,
                phone: newTeacher.phone || undefined,
                password: newTeacher.password,
                classTeaching: newTeacher.classTeaching || undefined,
                schoolSection: newTeacher.schoolSection || undefined,
                subjects: newTeacher.subject || undefined,
            })
            setMessage({ type: 'success', text: 'Teacher created successfully' })
            setShowAdd(false)
            setNewTeacher({ fullName: '', email: '', phone: '', schoolSection: '', classTeaching: '', subject: '', password: '' })
            fetchTeachers()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create teacher' })
        } finally {
            setAdding(false)
        }
    }

    const filtered = teachers.filter((t) => {
        const q = search.toLowerCase()
        return (
            t.name?.toLowerCase().includes(q) ||
            t.firstName?.toLowerCase().includes(q) ||
            t.lastName?.toLowerCase().includes(q) ||
            t.email?.toLowerCase().includes(q) ||
            t.teacherProfile?.employeeId?.toLowerCase().includes(q)
        )
    })

    const displayList = tab === 'pending' ? pendingTeachers : filtered

    const handleEdit = (teacher) => {
        setEditing(teacher)
        const tp = teacher.teacherProfile || {}
        setForm({
            firstName: teacher.firstName || '',
            lastName: teacher.lastName || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            department: tp.department || '',
            subjects: tp.subjects?.join(', ') || '',
            assignedClass: tp.assignedClass || '',
            schoolSection: tp.section || tp.schoolSection || '',
            employeeId: tp.employeeId || '',
            qualification: tp.qualification || '',
            specialization: tp.specialization || '',
            bio: tp.bio || '',
        })
    }

    const handleFormSchoolSectionChange = (e) => {
        const value = e.target.value
        setForm(prev => ({ ...prev, schoolSection: value, assignedClass: '' }))
    }

    const handleNewTeacherSchoolSectionChange = (e) => {
        const value = e.target.value
        setNewTeacher(prev => ({ ...prev, schoolSection: value, classTeaching: '' }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.put('/api/teachers/' + editing._id, {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                'teacherProfile.department': form.department,
                'teacherProfile.subjects': form.subjects ? form.subjects.split(',').map(s => s.trim()) : [],
                'teacherProfile.assignedClass': form.assignedClass,
                'teacherProfile.schoolSection': form.schoolSection,
                'teacherProfile.employeeId': form.employeeId,
                'teacherProfile.qualification': form.qualification,
                'teacherProfile.specialization': form.specialization,
                'teacherProfile.bio': form.bio,
            })
            setMessage({ type: 'success', text: 'Teacher updated successfully' })
            setEditing(null)
            fetchTeachers()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update teacher' })
        } finally {
            setSaving(false)
        }
    }

    const handleToggleActive = async (teacher) => {
        try {
            if (teacher.isActive === false) {
                await activateTeacher(teacher._id)
            } else {
                await deactivateTeacher(teacher._id)
            }
            fetchTeachers()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' })
        }
    }

    const handleApprove = async (id) => {
        try {
            await approveTeacherProfile(id)
            setMessage({ type: 'success', text: 'Teacher profile approved' })
            fetchTeachers()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Approval failed' })
        }
    }

    const handleReject = async (id) => {
        try {
            await rejectTeacherProfile(id)
            setMessage({ type: 'success', text: 'Teacher profile rejected' })
            fetchTeachers()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Rejection failed' })
        }
    }

    const profileStatusColors = {
        approved: 'bg-green-500/10 text-green-300',
        pending: 'bg-amber-500/10 text-amber-300',
        rejected: 'bg-red-500/10 text-red-300',
        none: 'bg-slate-500/10 text-slate-400',
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage Teachers</h1>
                    <p className="mt-3 text-lg text-slate-400">View, edit, and manage all teacher records.</p>
                </div>
                {pendingTeachers.length > 0 && (
                    <span className="rounded-full bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-400">
                        {pendingTeachers.length} pending approval
                    </span>
                )}
                <button
                    onClick={() => { setShowAdd(true); setMessage({ type: '', text: '' }) }}
                    className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
                >
                    Add Teacher
                </button>
            </div>

            {message.text && (
                <div className={'mb-6 rounded-2xl border px-4 py-3 text-sm ' +
                    (message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300')
                }>{message.text}</div>
            )}

            <div className="flex gap-3 mb-6">
                <button onClick={() => setTab('all')} className={'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' + (tab === 'all' ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400 hover:text-white')}>
                    All Teachers ({teachers.length})
                </button>
                <button onClick={() => setTab('pending')} className={'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' + (tab === 'pending' ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400 hover:text-white')}>
                    Pending ({pendingTeachers.length})
                </button>
            </div>

            <div className="mb-6">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500"
                    placeholder="Search by name, email, or ID..."
                />
            </div>

            {loading ? (
                <p className="text-slate-400">Loading teachers...</p>
            ) : (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-left text-slate-400">
                                    <th className="px-4 py-3">Teacher</th>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Subjects</th>
                                    <th className="px-4 py-3">Section</th>
                                    <th className="px-4 py-3">Class</th>
                                    <th className="px-4 py-3">Profile</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayList.map((t) => {
                                    const tp = t.teacherProfile || {}
                                    return (
                                        <tr key={t._id} className="border-t border-slate-800 text-slate-300">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-800 flex-shrink-0">
                                                        {t.profilePhoto ? (
                                                            <img src={t.profilePhoto} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-amber-400">
                                                                {(t.firstName || 'T')[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{t.name || `${t.firstName || ''} ${t.lastName || ''}`}</p>
                                                        <p className="text-xs text-slate-500">{t.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{tp.employeeId || 'N/A'}</td>
                                            <td className="px-4 py-3">{tp.department || 'N/A'}</td>
                                            <td className="px-4 py-3">{tp.subjects?.join(', ') || 'N/A'}</td>
                                            <td className="px-4 py-3">{tp.section || tp.schoolSection || 'N/A'}</td>
                                            <td className="px-4 py-3">{tp.assignedClass || 'N/A'}</td>
                                            <td className="px-4 py-3">
                                                <span className={'inline-block rounded-full px-2.5 py-1 text-xs font-semibold ' + (profileStatusColors[tp.profileStatus] || profileStatusColors.none)}>
                                                    {(tp.profileStatus || 'none').charAt(0).toUpperCase() + (tp.profileStatus || 'none').slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={'rounded-full px-2.5 py-1 text-xs font-semibold ' +
                                                    (t.isActive !== false ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300')
                                                }>
                                                    {t.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <button onClick={() => handleEdit(t)} className="text-xs font-semibold text-amber-400 hover:text-amber-300">Edit</button>
                                                    <button onClick={() => setViewing(t)} className="text-xs font-semibold text-blue-400 hover:text-blue-300">View</button>
                                                    {tp.profileStatus === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleApprove(t._id)} className="text-xs font-semibold text-green-400 hover:text-green-300">Approve</button>
                                                            <button onClick={() => handleReject(t._id)} className="text-xs font-semibold text-red-400 hover:text-red-300">Reject</button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleToggleActive(t)} className="text-xs font-semibold text-red-400 hover:text-red-300">
                                                        {t.isActive !== false ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {displayList.length === 0 && <p className="mt-4 text-sm text-slate-400">No teachers found.</p>}
                </div>
            )}

            {viewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-amber-500/20 bg-slate-800">
                                {viewing.profilePhoto ? (
                                    <img src={viewing.profilePhoto} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-400">
                                        {(viewing.firstName || 'T')[0]}
                                    </div>
                                )}
                            </div>
                            <h2 className="mt-3 text-xl font-semibold text-white">{viewing.name || `${viewing.firstName || ''} ${viewing.lastName || ''}`}</h2>
                            <p className="text-sm text-slate-400">{viewing.teacherProfile?.employeeId || 'No ID'}</p>
                        </div>
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                            <div><span className="text-slate-500">Email: </span><span className="text-slate-300">{viewing.email}</span></div>
                            <div><span className="text-slate-500">Phone: </span><span className="text-slate-300">{viewing.phone || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Department: </span><span className="text-slate-300">{viewing.teacherProfile?.department || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Qualification: </span><span className="text-slate-300">{viewing.teacherProfile?.qualification || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Specialization: </span><span className="text-slate-300">{viewing.teacherProfile?.specialization || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Subjects: </span><span className="text-slate-300">{viewing.teacherProfile?.subjects?.join(', ') || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Section: </span><span className="text-slate-300">{viewing.teacherProfile?.section || viewing.teacherProfile?.schoolSection || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Class: </span><span className="text-slate-300">{viewing.teacherProfile?.assignedClass || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Profile Status: </span><span className="text-slate-300 capitalize">{viewing.teacherProfile?.profileStatus || 'none'}</span></div>
                        </div>
                        {viewing.teacherProfile?.bio && (
                            <div className="mt-4">
                                <p className="text-sm text-slate-500 mb-1">Bio</p>
                                <p className="text-sm text-slate-400">{viewing.teacherProfile.bio}</p>
                            </div>
                        )}
                        <div className="mt-6 flex gap-3">
                            {viewing.teacherProfile?.profileStatus === 'pending' && (
                                <>
                                    <button onClick={() => { handleApprove(viewing._id); setViewing(null) }} className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white">Approve Profile</button>
                                    <button onClick={() => { handleReject(viewing._id); setViewing(null) }} className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white">Reject Profile</button>
                                </>
                            )}
                            <button onClick={() => setViewing(null)} className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-white">Edit Teacher</h2>
                        <div className="mt-4 space-y-4">
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">First Name</span>
                                <input value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Last Name</span>
                                <input value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Email</span>
                                <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Phone</span>
                                <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Teacher ID</span>
                                <input value={form.employeeId || ''} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Department</span>
                                <input value={form.department || ''} onChange={(e) => setForm({ ...form, department: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Qualification</span>
                                <input value={form.qualification || ''} onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Specialization</span>
                                <input value={form.specialization || ''} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Subjects (comma separated)</span>
                                <input value={form.subjects || ''} onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" placeholder="Mathematics, English" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">School Section</span>
                                <select value={form.schoolSection || ''} onChange={handleFormSchoolSectionChange}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                                    <option value="">Select a section</option>
                                    {CLASS_CATEGORIES_LIST.map((section) => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Assigned Class</span>
                                <select value={form.assignedClass || ''} onChange={(e) => setForm({ ...form, assignedClass: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    disabled={!form.schoolSection}
                                >
                                    <option value="">Select a class</option>
                                    {editFormClassOptions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    {form.assignedClass && !editFormClassOptions.includes(form.assignedClass) && (
                                        <option value={form.assignedClass}>
                                            Custom: {form.assignedClass}
                                        </option>
                                    )}
                                </select>
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Bio</span>
                                <textarea value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white resize-none" />
                            </label>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={handleSave} disabled={saving}
                                className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditing(null)}
                                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-white">Add Teacher</h2>
                        <p className="mt-1 text-sm text-slate-400">Create a new teacher account. Role is automatically set to "teacher".</p>
                        <form onSubmit={handleAdd} className="mt-4 space-y-4">
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Full Name</span>
                                <input
                                    type="text"
                                    value={newTeacher.fullName}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="John Adewale"
                                    required
                                />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Email</span>
                                <input
                                    type="email"
                                    value={newTeacher.email}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="john@royalhigherlifeschools.com"
                                    required
                                />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Phone Number</span>
                                <input
                                    type="tel"
                                    value={newTeacher.phone}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="080XXXXXXXX"
                                />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">School Section</span>
                                <select value={newTeacher.schoolSection} onChange={handleNewTeacherSchoolSectionChange}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    required
                                >
                                    <option value="">Select a section</option>
                                    {CLASS_CATEGORIES_LIST.map((section) => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Class Teaching</span>
                                <select value={newTeacher.classTeaching} onChange={(e) => setNewTeacher({ ...newTeacher, classTeaching: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    disabled={!newTeacher.schoolSection}
                                    required
                                >
                                    <option value="">Select a class</option>
                                    {newTeacherClassOptions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Subject</span>
                                <input
                                    type="text"
                                    value={newTeacher.subject}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="Mathematics"
                                />
                            </label>
                            <label className="block text-sm text-slate-400">
                                <span className="mb-2 block">Password</span>
                                <input
                                    type="password"
                                    value={newTeacher.password}
                                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                                    placeholder="Minimum 6 characters"
                                    minLength={6}
                                    required
                                />
                            </label>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                                >
                                    {adding ? 'Creating...' : 'Create Teacher'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAdd(false)}
                                    className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}