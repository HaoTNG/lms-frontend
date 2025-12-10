// TutorAssignments.jsx
import React, { useState, useEffect } from "react";
import { Search, Trash2, Eye, FileText } from "lucide-react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export function TeacherAssignments({ user, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyExercises();
  }, []);

  const loadMyExercises = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getMyExercises();
      
      // Handle both direct array and wrapped response
      const exercisesData = Array.isArray(response)
        ? response
        : response.data || [];
      
      setExercises(exercisesData);
      setError(null);
    } catch (err) {
      setError("Lỗi tải danh sách bài tập: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài tập này?")) return;

    try {
      await tutorAPI.deleteExercise(exerciseId);
      await loadMyExercises();
      setError(null);
    } catch (err) {
      setError("Lỗi xóa bài tập: " + err.message);
      console.error(err);
    }
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.lessonId.toString().includes(searchQuery)
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bài tập</h1>
          <p className="text-gray-600">Xem và quản lý các bài tập của bạn</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Tìm kiếm bài tập (câu hỏi hoặc ID bài giảng)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Assignments List */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Danh sách bài tập ({filteredExercises.length})
          </h2>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {exercises.length === 0
              ? "Chưa có bài tập nào"
              : "Không tìm thấy bài tập phù hợp"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Câu hỏi
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Bài giảng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Hạn chót
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Lần làm
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-700">
                    Bài nộp
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExercises.map((exercise) => {
                  const deadline = new Date(exercise.deadline);
                  const now = new Date();
                  const isOverdue = deadline < now;

                  return (
                    <tr
                      key={exercise.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm line-clamp-2">
                              {exercise.question}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          ID: {exercise.lessonId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-800"}>
                            {deadline.toLocaleDateString("vi-VN")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {deadline.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isOverdue && (
                            <span className="text-xs text-red-600 font-medium mt-1">
                              Đã hết hạn
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {exercise.attemptLimit || "Không giới hạn"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-semibold text-blue-600">
                            {exercise.submissionCount}
                          </span>
                          <span className="text-gray-500">bài nộp</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              onNavigate("exercise-detail", { exerciseId: exercise.id });
                            }}
                            className="p-2 hover:bg-blue-100 rounded text-blue-600 transition"
                            title="Xem chi tiết bài tập"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="p-2 hover:bg-red-100 rounded text-red-600 transition"
                            title="Xóa bài tập"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {exercises.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tổng bài tập</p>
              <p className="text-2xl font-bold text-gray-800">{exercises.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tổng bài nộp</p>
              <p className="text-2xl font-bold text-blue-600">
                {exercises.reduce((sum, ex) => sum + ex.submissionCount, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Đã hết hạn</p>
              <p className="text-2xl font-bold text-red-600">
                {exercises.filter((ex) => new Date(ex.deadline) < new Date()).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
