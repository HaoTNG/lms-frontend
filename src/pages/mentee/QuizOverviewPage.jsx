// src/pages/mentee/QuizOverviewPage.jsx
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function QuizOverviewPage() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const quizName = `Quiz ${quizId || 1}`;

  const handleStart = () => {
    navigate(`/mentee/courses/${courseId}/quizzes/${quizId}/do`);
  };

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
        <span>{quizName}</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        {quizName}
      </h1>

      <div className="flex gap-6 text-sm border-b mb-4">
        <button className="pb-2 border-b-2 border-[#0b6fe0] text-[#0b6fe0] font-semibold">
          Khóa học
        </button>
        <button className="pb-2 text-gray-500 hover:text-gray-700">
          Điểm số
        </button>
      </div>

      {/* info block */}
      <section className="bg-[#f5f7fb] border rounded-xl p-5 mb-6 text-sm">
        <p className="mb-1">
          <span className="font-semibold">Bắt đầu:</span> ....
        </p>
        <p className="mb-1">
          <span className="font-semibold">Kết thúc:</span> ....
        </p>
        <p className="mb-1">
          <span className="font-semibold">Số lần thực hiện:</span> ....
        </p>
        <p className="mb-1">
          <span className="font-semibold">Thời gian làm bài:</span> ....
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cách tính điểm:</span> ....
        </p>

        <button
          onClick={handleStart}
          className="px-6 py-2 rounded-md bg-[#0b6fe0] text-white text-sm hover:bg-[#0552b5]"
        >
          Tham gia
        </button>

        {/* Bảng trạng thái */}
        <div className="mt-6 border rounded-md bg-white overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="px-4 py-3 bg-gray-50 w-1/3">
                  Trạng thái bài kiểm tra
                </td>
                <td className="px-4 py-3 text-green-600">
                  Kết thúc sau 2 ngày
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 bg-gray-50">Trạng thái làm bài</td>
                <td className="px-4 py-3 text-green-600">Đã làm bài</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* tổng quan lần làm trước */}
        <h3 className="mt-6 mb-2 font-semibold text-sm">
          Điểm tổng kết bài làm: .../10
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Tổng quan các lần làm bài trước
        </p>

        <div className="border rounded-md bg-white overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 bg-gray-50 w-1/4">Lần 1</td>
                <td className="px-4 py-3">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <span>
                      <span className="font-semibold">Bắt đầu:</span> Thứ Sáu,
                      24 tháng 10 2025, 17:00
                    </span>
                    <span>
                      <span className="font-semibold">Kết thúc:</span> Thứ Sáu,
                      24 tháng 10 2025, 18:00
                    </span>
                    <span>
                      <span className="font-semibold">Thời gian làm bài:</span>{" "}
                      1 tiếng
                    </span>
                    <span>
                      <span className="font-semibold">Điểm:</span> .../10
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[#0b6fe0] text-sm underline">
                    Xem lại
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
