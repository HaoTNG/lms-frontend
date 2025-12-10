import React, { useState, useEffect } from "react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Plus, Trash2, FileText, Video, Eye } from "lucide-react";

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
      >
        <span className="font-medium text-gray-800">{title}</span>
        <span className="text-xs text-gray-500">{open ? "▴" : "▾"}</span>
      </button>
      {open && <div className="border-t px-4 py-2 bg-white">{children}</div>}
    </div>
  );
}

export default function TutorLessonDetailPage({ courseId, lessonId, onNavigate }) {
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for creating new resource
  const [showNewResource, setShowNewResource] = useState(false);
  const [newResource, setNewResource] = useState({
    lessonId: lessonId,
    title: "",
    fileUrl: "",
    resourceType: "PDF",
  });
  const [creatingResource, setCreatingResource] = useState(false);

  // States for editing resource
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editResource, setEditResource] = useState({
    title: "",
    fileUrl: "",
    resourceType: "PDF",
  });
  const [editingResource, setEditingResource] = useState(false);

  // States for creating new exercise
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    lessonId: lessonId,
    question: "",
    deadline: "", // Format: "2025-12-09T14:30" for datetime-local input
    attemptLimit: 3,
  });
  const [creatingExercise, setCreatingExercise] = useState(false);

  useEffect(() => {
    loadLessonDetail();
  }, [lessonId]);

  const loadLessonDetail = async () => {
    try {
      setLoading(true);

      // Load lesson detail
      const lessonRes = await tutorAPI.getLessonDetail(courseId, lessonId);
      const lessonData = Array.isArray(lessonRes) ? lessonRes[0] : lessonRes;
      setLesson(lessonData);

      // Load exercises for this lesson
      const exercisesRes = await tutorAPI.getExercises(lessonId);
      const exercisesData = Array.isArray(exercisesRes)
        ? exercisesRes
        : exercisesRes.data || [];
      setExercises(exercisesData);

      // Load resources for this lesson
      const resourcesRes = await tutorAPI.getResources(lessonId);
      const resourcesData = Array.isArray(resourcesRes)
        ? resourcesRes
        : resourcesRes.data || [];
      setResources(resourcesData);

      setError(null);
    } catch (err) {
      setError("Lỗi tải chi tiết bài giảng: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async () => {
    if (!newResource.title.trim() || !newResource.fileUrl.trim()) {
      setError("Vui lòng điền đủ thông tin");
      return;
    }

    setCreatingResource(true);
    try {
      await tutorAPI.createResource(newResource);
      setNewResource({
        lessonId: lessonId,
        title: "",
        fileUrl: "",
        resourceType: "PDF",
      });
      setShowNewResource(false);
      await loadLessonDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi tạo tài nguyên: " + err.message);
      console.error(err);
    } finally {
      setCreatingResource(false);
    }
  };

  const handleEditResource = (resource) => {
    setEditingResourceId(resource.id);
    setEditResource({
      title: resource.title,
      fileUrl: resource.fileUrl,
      resourceType: resource.resourceType,
    });
  };

  const handleUpdateResource = async () => {
    if (!editResource.title.trim() || !editResource.fileUrl.trim()) {
      setError("Vui lòng điền đủ thông tin");
      return;
    }

    setEditingResource(true);
    try {
      await tutorAPI.updateResource(editingResourceId, editResource);
      setEditingResourceId(null);
      setEditResource({ title: "", fileUrl: "", resourceType: "PDF" });
      await loadLessonDetail();
      setError(null);
    } catch (err) {
      //setError("Lỗi cập nhật tài nguyên: " + err.message);
      await loadLessonDetail();
      console.error(err);
    } finally {
      setEditingResource(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingResourceId(null);
    setEditResource({ title: "", fileUrl: "", resourceType: "PDF" });
  };

  const handleCreateExercise = async () => {
    if (!newExercise.question.trim()) {
      setError("Vui lòng nhập câu hỏi bài tập");
      return;
    }

    // Validate deadline
    if (newExercise.deadline) {
      const deadline = new Date(newExercise.deadline);
      const now = new Date();
      
      if (deadline <= now) {
        setError("Hạn chót phải là một ngày và thời gian trong tương lai");
        return;
      }
    }

    setCreatingExercise(true);
    try {
      // Prepare exercise data with proper datetime format and lessonId
      const exerciseData = {
        lessonId: parseInt(lessonId),
        question: newExercise.question.trim(),
        deadline: newExercise.deadline ? new Date(newExercise.deadline).toISOString() : null,
        attemptLimit: newExercise.attemptLimit || 3,
      };
      
      console.log("Creating exercise with data:", exerciseData);
      await tutorAPI.createExercise(exerciseData);
      
      setNewExercise({
        lessonId: lessonId,
        question: "",
        deadline: "",
        attemptLimit: 3,
      });
      setShowNewExercise(false);
      await loadLessonDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi tạo bài tập: " + err.message);
      console.error(err);
    } finally {
      setCreatingExercise(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tài nguyên này?")) return;

    try {
      await tutorAPI.deleteResource(resourceId);
      await loadLessonDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi xóa tài nguyên: " + err.message);
      console.error(err);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài tập này?")) return;

    try {
      await tutorAPI.deleteExercise(exerciseId);
      await loadLessonDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi xóa bài tập: " + err.message);
      console.error(err);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "PDF":
        return <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-xs">PDF</div>;
      case "VIDEO":
        return <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">▶</div>;
      case "DOC":
        return <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center text-yellow-600">📄</div>;
      case "LINK":
        return <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600">🔗</div>;
      case "SOURCE_CODE":
        return <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600">{"</>"}</div>;
      default:
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6 py-5">
          <div className="text-red-600">Không tìm thấy bài giảng</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-5">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Lesson Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
          <p className="text-gray-600">{lesson.description}</p>
        </div>

        {/* Sections */}
        <div className="border rounded-lg overflow-hidden divide-y">
          {/* 1. Bài tập */}
          <AccordionSection 
            title={`📝 Bài tập (${exercises.length})`}
            defaultOpen={true}
          >
            {exercises.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">
                Chưa có bài tập nào
              </div>
            ) : (
              <div className="divide-y text-sm">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {exercise.question}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hạn chót:{" "}
                        {exercise.deadline
                          ? new Date(exercise.deadline).toLocaleDateString(
                              "vi-VN"
                            ) + " " + new Date(exercise.deadline).toLocaleTimeString(
                              "vi-VN"
                            )
                          : "Không có"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Lần làm: {exercise.attemptLimit || "Không giới hạn"}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        📊 Bài nộp: {exercise.submissionCount || 0}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() =>
                          onNavigate("exercise-detail", {
                            exerciseId: exercise.id,
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create new exercise form */}
            {!showNewExercise && (
              <div className="mt-3 pt-3 border-t">
                <button
                  onClick={() => setShowNewExercise(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Tạo bài tập mới
                </button>
              </div>
            )}

            {showNewExercise && (
              <div className="mt-3 pt-3 border-t space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Câu hỏi bài tập <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Nhập câu hỏi bài tập..."
                    value={newExercise.question}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, question: e.target.value })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn chót (Tùy chọn)
                  </label>
                  <input
                    type="datetime-local"
                    value={newExercise.deadline}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, deadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống nếu không có hạn chót</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lần làm tối đa
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newExercise.attemptLimit}
                    onChange={(e) =>
                      setNewExercise({
                        ...newExercise,
                        attemptLimit: parseInt(e.target.value) || 3,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCreateExercise}
                    disabled={creatingExercise || !newExercise.question.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {creatingExercise ? "Đang tạo..." : "Tạo bài tập"}
                  </button>
                  <button
                    onClick={() => setShowNewExercise(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </AccordionSection>

          {/* 2. Tài nguyên */}
          <AccordionSection title={`📚 Tài nguyên (${resources.length})`}>
            {resources.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">
                Chưa có tài nguyên nào
              </div>
            ) : (
              <div className="divide-y text-sm">
                {resources.map((resource) => (
                  <div key={resource.id}>
                    {editingResourceId === resource.id ? (
                      <div className="py-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên tài nguyên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editResource.title}
                            onChange={(e) =>
                              setEditResource({ ...editResource, title: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link tệp (URL) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={editResource.fileUrl}
                            onChange={(e) =>
                              setEditResource({ ...editResource, fileUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại tài nguyên
                          </label>
                          <select
                            value={editResource.resourceType}
                            onChange={(e) =>
                              setEditResource({ ...editResource, resourceType: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="VIDEO">Video</option>
                            <option value="PDF">PDF</option>
                            <option value="DOC">Tài liệu (DOC)</option>
                            <option value="LINK">Link</option>
                            <option value="SOURCE_CODE">Source Code</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleUpdateResource}
                            disabled={editingResource || !editResource.title.trim() || !editResource.fileUrl.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 font-medium"
                          >
                            {editingResource ? "Đang cập nhật..." : "Cập nhật"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="pt-1">
                            {getResourceIcon(resource.resourceType)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {resource.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {resource.fileUrl}
                            </p>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded inline-block mt-1">
                              {resource.resourceType}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => handleEditResource(resource)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Create new resource form */}
            {!showNewResource && (
              <div className="mt-3 pt-3 border-t">
                <button
                  onClick={() => setShowNewResource(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm tài nguyên mới
                </button>
              </div>
            )}

            {showNewResource && (
              <div className="mt-3 pt-3 border-t space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên tài nguyên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bài giảng Toán học..."
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link tệp (URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/file.pdf"
                    value={newResource.fileUrl}
                    onChange={(e) =>
                      setNewResource({ ...newResource, fileUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại tài nguyên
                  </label>
                  <select
                    value={newResource.resourceType}
                    onChange={(e) =>
                      setNewResource({
                        ...newResource,
                        resourceType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="DOC">Tài liệu (DOC)</option>
                    <option value="LINK">Link</option>
                    <option value="SOURCE_CODE">Source Code</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCreateResource}
                    disabled={creatingResource || !newResource.title.trim() || !newResource.fileUrl.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {creatingResource ? "Đang thêm..." : "Thêm tài nguyên"}
                  </button>
                  <button
                    onClick={() => setShowNewResource(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </AccordionSection>
        </div>
      </main>
    </div>
  );
}
