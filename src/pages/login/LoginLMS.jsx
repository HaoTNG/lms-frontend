// src/pages/login/LoginLMS.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import HCMUTLogo from "../../../image/HCMUT_logo.png";

export default function LoginLMS() {
  const navigate = useNavigate();


  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* THANH XANH TRÊN CÙNG – logo dính mép trái */}
      <header className="h-12 bg-[#4EA5FF] flex items-center px-0">
        <img
          src={HCMUTLogo}
          alt="HCMUT Logo"
          className="h-10 md:h-12 w-auto object-contain"
        />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 bg-[#f5f7ff]">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-8 leading-tight">
            Đăng nhập bằng tài khoản của bạn trên
          </h1>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/login-mentee")}
              className="w-full py-3 bg-[#4EA5FF] text-white text-xs md:text-sm font-semibold rounded-sm tracking-wide hover:bg-[#2F80ED] transition"
            >
              SINH VIÊN
            </button>
            <button
              type="button"
              onClick={() => navigate("/login-tutor")}
              className="w-full py-3 bg-[#4EA5FF] text-white text-xs md:text-sm font-semibold rounded-sm tracking-wide hover:bg-[#2F80ED] transition"
            >
              GIẢNG VIÊN
            </button>

            <button
              type="button"
              onClick={() => navigate("/login-admin")}
              className="w-full py-3 bg-[#4EA5FF] text-white text-xs md:text-sm font-semibold rounded-sm tracking-wide hover:bg-[#2F80ED] transition"
            >
              QUẢN TRỊ VIÊN
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
