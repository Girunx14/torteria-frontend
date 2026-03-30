import { ShoppingBag } from "lucide-react"

function ProductCard({ product }) {
  const imageUrl = product.image_url
    ? (product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL}${product.image_url}`)
    : null

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FDF6EC]">
            <ShoppingBag size={40} className="text-[#C0392B]/20" />
          </div>
        )}
        {/* Badge de precio */}
        <div className="absolute top-3 right-3 bg-[#C0392B] text-white text-sm font-bold
                        px-3 py-1 rounded-full shadow-md">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductCard
