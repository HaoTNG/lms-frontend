import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('system')
  const [systemAnalytics, setSystemAnalytics] = useState(null)
  const [studentAnalytics, setStudentAnalytics] = useState(null)
  const [tutorAnalytics, setTutorAnalytics] = useState(null)
  const [allAnalytics, setAllAnalytics] = useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [activeTab])

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'system') {
        const response = await adminAPI.getSystemAnalytics()
        setSystemAnalytics(response.data || response)
      } else if (activeTab === 'students') {
        const response = await adminAPI.getStudentAnalytics()
        setStudentAnalytics(response.data || response)
      } else if (activeTab === 'tutors') {
        const response = await adminAPI.getTutorAnalytics()
        setTutorAnalytics(response.data || response)
      } else if (activeTab === 'all') {
        const response = await adminAPI.getAllAnalytics()
        setAllAnalytics(response.data || response)
      }
    } catch (err) {
      setError('Lỗi tải phân tích: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'system', label: '🖥️ Hệ thống', icon: 'system' },
    { id: 'students', label: '📚 Học viên', icon: 'students' },
    { id: 'tutors', label: '🎓 Hướng dẫn viên', icon: 'tutors' },
    { id: 'all', label: '📊 Tất cả', icon: 'all' },
  ]

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">Bảng phân tích</h2>

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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b-2 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'system' && systemAnalytics && (
          <SystemAnalyticsView data={systemAnalytics} />
        )}
        {activeTab === 'students' && studentAnalytics && (
          <StudentAnalyticsView data={studentAnalytics} />
        )}
        {activeTab === 'tutors' && tutorAnalytics && (
          <TutorAnalyticsView data={tutorAnalytics} />
        )}
        {activeTab === 'all' && allAnalytics && (
          <AllAnalyticsView data={allAnalytics} />
        )}
      </div>
    </div>
  )
}

function SystemAnalyticsView({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnalyticsCard
        title="Tổng người dùng"
        value={data?.totalUsers || 0}
        icon="👥"
        color="blue"
      />
      <AnalyticsCard
        title="Tổng Admin"
        value={data?.totalAdmins || 0}
        icon="👨‍💼"
        color="red"
      />
      <AnalyticsCard
        title="Tổng Hướng dẫn viên"
        value={data?.totalTutors || 0}
        icon="🎓"
        color="purple"
      />
      <AnalyticsCard
        title="Tổng Học viên"
        value={data?.totalMentees || 0}
        icon="📚"
        color="green"
      />
      <AnalyticsCard
        title="Tổng khóa học"
        value={data?.totalCourses || 0}
        icon="📖"
        color="orange"
      />
      <AnalyticsCard
        title="Khóa học đang hoạt động"
        value={data?.activeCourses || 0}
        icon="✅"
        color="emerald"
      />
      <AnalyticsCard
        title="Khóa học hoàn thành"
        value={data?.finishedCourses || 0}
        icon="🏆"
        color="yellow"
      />
      <AnalyticsCard
        title="Tổng đăng ký"
        value={data?.totalEnrollments || 0}
        icon="📝"
        color="cyan"
      />
    </div>
  )
}

