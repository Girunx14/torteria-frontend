import { useState, useMemo } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCategories } from "../hooks/useCategories"
import MenuNavbar from "../components/layout/MenuNavbar"
import ProductCard from "../components/menu/ProductCard"
import CategoryTabs from "../components/menu/CategoryTabs"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { MessageCircle } from "lucide-react"

function MenuPage() {
  const [activeCategoryId, setActiveCategoryId] = useState(null)

  const { data: products = [], isLoading: loadingProducts } = useProducts({ only_available: true })
  const { data: categories = [], isLoading: loadingCategories } = useCategories()

  // Filtrar productos por categoría activa
  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return products
    return products.filter((p) => p.category_id === activeCategoryId)
  }, [products, activeCategoryId])

  const isLoading = loadingProducts || loadingCategories

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <MenuNavbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-xs font-semibold text-[#C0392B] uppercase tracking-widest mb-3">
            Hecho con amor
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight max-w-lg">
            El Corazón de la{" "}
            <span className="text-[#C0392B] italic">Abuela</span>{" "}
            en tu Mesa.
          </h1>
          <p className="text-gray-500 mt-4 max-w-md text-base">
            Tortas artesanales, bebidas frescas y más. Todo preparado con ingredientes frescos del día.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {isLoading ? (
          <LoadingSpinner text="Cargando menú..." />
        ) : (
          <>
            {/* Filtros de categoría */}
            <div className="mb-8">
              <CategoryTabs
                categories={categories}
                activeId={activeCategoryId}
                onSelect={setActiveCategoryId}
              />
            </div>

            {/* Grid de productos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  No hay productos disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 pb-32 md:pb-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-center text-center">
          <p className="text-sm text-gray-500 font-medium">
            © 2024 La Tortería. Hecho con amor.
          </p>
        </div>
      </footer>

      {/* Control de Botones Flotantes (Redes y Contacto) */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col gap-4 items-center">

        {/* Facebook Floating Button */}
        <a
          href="https://facebook.com/tutorteria"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1877F2] text-white p-3.5 rounded-full shadow-lg shadow-[#1877F2]/40 hover:scale-110 hover:bg-[#166fe5] transition-all duration-300 flex items-center justify-center group cursor-pointer relative"
          aria-label="Síguenos en Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[26px] h-[26px] border-none"
            stroke="none"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
            ¡Síguenos en Facebook!
          </span>
        </a>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/529931669653?text=Hola,%20me%20gustar%C3%ADa%20hacer%20un%20pedido%20de%20La%20Torter%C3%ADa"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/40 hover:scale-110 hover:bg-[#20ba56] transition-all duration-300 flex items-center justify-center group cursor-pointer relative"
          aria-label="Haz tu pedido por WhatsApp"
        >
          <MessageCircle size={28} strokeWidth={2.5} />

          <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg flex items-center gap-2">
            ¡Haz tu pedido aquí!
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
            </span>
          </span>
        </a>

      </div>
    </div>
  )
}

export default MenuPage
