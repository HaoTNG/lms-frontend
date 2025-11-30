import { useState, useEffect } from 'react'
import {  adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [recipientFilter, setRecipientFilter] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    recipient: 'ALL',
    title: '',
    content: '',
    userId: '',
  })

  useEffect(() => {
    loadAnnouncements()
  }, [page, pageSize, recipientFilter])

  const loadAnnouncements = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminAPI.getAnnouncements(page, pageSize, recipientFilter)
      const paginationData = response.pagination || {}
      setAnnouncements(paginationData.content || [])
      setTotalElements(paginationData.totalItems || 0)
      setTotalPages(paginationData.totalPages || 0)
    } catch (err) {
      setError('Lỗi tải danh sách thông báo: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendAnnouncement = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      setError('Vui lòng điền tiêu đề và nội dung')
      return
    }

    try {
      if (formData.recipient === 'ALL') {
        await adminAPI.sendAnnouncementToAll(formData.title, formData.content)
      } else if (formData.recipient === 'MENTEE') {
        await adminAPI.sendAnnouncementToMentee(formData.title, formData.content)
      } else if (formData.recipient === 'TUTOR') {
        await adminAPI.sendAnnouncementToTutor(formData.title, formData.content)
      } else if (formData.recipient === 'SPECIFIC' && formData.userId) {
        await adminAPI.sendAnnouncementToUser(formData.userId, formData.title, formData.content)
      }

      setError(null)
      setFormData({ recipient: 'ALL', title: '', content: '', userId: '' })
      setShowCreateForm(false)
      loadAnnouncements()
    } catch (err) {
      setError('Lỗi gửi thông báo: ' + err.message)
    }
  }

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      return
    }

    try {
      await adminAPI.deleteAnnouncement(announcementId)
      setError(null)
      loadAnnouncements()
    } catch (err) {
      setError('Lỗi xóa thông báo: ' + err.message)
    }
  }

  const getRecipientLabel = (recipient) => {
    switch (recipient) {
      case 'ALL':
        return '👥 Tất cả'
      case 'MENTEE':
        return '📚 Học viên'
      case 'TUTOR':
        return '🎓 Hướng dẫn viên'
      case 'SPECIFIC':
        return '👤 Người dùng'
      default:
        return recipient
    }
  }

  if (loading && announcements.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Thông báo</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          {showCreateForm ? '❌ Hủy' : '📢 Gửi thông báo'}
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

      {/* Create Announcement Form */}
      {showCreateForm && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Gửi thông báo mới</h3>
          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.recipient}
                onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">👥 Gửi tới tất cả</option>
                <option value="MENTEE">📚 Gửi tới học viên</option>
                <option value="TUTOR">🎓 Gửi tới hướng dẫn viên</option>
                <option value="SPECIFIC">👤 Gửi tới người dùng cụ thể</option>
              </select>
              
              {formData.recipient === 'USER' && (
                <input
                  type="number"
                  placeholder="ID người dùng"
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required={formData.recipient === 'USER'}
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Tiêu đề thông báo"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />

            <textarea
              placeholder="Nội dung thông báo"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-32"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold transition"
            >
              📤 Gửi thông báo
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <select
          value={recipientFilter}
          onChange={(e) => {
            setRecipientFilter(e.target.value)
            setPage(0)
          }}
          className="w-full md:w-64 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Tất cả thông báo</option>
          <option value="ALL">Gửi tới tất cả</option>
          <option value="MENTEE">Gửi tới học viên</option>
          <option value="TUTOR">Gửi tới hướng dẫn viên</option>
          <option value="SPECIFIC">Gửi tới người dùng cụ thể</option>
        </select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Không tìm thấy thông báo nào
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <div key={announcement.id} className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📢</span>
                    <h3 className="text-xl font-bold text-gray-800">{announcement.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {getRecipientLabel(announcement.recipientType)}
                    </span>
                    {announcement.createdAt && (
                      <span className="text-gray-500 text-sm">
                        📅 {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-lg"
                >
                  🗑️
                </button>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap mb-3">{announcement.content}</p>

              {announcement.adminId && (
                <p className="text-gray-500 text-sm">
                  Từ Admin ID: #{announcement.adminId}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong> | Tổng: <strong>{totalElements}</strong> thông báo
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
          </select>
        </div>
      )}
    </div>
  )
}
