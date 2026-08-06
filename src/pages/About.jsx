import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'

const values = [
    'Academic excellence with strong moral grounding',
    'A safe, inclusive environment for every learner',
    'Innovative teaching supported by technology and creativity',
    'Leadership opportunities that build confidence and service',
]

export default function About() {
    return (
        <main className="space-y-20 pb-16">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <SectionHeading
                            eyebrow="About us"
                            title="A school built on excellence, care, and purpose."
                            description="Royal Higherlife Schools exists to nurture well-rounded learners who can lead with wisdom, compassion, and confidence."
                        />
                        <p className="mt-6 text-lg leading-8 text-slate-400">
                            Our teachers, administrators, and support staff work together to create an environment where students feel seen, challenged, and inspired to do their best. We believe that strong academics should always go hand in hand with character formation and service.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/70">
                        <img
                            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80"
                            alt="Students and teachers in a welcoming school setting"
                            className="h-full min-h-[320px] w-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 lg:grid-cols-2 lg:p-12">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Our mission</p>
                        <h2 className="mt-3 text-3xl font-semibold text-white">To raise learners who thrive academically and contribute meaningfully to society.</h2>
                    </div>
                    <div>
                        <p className="text-lg leading-8 text-slate-400">
                            We strive to provide a well-rounded education rooted in excellence, innovation, responsibility, and compassion — empowering every learner to create a positive impact.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Our values"
                    title="The principles that guide everything we do"
                    description="These values shape our classrooms, culture, and community relationships."
                    align="center"
                />
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {values.map((value) => (
                        <motion.div key={value} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-lg text-slate-300">
                            <div className="mb-3 h-2.5 w-2.5 rounded-full bg-amber-400" />
                            {value}
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    )
}
