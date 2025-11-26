import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function Navbar() {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      logout()
      navigate('/login')
    }
  }

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold hover:text-blue-200">
          LMS
        </Link>
        {user && (
          <>
            <Link to="/" className="hover:text-blue-200">Trang chủ</Link>
            {(user.role === 'ADMIN' || user.role === 'TUTOR') && (
              <Link to="/tutor" className="hover:text-blue-200">Hướng dẫn viên</Link>
            )}
            {(user.role === 'ADMIN' || user.role === 'MENTEE') && (
              <Link to="/mentee" className="hover:text-blue-200">Học viên</Link>
            )}
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="hover:text-blue-200">Admin</Link>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">
              👤 {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-200">
              Đăng nhập
            </Link>
            <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}