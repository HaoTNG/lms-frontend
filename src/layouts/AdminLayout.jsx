// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7ff]">
      {/* Thanh navbar riêng của admin */}
      <AdminNavbar />

      {/* Nội dung trang con (AdminPage, UserManagement, ...) */}
      <main className="flex-1 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
