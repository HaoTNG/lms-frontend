// src/pages/mentee/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    currentlyEnrolled: 0,
    completed: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle browser back button to prevent going back to login
  useEffect(() => {
    const handlePopState = () => {
      // Stay on mentee dashboard, prevent going back
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await menteeAPI.getMyCourses();
      const courses = Array.isArray(response) ? response : (response.data || []);

      // Calculate stats
      const totalEnrolled = courses.length;
      const currentlyEnrolled = courses.filter(
        (c) => c.courseStatus === "OPEN"
      ).length;
      const completed = courses.filter(
        (c) => c.courseStatus !== "OPEN"
      ).length;

      setStats({
        totalEnrolled,
        currentlyEnrolled,
        completed,
      });

      // Get recent 3 courses
      const recent = courses.slice(0, 3).map((course) => ({
        id: course.courseId,
        title: course.courseName,
        code: course.subjectRegistrationId || "N/A",
        teacher: course.tutorName,
        term: "N/A",
        classCode: course.courseId,
        img: "https://images.pexels.com/photos/4144099/pexels-photo-4144099.jpeg",
      }));

      setRecentCourses(recent);
      setError(null);
    } catch (err) {
      setError("Lỗi tải dữ liệu dashboard: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const statsData = [
    {
      label: "Khóa học đã đăng ký",
      value: stats.totalEnrolled,
      bg: "bg-[#ffe7df]",
      icon: "📚",
    },
    {
      label: "Khóa học đang học",
      value: stats.currentlyEnrolled,
      bg: "bg-[#e8edff]",
      icon: "📖",
    },
    {
      label: "Khóa học đã hoàn thành",
      value: stats.completed,
      bg: "bg-[#e5f9e7]",
      icon: "🏆",
    },
  ];

  return (
    // phần này được render bên trong <main> của MainLayout nên
    // KHÔNG cần header màu xanh nữa
    <div className="max-w-6xl mx-auto">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tổng quan */}
      <section className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-[#004196] mb-4">
          Tổng quan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsData.map((item, idx) => (
            <div
              key={idx}
              className={`${item.bg} rounded-xl px-4 py-4 flex items-center gap-3 shadow-sm`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800">
                  {item.value}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Các khóa học gần đây */}
      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-[#004196] mb-4">
          Các khóa học gần đây
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentCourses.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Bạn chưa đăng ký khóa học nào
            </div>
          ) : (
            recentCourses.map((course, idx) => (
              <Link
                key={idx}
                to={`/mentee/courses/${course.id}`}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-gray-800">
                      {course.title} ({course.code})
                    </p>
                    <p className="text-gray-600">
                      [{course.teacher}] ({course.term})
                    </p>
                    <p className="text-gray-600">[{course.classCode}]</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
