export default function BadgeShelf({ badges = [] }) {
    return (
        <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
                <span key={badge} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                    {badge}
                </span>
            ))}
        </div>
    )
}
