// src/pages/LoginAdmin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HCMUTLogo from "../../../image/HCMUT_logo.png";
import { useAuthContext } from '../../context/AuthContext'
import { authAPI } from '../../services/api'

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý đăng nhập
    try {
      const response = await authAPI.login(username, password);
      login(response.user);
      
      // Check user role and redirect accordingly
      const userInfo = await authAPI.me();
      const role = userInfo.user?.role;
      
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "MENTEE") {
        navigate("/mentee", { replace: true });
      } else if (role === "TUTOR") {
        navigate("/tutor", { replace: true });
      } else {
        navigate("/login-lms", { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(true);     // Bật popup lỗi
      setPassword("");    // Xóa password
    }
  };

  const closeError = () => {
    setError(false);
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* THANH XANH + LOGO */}
      <header className="h-12 bg-[#4EA5FF] flex items-center px-0">
        <img
          src={HCMUTLogo}
          alt="HCMUT Logo"
          className="h-10 md:h-12 w-auto object-contain"
        />
      </header>

      {/* NỀN XÁM NHẸ + FORM Ở GIỮA */}
      <main className="flex-1 flex items-center justify-center bg-[#f5f7ff] px-4">
        <div className="w-full max-w-xl bg-white border rounded-md shadow-sm px-6 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Đăng nhập bằng tài khoản quản trị viên
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#4EA5FF] focus:border-[#4EA5FF]"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 text-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#4EA5FF] focus:border-[#4EA5FF]"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 text-sm font-semibold rounded-sm text-white bg-[#4EA5FF] hover:bg-[#2F80ED] transition"
            >
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-2.5 text-sm font-medium rounded-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Quay lại
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </main>

      {/* POPUP LỖI */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
          <div className="bg-white rounded-md shadow-lg w-full max-w-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-gray-800">Lỗi</span>
              <button
                onClick={closeError}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-4 py-4 text-sm text-gray-700">
              Thông tin đăng nhập sai, vui lòng thử lại.
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button
                onClick={closeError}
                className="px-4 py-1.5 text-sm font-medium rounded-sm bg-[#4EA5FF] text-white hover:bg-[#2F80ED] transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
