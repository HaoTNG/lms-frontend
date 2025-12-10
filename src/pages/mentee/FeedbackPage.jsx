// src/pages/mentee/FeedbackPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  X,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function StarRating({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center justify-center gap-1 mb-4">
      {Array.from({ length: max }).map((_, i) => {
        const score = i + 1;
        const active = hover != null ? score <= hover : score <= value;
        return (
          <button
            key={score}
            type="button"
            onMouseEnter={() => setHover(score)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(score)}
            className="p-0.5"
          >
            <Star
              className={`w-5 h-5 ${
                active ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function FeedbackPage() {
  const navigate = useNavigate();

  // tab: "form" | "history"
  const [tab, setTab] = useState("form");

  // form state
  const [rating, setRating] = useState(4);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // fake dữ liệu lịch sử
  const history = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    title: `[Tiêu đề]`,
    createdAt: "20/11/2025",
    status: "Đã gửi",
  }));
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(history.length / pageSize));
  const current = history.slice((page - 1) * pageSize, page * pageSize);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Giả lập call API
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccess(true);
      // sau khi gửi có thể reset form
      // setFullName(""); setStudentId(""); ...
    }, 600);
  };

  const goHome = () => {
    setShowSuccess(false);
    navigate("/mentee");
  };

  const goHistory = () => {
    setShowSuccess(false);
    setTab("history");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Tiêu đề + tab nhỏ switch giữa 2 màn hình */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#004196]">
          {tab === "form" ? "Gửi đánh giá" : "Lịch sử đánh giá"}
        </h1>

        <div className="flex border rounded-full text-sm overflow-hidden">
          <button
            className={`px-4 py-1.5 ${
              tab === "form"
                ? "bg-[#0b6fe0] text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setTab("form")}
          >
            Gửi đánh giá
          </button>
          <button
            className={`px-4 py-1.5 ${
              tab === "history"
                ? "bg-[#0b6fe0] text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setTab("history")}
          >
            Lịch sử
          </button>
        </div>
      </div>

      {/* FORM GỬI ĐÁNH GIÁ */}
      {tab === "form" && (
        <section className="border rounded-lg px-8 py-6 bg-white shadow-sm">
          <div className="flex flex-col items-center mb-4">
            <StarRating value={rating} onChange={setRating} />
            <p className="text-xs text-gray-500">
              Đánh giá: <span className="font-semibold">{rating}/5</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Họ và tên
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0b6fe0]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Mã số sinh viên
                </label>
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0b6fe0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tiêu đề
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0b6fe0]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0b6fe0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Nội dung
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full border rounded-sm px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#0b6fe0]"
              />
              <div className="flex justify-end text-[11px] text-gray-400 mt-1">
                0 / 1000
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-3 items-center pt-2 border-t">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Minh chứng (optional)
                </label>
                <label className="inline-flex items-center justify-center px-4 py-2 border rounded-sm text-xs cursor-pointer hover:bg-gray-50">
                  <span>Click to upload</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                <div className="text-[11px] text-gray-400 mt-1">
                  Chấp nhận các định dạng PDF, JPG, PNG (tối đa 10MB)
                </div>
                {file && (
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Đã chọn: {file.name}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span>Gửi ẩn danh</span>
                  <button
                    type="button"
                    onClick={() => setAnonymous((v) => !v)}
                    className={`w-9 h-5 rounded-full flex items-center px-0.5 ${
                      anonymous ? "bg-[#0b6fe0]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        anonymous ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm rounded-sm bg-[#0b6fe0] text-white hover:bg-[#0552b5] disabled:opacity-60"
                >
                  {submitting ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* LỊCH SỬ ĐÁNH GIÁ */}
      {tab === "history" && (
        <section className="border rounded-lg px-8 py-6 bg-white shadow-sm">
          <table className="w-full text-sm border rounded-md overflow-hidden">
            <tbody>
              {current.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-[13px]">
                    <div className="font-medium">[{item.title}]</div>
                    <div className="text-[11px] text-gray-500">
                      {item.createdAt}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] whitespace-nowrap">
                    <button className="text-blue-600 hover:underline mr-4 inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Xem chi tiết
                    </button>
                    <button className="text-red-500 hover:underline inline-flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* phân trang */}
          <div className="flex justify-center items-center gap-1 mt-4 text-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center border rounded-md disabled:opacity-40"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            {Array.from({ length: pageCount }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-md ${
                    p === page
                      ? "bg-[#0b6fe0] text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="w-7 h-7 flex items-center justify-center border rounded-md disabled:opacity-40"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      )}

      {/* POPUP THÀNH CÔNG */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-md shadow-lg px-10 py-6 text-center relative min-w-[320px]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowSuccess(false)}
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h2 className="font-semibold mb-4">Gửi đánh giá thành công</h2>
            <div className="flex justify-center gap-3 text-sm">
              <button
                className="px-4 py-1.5 border rounded-sm text-gray-700 hover:bg-gray-50"
                onClick={goHome}
              >
                Trở về trang chủ
              </button>
              <button
                className="px-4 py-1.5 bg-[#0b6fe0] text-white rounded-sm hover:bg-[#0552b5]"
                onClick={goHistory}
              >
                Xem lịch sử đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
