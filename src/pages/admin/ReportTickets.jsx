import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function ReportTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [responseData, setResponseData] = useState({
    status: 'PENDING',
    adminResponse: '',
  })

  useEffect(() => {
    loadTickets()
  }, [page, pageSize, statusFilter])

  const loadTickets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminAPI.getReportTickets(page, pageSize)
      const paginationData = response.pagination || {}
      let filteredTickets = paginationData.content || []
      
      if (statusFilter) {
        filteredTickets = filteredTickets.filter(t => t.status === statusFilter)
      }
      
      setTickets(filteredTickets)
      setTotalElements(paginationData.totalItems || 0)
      setTotalPages(paginationData.totalPages || 0)
    } catch (err) {
      setError('Lỗi tải danh sách vé: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTicket = async (ticketId) => {
    if (!responseData.status) {
      setError('Vui lòng chọn trạng thái')
      return
    }

    try {
      await adminAPI.updateReportTicket(ticketId, responseData.status, responseData.adminResponse)
      setError(null)
      setResponseData({ status: 'OPEN', adminResponse: '' })
      setSelectedTicket(null)
      loadTickets()
    } catch (err) {
      setError('Lỗi cập nhật vé: ' + err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500'
      case 'APPROVED':
        return 'bg-green-500'
      case 'REJECTED':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  if (loading && tickets.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">Quản lý Khiếu nại</h2>

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

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(0)
          }}
          className="w-full md:w-48 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý (PENDING)</option>
          <option value="APPROVED">Được phê duyệt (APPROVED)</option>
          <option value="REJECTED">Bị từ chối (REJECTED)</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Không tìm thấy vé nào
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{ticket.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">ID: #{ticket.id}</p>
                </div>
                <span className={`${getStatusColor(ticket.status)} text-white px-4 py-2 rounded-full font-bold text-sm`}>
                  {ticket.status}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{ticket.description}</p>

              {ticket.adminResponse && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm text-gray-600 font-bold mb-1">💬 Phản hồi từ Admin:</p>
                  <p className="text-gray-700">{ticket.adminResponse}</p>
                </div>
              )}

              {selectedTicket === ticket.id ? (
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 space-y-4">
                  <h4 className="font-bold text-gray-800">Cập nhật trạng thái vé</h4>
                  <select
                    value={responseData.status}
                    onChange={(e) => setResponseData({...responseData, status: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="PENDING">Chờ xử lý (PENDING)</option>
                    <option value="APPROVED">Được phê duyệt (APPROVED)</option>
                    <option value="REJECTED">Bị từ chối (REJECTED)</option>
                  </select>
                  <textarea
                    placeholder="Phản hồi của Admin (không bắt buộc)"
                    value={responseData.adminResponse}
                    onChange={(e) => setResponseData({...responseData, adminResponse: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTicket(ticket.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                       Lưu
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTicket(null)
                        setResponseData({ status: 'PENDING', adminResponse: '' })
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                      ❌ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedTicket(ticket.id)
                    setResponseData({ status: ticket.status, adminResponse: ticket.adminResponse || '' })
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  ✍️ Xử lý
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong>
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
        </div>
      )}
    </div>
  )
}
