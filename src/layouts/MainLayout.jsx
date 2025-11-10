import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function MainLayout({ children }) {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='p-6 overflow-auto'>{children}</main>
      </div>
    </div>
  )
}