// src/components/layout/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  LogOut,
  ChefHat,
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
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada")
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col fixed h-full z-10">

        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C0392B] rounded-lg flex items-center justify-center">
              <ChefHat size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Admin Panel</p>
              <p className="text-white/40 text-xs">La Tortería Management</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
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
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout