# Torteria Frontend

Interfaz web construida con React y Vite para la gestión visual del menú, órdenes y estadísticas de La Tortería.

## Tecnologías

- **React 19** — UI
- **Vite** — bundler
- **Tailwind CSS** — estilos
- **React Router** — navegación
- **TanStack Query** — caché y sincronización con la API
- **Zustand** — estado global de autenticación
- **Axios** — llamadas HTTP
- **Recharts** — gráficas del dashboard
- **Lucide React** — íconos
- **React Hot Toast** — notificaciones

## Requisitos

- Node.js 20+
- El backend `torteria-backend` corriendo en `http://localhost:8000`

## Instalación
```bash
git clone https://github.com/tuusuario/torteria-frontend.git
cd torteria-frontend
npm install
cp .env.example .env
npm run dev
```

## Configuración

Edita `.env`:
```env
VITE_API_URL=http://localhost:8000
```

## Estructura
```
src/
├── components/
│   ├── ui/          ← StatCard, LoadingSpinner, ErrorMessage
│   ├── layout/      ← AdminLayout, MenuNavbar
│   ├── menu/        ← ProductCard, CategoryTabs
│   └── admin/       ← ProductModal, NewOrderModal
├── pages/
│   ├── MenuPage.jsx
│   ├── LoginPage.jsx
│   └── admin/
│       ├── DashboardPage.jsx
│       ├── ProductsPage.jsx
│       └── OrdersPage.jsx
├── hooks/           ← useProducts, useCategories, useOrders, useStats
├── services/        ← api.js
└── store/           ← authStore.js
```

## Páginas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Menú visual con categorías y productos |
| `/login` | Público | Login del administrador |
| `/admin/dashboard` | Admin | KPIs, gráfica de ventas y top productos |
| `/admin/products` | Admin | CRUD de productos con imágenes |
| `/admin/orders` | Admin | Gestión de órdenes y cambio de estado |