function StudentAnalyticsView({ data }) {
  const performanceDist = data?.performanceDistribution || {}
  const submissionAnalysis = data?.submissionAnalysis || {}
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Học viên xuất sắc"
          value={performanceDist?.excellentCount || 0}
          icon="⭐"
          color="yellow"
        />
        <AnalyticsCard
          title="Học viên giỏi"
          value={performanceDist?.goodCount || 0}
          icon="👍"
          color="green"
        />
        <AnalyticsCard
          title="Học viên trung bình"
          value={performanceDist?.averageCount || 0}
          icon="📊"
          color="orange"
        />
        <AnalyticsCard
          title="Học viên yếu"
          value={performanceDist?.weakCount || 0}
          icon="⚠️"
          color="red"
        />
        <AnalyticsCard
          title="Điểm trung bình chung"
          value={`${performanceDist?.averageScoreOverall?.toFixed(2) || 0}`}
          icon="📈"
          color="blue"
        />
        <AnalyticsCard
          title="Tỉ lệ hoàn thành"
          value={`${(submissionAnalysis?.completionRate * 100)?.toFixed(1) || 0}%`}
          icon="✅"
          color="emerald"
        />
      </div>
      
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📝 Phân tích nộp bài</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-600">{submissionAnalysis?.onTimeSubmissions || 0}</div>
            <div className="text-gray-600 text-sm mt-2">Nộp đúng hạn</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-600">{submissionAnalysis?.lateSubmissions || 0}</div>
            <div className="text-gray-600 text-sm mt-2">Nộp trễ hạn</div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600">{(submissionAnalysis?.completionRate * 100)?.toFixed(1) || 0}%</div>
            <div className="text-gray-600 text-sm mt-2">Tỉ lệ hoàn thành</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TutorAnalyticsView({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsCard
          title="Tỉ lệ hoàn thành khóa học"
          value={`${(data?.courseCompletionRate * 100)?.toFixed(1) || 0}%`}
          icon="✅"
          color="green"
        />
        <AnalyticsCard
          title="Đánh giá trung bình"
          value={`${data?.averageRating?.toFixed(2) || 0}/5.0`}
          icon="⭐"
          color="yellow"
        />
      </div>
      
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Thông tin hướng dẫn viên</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div>
              <p className="text-gray-600 font-medium">Tỉ lệ hoàn thành khóa học</p>
              <p className="text-sm text-gray-500 mt-1">Phần trăm khóa học được hoàn thành thành công</p>
            </div>
            <div className="text-2xl font-bold text-green-600">{(data?.courseCompletionRate * 100)?.toFixed(1) || 0}%</div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div>
              <p className="text-gray-600 font-medium">Đánh giá trung bình từ học viên</p>
              <p className="text-sm text-gray-500 mt-1">Xếp hạng từ 1 đến 5 sao</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{'⭐'.repeat(Math.round(data?.averageRating || 0))}</span>
              <span className="text-2xl font-bold text-yellow-600">{data?.averageRating?.toFixed(2) || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AllAnalyticsView({ data }) {
  const systemStats = data?.systemStats || {}
  const studentAnalytics = data?.studentAnalytics || {}
  const tutorAnalytics = data?.tutorAnalytics || {}
  const performanceDist = studentAnalytics?.performanceDistribution || {}
  const submissionAnalysis = studentAnalytics?.submissionAnalysis || {}

  return (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🖥️ Thống kê hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            title="Tổng người dùng"
            value={systemStats?.totalUsers || 0}
            icon="👥"
            color="blue"
          />
          <AnalyticsCard
            title="Admin"
            value={systemStats?.totalAdmins || 0}
            icon="👨‍💼"
            color="red"
          />
          <AnalyticsCard
            title="Hướng dẫn viên"
            value={systemStats?.totalTutors || 0}
            icon="🎓"
            color="purple"
          />
          <AnalyticsCard
            title="Học viên"
            value={systemStats?.totalMentees || 0}
            icon="📚"
            color="green"
          />
          <AnalyticsCard
            title="Khóa học"
            value={systemStats?.totalCourses || 0}
            icon="📖"
            color="orange"
          />
          <AnalyticsCard
            title="Đang hoạt động"
            value={systemStats?.activeCourses || 0}
            icon="✅"
            color="emerald"
          />
          <AnalyticsCard
            title="Hoàn thành"
            value={systemStats?.finishedCourses || 0}
            icon="🏆"
            color="yellow"
          />
          <AnalyticsCard
            title="Đăng ký"
            value={systemStats?.totalEnrollments || 0}
            icon="📝"
            color="cyan"
          />
        </div>
      </div>

      {/* Student Analytics */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📚 Phân tích học viên</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <AnalyticsCard
            title="Xuất sắc"
            value={performanceDist?.excellentCount || 0}
            icon="⭐"
            color="yellow"
          />
          <AnalyticsCard
            title="Giỏi"
            value={performanceDist?.goodCount || 0}
            icon="👍"
            color="green"
          />
          <AnalyticsCard
            title="Trung bình"
            value={performanceDist?.averageCount || 0}
            icon="📊"
            color="orange"
          />
          <AnalyticsCard
            title="Yếu"
            value={performanceDist?.weakCount || 0}
            icon="⚠️"
            color="red"
          />
          <AnalyticsCard
            title="Điểm TB"
            value={`${performanceDist?.averageScoreOverall?.toFixed(2) || 0}`}
            icon="📈"
            color="blue"
          />
          <AnalyticsCard
            title="Hoàn thành"
            value={`${(submissionAnalysis?.completionRate * 100)?.toFixed(1) || 0}%`}
            icon="✅"
            color="emerald"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-600">{submissionAnalysis?.onTimeSubmissions || 0}</div>
            <div className="text-gray-600 text-sm mt-2">Nộp đúng hạn</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-600">{submissionAnalysis?.lateSubmissions || 0}</div>
            <div className="text-gray-600 text-sm mt-2">Nộp trễ hạn</div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600">{(submissionAnalysis?.completionRate * 100)?.toFixed(1) || 0}%</div>
            <div className="text-gray-600 text-sm mt-2">Tỉ lệ hoàn thành</div>
          </div>
        </div>
      </div>

      {/* Tutor Analytics */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🎓 Phân tích hướng dẫn viên</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="text-4xl font-bold text-green-600 mb-2">{(tutorAnalytics?.courseCompletionRate * 100)?.toFixed(1) || 0}%</div>
            <div className="text-gray-700 font-medium">Tỉ lệ hoàn thành khóa học</div>
            <p className="text-gray-600 text-sm mt-2">Phần trăm khóa học được hoàn thành thành công</p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{'⭐'.repeat(Math.round(tutorAnalytics?.averageRating || 0))}</span>
              <span className="text-4xl font-bold text-yellow-600">{tutorAnalytics?.averageRating?.toFixed(2) || 0}</span>
            </div>
            <div className="text-gray-700 font-medium">Đánh giá trung bình</div>
            <p className="text-gray-600 text-sm mt-2">Xếp hạng từ học viên (1-5 sao)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    cyan: 'bg-cyan-50 border-cyan-200',
  }

  return (
    <div className={`${colorClasses[color]} border-2 rounded-lg p-6`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-gray-600 text-sm font-medium mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
    </div>
  )
}
