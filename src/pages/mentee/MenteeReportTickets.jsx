import React, { useState, useEffect } from 'react'
import { AlertCircle, Send, Clock } from 'lucide-react'
import { menteeAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function MenteeReportTickets() {
  const [activeTab, setActiveTab] = useState('create')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (activeTab === 'list') {
      loadTickets()
    }
  }, [activeTab])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const res = await menteeAPI.getMyReportTickets()
      if (res.data) {
        setTickets(res.data.content || res.data)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Lỗi khi tải danh sách khiếu nại',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      setMessage({
        type: 'error',
        text: 'Vui lòng điền đầy đủ tiêu đề và mô tả',
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await menteeAPI.createReportTicket(
        formData.title,
        formData.description
      )

      if (res.statusCode === 201 || res.statusCode === 200) {
        setMessage({
          type: 'success',
          text: 'Gửi khiếu nại thành công!',
        })
        setFormData({ title: '', description: '' })
        setTimeout(() => {
          setActiveTab('list')
          loadTickets()
        }, 1000)
      } else {
        setMessage({
          type: 'error',
          text: res.message || 'Lỗi khi gửi khiếu nại',
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Lỗi khi gửi khiếu nại: ' + (error.message || 'Vui lòng thử lại'),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      OPEN: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      RESOLVED: 'bg-green-100 text-green-800 border border-green-300',
      CLOSED: 'bg-gray-100 text-gray-800 border border-gray-300',
      PENDING: 'bg-blue-100 text-blue-800 border border-blue-300',
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      OPEN: 'Đang xử lý',
      RESOLVED: 'Đã giải quyết',
      CLOSED: 'Đã đóng',
      PENDING: 'Chờ xử lý',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Khiếu nại và báo cáo
        </h1>
        <p className="text-gray-600 text-sm">
          Gửi khiếu nại hoặc báo cáo vấn đề bạn gặp phải
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-4 py-3 font-medium text-center text-sm transition-colors ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gửi khiếu nại mới
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 px-4 py-3 font-medium text-center text-sm transition-colors ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Danh sách khiếu nại
          </button>
        </div>

        <div className="p-4">
          {message.text && (
            <div
              className={`mb-3 p-3 rounded-md flex items-start gap-2 text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề khiếu nại..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả vấn đề bạn gặp phải một cách chi tiết..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Send size={16} />
                {submitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {loading ? (
                <LoadingSpinner />
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle
                    size={40}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <p className="text-gray-600 text-sm">
                    Bạn chưa có khiếu nại nào. Bắt đầu bằng cách gửi khiếu nại
                    mới.
                  </p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-50 rounded-md p-3 border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {ticket.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {getStatusLabel(ticket.status)}
                      </span>
                    </div>

                    <p className="text-gray-700 text-xs mb-2">
                      {ticket.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(ticket.createdAt).toLocaleString('vi-VN')}
                      </div>
                      {ticket.response && (
                        <div className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-blue-700">
                          <strong>Phản hồi:</strong> {ticket.response}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
