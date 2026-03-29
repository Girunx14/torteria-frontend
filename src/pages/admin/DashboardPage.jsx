// src/pages/admin/DashboardPage.jsx
import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { TrendingUp, ShoppingBag, Receipt } from "lucide-react"
import { useStats } from "../../hooks/useStats"
import StatCard from "../../components/ui/StatCard"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ErrorMessage from "../../components/ui/ErrorMessage"

// Tooltip personalizado para la gráfica
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#C0392B]">
          ${Number(payload[0].value).toLocaleString("es-MX")}
        </p>
      </div>
    )
  }
  return null
}

function DashboardPage() {
  const [days, setDays] = useState(30)
  const { data: stats, isLoading, isError } = useStats(days)

  const formatCurrency = (value) =>
    `$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`

  // Formatear fechas del eje X
  const chartData = stats?.daily_sales?.map((item) => ({
    ...item,
    date: new Date(item.date + "T00:00:00").toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    }),
  })) || []

  return (
    <div className="p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Resumen de actividad de los últimos {days} días
          </p>
        </div>

        {/* Selector de período */}
        <div className="grid grid-cols-3 md:flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm w-full md:w-auto">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${days === d
                  ? "bg-[#C0392B] text-white"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              {d === 7 ? "Semana" : d === 30 ? "Mes" : "Trimestre"}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <LoadingSpinner text="Cargando estadísticas..." />}
      {isError && <ErrorMessage message="No se pudieron cargar las estadísticas." />}

      {stats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Vendido"
              value={formatCurrency(stats.total_revenue)}
              subtitle={`${stats.total_orders} órdenes completadas`}
              color="red"
            />
            <StatCard
              title="Total Órdenes"
              value={stats.total_orders}
              subtitle={`Promedio ${Math.round(stats.total_orders / days)}/día`}
              color="orange"
            />
            <StatCard
              title="Ticket Promedio"
              value={formatCurrency(stats.average_ticket)}
              subtitle={`Basado en ${days} días`}
              color="green"
            />
          </div>

          {/* Gráfica + Top productos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Gráfica de ventas */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-800">Ventas por día</h2>
                <TrendingUp size={18} className="text-[#C0392B]" />
              </div>

              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                  Sin datos para este período
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="total_revenue"
                      fill="#C0392B"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top 5 productos */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-800">Top 5 productos</h2>
                <ShoppingBag size={18} className="text-[#C0392B]" />
              </div>

              {stats.top_products.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                  Sin ventas registradas
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.top_products.slice(0, 5).map((product, index) => (
                    <div key={product.product_id} className="flex items-center gap-3">
                      {/* Número */}
                      <span className="w-6 h-6 rounded-full bg-[#FDF6EC] text-[#C0392B]
                                       text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.product_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.total_sold} vendidos
                        </p>
                      </div>

                      {/* Revenue */}
                      <span className="text-sm font-bold text-[#C0392B] flex-shrink-0">
                        {formatCurrency(product.total_revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage