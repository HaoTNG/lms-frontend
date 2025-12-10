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

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseDetail();
  }, [courseId]);

  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      
      // Load course detail
      const courseRes = await menteeAPI.getCourseDetail(courseId);
      const courseData = Array.isArray(courseRes) ? courseRes[0] : courseRes;
      setCourse(courseData);
      
      // Load lessons
      const lessonsRes = await menteeAPI.getLessons(courseId);
      const lessonsData = Array.isArray(lessonsRes) ? lessonsRes : (lessonsRes.data || []);
      setLessons(lessonsData);
      
      // Load sessions
      const sessionsRes = await menteeAPI.getSessions(courseId);
      const sessionsData = Array.isArray(sessionsRes) ? sessionsRes : (sessionsRes.data || []);
      const mappedSessions = sessionsData.map((s) => ({
        id: s.id,
        title: `${s.type} - ${s.room}`,
        description: `${s.date} ${s.startTime} - ${s.endTime}`,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        type: s.type,
        room: s.room,
        averageRating: s.averageRating,
        ratingCount: s.ratingCount,
        forumId: s.forumId,
      }));
      setSessions(mappedSessions);
      
      setError(null);
    } catch (err) {
      setError("Lỗi tải chi tiết khóa học: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6 py-5">
          <div className="text-red-600">Không tìm thấy khóa học</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-5">
        {/* breadcrumb */}
        <div className="text-xs text-gray-500 mb-2">
          <Link to="/mentee" className="hover:underline">
            Trang chủ
          </Link>{" "}
          /{" "}
          <Link to="/mentee/courses" className="hover:underline">
            Các khóa học của tôi
          </Link>{" "}
          / <span>{course.courseName}</span>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          {course.courseName}
        </h1>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Course Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Giảng viên</p>
              <p className="font-semibold text-gray-800">{course.tutorName}</p>
            </div>
            <div>
              <p className="text-gray-600">Trạng thái</p>
              <p className={`font-semibold ${course.courseStatus === "OPEN" ? "text-green-600" : "text-gray-600"}`}>
                {course.courseStatus === "OPEN" ? "Đang học" : "Đã hoàn thành"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Ngày bắt đầu</p>
              <p className="font-semibold text-gray-800">{new Date(course.startDate).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <p className="text-gray-600">Ngày kết thúc</p>
              <p className="font-semibold text-gray-800">{new Date(course.endDate).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
          <p className="text-gray-700 mt-3">
            <strong>Mô tả:</strong> {course.description}
          </p>
        </div>

        {/* tabs */}
        <div className="flex gap-6 text-sm border-b mb-4">
          <button className="pb-2 border-b-2 border-[#0b6fe0] text-[#0b6fe0] font-semibold">
            Khóa học
          </button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">
            Điểm số
          </button>
        </div>

        {/* ACCORDION */}
        <div className="border rounded-md bg-gray-50">
          {/* 1. Chung */}
          <AccordionSection title="Chung" defaultOpen>
            <div className="divide-y text-sm">
              <div className="flex items-center justify-between py-2">
                <span>Tổng bài giảng: {lessons.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Trạng thái: {course.courseStatus}</span>
              </div>
            </div>
          </AccordionSection>

          {/* 2. Bài giảng */}
          <AccordionSection title={`Bài giảng (${lessons.length})`}>
            {lessons.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">Chưa có bài giảng nào</div>
            ) : (
              <div className="divide-y text-sm">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{lesson.title}</p>
                      <p className="text-xs text-gray-500 truncate">{lesson.description}</p>
                    </div>
                    <div className="ml-2 text-right">
                      <p className="text-xs text-gray-500">
                        {lesson.resourceCount} tài nguyên, {lesson.exerciseCount} bài tập
                      </p>
                      <Link
                        to={`/mentee/courses/${courseId}/lessons/${lesson.id}`}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccordionSection>

          {/* 3. Phiên học */}
          <AccordionSection title={`Phiên học (${sessions.length})`}>
            {sessions.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">Chưa có phiên học nào</div>
            ) : (
              <div className="divide-y text-sm">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{session.title}</p>
                      <p className="text-xs text-gray-500 truncate">{session.description}</p>
                      {session.startDate && (
                        <p className="text-xs text-gray-500">
                          {new Date(session.startDate).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>
                    <div className="ml-2 text-right">
                      <Link
                        to={`/mentee/courses/${courseId}/sessions/${session.id}`}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Xem chi tiết
                      </Link>
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

