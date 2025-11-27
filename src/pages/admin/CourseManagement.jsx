import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function CourseManagement() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [tutorFilter, setTutorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [totalElements, setTotalElements] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    tutor: '',
    status: 'ACTIVE',
    maxStudents: 30,
  })

  useEffect(() => {
    loadCourses()
  }, [page, pageSize, tutorFilter, statusFilter, searchCourse])

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminAPI.getCourses(page, pageSize, tutorFilter, statusFilter, searchCourse)
      setCourses(response.data || [])
      setTotalElements(response.totalElements || 0)
    } catch (err) {
      setError('Lỗi tải danh sách khóa học: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    if (!formData.courseName || !formData.tutor) {
      setError('Vui lòng điền tên khóa học và tên hướng dẫn viên')
      return
    }

    try {
      await adminAPI.createCourse(formData)
      setError(null)
      setFormData({
        courseName: '',
        description: '',
        tutor: '',
        status: 'ACTIVE',
        maxStudents: 30,
      })
      setShowCreateForm(false)
      loadCourses()
    } catch (err) {
      setError('Lỗi tạo khóa học: ' + err.message)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const totalPages = Math.ceil(totalElements / pageSize)

  if (loading && courses.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Khóa học</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {showCreateForm ? '❌ Hủy' : '➕ Tạo khóa học'}
        </button>
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

      {/* Create Course Form */}
      {showCreateForm && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Tạo khóa học mới</h3>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <input
              type="text"
              name="courseName"
              placeholder="Tên khóa học"
              value={formData.courseName}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Mô tả khóa học"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="tutor"
                placeholder="Tên hướng dẫn viên"
                value={formData.tutor}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
                <option value="INACTIVE">Tạm dừng (INACTIVE)</option>
                <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
              </select>
              <input
                type="number"
                name="maxStudents"
                placeholder="Số học viên tối đa"
                value={formData.maxStudents}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                min="1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold transition"
            >
              Tạo khóa học
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tên khóa học..."
            value={searchCourse}
            onChange={(e) => {
              setSearchCourse(e.target.value)
              setPage(0)
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="🎓 Tìm hướng dẫn viên..."
            value={tutorFilter}
            onChange={(e) => {
              setTutorFilter(e.target.value)
              setPage(0)
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto border-2 border-gray-300 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-6 py-3 text-left font-bold">ID</th>
              <th className="px-6 py-3 text-left font-bold">Tên khóa học</th>
              <th className="px-6 py-3 text-left font-bold">Hướng dẫn viên</th>
              <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
              <th className="px-6 py-3 text-center font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy khóa học nào
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr key={course.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-800">{course.id}</td>
                  <td className="px-6 py-3 text-gray-800 font-medium">{course.courseName}</td>
                  <td className="px-6 py-3 text-gray-600">{course.tutor}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                      course.status === 'ACTIVE' ? 'bg-green-500' :
                      course.status === 'INACTIVE' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
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
            Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong> | Tổng: <strong>{totalElements}</strong> khóa học
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
