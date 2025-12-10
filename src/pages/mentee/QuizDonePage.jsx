// src/pages/mentee/QuizDonePage.jsx
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function QuizDonePage() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/mentee/courses/${courseId}`);
  };

  return (
    <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#0b6fe0]/10 flex items-center justify-center">
          <span className="text-3xl text-[#0b6fe0]">★</span>
        </div>
        <h1 className="text-lg md:text-xl font-semibold mb-2">
          Nộp bài thành công
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Bài làm của bạn cho {`Quiz ${quizId}`} đã được ghi nhận.
        </p>
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-md bg-[#0b6fe0] text-white text-sm hover:bg-[#0552b5]"
        >
          Trở về trang chủ khóa học
        </button>
        <div className="mt-3 text-xs text-gray-500">
          hoặc{" "}
          <Link
            to={`/mentee/courses/${courseId}/quizzes/${quizId}`}
            className="text-[#0b6fe0] underline"
          >
            xem lại thông tin quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
