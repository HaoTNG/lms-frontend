// src/pages/mentee/QuizDoPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function QuizDoPage() {
  const { courseId, lessonId, exerciseId } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadExerciseDetail();
  }, [exerciseId]);

  const loadExerciseDetail = async () => {
    try {
      setLoading(true);
      const res = await menteeAPI.getExerciseDetail(exerciseId);
      const data = Array.isArray(res) ? res[0] : res;
      setExercise(data);
      
      // Load submissions
      const submissionsRes = await menteeAPI.getSubmissions(exerciseId);
      const submissionsData = Array.isArray(submissionsRes) ? submissionsRes : (submissionsRes.data || []);
      setSubmissions(submissionsData);
      
      setError(null);
    } catch (err) {
      setError("Lỗi tải bài tập: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Vui lòng nhập hoặc chọn câu trả lời");
      return;
    }

    try {
      setSubmitting(true);
      await menteeAPI.submitExercise(exerciseId, {
        textAnswer: answer,
      });
      navigate(`/mentee/courses/${courseId}/lessons/${lessonId}`);
    } catch (err) {
      alert("Lỗi nộp bài: " + err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
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

  const questions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-2">
        <Link to="/mentee" className="hover:underline">
          Trang chủ
        </Link>{" "}
        /
        <Link to="/mentee/courses" className="hover:underline">
          {" "}
          Các khóa học
        </Link>{" "}
        /
        <Link
          to={`/mentee/courses/${courseId}`}
          className="hover:underline"
        >
          {" "}
          Chi tiết khóa học
        </Link>{" "}
        /
        <Link
          to={`/mentee/courses/${courseId}/lessons/${lessonId}`}
          className="hover:underline"
        >
          {" "}
          Chi tiết bài giảng
        </Link>{" "}
        / <span>Làm bài</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        Bài tập
      </h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Phần nội dung bài tập */}
      <div className="border rounded-lg bg-white p-6 mb-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {exercise.question}
          </h2>
          <p className="text-sm text-gray-600">
            Hạn chót:{" "}
            {exercise.deadline
              ? new Date(exercise.deadline).toLocaleDateString("vi-VN")
              : "Không có"}
          </p>
          <p className="text-sm text-gray-600">
            Lần làm: {exercise.attemptLimit || "Không giới hạn"}
          </p>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-800 mb-3">
            Câu trả lời của bạn:
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn tại đây..."
            className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
          />
        </div>
      </div>

      {/* Lịch sử submissions */}
      <div className="border rounded-lg bg-white p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Lịch sử nộp bài ({submissions.length})
        </h3>
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-500">Bạn chưa nộp bài nào</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission, index) => (
              <div
                key={submission.id}
                className="border rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Lần nộp #{index + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submission ID: {submission.id}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Đã nộp
                  </span>
                </div>

                {submission.textAnswer && (
                  <div className="bg-white p-2 rounded border border-gray-200 mt-2">
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Câu trả lời:
                    </p>
                    <p className="text-sm text-gray-800 line-clamp-3">
                      {submission.textAnswer}
                    </p>
                  </div>
                )}

                {submission.fileUrl && (
                  <div className="mt-2">
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      📎 Tải file đính kèm
                    </a>
                  </div>
                )}

                {submission.grade !== undefined && submission.grade !== null && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <span className="text-xs text-gray-600">Điểm:</span>
                    <span className="text-sm font-semibold text-yellow-700">
                      {submission.grade}
                    </span>
                  </div>
                )}
                {(submission.grade === undefined || submission.grade === null) && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded">
                    <span className="text-xs text-gray-600">Trạng thái:</span>
                    <span className="text-xs font-medium text-gray-700">
                      Chưa chấm điểm
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex gap-3 justify-between">
        <Link
          to={`/mentee/courses/${courseId}/lessons/${lessonId}`}
          className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
        >
          Quay lại
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 rounded-md bg-[#7c3aed] text-white hover:bg-[#6d28d9] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Đang nộp..." : "Nộp bài"}
        </button>
      </div>
    </div>
  );
}
