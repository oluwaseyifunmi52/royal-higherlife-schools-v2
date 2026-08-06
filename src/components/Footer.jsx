import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const quickLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/academics', label: 'Academics' },
    { to: '/admission', label: 'Admissions' },
    { to: '/contact', label: 'Contact' },
]

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950/95">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
                <div>
                    <h2 className="text-xl font-semibold text-white">Royal Higherlife Schools</h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                        A Christian Montessori community committed to excellence, knowledge, integrity, and godly leadership.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Quick links</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        {quickLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} className="hover:text-yellow-400">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Contact</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><FiMapPin /> BEHIND BADEKU TOWN HALL</li>
                        <li className="flex items-center gap-2"><FiPhone /> 07084604623 / 08030642067</li>
                        <li className="flex items-center gap-2"><FiMail /> admissions@royalhigherlife.edu</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
                © {new Date().getFullYear()} Royal Higherlife Schools. All Rights Reserved. |
                Excellence, Knowledge & Integrity | In God We Stand
            </div>
        </footer>
    )
}
