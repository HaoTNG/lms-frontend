import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
