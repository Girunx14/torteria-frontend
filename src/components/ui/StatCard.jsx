// src/components/ui/StatCard.jsx
function StatCard({ title, value, subtitle, color = "red" }) {
    const borderColor = {
        red: "border-[#C0392B]",
        green: "border-[#27AE60]",
        orange: "border-[#E67E22]",
    }[color]

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${borderColor}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 my-1">{value}</p>
            {subtitle && (
                <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
        </div>
    )
}

export default StatCard