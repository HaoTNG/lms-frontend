// src/pages/mentee/CourseSessionPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { menteeAPI } from "../../services/api";

export default function CourseSessionPage() {
  const { courseId, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const courseName = "Khóa học";

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

  // Hàm tính trạng thái lớp học
  const getSessionStatus = () => {
    if (!session) return { text: "Đang tải...", color: "text-gray-500" };
    
    const sessionDateTime = new Date(`${session.date}T${session.endTime}`);
    const now = new Date();
    const diffTime = now - sessionDateTime;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime > 0) {
      return {
        text: `Đã kết thúc ${diffDays} ngày trước`,
        color: "text-red-500",
      };
    } else {
      return {
        text: "Sắp diễn ra",
        color: "text-blue-500",
      };
    }
  };

  // Hàm format ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // Lấy HH:mm từ HH:mm:ss
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="text-center py-10">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="text-center py-10 text-red-500">{error}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="text-center py-10">Không tìm thấy phiên học</div>
      </div>
    );
  }

  const sessionName = `Buổi học ${session.type} - ${session.room}`;
  const sessionStatus = getSessionStatus();

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Breadcrumb */}
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
          {courseName}
        </Link>{" "}
        / <span>{sessionName}</span>
      </div>

      {/* Tiêu đề */}
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        {sessionName}
      </h1>

      {/* Thông tin chi tiết phiên học */}
      <section className="bg-white border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">Thông tin buổi học</h2>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-medium w-32">Ngày:</span>
            <span>{formatDate(session.date)}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Thời gian:</span>
            <span>
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Phòng:</span>
            <span>{session.room}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-32">Loại:</span>
            <span>{session.type}</span>
          </div>
          {session.ratingCount > 0 && (
            <div className="flex">
              <span className="font-medium w-32">Đánh giá:</span>
              <span>
                ⭐ {session.averageRating.toFixed(1)} ({session.ratingCount}{" "}
                đánh giá)
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Khối buổi học – chỉ giữ nút + bảng trạng thái */}
      <section className="bg-[#f5f7fb] border rounded-xl p-5 mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="px-6 py-2 rounded-md bg-gray-300 text-gray-600 text-sm cursor-not-allowed">
            Tham gia
          </button>
          <button className="px-6 py-2 rounded-md bg-[#0b6fe0] text-white text-sm hover:bg-[#0552b5]">
            Xem lại
          </button>
          <Link
            to={`/mentee/courses/${courseId}/sessions/${sessionId}/forum`}
            className="px-6 py-2 rounded-md bg-[#0b6fe0] text-white text-sm hover:bg-[#0552b5]"
          >
            Forum
          </Link>
        </div>

        <table className="w-full text-sm border rounded-md overflow-hidden bg-white">
          <tbody>
            <tr>
              <td className="px-4 py-3 bg-gray-50 w-1/3">
                Trạng thái lớp học
              </td>
              <td className={`px-4 py-3 ${sessionStatus.color}`}>
                {sessionStatus.text}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 bg-gray-50">Trạng thái tham gia</td>
              <td className="px-4 py-3 text-green-600">Đã tham gia</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}