import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"
import { useCreateCategory, useUpdateCategory } from "../../hooks/useCategories"

function CategoryModal({ category, onClose }) {
  const [name, setName] = useState("")
  const isEditing = !!category

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  useEffect(() => {
    if (category) {
      setName(category.name || "")
    }
  }, [category])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({
          id: category.id,
          data: { name: name.trim() },
        })
      } else {
        await createCategory.mutateAsync({ name: name.trim() })
      }
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const isPending = createCategory.isPending || updateCategory.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la categoría
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C0392B] focus:border-transparent transition-all outline-none"
                placeholder="Ej. Bebidas calientes"
                required
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C0392B] hover:bg-[#96281B] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryModal
