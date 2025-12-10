// TutorCourseDetail.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, Eye, Users, BookOpen, Plus, Calendar, FileText } from "lucide-react";
import { tutorAPI } from "../../services/api";

export function TeacherCourseDetail({ courseId, onNavigate }) {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [createLessonDialogOpen, setCreateLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  
  // Form states
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    courseId: courseId,
  });

  useEffect(() => {
    loadAllData();
  }, [courseId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load course
      const courseResponse = await tutorAPI.getCourseById(courseId);
      const courseData = courseResponse.data || courseResponse;
      setCourse(courseData);
      
      // Load lessons
      const lessonsResponse = await tutorAPI.getLessonsByCourseId(courseId);
      const lessonsData = lessonsResponse.data || lessonsResponse;
      setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      
      // Load sessions
      const sessionsResponse = await tutorAPI.getSessionsByCourseId(courseId);
      const sessionsData = sessionsResponse.data || sessionsResponse;
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      
      // Load exercises
      const exercisesResponse = await tutorAPI.getMyExercises();
      const exercisesData = Array.isArray(exercisesResponse) ? exercisesResponse : (exercisesResponse.data || []);
      setExercises(exercisesData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Không thể tải thông tin khóa học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.title) {
      setError("Vui lòng nhập tiêu đề bài giảng");
      return;
    }

    try {
      await tutorAPI.createLesson({
        ...lessonForm,
        courseId: courseId,
      });
      
      setCreateLessonDialogOpen(false);
      setLessonForm({ title: "", description: "", content: "", courseId });
      await loadAllData();
    } catch (err) {
      setError("Lỗi tạo bài giảng: " + err.message);
    }
  };

  const handleUpdateLesson = async () => {
    if (!lessonForm.title) {
      setError("Vui lòng nhập tiêu đề bài giảng");
      return;
    }

    try {
      await tutorAPI.updateLesson(editingLesson.id, lessonForm);
      
      setCreateLessonDialogOpen(false);
      setEditingLesson(null);
      setLessonForm({ title: "", description: "", content: "", courseId });
      await loadAllData();
    } catch (err) {
      setError("Lỗi cập nhật bài giảng: " + err.message);
    }
  };

  const handleCreateSession = async () => {


    try {
      await tutorAPI.createSession(courseId, sessionForm);
      
      setCreateSessionDialogOpen(false);
      await loadAllData();
    } catch (err) {
      setError("Lỗi tạo phiên học: " + err.message);
    }
  };

  const openLessonDialog = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        description: lesson.description || "",
        content: lesson.content || "",
        courseId: courseId,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({ title: "", description: "", content: "", courseId });
    }
    setCreateLessonDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  if (error && !course) {
    return (
      <div>
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          onClick={() => onNavigate("courses")}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          onClick={() => onNavigate("courses")}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy khóa học
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            onClick={() => onNavigate("courses")}
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div>
            <h1 className="text-2xl font-bold">{course?.courseName || "Khóa học"}</h1>
            <p className="text-gray-600">
              Mã khóa học: { course?.courseId || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Sinh viên</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {course?.totalEnrollments ?? 0}
              </div>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Trạng thái</div>
              <div className="text-lg font-bold mt-1">
                <span className={`px-2 py-1 rounded text-sm ${
                  course?.courseStatus === "OPEN" 
                    ? "bg-green-100 text-green-800" 
                    : course?.courseStatus === "END"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {course?.courseStatus === "OPEN" ? "Đang diễn ra" : 
                   course?.courseStatus === "END" ? "Đã kết thúc" : 
                   course?.courseStatus || "Chưa bắt đầu"}
                </span>
              </div>
            </div>
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Năm học</div>
              <div className="text-lg font-bold mt-1">
                {course?.startDate ? new Date(course.startDate).getFullYear() : "N/A"}
              </div>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-4 font-medium ${
                activeTab === "info"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Thông tin
            </button>
            <button
              onClick={() => setActiveTab("lessons")}
              className={`pb-4 font-medium ${
                activeTab === "lessons"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Bài giảng ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`pb-4 font-medium ${
                activeTab === "exercises"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Bài tập ({exercises.length})
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`pb-4 font-medium ${
                activeTab === "sessions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Phiên học ({sessions.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Mô tả khóa học</h3>
                <p className="text-gray-600">
                  {course?.description || "Chưa có mô tả"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Ngày bắt đầu</h3>
                  <p className="text-lg font-semibold">
                    {course?.startDate ? new Date(course.startDate).toLocaleDateString("vi-VN") : "N/A"}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Ngày kết thúc</h3>
                  <p className="text-lg font-semibold">
                    {course?.endDate ? new Date(course.endDate).toLocaleDateString("vi-VN") : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Giáo viên</div>
                  <div className="text-lg font-semibold">{course?.tutorName}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Được tạo</div>
                  <div className="text-lg font-semibold">
                    {course?.createdDate ? new Date(course.createdDate).toLocaleDateString("vi-VN") : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === "lessons" && (
            <div className="space-y-4">
              <button
                onClick={() => openLessonDialog()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm bài giảng
              </button>

              {lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{lesson.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onNavigate("lesson", { courseId, lessonId: lesson.id })}
                            className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openLessonDialog(lesson)}
                            className="p-2 hover:bg-gray-100 rounded text-blue-600"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có bài giảng nào. Thêm bài giảng để bắt đầu!
                </div>
              )}
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === "exercises" && (
            <div className="space-y-4">
              {exercises.length > 0 ? (
                <div className="space-y-3">
                  {exercises.map((exercise) => {
                    const deadline = new Date(exercise.deadline);
                    const now = new Date();
                    const isOverdue = deadline < now;

                    return (
                      <div
                        key={exercise.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <h4 className="text-lg font-semibold">{exercise.question}</h4>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                              <span>Bài giảng ID: <span className="font-medium">{exercise.lessonId}</span></span>
                              <span>Hạn chót: <span className={isOverdue ? "text-red-600 font-medium" : "font-medium"}>
                                {deadline.toLocaleDateString("vi-VN")}
                              </span></span>
                              <span>Lần làm: <span className="font-medium">{exercise.attemptLimit || "Không giới hạn"}</span></span>
                              <span>Bài nộp: <span className="font-semibold text-blue-600">{exercise.submissionCount}</span></span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onNavigate("exercise-detail", { exerciseId: exercise.id })}
                              className="p-2 hover:bg-blue-100 rounded text-blue-600 transition"
                              title="Xem chi tiết bài tập và bài nộp"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có bài tập nào
                </div>
              )}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-4">
              <button
                onClick={() => openSessionDialog()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm phiên học
              </button>

              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                              {session.type}
                            </span>
                          </div>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            {session.date && (
                              <span>📅 {session.date}</span>
                            )}
                            {session.startTime && session.endTime && (
                              <span>⏰ {session.startTime}⏰ {session.endTime}</span>
                            )}
                            {session.room && (
                              <span>📍 {session.room}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onNavigate("session", { courseId, sessionId: session.id })}
                            className="p-2 hover:bg-gray-100 rounded text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có phiên học nào. Thêm phiên học để bắt đầu!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Lesson Dialog */}
      {createLessonDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {editingLesson ? "Chỉnh sửa bài giảng" : "Thêm bài giảng mới"}
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Nhập tiêu đề bài giảng"
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mô tả
                </label>
                <textarea
                  placeholder="Mô tả bài giảng"
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nội dung
                </label>
                <textarea
                  placeholder="Nhập nội dung bài giảng"
                  value={lessonForm.content}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, content: e.target.value })
                  }
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setCreateLessonDialogOpen(false);
                  setEditingLesson(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
              >
                {editingLesson ? "Cập nhật" : "Tạo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
