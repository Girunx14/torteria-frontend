import { Outlet } from "react-router-dom"

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#1A1A1A] text-white">Sidebar</aside>
      <main className="flex-1"><Outlet /></main>
    </div>
  )
}
export default AdminLayout
