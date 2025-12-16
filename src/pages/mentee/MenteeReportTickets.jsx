import React, { useState, useEffect } from 'react'
import { AlertCircle, Send, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
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

  const getStatusConfig = (status) => {
    const configs = {
      OPEN: {
        badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        label: 'Đang xử lý',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600'
      },
      APPROVED: {
        badge: 'bg-green-50 text-green-700 border-green-200',
        label: 'Đã phê duyệt',
        icon: CheckCircle2,
        iconColor: 'text-green-600'
      },
      RESOLVED: {
        badge: 'bg-green-50 text-green-700 border-green-200',
        label: 'Đã giải quyết',
        icon: CheckCircle2,
        iconColor: 'text-green-600'
      },
      CLOSED: {
        badge: 'bg-gray-50 text-gray-700 border-gray-200',
        label: 'Đã đóng',
        icon: XCircle,
        iconColor: 'text-gray-600'
      },
      PENDING: {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        label: 'Chờ xử lý',
        icon: Clock,
        iconColor: 'text-blue-600'
      },
    }
    return configs[status] || configs.PENDING
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Khiếu nại và báo cáo
        </h1>
        <p className="text-blue-100">
          Gửi khiếu nại hoặc báo cáo vấn đề bạn gặp phải, chúng tôi sẽ hỗ trợ bạn trong thời gian sớm nhất
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-6 py-4 font-semibold text-center transition-all ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Send size={18} className="inline-block mr-2 mb-1" />
            Gửi khiếu nại mới
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 px-6 py-4 font-semibold text-center transition-all ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <AlertCircle size={18} className="inline-block mr-2 mb-1" />
            Danh sách khiếu nại
          </button>
        </div>

        <div className="p-6">
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-start gap-3 shadow-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề khiếu nại..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả vấn đề bạn gặp phải một cách chi tiết..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-sm"
                  disabled={submitting}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Send size={18} />
                {submitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <LoadingSpinner />
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={40} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-2">
                    Chưa có khiếu nại nào
                  </p>
                  <p className="text-gray-500 text-sm">
                    Bắt đầu bằng cách gửi khiếu nại mới nếu bạn gặp vấn đề
                  </p>
                </div>
              ) : (
                tickets.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status)
                  const StatusIcon = statusConfig.icon
                  
                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-4">
                          {ticket.title}
                        </h3>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 flex-shrink-0 ${statusConfig.badge}`}
                        >
                          <StatusIcon size={14} className={statusConfig.iconColor} />
                          {statusConfig.label}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                        {ticket.description}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Clock size={14} className="mr-1.5" />
                        <span className="font-medium">Gửi lúc:</span>
                        <span className="ml-1">{new Date(ticket.createdAt).toLocaleString('vi-VN')}</span>
                      </div>

                      {ticket.adminResponse && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border-l-4 border-blue-500 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-blue-500 rounded-full p-1">
                              <CheckCircle2 size={14} className="text-white" />
                            </div>
                            <p className="text-sm font-bold text-blue-900">
                              Phản hồi từ Admin
                            </p>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed pl-6">
                            {ticket.adminResponse}
                          </p>
                          {ticket.resolvedAt && (
                            <p className="text-xs text-gray-600 mt-2 pl-6 flex items-center gap-1">
                              <Clock size={12} />
                              Phản hồi lúc: {new Date(ticket.resolvedAt).toLocaleString('vi-VN')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}