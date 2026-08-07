import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CLASS_CATEGORIES, CLASS_CATEGORIES_LIST, ALL_CLASSES } from '../../config/classes'

export default function TeacherRegister() {
    const { registerTeacher } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', schoolSection: '', classTeaching: '', subject: '' })
    const [loading, setLoading] = useState(false)
    const [submitDone, setSubmitDone] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => {
            // When schoolSection changes, reset classTeaching
            if (name === 'schoolSection') {
                return { ...prev, [name]: value, classTeaching: '' }
            }
            return { ...prev, [name]: value }
        })
    }

    const getClassOptions = (section) => {
        return CLASS_CATEGORIES[section] || []
    }

    const classOptions = getClassOptions(form.schoolSection)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ type: '', message: '' })
        const { name, email, password, schoolSection, classTeaching, subject } = form
        if (!name || !email || !password || !schoolSection || !classTeaching || !subject) {
            setStatus({ type: 'error', message: 'Please fill in all fields.' })
            return
        }
        if (password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' })
            return
        }
        setLoading(true)
        try {
            const data = await registerTeacher({ name, email, password, classTeaching, subject, schoolSection })
            setStatus({ type: 'success', message: data?.message || 'Teacher account created successfully.' })
            setSubmitDone(true)
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Account creation failed. Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }

    if (submitDone) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher registration</p>
                    <h1 className="mt-3 text-3xl font-semibold text-white">Account created</h1>
                    <p className="mt-4 text-sm leading-7 text-slate-400">
                        {status.message}
                    </p>
                    <p className="mt-4 text-sm text-slate-400">
                        Your account is being reviewed and will be available once an administrator approves it.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-6 w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
                    >
                        Back to Teacher Login
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Teacher registration</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Create Teacher Account</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                    Your account will be reviewed by an administrator before it is activated.
                </p>

                {status.message && (
                    <div
                        className={
                            'mt-4 rounded-2xl border px-4 py-3 text-sm ' +
                            (status.type === 'success'
                                ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                : 'border-red-500/30 bg-red-500/10 text-red-300')
                        }
                    >
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Full Name</span>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="John Adewale"
                            required
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Email</span>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Password</span>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="Enter a password"
                            required
                            minLength={6}
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">School Section</span>
                        <select
                            name="schoolSection"
                            value={form.schoolSection}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-amber-500"
                            required
                        >
                            <option value="">Select a section</option>
                            {CLASS_CATEGORIES_LIST.map((section) => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Class Teaching</span>
                        <select
                            name="classTeaching"
                            value={form.classTeaching}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-amber-500"
                            required
                            disabled={!form.schoolSection}
                        >
                            <option value="">Select a class</option>
                            {classOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                            {form.classTeaching && !classOptions.includes(form.classTeaching) && (
                                <option value={form.classTeaching}>
                                    Custom: {form.classTeaching}
                                </option>
                            )}
                        </select>
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Subject Teaching</span>
                        <input
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="e.g. Mathematics"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create Teacher Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300">Sign in</Link>
                </p>
            </div>
        </main>
    )
}