// src/components/ui/ErrorMessage.jsx
function ErrorMessage({ message = "Ocurrió un error al cargar los datos." }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-center">
                <p className="text-red-600 font-medium text-sm">{message}</p>
            </div>
        </div>
    )
}

export default ErrorMessage