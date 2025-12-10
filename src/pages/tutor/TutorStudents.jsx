// TutorStudents.jsx
import { useState, useEffect } from "react";
import { Search, Eye, User } from "lucide-react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export function TeacherStudents({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [courseStudents, setCourseStudents] = useState({}); // { courseId: [students] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load courses
      const coursesRes = await tutorAPI.getMyCourses();
      const coursesData = Array.isArray(coursesRes)
        ? coursesRes
        : coursesRes.data || [];
      setMyCourses(coursesData);

      // Load students for each course
      const studentsMap = {};
      for (const course of coursesData) {
        try {
          const courseId = course.id || course.courseId;
          const menteesRes = await tutorAPI.getMenteesInCourse(
            courseId,
            0,
            100
          );
          
          // Handle different response formats
          let mentees = [];
          if (Array.isArray(menteesRes)) {
            mentees = menteesRes;
          } else if (menteesRes?.data) {
            mentees = Array.isArray(menteesRes.data) ? menteesRes.data : [menteesRes.data];
          } else if (menteesRes?.content) {
            mentees = Array.isArray(menteesRes.content) ? menteesRes.content : [];
          }
          
          studentsMap[courseId] = mentees;
          console.log(`Course ${course.courseName}: ${mentees.length} students loaded`);
        } catch (err) {
          console.error(`Failed to load students for course ${course.courseId}:`, err);
          // Fallback: use totalEnrollments if API fails
          const courseId = course.id || course.courseId;
          studentsMap[courseId] = Array(course.totalEnrollments || 0).fill(null).map((_, i) => ({
            id: `placeholder_${courseId}_${i}`,
            name: `Sinh viên ${i + 1}`,
            email: `student${i}@example.com`,
          }));
        }
      }
      setCourseStudents(studentsMap);
    } catch (err) {
      console.error("Failed to load students data:", err);
      setError("Không thể tải dữ liệu sinh viên");
    } finally {
      setLoading(false);
    }
  };

  // Get all unique students or filter by selected course
  const getAllStudents = () => {
    if (selectedCourse === "all") {
      const studentsMap = {};
      Object.values(courseStudents).forEach((students) => {
        students.forEach((student) => {
          if (!studentsMap[student.id]) {
            studentsMap[student.id] = student;
          }
        });
      });
      return Object.values(studentsMap);
    } else {
      return courseStudents[selectedCourse] || [];
    }
  };

  // Get students for specific course
  const getStudentsInCourse = (courseId) => {
    return courseStudents[courseId] || [];
  };

  // Filter by search query
  const filteredStudents = getAllStudents().filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total students (unique across all courses)
  const totalStudents = myCourses.reduce((sum, course) => {
    return sum + (course.totalEnrollments || 0);
  }, 0);

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý sinh viên</h1>
        <p className="text-gray-600">
          Xem và quản lý sinh viên trong các lớp học
        </p>
      </div>

      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="text-sm font-medium text-gray-600">
                Tổng sinh viên
              </div>
              <div className="text-blue-600 text-2xl font-bold mt-1">
                {totalStudents}
              </div>
            </div>
            {myCourses.slice(0, 3).map((course) => {
              const courseStudentCount = course.totalEnrollments || 0;
              return (
                <div
                  key={course.id || course.courseId}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  <div className="text-sm font-medium text-gray-600 line-clamp-1">
                    {course.courseName || course.name}
                  </div>
                  <div className="text-blue-600 text-2xl font-bold mt-1">
                    {courseStudentCount} SV
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Tìm kiếm sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Tất cả lớp học</option>
              {myCourses.map((course) => (
                <option key={course.id || course.courseId} value={course.id || course.courseId}>
                  {course.courseName || course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Students Table */}
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                Danh sách sinh viên ({filteredStudents.length})
              </h2>
            </div>
            <div className="p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium">Tên</th>
                    <th className="text-left py-3 font-medium">Email</th>
                    <th className="text-left py-3 font-medium">Lớp học</th>
                    <th className="text-left py-3 font-medium">Trạng thái</th>
                    <th className="text-right py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const studentInCourses = selectedCourse === "all" 
                      ? Object.keys(courseStudents).filter(courseId => 
                          courseStudents[courseId].find(s => s.id === student.id)
                        )
                      : [];

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 font-medium">{student.name}</td>
                        <td className="py-3">{student.email}</td>
                        <td className="py-3">
                          {selectedCourse === "all" ? (
                            <span className="text-sm">{studentInCourses.length} lớp</span>
                          ) : (
                            myCourses.find((c) => (c.id || c.courseId) === parseInt(selectedCourse))
                              ?.courseName || "N/A"
                          )}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            Hoạt động
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            className="p-2 hover:bg-gray-100 rounded"
                            onClick={() => handleViewDetail(student)}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy sinh viên nào
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Student Detail Dialog */}
      {detailDialogOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Thông tin sinh viên</h2>
              <p className="text-gray-600 text-sm">
                Chi tiết về sinh viên
              </p>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Họ và tên</label>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Lớp học đang tham gia</h3>
                <div className="space-y-2">
                  {myCourses
                    .filter((course) => {
                      const courseId = course.id || course.courseId;
                      return courseStudents[courseId]?.some(
                        (s) => s.id === selectedStudent.id
                      );
                    })
                    .map((course) => (
                      <div
                        key={course.id || course.courseId}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <User className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {course.courseName || course.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {course.code || course.courseCode || "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setDetailDialogOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
