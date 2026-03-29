// src/components/ui/LoadingSpinner.jsx
function LoadingSpinner({ text = "Cargando..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C0392B] rounded-full animate-spin" />
            <p className="text-sm text-gray-400">{text}</p>
        </div>
    )
}

export default LoadingSpinner