function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Tab "Todos" */}
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
          activeId === null
            ? "bg-[#C0392B] text-white shadow-sm"
            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            activeId === cat.id
              ? "bg-[#C0392B] text-white shadow-sm"
              : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
