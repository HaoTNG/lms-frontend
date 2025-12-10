import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

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

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [resources, setResources] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLessonDetail();
  }, [lessonId]);

  const loadLessonDetail = async () => {
    try {
      setLoading(true);

      // Load lesson detail
      const lessonRes = await menteeAPI.getLesson(lessonId);
      const lessonData = Array.isArray(lessonRes) ? lessonRes[0] : lessonRes;
      setLesson(lessonData);

      // Load exercises for this lesson
      const exercisesRes = await menteeAPI.getExercises(lessonId);
      const exercisesData = Array.isArray(exercisesRes)
        ? exercisesRes
        : exercisesRes.data || [];
      setExercises(exercisesData);

      // Load submissions for each exercise
      const submissionsMap = {};
      for (const exercise of exercisesData) {
        try {
          const submissionsRes = await menteeAPI.getSubmissions(exercise.id);
          const submissionsData = Array.isArray(submissionsRes) ? submissionsRes : (submissionsRes.data || []);
          // Get the latest submission (usually the first one in array)
          if (submissionsData.length > 0) {
            submissionsMap[exercise.id] = submissionsData[0];
          }
        } catch (err) {
          console.error(`Lỗi tải submissions cho exercise ${exercise.id}:`, err);
        }
      }
      setSubmissions(submissionsMap);

      // Load resources for this lesson
      const resourcesRes = await menteeAPI.getResources(lessonId);
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
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-2">
          <Link to="/mentee" className="hover:underline">
            Trang chủ
          </Link>{" "}
          /
          <Link to="/mentee/courses" className="hover:underline">
            {" "}
            Các khóa học của tôi
          </Link>{" "}
          /
          <Link
            to={`/mentee/courses/${courseId}`}
            className="hover:underline"
          >
            {" "}
            Chi tiết khóa học
          </Link>{" "}
          / <span>{lesson.title}</span>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          {lesson.title}
        </h1>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Lesson Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
          <p className="text-gray-700">
            <strong>Mô tả:</strong> {lesson.description || "Không có mô tả"}
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Bài tập:</strong> {exercises.length} bài
          </p>
          <p className="text-gray-700 mt-1">
            <strong>Tài nguyên:</strong> {resources.length} tài nguyên
          </p>
        </div>

        {/* Accordion */}
        <div className="border rounded-md bg-gray-50">
          {/* 1. Bài tập & Quiz */}
          <AccordionSection
            title={`Bài tập & Quiz (${exercises.length})`}
            defaultOpen
          >
            {exercises.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">
                Chưa có bài tập nào
              </div>
            ) : (
              <div className="divide-y text-sm">
                {exercises.map((exercise) => {
                  const submission = submissions[exercise.id];
                  return (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {exercise.question}
                        </p>
                        <p className="text-xs text-gray-500">
                          Hạn chót:{" "}
                          {exercise.deadline
                            ? new Date(exercise.deadline).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Không có"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Lần làm: {exercise.attemptLimit || "Không giới hạn"}
                        </p>
                        {submission && (submission.grade !== undefined && submission.grade !== null) && (
                          <p className="text-xs text-yellow-700 font-medium bg-yellow-50 inline-block px-2 py-1 rounded mt-1">
                            Điểm: {submission.grade}
                          </p>
                        )}
                        {submission && (submission.grade === undefined || submission.grade === null) && (
                          <p className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mt-1">
                            Chưa chấm
                          </p>
                        )}
                      </div>
                      <div className="ml-2 text-right">
                        <Link
                          to={`/mentee/courses/${courseId}/lessons/${lessonId}/exercises/${exercise.id}`}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          Làm bài
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AccordionSection>

          {/* 2. Tài nguyên */}
          <AccordionSection title={`Tài nguyên (${resources.length})`}>
            {resources.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">
                Chưa có tài nguyên nào
              </div>
            ) : (
              <div className="divide-y text-sm">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Icon theo loại resource */}
                      <div className="pt-1">
                        {resource.resourceType === 'PDF' && (
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-xs">
                            PDF
                          </div>
                        )}
                        {resource.resourceType === 'VIDEO' && (
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                            ▶
                          </div>
                        )}
                        {resource.resourceType === 'DOCUMENT' && (
                          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center text-yellow-600">
                            📄
                          </div>
                        )}
                        {resource.resourceType === 'IMAGE' && (
                          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600">
                            🖼
                          </div>
                        )}
                        {resource.resourceType === 'LINK' && (
                          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600">
                            🔗
                          </div>
                        )}
                        {!['PDF', 'VIDEO', 'DOCUMENT', 'IMAGE', 'LINK'].includes(resource.resourceType) && (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                            📎
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {resource.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {resource.description || 'Không có mô tả'}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {resource.resourceType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-2 text-right">
                      {resource.fileUrl && (
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs hover:underline font-medium"
                        >
                          {resource.resourceType === 'VIDEO' ? 'Xem video' : 'Tải xuống'}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccordionSection>
          </div>
      </main>
    </div>
  );
}