// src/components/admin/ProductModal.jsx
import { useState, useEffect } from "react"
import { X, Upload, ImageIcon } from "lucide-react"
import { useCategories } from "../../hooks/useCategories"
import { useCreateProduct, useUpdateProduct, useUploadImage } from "../../hooks/useProducts"

function ProductModal({ product = null, onClose }) {
    const isEditing = !!product
    const { data: categories = [] } = useCategories()
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()
    const uploadImage = useUploadImage()

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        is_available: true,
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)

    // Si estamos editando, prellenar el formulario
    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                category_id: product.category_id || "",
                is_available: product.is_available ?? true,
            })
            if (product.image_url) {
                setImagePreview(`${import.meta.env.VITE_API_URL}${product.image_url}`)
            }
        }
    }, [product])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.category_id) {
            return
        }
        setLoading(true)
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                category_id: parseInt(form.category_id),
            }

            let savedProduct

            if (isEditing) {
                const result = await updateProduct.mutateAsync({ id: product.id, data: payload })
                savedProduct = result.data
            } else {
                const result = await createProduct.mutateAsync(payload)
                savedProduct = result.data
            }

            // Subir imagen si se seleccionó una
            if (imageFile && savedProduct?.id) {
                await uploadImage.mutateAsync({ id: savedProduct.id, file: imageFile })
            }

            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-gray-900">
                            {isEditing ? "Editar Producto" : "Nuevo Producto"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Gestión de inventario</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full
                       hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imagen del producto
                        </label>
                        <label className="block cursor-pointer">
                            <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors
                              ${imagePreview ? "border-[#C0392B]" : "border-gray-200 hover:border-[#C0392B]"}`}>
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                                            <ImageIcon size={24} className="text-gray-300" />
                                        </div>
                                        <p className="text-sm text-gray-400">Arrastra o selecciona un archivo</p>
                                        <p className="text-xs text-gray-300">PNG, JPG hasta 5MB</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del producto <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ej. Torta Cubana"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Detalles de ingredientes y preparación..."
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent
                         resize-none"
                        />
                    </div>

                    {/* Precio y Categoría */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent
                           bg-white"
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Disponible */}
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Disponible para venta</p>
                            <p className="text-xs text-gray-400">El producto aparecerá en el menú digital</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_available"
                                checked={form.is_available}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer
                              peer-checked:after:translate-x-full peer-checked:after:border-white
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                              after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                              peer-checked:bg-[#C0392B]" />
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-[#C0392B] hover:bg-[#96281B]
                         disabled:opacity-60 text-white rounded-xl text-sm
                         font-semibold transition-colors"
                        >
                            {loading ? "Guardando..." : "Guardar Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductModal