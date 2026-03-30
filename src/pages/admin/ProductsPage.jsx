import { useState } from "react"
import { Plus, Pencil, Trash2, ImageOff, ToggleLeft, ToggleRight } from "lucide-react"
import { useProducts, useDeleteProduct, useUpdateProduct } from "../../hooks/useProducts"
import { useCategories } from "../../hooks/useCategories"
import ProductModal from "../../components/admin/ProductModal"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ErrorMessage from "../../components/ui/ErrorMessage"

function ProductsPage() {
  const { data: products = [], isLoading, isError } = useProducts({ only_available: false })
  const { data: categories = [] } = useCategories()
  const deleteProduct = useDeleteProduct()
  const updateProduct = useUpdateProduct()

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.name || `Cat. ${categoryId}`
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleDelete = (product) => {
    if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      deleteProduct.mutate(product.id)
    }
  }

  const handleToggleAvailable = (product) => {
    updateProduct.mutate({
      id: product.id,
      data: { is_available: !product.is_available },
    })
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Catálogo de menú
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#96281B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total productos</p>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Más vendido</p>
          <p className="text-lg font-bold text-gray-900 truncate">
            {products[0]?.name || "Sin datos"}
          </p>
        </div>
      </div>

      {isLoading && <LoadingSpinner text="Cargando productos..." />}
      {isError && <ErrorMessage message="No se pudieron cargar los productos." />}

      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categoría</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Disponible</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 text-sm">
                    No hay productos registrados. Crea el primero.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL}${product.image_url}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff size={16} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">
                            {product.description || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 bg-[#FDF6EC] text-[#C0392B] text-xs font-medium rounded-lg">
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleAvailable(product)} className="transition-colors">
                        {product.is_available ? (
                          <ToggleRight size={28} className="text-[#C0392B]" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
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
        <ProductModal product={editingProduct} onClose={handleClose} />
      )}
    </div>
  )
}

export default ProductsPage
