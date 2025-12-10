// src/components/Navbar.jsx
import HCMUTLogo from "../../image/HCMUT_logo.png";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  ChevronDown,
  Globe2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const [openNotif, setOpenNotif] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const [language, setLanguage] = useState("vi"); // "vi" | "en"

  const notifications = [
    { id: 1, title: "[Thông báo] Nhắc nộp bài", time: "1 phút trước" },
    { id: 2, title: "[Thông báo] Lịch học cập nhật", time: "5 phút trước" },
    { id: 3, title: "[Thông báo] Điểm quiz 1", time: "1 giờ trước" },
    { id: 4, title: "[Thông báo] Tin nhắn mới", time: "Hôm qua" },
    { id: 5, title: "[Thông báo] Thông báo hệ thống", time: "2 ngày trước" },
  ];

  const handleSaveLanguage = () => {
    console.log("Saved language:", language);
    setOpenLangMenu(false);
  };

  return (
    // 🔹 Đổi màu nền nav: xanh nhạt hơn
    <header className="bg-[#4EA5FF] text-white shadow-md">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo + tên hệ thống */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center border border-white/40 overflow-hidden">
            <img
              src={HCMUTLogo}
              alt="HCMUT Logo"
              className="w-full h-full object-contain scale-150"
            />
          </div>
        </div>

        {/* Menu chính */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/mentee"
            end
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/70"
              }`
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/mentee/courses"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/70"
              }`
            }
          >
            Khóa học của tôi
          </NavLink>

          <NavLink
            to="/mentee/register"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/70"
              }`
            }
          >
            Đăng ký môn học
          </NavLink>

          <NavLink
            to="/mentee/schedule"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/70"
              }`
            }
          >
            Lịch học
          </NavLink>

          <NavLink
            to="/mentee/report-tickets"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/70"
              }`
            }
          >
            Khiếu nại
          </NavLink>
        </nav>

        {/* Khu vực icon bên phải */}
        <div className="flex items-center gap-3 relative">
          {/* Tin nhắn */}
          <button
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25"
            onClick={() => navigate("/mentee/messages")}
            title="Tin nhắn"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Thông báo */}
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 relative"
              onClick={() => setOpenNotif((v) => !v)}
              title="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
                11
              </span>
            </button>

            {/* Dropdown thông báo */}
            {openNotif && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-40">
                <div className="px-3 py-2 border-b text-sm font-semibold">
                  Thông báo
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-3 py-2 text-xs border-b hover:bg-gray-50"
                    >
                      <div className="font-medium">{n.title}</div>
                      <div className="text-gray-500 text-[11px]">{n.time}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full text-center text-xs text-blue-600 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setOpenNotif(false);
                    navigate("/mentee/notifications");
                  }}
                >
                  Xem tất cả
                </button>
              </div>
            )}
          </div>

          {/* Username + menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs md:text-sm hover:bg-white/25"
              onClick={() => setOpenUserMenu((v) => !v)}
            >
              <span className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-[11px]">
                U
              </span>
              <span>Username</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Dropdown user */}
            {openUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-lg z-40 text-sm">
                {/* Hồ sơ */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setOpenUserMenu(false);
                    navigate("/user");
                  }}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Hồ sơ</span>
                </button>

                {/* Ngôn ngữ – submenu trong dropdown */}
                <div className="border-t border-gray-100">
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                    onClick={() => setOpenLangMenu((v) => !v)}
                  >
                    <span className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4" />
                      <span>Ngôn ngữ</span>
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {openLangMenu && (
                    <div className="text-xs border-t border-gray-100">
                      <div className="px-3 pt-2 pb-1 text-[11px] text-gray-500">
                        Chọn ngôn ngữ
                      </div>
                      <button
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                          language === "vi"
                            ? "text-blue-600 font-medium"
                            : ""
                        }`}
                        onClick={() => setLanguage("vi")}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                          language === "en"
                            ? "text-blue-600 font-medium"
                            : ""
                        }`}
                        onClick={() => setLanguage("en")}
                      >
                        English
                      </button>
                      <div className="px-3 py-2">
                        <button
                          className="w-full bg-blue-600 text-white rounded-md py-1 text-[11px] hover:bg-blue-700"
                          onClick={handleSaveLanguage}
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Đánh giá */}
                <button
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 border-t border-gray-100"
                  onClick={() => {
                    setOpenUserMenu(false);
                    navigate("/mentee/feedback");
                  }}
                >
                  Đánh giá
                </button>

                {/* Thoát */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 border-t border-gray-100 text-red-600"
                  onClick={async () => {
                    try {
                      await authAPI.logout();
                      logout();
                      navigate("/login-lms");
                    } catch (err) {
                      console.error("Logout error:", err);
                      logout();
                      navigate("/login-lms");
                    }
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Thoát</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
