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

export default function SessionDetailPage() {
  const { courseId, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessionDetail();
  }, [sessionId]);

  const loadSessionDetail = async () => {
    try {
      setLoading(true);
      
      // Load session detail
      const sessionRes = await menteeAPI.getSessionDetail(sessionId);
      const sessionData = Array.isArray(sessionRes) ? sessionRes[0] : sessionRes;
      const mappedSession = {
        id: sessionData.id,
        courseId: sessionData.courseId,
        title: `${sessionData.type} - ${sessionData.room}`,
        description: `Phiên học loại ${sessionData.type}`,
        date: sessionData.date,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        type: sessionData.type,
        room: sessionData.room,
        averageRating: sessionData.averageRating,
        ratingCount: sessionData.ratingCount,
        forumId: sessionData.forumId,
      };
      setSession(mappedSession);
      
      setError(null);
    } catch (err) {
      setError("Lỗi tải chi tiết phiên học: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6 py-5">
          <div className="text-red-600">Không tìm thấy phiên học</div>
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
          /{" "}
          <Link to={`/mentee/courses/${courseId}`} className="hover:underline">
            Chi tiết khóa học
          </Link>{" "}
          / <span>{session.title}</span>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          {session.title}
        </h1>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Session Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            {session.date && (
              <div>
                <p className="text-gray-600">Ngày</p>
                <p className="font-semibold text-gray-800">
                  {new Date(session.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}
            {session.type && (
              <div>
                <p className="text-gray-600">Loại phiên học</p>
                <p className="font-semibold text-gray-800">{session.type}</p>
              </div>
            )}
            {session.startTime && (
              <div>
                <p className="text-gray-600">Thời gian bắt đầu</p>
                <p className="font-semibold text-gray-800">{session.startTime}</p>
              </div>
            )}
            {session.endTime && (
              <div>
                <p className="text-gray-600">Thời gian kết thúc</p>
                <p className="font-semibold text-gray-800">{session.endTime}</p>
              </div>
            )}
            {session.room && (
              <div className="col-span-2">
                <p className="text-gray-600">Phòng học</p>
                <p className="font-semibold text-gray-800">{session.room}</p>
              </div>
            )}
          </div>
          {session.averageRating > 0 && (
            <p className="text-gray-700 mt-3">
              <strong>Đánh giá:</strong> {session.averageRating}/10 ({session.ratingCount} đánh giá)
            </p>
          )}
        </div>

        {/* tabs */}
        <div className="flex gap-6 text-sm border-b mb-4">
          <button className="pb-2 border-b-2 border-[#0b6fe0] text-[#0b6fe0] font-semibold">
            Thông tin
          </button>
          <Link
            to={`/mentee/courses/${courseId}/sessions/${sessionId}/forum`}
            className="pb-2 text-gray-500 hover:text-gray-700"
          >
            Forum
          </Link>
        </div>

        {/* ACCORDION */}
        <div className="border rounded-md bg-gray-50">
          {/* 1. Chung */}
          <AccordionSection title="Thông tin chung" defaultOpen>
            <div className="divide-y text-sm">
              <div className="flex items-center justify-between py-2">
                <span>Loại phiên: {session.type}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Phòng: {session.room}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Ngày: {new Date(session.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Giờ: {session.startTime} - {session.endTime}</span>
              </div>
              {session.averageRating > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span>Đánh giá: {session.averageRating}/10 ({session.ratingCount} lượt)</span>
                </div>
              )}
            </div>
          </AccordionSection>
        </div>

        {/* Back button */}
        <div className="mt-6">
          <Link
            to={`/mentee/courses/${courseId}`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Quay lại chi tiết khóa học
          </Link>
        </div>
      </main>
    </div>
  );
}
