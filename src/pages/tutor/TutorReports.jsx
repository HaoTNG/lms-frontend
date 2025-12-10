// TutorReports.jsx
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export function TeacherReports({ user }) {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [myCourses, setMyCourses] = useState([]);
  const [myExercises, setMyExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      // Load courses
      const coursesRes = await tutorAPI.getMyCourses();
      const coursesData = Array.isArray(coursesRes)
        ? coursesRes
        : coursesRes.data || [];
      setMyCourses(coursesData);

      // Calculate total students from courses
      const totalStudentsCount = coursesData.reduce((sum, course) => {
        return sum + (course.totalEnrollments || 0);
      }, 0);
      setTotalStudents(totalStudentsCount);

      // Load exercises
      try {
        const exercisesRes = await tutorAPI.getMyExercises();
        const exercisesData = Array.isArray(exercisesRes)
          ? exercisesRes
          : exercisesRes.data || [];
        setMyExercises(exercisesData);
      } catch (err) {
        console.error("Failed to load exercises:", err);
        setMyExercises([]);
      }
    } catch (err) {
      console.error("Failed to load reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Thống kê lớp học</h1>
          <p className="text-gray-600">
            Theo dõi hiệu quả giảng dạy và kết quả học tập
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-48 border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">Tất cả lớp học</option>
            {myCourses.map((course) => (
              <option key={course.id || course.courseId} value={course.id || course.courseId}>
                {course.courseName || course.name}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Xuất báo cáo PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Lớp học",
            value: myCourses.length,
            icon: BookOpen,
            desc: "Đang giảng dạy",
          },
          {
            title: "Sinh viên",
            value: totalStudents,
            icon: Users,
            desc: "Tổng số",
          },
          {
            title: "Bài tập",
            value: myExercises.length,
            icon: FileText,
            desc: "Đã giao",
          },
          {
            title: "Tổng hoạt động",
            value: myCourses.length + totalStudents + myExercises.length,
            icon: TrendingUp,
            desc: "Trong hệ thống",
          },
        ].map((stat, index) => (
          <div
            key={index}
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

      {/* Summary Table */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Tổng kết chi tiết</h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium">Lớp học</th>
                  <th className="text-left py-3 font-medium">Mã khóa</th>
                  <th className="text-left py-3 font-medium">Sinh viên</th>
                  <th className="text-left py-3 font-medium">Bài tập</th>
                  <th className="text-left py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {myCourses.map((course) => {
                  const courseExercises = myExercises.filter(
                    (ex) => ex.lessonId === course.id || ex.lessonId === course.courseId
                  ).length;

                  return (
                    <tr
                      key={course.id || course.courseId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium">
                        {course.courseName || course.name}
                      </td>
                      <td className="py-3 text-gray-600">
                        {course.courseId || "N/A"}
                      </td>
                      <td className="py-3">{course.totalEnrollments || 0}</td>
                      <td className="py-3">{courseExercises}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            course.courseStatus === "OPEN"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.courseStatus === "OPEN" ? "Đang mở" : "Đóng"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {myCourses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Chưa có dữ liệu thống kê
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Summary */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Bài tập gần đây</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {myExercises.slice(0, 5).map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{exercise.question}</div>
                  <div className="text-sm text-gray-600">
                    Bài học #{exercise.lessonId} •{" "}
                    {exercise.submissionCount || 0} nộp
                  </div>
                </div>
                <div className="text-sm">
                  {exercise.deadline ? (
                    new Date(exercise.deadline) > new Date() ? (
                      <span className="text-green-600">Còn thời hạn</span>
                    ) : (
                      <span className="text-red-600">Quá hạn</span>
                    )
                  ) : (
                    <span className="text-gray-600">Không có hạn</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {myExercises.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Chưa có bài tập
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
          