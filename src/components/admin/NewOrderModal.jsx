// src/components/admin/NewOrderModal.jsx
import { useState } from "react"
import { X, Plus, Minus, Trash2 } from "lucide-react"
import { useProducts } from "../../hooks/useProducts"
import { useCreateOrder } from "../../hooks/useOrders"

function NewOrderModal({ onClose }) {
    const { data: products = [] } = useProducts({ only_available: true })
    const createOrder = useCreateOrder()

    const [items, setItems] = useState([])
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(false)

    const addProduct = (product) => {
        const existing = items.find((i) => i.product_id === product.id)
        if (existing) {
            setItems(items.map((i) =>
                i.product_id === product.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ))
        } else {
            setItems([...items, {
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
            }])
        }
    }

    const updateQuantity = (product_id, quantity) => {
        if (quantity <= 0) {
            setItems(items.filter((i) => i.product_id !== product_id))
        } else {
            setItems(items.map((i) =>
                i.product_id === product_id ? { ...i, quantity } : i
            ))
        }
    }

    const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

    const handleSubmit = async () => {
        if (items.length === 0) return
        setLoading(true)
        try {
            await createOrder.mutateAsync({
                items: items.map(({ product_id, quantity }) => ({ product_id, quantity })),
                notes,
            })
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-gray-900">Nueva Orden</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Selecciona los productos</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full
                       hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* Lista de productos */}
                    <div className="flex-1 overflow-y-auto p-4 border-r border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Productos disponibles
                        </p>
                        <div className="space-y-2">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addProduct(product)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl
                             hover:bg-[#FDF6EC] border border-gray-100
                             hover:border-[#C0392B]/20 transition-all text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        {product.image_url ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${product.image_url}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                                IMG
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                                    </div>
                                    <span className="text-sm font-bold text-[#C0392B] flex-shrink-0">
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resumen de la orden */}
                    <div className="w-72 flex flex-col p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Orden actual
                        </p>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {items.length === 0 ? (
                                <p className="text-sm text-gray-300 text-center py-8">
                                    Agrega productos desde la izquierda
                                </p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.product_id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">
                                                ${Number(item.price).toFixed(2)} c/u
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100
                                   flex items-center justify-center transition-colors"
                                            >
                                                {item.quantity === 1
                                                    ? <Trash2 size={10} className="text-red-400" />
                                                    : <Minus size={10} className="text-gray-600" />
                                                }
                                            </button>
                                            <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-green-100
                                   flex items-center justify-center transition-colors"
                                            >
                                                <Plus size={10} className="text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Notas */}
                        <div className="mt-3">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notas (sin cebolla, extra salsa...)"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs
                           focus:outline-none focus:ring-2 focus:ring-[#C0392B] resize-none"
                            />
                        </div>

                        {/* Total y botón */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-600">Total</span>
                                <span className="text-lg font-bold text-[#C0392B]">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={items.length === 0 || loading}
                                className="w-full bg-[#C0392B] hover:bg-[#96281B] disabled:opacity-50
                           text-white py-2.5 rounded-xl text-sm font-semibold
                           transition-colors"
                            >
                                {loading ? "Creando..." : "Crear Orden"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewOrderModal