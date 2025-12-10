// TutorCourses.jsx
import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Users, Edit, Trash2, Calendar, AlertCircle } from "lucide-react";
import { tutorAPI } from "../../services/api";

export function TeacherCourses({ user, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getMyCourses();
      const data = Array.isArray(response) ? response : (response.data || []);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError("Lỗi tải danh sách khóa học: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await tutorAPI.getAvailableSubjects();
      const data = Array.isArray(response) ? response : (response.data || []);
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setSubjects([]);
    }
  };

  const handleRegisterSubject = async () => {
    if (!selectedSubjectId) {
      setError("Vui lòng chọn môn học");
      return;
    }

    try {
      setRegistering(true);
      await tutorAPI.createSubjectRegistration({ subjectId: selectedSubjectId });
      
      setRegisterDialogOpen(false);
      setSelectedSubjectId(null);
      setError(null);
      
      // Reload courses
      await loadCourses();
    } catch (err) {
      console.error("Register subject error:", err);
      setError("Lỗi đăng ký môn học: " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      (course.courseName || course.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.courseCode || course.code).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
          <p className="text-gray-600">
            Quản lý các lớp học bạn đang giảng dạy
          </p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            loadSubjects();
            setRegisterDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Đăng ký lớp học mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : (
        <>
          

          {/* Course Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          console.log("Clicking course:", course);
                          onNavigate("course-detail", { courseId: course.courseId });
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {course.courseName || course.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {course.courseCode || course.code}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>2024-2025</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{course.totalEnrollments || 0} sinh viên</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-600 mb-2">
                  {searchQuery
                    ? "Không tìm thấy lớp học"
                    : "Chưa có lớp học nào"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {searchQuery
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Tạo lớp học mới để bắt đầu"}
                </p>
                {!searchQuery && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mx-auto"
                    onClick={() => {
                      loadSubjects();
                      setRegisterDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Đăng ký lớp học mới
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Register Subject Dialog */}
      {registerDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Đăng ký lớp học mới</h2>
              <p className="text-gray-600 text-sm mt-1">
                Chọn môn học để đăng ký giảng dạy
              </p>
            </div>
            <div className="p-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Chọn môn học</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedSubjectId === subject.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedSubjectId(subject.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-4 h-4 rounded border mt-1 flex items-center justify-center flex-shrink-0 ${
                              selectedSubjectId === subject.id
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedSubjectId === subject.id && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">
                              {subject.subjectName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {subject.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Không có môn học nào
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setRegisterDialogOpen(false);
                  setSelectedSubjectId(null);
                  setError(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleRegisterSubject}
                disabled={registering || !selectedSubjectId}
              >
                {registering ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
