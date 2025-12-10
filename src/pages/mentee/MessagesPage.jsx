import React, { useState } from "react";

const mockConversations = [
  { id: 1, name: "Tutor - Cơ học bay 2", lastMessage: "Em nhớ xem lại record buổi 3 nhé." },
  { id: 2, name: "Admin hệ thống", lastMessage: "Hệ thống sẽ bảo trì tối nay 23h." },
];

const mockMessages = [
  { from: "tutor", text: "Chào em, em đã làm xong phần 1 bài tập lớn chưa?", time: "10:20" },
  { from: "me", text: "Dạ em đang làm, còn phần xác định đạo hàm khí động.", time: "10:22" },
  { from: "tutor", text: "Nếu cần thì gửi file cho thầy xem nhé.", time: "10:25" },
];

export default function MessagesPage() {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: call API gửi tin nhắn
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#0053a6] mb-6">
        Nhắn tin
      </h1>

      <div className="bg-white rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 overflow-hidden min-h-[480px]">
        {/* Danh sách hội thoại */}
        <div className="border-r border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện"
              className="w-full px-3 py-2 text-sm border rounded-full"
            />
          </div>
          <div className="max-h-[440px] overflow-y-auto">
            {mockConversations.map((c) => (
              <button
                key={c.id}
                className="w-full text-left px-4 py-3 hover:bg-[#f5f7fb] border-b border-gray-50"
              >
                <p className="text-sm font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Khung chat */}
        <div className="md:col-span-2 flex flex-col">
          {/* Header chat */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Tutor - Cơ học bay 2
              </p>
              <p className="text-xs text-gray-500">Trực tuyến</p>
            </div>
            <span className="text-xl">💬</span>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#f9fafc]">
            {mockMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "me"
                      ? "bg-[#0053a6] text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      m.from === "me" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập tin nhắn */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 px-4 py-3 border-t border-gray-100"
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 text-sm border rounded-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#0053a6] text-white text-sm font-medium"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
