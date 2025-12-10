// src/pages/mentee/SessionForumDetailPage.jsx
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function SessionForumDetailPage() {
  const { courseId, sessionId, topicId } = useParams();
  const [comment, setComment] = useState("");

  return (
    <div className="max-w-6xl mx-auto">
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
          [Tên lớp học]
        </Link>{" "}
        /{" "}
        <Link
          to={`/mentee/courses/${courseId}/sessions/${sessionId}`}
          className="hover:underline"
        >
          Buổi {sessionId}
        </Link>{" "}
        /{" "}
        <Link
          to={`/mentee/courses/${courseId}/sessions/${sessionId}/forum`}
          className="hover:underline"
        >
          Forum buổi {sessionId}
        </Link>{" "}
        / <span>Chủ đề {topicId}</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        Forum buổi {sessionId}
      </h1>

      <div className="flex gap-6 text-sm border-b mb-4">
        <button className="pb-2 border-b-2 border-[#0b6fe0] text-[#0b6fe0] font-semibold">
          Khóa học
        </button>
        <button className="pb-2 text-gray-500 hover:text-gray-700">
          Điểm số
        </button>
      </div>

      {/* Bài post chính */}
      <section className="bg-white border rounded-lg mb-4">
        <div className="flex items-start gap-3 px-4 py-3 border-b">
          <div className="w-10 h-10 rounded-full bg-[#0b6fe0] text-white flex items-center justify-center text-sm">
            Họ
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Họ tên</p>
                <p className="text-xs text-gray-500">
                  Thứ Ba, 31 tháng 10 2025
                </p>
              </div>
              <div className="w-32 h-20 bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">Ảnh minh họa</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">
              We supply a series of design principles, practical patterns and
              high quality design resources (Sketch and Axure), to help people
              create their product prototypes beautifully and efficiently.
            </p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>👍 10</span>
              <span>💬 2</span>
            </div>
          </div>
        </div>

        {/* comment 1 */}
        <div className="px-4 py-3 border-b flex gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
            A
          </div>
          <div>
            <p className="font-semibold">Học viên A</p>
            <p className="text-gray-700">
              We supply a series of design principles, practical patterns and
              high quality design resources.
            </p>
          </div>
        </div>

        {/* comment 2 */}
        <div className="px-4 py-3 flex gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
            B
          </div>
          <div>
            <p className="font-semibold">Học viên B</p>
            <p className="text-gray-700">
              We supply a series of design principles, practical patterns and
              high quality design resources (Sketch and Axure).
            </p>
          </div>
        </div>
      </section>

      {/* form comment */}
      <section className="bg-white border rounded-lg p-4 text-sm">
        <p className="font-semibold mb-2">Nhập nội dung</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {comment.length}/1000
          </span>
          <button className="px-4 py-2 rounded-md bg-[#0b6fe0] text-white text-sm">
            Bình luận
          </button>
        </div>
      </section>
    </div>
  );
}
