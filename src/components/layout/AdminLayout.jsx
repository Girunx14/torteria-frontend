// src/components/layout/AdminLayout.jsx
import { useState, useEffect } from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  LogOut,
  ChefHat,
  Menu,
  X,
} from "lucide-react"
import toast from "react-hot-toast"
import useAuthStore from "../../store/authStore"

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: ShoppingBag, label: "Productos" },
  { to: "/admin/orders", icon: ClipboardList, label: "Órdenes" },
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Cerrar sidebar al cambiar de ruta
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada")
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#1A1A1A] text-white flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>

        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Tortería" 
              className="w-10 h-10 object-contain bg-white rounded-lg p-[2px] shadow-sm transform transition-transform hover:rotate-2 hover:scale-105"
            />
            <div>
              <p className="font-bold text-sm leading-tight text-[#C0392B] tracking-wide">Tortería 18</p>
              <p className="text-white/40 text-xs font-medium">Panel de control</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                  ? "bg-[#C0392B] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Usuario */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-[#C0392B] rounded-full flex items-center justify-center text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username || "Admin"}</p>
              <p className="text-white/40 text-xs capitalize">{user?.role || "admin"}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                       text-white/60 hover:bg-red-900/40 hover:text-white
                       text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col max-w-full overflow-x-hidden">
        {/* Header móvil */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Logo Tortería" 
              className="w-8 h-8 object-contain bg-[#1A1A1A] rounded-md p-1 shadow-sm"
            />
            <span className="font-bold text-sm text-[#1A1A1A]">Panel Admin</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout