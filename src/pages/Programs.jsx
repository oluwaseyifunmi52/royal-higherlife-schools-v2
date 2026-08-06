import SectionHeading from '../components/SectionHeading'

const programs = [
    {
        title: 'Early Years',
        description: 'A joyful and nurturing foundation for children to build curiosity, confidence, and early literacy.',
    },
    {
        title: 'Primary & Junior High',
        description: 'A strong academic base with STEM, arts, leadership, and pastoral care embedded in daily learning.',
    },
    {
        title: 'Senior Secondary',
        description: 'Career-guided pathways in sciences, business, and humanities supported by mentorship and revision support.',
    },
]

export default function Programs() {
    return (
        <main className="space-y-20 pb-16">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <SectionHeading
                    eyebrow="Programs"
                    title="Learning pathways for every stage of growth"
                    description="Our curriculum supports excellence from early childhood through senior secondary education."
                    align="center"
                />
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {programs.map((program) => (
                        <div key={program.title} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                            <h3 className="text-xl font-semibold text-white">{program.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-slate-400">{program.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
