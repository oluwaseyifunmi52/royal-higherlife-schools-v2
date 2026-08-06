import { Link } from 'react-router-dom'

export default function Login() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Portal access</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Sign in to continue to your school portal.</p>

                <form className="mt-8 space-y-4">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Email</span>
                        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="name@example.com" />
                    </label>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Password</span>
                        <input type="password" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0" placeholder="Enter password" />
                    </label>
                    <button type="button" className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                        Sign in
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    New here? <Link to="/register" className="font-semibold text-amber-400">Create an account</Link>
                </p>
            </div>
        </main>
    )
}
