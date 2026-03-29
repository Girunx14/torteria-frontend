// src/pages/admin/ProductsPage.jsx
import { useProducts } from "../../hooks/useProducts"

function ProductsPage() {
    const { data: products, isLoading, isError } = useProducts()

    console.log("STATE:", { products, isLoading, isError })

    if (isLoading) return <div className="p-8">Cargando...</div>
    if (isError) return <div className="p-8 text-red-500">Error al cargar</div>

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Productos</h1>
            <pre className="text-xs bg-gray-100 p-4 rounded">
                {JSON.stringify(products, null, 2)}
            </pre>
        </div>
    )
}

export default ProductsPage