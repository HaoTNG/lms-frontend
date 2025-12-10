// src/pages/admin/AdminPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import ReportTickets from "./ReportTickets";
import Announcements from "./Announcements";
import Analytics from "./Analytics";
import { adminAPI } from "../../services/api";

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle browser back button to prevent going back to login
  useEffect(() => {
    const handlePopState = () => {
      // Stay on admin page, prevent going back
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const tabs = [
    { id: "dashboard", label: "📊 Tổng quan", icon: "chart" },
    { id: "users", label: "🎓 Quản lý Người dùng", icon: "users" },
    { id: "courses", label: "📚 Quản lý Khóa học", icon: "courses" },
    { id: "tickets", label: "📋 Vé báo cáo", icon: "tickets" },
    { id: "announcements", label: "🔈 Thông báo", icon: "announcements" },
    { id: "analytics", label: "📈 Phân tích", icon: "analytics" },
  ];

  return (
    <div className="w-full">
      {/* TIÊU ĐỀ TRANG */}
      <h1 className="text-3xl font-bold mb-6 text-[#1F4E79]">
        Phân tích dữ liệu
      </h1>

      {/* Nếu sau này muốn dùng tabs thì bật block dưới lên (đổi false -> true) */}
      {false && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Nội dung theo tab */}
      {activeTab === "dashboard" && <DashboardOverview />}
      {activeTab === "users" && <UserManagement />}
      {activeTab === "courses" && <CourseManagement />}
      {activeTab === "tickets" && <ReportTickets />}
      {activeTab === "announcements" && <Announcements />}
      {activeTab === "analytics" && <Analytics />}
    </div>
  );
}

function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminAPI.getSystemAnalytics();

        setStats({
          totalUsers: response.data.totalUsers,
          totalCourses: response.data.totalCourses,
          totalMentees: response.data.totalMentees,
          totalTutors: response.data.totalTutors,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <>
      {/* THỐNG KÊ – DỮ LIỆU TỪ BE, GIỮ NGUYÊN */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[#1F4E79] uppercase tracking-wide mb-4">
          Thống kê
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng số người dùng"
            value={stats ? stats.totalUsers : 0}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Tổng số khóa học"
            value={stats ? stats.totalCourses : 0}
            icon="📚"
            color="orange"
          />
          <StatCard
            title="Tổng số mentee"
            value={stats ? stats.totalMentees : 0}
            icon="🎓"
            color="purple"
          />
          <StatCard
            title="Tổng số tutor"
            value={stats ? stats.totalTutors : 0}
            icon="✏️"
            color="green"
          />
        </div>
      </section>

      {/* KHU VỰC BIỂU ĐỒ – CHỈ LÀ KHUNG, KHÔNG HARD-CODE DATA */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Performance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Student Performance
            </h3>
            <span className="text-gray-400 text-xl">⋮</span>
          </div>

          {/* Placeholder cho chart – sau này bạn tự vẽ bằng data thật */}
          <div className="h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-400">
            Biểu đồ hiệu suất học tập sẽ hiển thị ở đây
          </div>
        </div>

        {/* Teaching Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Teaching Activity
            </h3>
            <select className="text-xs border rounded-md px-2 py-1 text-gray-600">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>

          {/* Placeholder cho chart – sau này dùng dữ liệu thật */}
          <div className="h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-400">
            Biểu đồ hoạt động giảng dạy sẽ hiển thị ở đây
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard(props) {
  const title = props.title;
  const value = props.value;
  const icon = props.icon;
  const color = props.color;

  let cardClass = "";
  let iconBgClass = "";

  if (color === "blue") {
    cardClass = "border-blue-50";
    iconBgClass = "bg-blue-100 text-blue-600";
  } else if (color === "green") {
    cardClass = "border-green-50";
    iconBgClass = "bg-green-100 text-green-600";
  } else if (color === "orange") {
    cardClass = "border-orange-50";
    iconBgClass = "bg-orange-100 text-orange-600";
  } else if (color === "purple") {
    cardClass = "border-purple-50";
    iconBgClass = "bg-purple-100 text-purple-600";
  }

  return (
    <div
      className={
        "bg-white border rounded-xl p-5 shadow-sm flex items-start justify-between " +
        cardClass
      }
    >
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase">
          {title}
        </div>
        <div className="text-3xl font-bold text-gray-900 mt-3">{value}</div>
      </div>
      <div
        className={
          "w-10 h-10 rounded-full flex items-center justify-center " +
          iconBgClass
        }
      >
        <span className="text-xl">{icon}</span>
      </div>
    </div>
  );
}

function LegendDot(props) {
  const label = props.label;
  const dotClass = props.dotClass;

  return (
    <div className="flex items-center gap-1">
      <span className={"w-3 h-3 rounded-full " + dotClass} />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}
