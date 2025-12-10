// TutorDashboard.jsx
import { useState, useEffect } from "react";
import { BookOpen, FileText, Users } from "lucide-react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export function TeacherDashboard({ user, onNavigate }) {
  const [myCourses, setMyCourses] = useState([]);
  const [myExercises, setMyExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load courses
      const coursesRes = await tutorAPI.getMyCourses();
      const coursesData = Array.isArray(coursesRes) ? coursesRes : (coursesRes.data || []);
      setMyCourses(coursesData);

      // Calculate total students
      const total = coursesData.reduce((sum, course) => {
        return sum + (course.totalEnrollments || 0);
      }, 0);
      setTotalStudents(total);

      // Load exercises
      try {
        const exercisesRes = await tutorAPI.getMyExercises();
        const exercisesData = Array.isArray(exercisesRes) ? exercisesRes : (exercisesRes.data || []);
        setMyExercises(exercisesData);
      } catch (err) {
        console.error("Failed to load exercises:", err);
        setMyExercises([]);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan giảng dạy</h1>
        <p className="text-gray-600 mt-1">Xin chào, {user.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "courses",
            title: "Lớp học",
            value: myCourses.length,
            icon: BookOpen,
            desc: "Đang giảng dạy",
          },
          {
            id: "students",
            title: "Sinh viên",
            value: totalStudents,
            icon: Users,
            desc: "Tổng số sinh viên",
          },
          {
            id: "assignments",
            title: "Bài tập",
            value: myExercises.length,
            icon: FileText,
            desc: "Đã tạo",
          },
        ].map((stat) => (
          <div
            key={stat.id}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{stat.title}</div>
              <stat.icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-blue-600 text-2xl font-bold mt-2">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Lớp học của tôi */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Lớp học của tôi</h3>
        </div>
        <div className="p-4">
          {myCourses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Chưa có lớp học nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((course) => (
                <div
                  key={course.id || course.courseId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    onNavigate("course-detail", { courseId: course.id || course.courseId })
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {course.courseName || course.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.description || "Không có mô tả"}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Năm học:</span>
                        <p className="font-medium text-gray-800">
                          {course.startDate && course.endDate
                            ? `${new Date(course.startDate).getFullYear()}-${new Date(course.endDate).getFullYear()}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sinh viên:</span>
                        <p className="font-medium text-gray-800">
                          {course.totalEnrollments || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        course.courseStatus === "OPEN"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.courseStatus === "OPEN" ? "Đang mở" : "Đóng"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
           

