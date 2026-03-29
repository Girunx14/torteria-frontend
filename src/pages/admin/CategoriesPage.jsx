import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useCategories, useDeleteCategory } from "../../hooks/useCategories"
import CategoryModal from "../../components/admin/CategoryModal"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ErrorMessage from "../../components/ui/ErrorMessage"

function CategoriesPage() {
  const { data: categories = [], isLoading, isError } = useCategories()
  const deleteCategory = useDeleteCategory()

  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingCategory(null)
  }

  const handleDelete = (category) => {
    if (confirm(`¿Eliminar la categoría "${category.name}"? Los productos asignados a esta categoría podrían verse afectados.`)) {
      deleteCategory.mutate(category.id)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Gestión de menús
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#96281B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total categorías</p>
          <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
        </div>
      </div>

      {isLoading && <LoadingSpinner text="Cargando categorías..." />}
      {isError && <ErrorMessage message="No se pudieron cargar las categorías." />}

      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-16 text-gray-400 text-sm">
                      No hay categorías registradas. Crea la primera.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 font-medium">#{category.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-800">{category.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <CategoryModal category={editingCategory} onClose={handleClose} />
      )}
    </div>
  )
}

export default CategoriesPage
