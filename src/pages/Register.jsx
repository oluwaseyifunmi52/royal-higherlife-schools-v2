import { Link } from 'react-router-dom'

export default function Register() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admissions</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Apply for admission</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Start your child’s journey with Royal Higherlife Schools.</p>

                <form className="mt-8 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Full name</span>
                        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Your name" />
                    </label>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Email</span>
                        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="you@example.com" />
                    </label>
                    <label className="block text-sm text-slate-300 sm:col-span-2">
                        <span className="mb-2 block">Student grade</span>
                        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="e.g. Grade 5" />
                    </label>
                    <label className="block text-sm text-slate-300 sm:col-span-2">
                        <span className="mb-2 block">Message</span>
                        <textarea className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Tell us more about your child" />
                    </label>
                    <button type="button" className="sm:col-span-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                        Submit Application
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="font-semibold text-amber-400">Sign in</Link>
                </p>
            </div>
        </main>
    )
}
