import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import SectionHeading from '../components/SectionHeading'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
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
            await api.post('/api/admissions', {
                firstName: form.name.split(' ')[0] || '',
                lastName: form.name.split(' ').slice(1).join(' ') || '',
                email: form.email,
                classApplyingFor: 'Inquiry',
                academicSession: new Date().getFullYear().toString(),
                previousSchool: 'Contact Form',
                reasonForLeaving: form.message || form.subject || '',
            })
            setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' })
            setForm({ name: '', email: '', subject: '', message: '' })
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send message. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="space-y-20 pb-16">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                    <div>
                        <SectionHeading
                            eyebrow="Contact"
                            title="We would love to hear from you"
                            description="Whether you are seeking admissions information or just want to connect, our team is ready to help."
                        />
                        <div className="mt-8 space-y-5 text-slate-300">
                            <div className="flex items-center gap-3"><FiMapPin className="text-amber-400" /> Behind Badeku Town hall </div>
                            <div className="flex items-center gap-3"><FiPhone className="text-amber-400" /> +233 7084604623</div>
                            <div className="flex items-center gap-3"><FiMail className="text-amber-400" /> admissions@royalhigherlife.edu</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                        {status.message && (
                            <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
                                status.type === 'success'
                                    ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                    : 'border-red-500/30 bg-red-500/10 text-red-300'
                            }`}>
                                {status.message}
                            </div>
                        )}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="text-sm text-slate-300">
                                <span className="mb-2 block">Name</span>
                                <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Your name" required />
                            </label>
                            <label className="text-sm text-slate-300">
                                <span className="mb-2 block">Email</span>
                                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="you@example.com" required />
                            </label>
                        </div>
                        <label className="mt-5 block text-sm text-slate-300">
                            <span className="mb-2 block">Subject</span>
                            <input name="subject" value={form.subject} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Subject" />
                        </label>
                        <label className="mt-5 block text-sm text-slate-300">
                            <span className="mb-2 block">Message</span>
                            <textarea name="message" value={form.message} onChange={handleChange} className="min-h-[140px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="How can we help?" required />
                        </label>
                        <button type="submit" disabled={loading} className="mt-6 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}
