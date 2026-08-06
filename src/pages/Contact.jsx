import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import SectionHeading from '../components/SectionHeading'

export default function Contact() {
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

                    <form className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="text-sm text-slate-300">
                                <span className="mb-2 block">Name</span>
                                <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Your name" />
                            </label>
                            <label className="text-sm text-slate-300">
                                <span className="mb-2 block">Email</span>
                                <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="you@example.com" />
                            </label>
                        </div>
                        <label className="mt-5 block text-sm text-slate-300">
                            <span className="mb-2 block">Message</span>
                            <textarea className="min-h-[140px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="How can we help?" />
                        </label>
                        <button type="button" className="mt-6 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}
