import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, updateMyProfile, uploadProfilePhoto } from '../../services/teacherService'
import { CLASS_CATEGORIES, CLASS_CATEGORIES_LIST, ALL_CLASSES } from '../../config/classes'

export default function TeacherEditProfile() {
    const { user, refreshUser } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        schoolSection: '',
        assignedClass: '',
        subjects: '',
    })
    const [photoPreview, setPhotoPreview] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile()
                const p = res.data.data
                const tp = p.teacherProfile || {}
                setForm({
                    firstName: p.firstName || '',
                    lastName: p.lastName || '',
                    phone: p.phone || '',
                    schoolSection: tp.section || tp.schoolSection || '',
                    assignedClass: tp.assignedClass || '',
                    subjects: tp.subjects?.join(', ') || '',
                })
                setPhotoPreview(p.profilePhoto || '')
            } catch {
                const tp = user?.teacherProfile || {}
                setForm({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    phone: user?.phone || '',
                    schoolSection: tp.section || tp.schoolSection || '',
                    assignedClass: tp.assignedClass || '',
                    subjects: tp.subjects?.join(', ') || '',
                })
                setPhotoPreview(user?.profilePhoto || '')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => {
            // When schoolSection changes, reset assignedClass
            if (name === 'schoolSection') {
                return { ...prev, [name]: value, assignedClass: '' }
            }
            return { ...prev, [name]: value }
        })
    }

    const getClassOptions = (section) => {
        return CLASS_CATEGORIES[section] || []
    }

    const classOptions = getClassOptions(form.schoolSection)

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File size must be less than 5MB' })
            return
        }

        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowed.includes(file.type)) {
            setMessage({ type: 'error', text: 'Only JPEG, JPG, PNG, and WebP images are allowed' })
            return
        }

        setPhotoPreview(URL.createObjectURL(file))
        setUploading(true)
        setMessage({ type: '', text: '' })

        try {
            const formData = new FormData()
            formData.append('photo', file)
            const res = await uploadProfilePhoto(formData)
            setPhotoPreview(res.data.data.profilePhoto)
            setMessage({ type: 'success', text: 'Photo uploaded successfully' })
            await refreshUser()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo' })
            setPhotoPreview(user?.profilePhoto || '')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        const subjectsArray = form.subjects
            ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean)
            : []

        try {
            await updateMyProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                'teacherProfile.assignedClass': form.assignedClass,
                'teacherProfile.schoolSection': form.schoolSection,
                'teacherProfile.subjects': subjectsArray,
            })
            setMessage({ type: 'success', text: 'Profile updated successfully' })
            await refreshUser()
            setTimeout(() => navigate('/teacher/profile'), 1500)
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to update profile. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-slate-400">Loading profile...</p>
        </main>
    )

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Edit Profile</h1>
                <p className="mt-3 text-lg text-slate-400">Update your personal and teaching information.</p>
            </div>

            {message.text && (
                <div className={'mb-6 rounded-2xl border px-4 py-3 text-sm ' +
                    (message.type === 'success'
                        ? 'border-green-500/30 bg-green-500/10 text-green-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300')
                }>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-center">
                        <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-amber-500/30 bg-slate-800">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-amber-400">
                                    {(form.firstName || 'T')[0]}
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-sm text-slate-400">Profile Photo</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="mt-3 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Change Photo'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <p className="mt-2 text-xs text-slate-500">Max 5MB. JPEG, PNG, WebP.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm text-slate-400">
                                    <span className="mb-2 block">First Name</span>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                    />
                                </label>
                                <label className="block text-sm text-slate-400">
                                    <span className="mb-2 block">Last Name</span>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                    />
                                </label>
                                <label className="block text-sm text-slate-400 sm:col-span-2">
                                    <span className="mb-2 block">Phone Number</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                        placeholder="080XXXXXXXX"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Teaching Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm text-slate-400">
                                    <span className="mb-2 block">School Section</span>
                                    <select
                                        name="schoolSection"
                                        value={form.schoolSection}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                    >
                                        <option value="">Select a section</option>
                                        {CLASS_CATEGORIES_LIST.map((section) => (
                                            <option key={section} value={section}>{section}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block text-sm text-slate-400">
                                    <span className="mb-2 block">Class Teaching</span>
                                    <select
                                        name="assignedClass"
                                        value={form.assignedClass}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                        disabled={!form.schoolSection}
                                    >
                                        <option value="">Select a class</option>
                                        {classOptions.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        {form.assignedClass && !classOptions.includes(form.assignedClass) && (
                                            <option value={form.assignedClass}>
                                                Custom: {form.assignedClass}
                                            </option>
                                        )}
                                    </select>
                                </label>
                                <label className="block text-sm text-slate-400 sm:col-span-2">
                                    <span className="mb-2 block">Subject(s) Teaching</span>
                                    <input
                                        type="text"
                                        name="subjects"
                                        value={form.subjects}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                        placeholder="Mathematics, Physics"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Restricted Fields</h3>
                            <p className="text-sm text-slate-400 mb-3">These fields can only be changed by an administrator.</p>
                            <div className="grid gap-3 sm:grid-cols-2 text-sm">
                                <div>
                                    <span className="text-slate-500">Role:</span>
                                    <span className="ml-1 text-slate-300">{user?.role || 'teacher'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Teacher ID:</span>
                                    <span className="ml-1 text-slate-300">{user?.teacherProfile?.employeeId || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Account Status:</span>
                                    <span className="ml-1 text-slate-300">{user?.isActive === false ? 'Inactive' : 'Active'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/profile')}
                                className="rounded-full border border-slate-700 px-8 py-3 font-semibold text-white hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}