import { useState, useEffect } from 'react'
import UserManagement from './UserManagement'
import CourseManagement from './CourseManagement'
import ReportTickets from './ReportTickets'
import Announcements from './Announcements'
import Analytics from './Analytics'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: '📊 Tổng quan', icon: 'chart' },
    { id: 'users', label: '👥 Quản lý Người dùng', icon: 'users' },
    { id: 'courses', label: '📚 Quản lý Khóa học', icon: 'courses' },
    { id: 'tickets', label: '🎫 Vé báo cáo', icon: 'tickets' },
    { id: 'announcements', label: '📢 Thông báo', icon: 'announcements' },
    { id: 'analytics', label: '📈 Phân tích', icon: 'analytics' },
  ]

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Bảng điều khiển Admin</h1>
      
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'tickets' && <ReportTickets />}
        {activeTab === 'announcements' && <Announcements />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  )
}

function DashboardOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load some basic stats - có thể mở rộng thêm
        setStats({
          totalUsers: 0,
          totalCourses: 0,
          openTickets: 0,
          recentAnnouncements: 0,
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Tổng người dùng"
        value={stats?.totalUsers || 0}
        icon="👥"
        color="blue"
      />
      <StatCard
        title="Tổng khóa học"
        value={stats?.totalCourses || 0}
        icon="📚"
        color="green"
      />
      <StatCard
        title="Vé báo cáo mở"
        value={stats?.openTickets || 0}
        icon="🎫"
        color="orange"
      />
      <StatCard
        title="Thông báo gần đây"
        value={stats?.recentAnnouncements || 0}
        icon="📢"
        color="purple"
      />
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200',
  }

  return (
    <div className={`${colorClasses[color]} border-2 rounded-lg p-6`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-gray-600 text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold text-gray-800 mt-2">{value}</div>
    </div>
  )
}