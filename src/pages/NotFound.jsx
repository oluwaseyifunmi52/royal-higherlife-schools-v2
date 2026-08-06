import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">404</p>
                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Page not found</h1>
                <p className="mt-4 text-lg leading-8 text-slate-400">
                    The page you are looking for may have moved or no longer exists.
                </p>
                <Link to="/" className="mt-8 inline-flex rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                    Return home
                </Link>
            </div>
        </main>
    )
}
