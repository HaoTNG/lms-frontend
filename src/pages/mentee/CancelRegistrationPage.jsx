import React, { useState, useEffect } from "react";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CancelRegistrationPage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toCancel, setToCancel] = useState(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await menteeAPI.getMyCourses();
      const data = Array.isArray(response) ? response : (response.data || []);

      const mappedCourses = data.map((course) => ({
        id: course.courseId,
        name: course.courseName,
        teacher: course.tutorName,
        current: course.totalEnrollments || 0,
        max: course.maxStudents || 30,
      }));

      setCourses(mappedCourses);
      setError(null);
    } catch (err) {
      setError("Lỗi tải danh sách khóa học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.id.toString().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const confirmCancel = async () => {
    if (!toCancel) return;
    setCanceling(true);

    try {
      const payload = Number(toCancel.id) ;
      await menteeAPI.unenrollCourse(payload);
      setCourses((prev) => prev.filter((c) => c.id !== toCancel.id));
      setToCancel(null);
      setError("Hủy đăng ký thành công");
      // Auto-reload page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError("Lỗi hủy đăng ký: " + err.message);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <main className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-xl md:text-2xl font-semibold text-[#004196] mb-4">
          Hủy đăng ký môn học
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Bạn chưa đăng ký khóa học nào
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔍
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm"
                  className="w-full border rounded-md pl-8 pr-3 py-2 text-sm bg-white"
                />
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Mã lớp</th>
                    <th className="text-left px-4 py-3">Tên môn</th>
                    <th className="text-left px-4 py-3">Giảng viên</th>
                    <th className="text-left px-4 py-3">Số SV / Tối đa</th>
                    <th className="text-center px-4 py-3">Hủy đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{c.id}</td>
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.teacher}</td>
                      <td className="px-4 py-2">{c.current}/{c.max}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => setToCancel(c)}
                          className="text-gray-600 hover:text-red-600 text-lg"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {toCancel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-6 py-5 w-full max-w-md text-center shadow-lg">
            <div className="text-3xl mb-2 text-[#f59e0b]">⚠</div>
            <p className="mb-4 text-sm">
              Bạn có chắc muốn hủy đăng ký <b>{toCancel.name}</b>?
            </p>

            <div className="flex justify-center gap-3 text-sm">
              <button
                onClick={() => setToCancel(null)}
                disabled={canceling}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Không
              </button>

              <button
                onClick={confirmCancel}
                disabled={canceling}
                className="px-4 py-2 bg-[#0b6fe0] text-white rounded-md"
              >
                {canceling ? "Đang xử lý..." : "Có"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
