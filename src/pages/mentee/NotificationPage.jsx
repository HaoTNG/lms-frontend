import React from "react";

const notifications = [
  {
    type: "deadline",
    title: "Sắp đến hạn nộp bài tập lớn môn Cơ học bay 2",
    time: "Trong 3 ngày nữa",
    detail: "Hạn chót: 15/12/2025 - 23:59",
  },
  {
    type: "schedule",
    title: "Thay đổi lịch học tuần này",
    time: "1 giờ trước",
    detail: "Buổi thứ 4 chuyển sang học online (Zoom).",
  },
  {
    type: "system",
    title: "Bảo trì hệ thống LMS",
    time: "Hôm qua",
    detail: "Hệ thống bảo trì lúc 23h00 - 23h30, có thể gián đoạn.",
  },
];

export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#0053a6] mb-6">
        Thông báo & nhắc lịch
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông báo gần đây
          </h2>
          <button className="text-sm text-[#0053a6] hover:underline">
            Đánh dấu tất cả là đã đọc
          </button>
        </div>

        <ul className="space-y-4">
          {notifications.map((n, idx) => (
            <li
              key={idx}
              className="flex gap-3 px-3 py-3 rounded-xl bg-[#f5f7fb]"
            >
              <div className="mt-1">
                {n.type === "deadline" && <span>⏰</span>}
                {n.type === "schedule" && <span>📅</span>}
                {n.type === "system" && <span>⚙️</span>}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {n.title}
                </p>
                <p className="text-xs text-gray-500 mb-1">{n.time}</p>
                <p className="text-xs text-gray-600">{n.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-xs text-gray-500">
          Hệ thống có thể gửi thông báo qua email, app mobile hoặc web push
          tùy cấu hình tích hợp.
        </div>
      </div>
    </div>
  );
}
