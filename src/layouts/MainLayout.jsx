import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet />  {/* 👈 Đây là chỗ render HomePage, AdminPage,... */}
        </main>
      </div>
    </div>
  )
}
