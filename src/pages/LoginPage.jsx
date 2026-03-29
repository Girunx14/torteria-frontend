import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import toast from "react-hot-toast"
import useAuthStore from "../store/authStore"

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: "", password: "" })

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error("Completa todos los campos")
      return
    }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success("Bienvenido al panel")
      navigate("/admin/dashboard")
    } catch (error) {
      toast.error("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C0392B] rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">LT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Torteria 18</h1>
          <p className="text-gray-500 text-sm mt-1">Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C0392B] hover:bg-[#96281B] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          2026 Torteria 18. Hecho con amor.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
