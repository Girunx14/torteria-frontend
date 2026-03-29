import { Link } from "react-router-dom"
import { ChefHat, Lock } from "lucide-react"

function MenuNavbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="Torteria 18 Logo" 
            className="w-14 h-14 object-contain transition-transform group-hover:scale-105" 
          />
          <div className="flex flex-col">
            <p className="font-black text-xl text-gray-900 leading-none">TORTERIA 18</p>
            <p className="text-xs font-medium text-[#C0392B] italic">La casa de la abuela</p>
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
