import { Link } from "react-router-dom"
import { ChefHat, Lock } from "lucide-react"

function MenuNavbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C0392B] rounded-xl flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">La Tortería</p>
            <p className="text-xs text-gray-400">Hecho con sabor real</p>
          </div>
        </Link>

        {/* Link al admin */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-xs text-gray-400
                     hover:text-[#C0392B] transition-colors"
        >
          <Lock size={13} />
          Admin
        </Link>
      </div>
    </header>
  )
}

export default MenuNavbar
