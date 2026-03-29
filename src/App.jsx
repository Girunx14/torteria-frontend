// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import useAuthStore from "./store/authStore"

// Páginas
import MenuPage from "./pages/MenuPage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/admin/DashboardPage"
import ProductsPage from "./pages/admin/ProductsPage"
import OrdersPage from "./pages/admin/OrdersPage"

// Layout del admin
import AdminLayout from "./components/layout/AdminLayout"

// Ruta protegida
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas del admin — protegidas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App