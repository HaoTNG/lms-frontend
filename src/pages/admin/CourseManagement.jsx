import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'



export default function CourseManagement() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [tutorFilter, setTutorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchCourse, setSearchCourse] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [subjectRegistrations, setSubjectRegistrations] = useState([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  const navigate = useNavigate()
  // Form state
  const [formData, setFormData] = useState({
    subjectRegistrationId: '',
    description: '',
    status: 'OPEN',
    maxStudents: 30,
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    loadCourses()
    loadSubjectRegistrations()
  }, [page, pageSize, tutorFilter, statusFilter, searchCourse])

  const loadSubjectRegistrations = async () => {
    setLoadingSubjects(true)
    try {
      const response = await adminAPI.getSubjectRegistrations();
      console.log('Subject registrations:', response.data)
      setSubjectRegistrations(response.data || [])
    } catch (err) {
      console.error('Lỗi tải danh sách subject registrations:', err)
      setError('Lỗi tải danh sách subject registrations: ' + err.message)
    } finally {
      setLoadingSubjects(false)
    }
  }

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminAPI.getCourses(page, pageSize, tutorFilter, statusFilter, searchCourse)
      const paginationData = response.pagination || {}
      setCourses(paginationData.content || [])
      setTotalElements(paginationData.totalItems || 0)
      setTotalPages(paginationData.totalPages || 0)
    } catch (err) {
      setError('Lỗi tải danh sách khóa học: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    // Validate ngày
  if (formData.startDate && formData.endDate) {
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
      return;
    }
  }

    if (!formData.subjectRegistrationId) {
      setError('Vui lòng chọn Subject Registration')
      return
    }

    try {
      await adminAPI.createCourse({
        subjectRegistrationId: formData.subjectRegistrationId,
        description: formData.description,
        courseStatus: formData.status,
        maxMentee: formData.maxStudents,
        startDate: formData.startDate,
        endDate: formData.endDate,
      })
      setError(null)
      setFormData({
        subjectRegistrationId: '',
        description: '',
        status: 'OPEN',
        maxStudents: 30,
      })
      window.location.reload();

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
          {showCreateForm ? '❌ Hủy' : ' Tạo khóa học'}
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
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Tạo khóa học mới</h3>

          <form onSubmit={handleCreateCourse} className="space-y-4 max-w-2xl mx-auto">

            {/* Subject Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn Subject Registration <span className="text-red-500">*</span>
              </label>
              <select
                name="subjectRegistrationId"
                value={formData.subjectRegistrationId}
                onChange={handleFormChange}
                disabled={loadingSubjects}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">-- Chọn subject registration --</option>
                {subjectRegistrations.map(sr => (
                  <option key={sr.id} value={sr.id}>
                    {sr.subject.subjectName} — {sr.tutor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả khóa học
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả khóa học..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            {/* Start + End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Status + Max Students */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="OPEN">Đang hoạt động (OPEN)</option>
                  <option value="PENDING">Tạm dừng (PENDING)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số học viên tối đa
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  min="1"
                  value={formData.maxStudents}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold transition text-sm flex items-center justify-center gap-2"
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchCourse(searchInput)   // chỉ search khi nhấn Enter
                setPage(0)
              }
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
            <option value="OPEN">Đang hoạt động</option>
            <option value="END">Hoàn thành</option>
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
                <tr key={course.courseId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-800">{course.courseId}</td>
                  <td className="px-6 py-3 text-gray-800 font-medium">{course.courseName}</td>
                  <td className="px-6 py-3 text-gray-600">{course.tutorName}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                      course.courseStatus === 'OPEN' ? 'bg-green-500' :
                      course.courseStatus === 'END' ? 'bg-gray-500' :
                      'bg-blue-500'
                    }`}>
                      {course.courseStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => navigate(`/admin/courses/${course.courseId}`)}
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
