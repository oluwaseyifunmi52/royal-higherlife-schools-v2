export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
    return (
        <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">{description}</p>
        </div>
    )
}
