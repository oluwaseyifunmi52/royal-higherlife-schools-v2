import SectionHeading from '../components/SectionHeading'

const gallery = [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
]

export default function Gallery() {
    return (
        <main className="space-y-20 pb-16">
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <SectionHeading
                    eyebrow="Gallery"
                    title="Moments of learning, growth, and celebration"
                    description="Take a glimpse into the energy and warmth that define life at Royal Higherlife Schools."
                    align="center"
                />
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {gallery.map((image) => (
                        <img key={image} src={image} alt="School activity" className="h-72 w-full rounded-[2rem] object-cover" />
                    ))}
                </div>
            </section>
        </main>
    )
}
