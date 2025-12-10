// src/pages/tutor/TutorExerciseDetailPage.jsx
import React, { useState, useEffect } from "react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FileText, AlertCircle, CheckCircle, Clock, Star } from "lucide-react";

export default function TutorExerciseDetailPage({ exerciseId }) {
  const [exercise, setExercise] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (exerciseId) {
      loadExerciseDetail();
    }
  }, [exerciseId]);

  const loadExerciseDetail = async () => {
    try {
      setLoading(true);
      
      // Lấy chi tiết bài tập
      const exerciseRes = await tutorAPI.getExerciseDetail(exerciseId);
      const exerciseData = Array.isArray(exerciseRes) ? exerciseRes[0] : (exerciseRes.data || exerciseRes);
      setExercise(exerciseData);

      // Lấy danh sách submissions từ học viên
      const submissionsRes = await tutorAPI.getSubmissions(exerciseId, 0, 100);
      
      // Handle pagination format: { pagination: { content: [...] } } hoặc { data: [...] }
      let submissionsData = [];
      if (submissionsRes.pagination && submissionsRes.pagination.content) {
        submissionsData = submissionsRes.pagination.content;
      } else if (Array.isArray(submissionsRes)) {
        submissionsData = submissionsRes;
      } else if (submissionsRes.data) {
        submissionsData = Array.isArray(submissionsRes.data) ? submissionsRes.data : [];
      }
      
      setSubmissions(submissionsData);

      setError(null);
    } catch (err) {
      setError("Lỗi tải chi tiết bài tập: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission || gradeValue === "") {
      setError("Vui lòng nhập điểm");
      return;
    }

    const gradeNum = parseFloat(gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0) {
      setError("Điểm phải là số không âm");
      return;
    }

    setGrading(true);
    try {
      await tutorAPI.gradeSubmission(selectedSubmission.id, gradeNum);
      
      // Update local state to reflect the grade
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? { ...sub, grade: gradeNum }
            : sub
        )
      );

      setError(null);
      setSelectedSubmission(null);
      setGradeValue("");
    } catch (err) {
      setError("Lỗi chấm điểm: " + err.message);
      console.error(err);
    } finally {
      setGrading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!exercise) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="text-red-600">Không tìm thấy bài tập</div>
      </div>
    );
  }

  // Kiểm tra hạn chót
  const isOverdue = exercise.deadline && new Date(exercise.deadline) < new Date();
  const submissionCount = submissions.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4">
        <span>Bài tập</span>{" "}
        / <span>Chi tiết bài tập</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Chi tiết bài tập
      </h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Phần thông tin bài tập */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {exercise.question}
          </h2>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">Bài tập ID</p>
              <p className="text-sm font-medium text-gray-800">
                {exercise.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Bài giảng ID</p>
              <p className="text-sm font-medium text-gray-800">
                {exercise.lessonId}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Lần làm tối đa</p>
              <p className="text-sm font-medium text-gray-800">
                {exercise.attemptLimit || "Không giới hạn"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Đã nộp</p>
              <p className="text-sm font-semibold text-blue-600">
                {submissionCount}
              </p>
            </div>
          </div>

          {/* Hạn chót */}
          <div className="flex items-center gap-2 p-3 rounded bg-blue-50 border border-blue-200">
            {isOverdue ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">
                  Hạn chót:{" "}
                  {exercise.deadline
                    ? new Date(exercise.deadline).toLocaleDateString("vi-VN")
                    : "Không có"}
                  {" "}(Quá hạn)
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">
                  Hạn chót:{" "}
                  {exercise.deadline
                    ? new Date(exercise.deadline).toLocaleDateString("vi-VN")
                    : "Không có"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách submissions từ học viên */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            Bài nộp từ học viên ({submissions.length})
          </h3>
        </div>
        <div className="p-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Chưa có bài nộp nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-800">
                          Bài nộp #{index + 1}
                        </p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          ID: {submission.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Người nộp:{" "}
                        <span className="font-medium">
                          {submission.mentee?.name || submission.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Email:{" "}
                        <span className="font-medium">
                          {submission.mentee?.email || submission.email || "N/A"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Không rõ"}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Đã nộp
                      </span>
                    </div>
                  </div>

                  {/* Nội dung trả lời */}
                  {submission.textAnswer && (
                    <div className="bg-white border border-gray-200 p-3 rounded mt-3">
                      <p className="text-xs text-gray-600 font-medium mb-2">
                        Câu trả lời:
                      </p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {submission.textAnswer}
                      </p>
                    </div>
                  )}

                  {/* File đính kèm */}
                  {submission.fileUrl && (
                    <div className="mt-3">
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Tải file đính kèm
                      </a>
                    </div>
                  )}

                  {/* Điểm (nếu có) */}
                  {submission.grade !== undefined && submission.grade !== null && (
                    <div className="mt-3 flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <span className="text-xs text-gray-600">Điểm:</span>
                      <span className="text-sm font-semibold text-yellow-700">
                        {submission.grade}
                      </span>
                    </div>
                  )}

                  {/* Nút chấm điểm */}
                  <div className="mt-4 flex gap-2">
                    {submission.grade !== undefined && submission.grade !== null ? (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradeValue(submission.grade.toString());
                        }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition flex items-center gap-2"
                      >
                        <Star size={14} />
                        Chỉnh sửa điểm
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradeValue("");
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition flex items-center gap-2"
                      >
                        <Star size={14} />
                        Chấm điểm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nút quay lại */}
      <div className="flex justify-start mt-6">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm font-medium"
        >
          Quay lại
        </button>
      </div>

      {/* MODAL CHẤM ĐIỂM */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Chấm điểm bài nộp
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Học viên:{" "}
                <span className="font-medium">
                  {selectedSubmission.mentee?.name || selectedSubmission.name || "N/A"}
                </span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập điểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  placeholder="Ví dụ: 8.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  disabled={grading}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setGradeValue("");
                  setError(null);
                }}
                disabled={grading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleGradeSubmit}
                disabled={grading || gradeValue === ""}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
              >
                <Star size={16} />
                {grading ? "Đang lưu..." : "Lưu điểm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
