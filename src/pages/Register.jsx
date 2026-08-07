import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', grade: '', message: '' })
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus({ type: '', message: '' })
        try {
            const api = (await import('../api/axios')).default
            const nameParts = form.name.split(' ')
            await api.post('/api/admissions', {
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: form.email,
                classApplyingFor: form.grade,
                academicSession: new Date().getFullYear().toString(),
                previousSchool: 'Pre-Registration',
                reasonForLeaving: form.message || '',
            })
            setStatus({ type: 'success', message: 'Application submitted! We will contact you with next steps.' })
            setForm({ name: '', email: '', grade: '', message: '' })
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Submission failed. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admissions</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Apply for admission</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Start your child&apos;s journey with Royal Higherlife Schools.</p>

                {status.message && (
                    <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                        status.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Full name</span>
                        <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Your name" required />
                    </label>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Email</span>
                        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="you@example.com" required />
                    </label>
                    <label className="block text-sm text-slate-300 sm:col-span-2">
                        <span className="mb-2 block">Student grade</span>
                        <input name="grade" value={form.grade} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="e.g. Grade 5" />
                    </label>
                    <label className="block text-sm text-slate-300 sm:col-span-2">
                        <span className="mb-2 block">Message</span>
                        <textarea name="message" value={form.message} onChange={handleChange} className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Tell us more about your child" />
                    </label>
                    <button type="submit" disabled={loading} className="sm:col-span-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="font-semibold text-amber-400">Sign in</Link>
                </p>
            </div>
        </main>
    )
}
