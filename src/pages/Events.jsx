import SectionHeading from '../components/SectionHeading'

const events = [
    { title: 'Open Day', date: '12 Sep 2026', description: 'Meet our teachers, tour our facilities, and learn more about admissions.' },
    { title: 'Science Fair', date: '20 Oct 2026', description: 'Students showcase projects that reflect innovation, inquiry, and creativity.' },
    { title: 'Founders Day', date: '10 Nov 2026', description: 'A day of celebration, culture, and community service.' },
]

export default function Events() {
    return (
        <main className="space-y-20 pb-16">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <SectionHeading
                    eyebrow="Events"
                    title="Moments that bring our school community together"
                    description="Our calendar is filled with meaningful experiences that enrich learning and relationships."
                    align="center"
                />
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {events.map((event) => (
                        <div key={event.title} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">{event.date}</p>
                            <h3 className="mt-4 text-xl font-semibold text-white">{event.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-slate-400">{event.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
