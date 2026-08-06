import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiHeart, FiShield, FiStar, FiUsers } from 'react-icons/fi'
import SectionHeading from '../components/SectionHeading'

const highlights = [
    {
        title: 'Christian Montessori Education',
        description: 'A nurturing learning environment where children grow in wisdom, independence, and godly character.',
        icon: FiBookOpen,
    },
    {
        title: 'Trusted by Families',
        description: 'Parents partner with us for strong values, attentive care, and a warm school community.',
        icon: FiUsers,
    },
    {
        title: 'Safe and Purposeful Growth',
        description: 'We cultivate confidence, discipline, and excellence in every child through meaningful guidance.',
        icon: FiShield,
    },
]

const stats = [
    { value: '500+', label: 'Students' },
    { value: '30+', label: 'Qualified Teachers' },
    { value: '15+', label: 'Years of Excellence' },
    { value: '100%', label: 'Moral & Academic Development' },
]

const testimonials = [
    {
        quote: 'Royal Higherlife Schools has given my child a joyful learning experience rooted in values and discipline.',
        name: 'Mrs. Akua Boateng',
        role: 'Parent',
    },
    {
        quote: 'The atmosphere is calm, inspiring, and supportive. My child is growing both academically and spiritually.',
        name: 'Daniel Mensah',
        role: 'Student',
    },
]

export default function Home() {
    return (
        <main className="space-y-24 pb-16">
            <section className="relative overflow-hidden rounded-b-[2rem] border border-slate-800/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_30%),linear-gradient(135deg,_rgba(2,6,23,1),_rgba(15,23,42,1))] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10" />
                <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">Royal Higherlife Schools</p>
                        <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                            Building Godly Leaders Through Excellence in Education
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            Excellence, Knowledge & Integrity — In God We Stand. We nurture curious minds and strong character through Christian Montessori education.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link to="/admission" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-yellow-400">
                                Apply for Admission <FiArrowRight />
                            </Link>
                            <Link to="/about" className="inline-flex items-center justify-center rounded-full border border-blue-400/50 px-6 py-3 font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300">
                                Explore Our School
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-blue-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                        <img
                            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80"
                            alt="Happy African children learning in a bright classroom"
                            className="h-80 w-full rounded-[1.5rem] object-cover"
                        />
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {stats.map((stat) => (
                                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center">
                                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                                    <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Why Choose Us"
                    title="A premium Christian Montessori school for lifelong learning"
                    description="At Royal Higherlife Schools, we combine academic excellence, moral strength, and modern teaching to help every child become a confident leader."
                    align="center"
                />
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {highlights.map((item) => {
                        const Icon = item.icon
                        return (
                            <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                                    <Icon size={22} />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                            </motion.article>
                        )
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
                    <div>
                        <SectionHeading
                            eyebrow="Headmistress' Welcome"
                            title="A school built on values, excellence, and purpose"
                            description="Our school is committed to raising children who are academically prepared, spiritually grounded, and ready to make a difference."
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            'Montessori-inspired learning for independent thinkers',
                            'Strong Christian values and moral development',
                            'Qualified and caring teachers',
                            'A safe, inspiring, and future-ready environment',
                        ].map((item) => (
                            <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm leading-7 text-slate-300">
                                <div className="mb-3 h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Parent Voice"
                    title="What families are saying"
                    description="Parents trust Royal Higherlife Schools for a nurturing environment that supports both excellence and character."
                    align="center"
                />
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    {testimonials.map((item) => (
                        <motion.blockquote key={item.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                            <p className="text-lg leading-8 text-slate-300">“{item.quote}”</p>
                            <footer className="mt-6 text-sm font-semibold text-white">{item.name}</footer>
                            <p className="text-sm text-slate-400">{item.role}</p>
                        </motion.blockquote>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 px-6 py-10 text-center sm:px-8 lg:px-12">
                    <h2 className="text-3xl font-semibold text-white">Admission is open for our next academic journey</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                        Give your child a school experience rooted in faith, excellence, and purposeful learning.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link to="/admission" className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300">Apply for Admission</Link>
                        <Link to="/contact" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-300">Contact Admissions</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
