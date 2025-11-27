import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="p-6 overflow-auto flex-1 bg-gray-50">
        <Outlet />  {/* 👈 Đây là chỗ render HomePage, AdminPage,... */}
      </main>
    </div>
  )
}
