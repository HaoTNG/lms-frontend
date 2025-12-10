// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Phần giới thiệu LMS */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Welcome to LMS
          </h1>
          <p className="text-gray-600 mb-8">
            A simple Learning Management System platform for Admins, Tutors, and
            Mentees.
          </p>
        </div>

        {/* Phần đăng nhập */}
        <div>
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Đăng nhập bằng tài khoản của bạn
          </h2>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate("/login-lms")}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            <span className="flex flex-col items-center">
              <span className="font-bold">TÀI KHOẢN LMS</span>
              <span className="text-xs opacity-90">(LMS ACCOUNT)</span>
            </span>
          </button>

          <button
            onClick={() => navigate("/login-admin")}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
          >
            <span className="font-bold">QUẢN TRỊ VIÊN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
