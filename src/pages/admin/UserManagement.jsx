import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate()
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MENTEE',
  })

  useEffect(() => {
    loadUsers()
  }, [page, pageSize, search, roleFilter])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminAPI.getUsers(page, pageSize, search, roleFilter)
      const paginationData = response.pagination || {}
      setUsers(paginationData.content || [])
      setTotalElements(paginationData.totalItems || 0)
      setTotalPages(paginationData.totalPages || 0)
    } catch (err) {
      setError('Lỗi tải danh sách người dùng: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      await adminAPI.createUser(formData.name, formData.email, formData.password, formData.role)
      setError(null)
      setFormData({ name: '', email: '', password: '', role: 'MENTEE' })
      setShowCreateForm(false)
      loadUsers()
    } catch (err) {
      setError('Lỗi tạo người dùng: ' + err.message)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(0)
  }

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value)
    setPage(0)
  }

  if (loading && users.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>
        
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-bold hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Create User Form */}
      {showCreateForm && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Tạo người dùng mới</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Tên người dùng"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="MENTEE">Học viên (MENTEE)</option>
                <option value="TUTOR">Hướng dẫn viên (TUTOR)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold transition"
            >
              Tạo người dùng
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
                setSearch(searchInput)   // chỉ search khi nhấn Enter
                setPage(0)
            }
            }}

            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <select
            value={roleFilter}
            onChange={handleRoleFilter}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="MENTEE">Học viên (MENTEE)</option>
            <option value="TUTOR">Hướng dẫn viên (TUTOR)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
        {search && (
          <p className="text-sm text-gray-600">
            Tìm kiếm: <strong>{search}</strong> | Vai trò: <strong>{roleFilter || 'Tất cả'}</strong>
          </p>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border-2 border-gray-300 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-3 text-left font-bold">ID</th>
              <th className="px-6 py-3 text-left font-bold">Tên</th>
              <th className="px-6 py-3 text-left font-bold">Email</th>
              <th className="px-6 py-3 text-left font-bold">Vai trò</th>
              <th className="px-6 py-3 text-center font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-800">{user.id}</td>
                  <td className="px-6 py-3 text-gray-800 font-medium">{user.name}</td>
                  <td className="px-6 py-3 text-gray-600">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                      user.role === 'ADMIN' ? 'bg-red-500' :
                      user.role === 'TUTOR' ? 'bg-purple-500' :
                      'bg-blue-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ✏️ Chi tiết
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong> | Tổng: <strong>{totalElements}</strong> người dùng
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
            >
              ← Trước
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
            >
              Sau →
            </button>
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(0)
            }}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg"
          >
            <option value="5">5 trên trang</option>
            <option value="10">10 trên trang</option>
            <option value="20">20 trên trang</option>
            <option value="50">50 trên trang</option>
          </select>
        </div>
      )}
    </div>
  )
}
