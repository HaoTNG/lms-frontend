// src/components/AdminNavbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HCMUTLogo from "../../image/HCMUT_logo.png"; // nhớ chỉnh path nếu khác
import {
  Bell,
  MessageCircle,
  ChevronDown,
  Globe2,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const [language, setLanguage] = useState("vi");

  const notifications = [
    { id: 1, title: "[Thông báo] Báo cáo mới", time: "1 phút trước" },
    { id: 2, title: "[Thông báo] Khóa học cần duyệt", time: "5 phút trước" },
    { id: 3, title: "[Thông báo] Phản hồi người dùng", time: "1 giờ trước" },
    { id: 4, title: "[Thông báo] Tin nhắn nội bộ", time: "Hôm qua" },
  ];

  const handleSaveLanguage = () => {
    console.log("Saved language:", language);
    setOpenLangMenu(false);
  };

  return (
    // 👉 form & màu giống Navbar mentee (xanh nhạt)
    <header className="bg-[#4EA5FF] text-white shadow-md">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo + tên hệ thống */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/30 overflow-hidden">
            <img
              src={HCMUTLogo}
              alt="HCMUT Logo"
              className="w-full h-full object-contain scale-150"
            />
          </div>
        </div>

        {/* Menu chính – DÀNH RIÊNG CHO ADMIN */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/60"
              }`
            }
          >
            Phân tích
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/60"
              }`
            }
          >
            Quản lý người dùng
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/60"
              }`
            }
          >
            Quản lý khóa học
          </NavLink>

          <NavLink
            to="/admin/feedback"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/60"
              }`
            }
          >
            Quản lý phản hồi
          </NavLink>

          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "font-semibold border-b-2 border-white"
                  : "hover:border-b hover:border-white/60"
              }`
            }
          >
            Gửi thông báo
          </NavLink>
        </nav>

        {/* Khu vực icon bên phải – GIỮ Y NGUYÊN FORM CŨ */}
        <div className="flex items-center gap-3 relative">
          {/* Tin nhắn */}
          <button
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
            onClick={() => navigate("/admin")} // tạm cho về /admin, sau này bạn tạo trang messages riêng thì đổi
            title="Tin nhắn"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Thông báo */}
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 relative"
              onClick={() => setOpenNotif((v) => !v)}
              title="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

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
                      <div className="text-gray-500 text-[11px]">
                        {n.time}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full text-center text-xs text-blue-600 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setOpenNotif(false);
                    // sau này có trang /admin/notifications thì đổi sang đó
                    navigate("/admin");
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
              className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs md:text-sm hover:bg-white/20"
              onClick={() => setOpenUserMenu((v) => !v)}
            >
              <span className="w-6 h-6 rounded-full bg-white/40 flex items-center justify-center text-[11px]">
                A
              </span>
              <span>Admin</span>
              <ChevronDown className="w-3 h-3" />
            </button>

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

                {/* Ngôn ngữ */}
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

                {/* Đánh giá / Phản hồi */}
                <button
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 border-t border-gray-100"
                  onClick={() => {
                    setOpenUserMenu(false);
                    navigate("/admin/feedback"); // 👈 admin feedback
                  }}
                >
                  Quản lý phản hồi
                </button>

                {/* Thoát */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 border-t border-gray-100 text-red-600"
                  onClick={() => {
                    setOpenUserMenu(false);
                    navigate("/login-admin"); // 👈 đăng xuất về màn login admin
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
