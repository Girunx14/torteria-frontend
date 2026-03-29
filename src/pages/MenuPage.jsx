import { useState, useMemo } from "react"
import { useProducts } from "../hooks/useProducts"
import { useCategories } from "../hooks/useCategories"
import MenuNavbar from "../components/layout/MenuNavbar"
import ProductCard from "../components/menu/ProductCard"
import CategoryTabs from "../components/menu/CategoryTabs"
import LoadingSpinner from "../components/ui/LoadingSpinner"

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
            Hecho con sabor real
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight max-w-lg">
            El Corazón de la{" "}
            <span className="text-[#C0392B] italic">Calle</span>{" "}
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
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2024 La Tortería. Crafted with Sabor.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MenuPage
