import { useState } from "react"
import { Plus, Eye, Trash2 } from "lucide-react"
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "../../hooks/useOrders"
import { useProducts } from "../../hooks/useProducts"
import NewOrderModal from "../../components/admin/NewOrderModal"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ErrorMessage from "../../components/ui/ErrorMessage"

const STATUS_OPTIONS = [
  { value: null,        label: "Todas" },
  { value: "pending",   label: "Pendiente" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

const STATUS_STYLES = {
  pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-400 border border-red-200",
}

function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const { data: orders = [], isLoading, isError } = useOrders(
    statusFilter ? { order_status: statusFilter } : {}
  )
  const { data: products = [] } = useProducts({ only_available: false })
  const updateStatus = useUpdateOrderStatus()
  const deleteOrder = useDeleteOrder()

  const getProductName = (productId) => {
    const prod = products.find((p) => p.id === productId)
    return prod?.name || `Producto #${productId}`
  }

  const handleStatusChange = (order, newStatus) => {
    updateStatus.mutate({ id: order.id, status: newStatus })
  }

  const handleDelete = (order) => {
    if (confirm(`¿Eliminar la orden #${order.id}?`)) {
      deleteOrder.mutate(order.id)
    }
  }

  const pending = orders.filter((o) => o.status === "pending").length
  const totalCompleted = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Panel de control
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#96281B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={18} />
          Nueva Orden
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Órdenes totales</p>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-500">{pending}</p>
          {pending > 0 && <p className="text-xs text-yellow-400 mt-1">Requieren atención</p>}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ventas completadas</p>
          <p className="text-2xl font-bold text-[#C0392B]">
            ${totalCompleted.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => setStatusFilter(option.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === option.value
                ? "bg-[#C0392B] text-white"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner text="Cargando órdenes..." />}
      {isError && <ErrorMessage message="No se pudieron cargar las órdenes." />}

      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Orden</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Detalle</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                    No hay órdenes registradas.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <>
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-700">
                          #{String(order.id).padStart(4, "0")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString("es-MX")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {order.items?.map((i) => `${i.quantity}x ${getProductName(i.product_id)}`).join(", ") || "—"}
                        </p>
                        {order.notes && (
                          <p className="text-xs text-gray-400 truncate max-w-xs">Nota: {order.notes}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C0392B] ${STATUS_STYLES[order.status]}`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="completed">Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-400 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(order)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr key={`detail-${order.id}`} className="bg-[#FDF6EC]">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="flex gap-3 flex-wrap">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="bg-white px-3 py-2 rounded-xl text-xs border border-gray-100 shadow-sm">
                                <span className="font-bold text-[#C0392B]">{item.quantity}x</span>
                                <span className="text-gray-700 ml-1">{getProductName(item.product_id)}</span>
                                <span className="text-gray-400 ml-2">${Number(item.unit_price).toFixed(2)} c/u</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {showModal && <NewOrderModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default OrdersPage
