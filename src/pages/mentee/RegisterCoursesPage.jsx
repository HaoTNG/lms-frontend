import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

function StatusBadge({ courseStatus, current, max }) {
  let status = "Đang mở đăng ký";
  let base = "text-[11px] px-2 py-1 rounded-full border inline-flex items-center";
  
  if (courseStatus === "END") {
    return (
      <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>
        Đã kết thúc
      </span>
    );
  }
  
  if (current >= max) {
    return (
      <span className={`${base} bg-red-100 text-red-700 border-red-200`}>
        Đã đủ số lượng
      </span>
    );
  }
  
  return (
    <span className={`${base} bg-green-100 text-green-700 border-green-200`}>
      {status}
    </span>
  );
}

export default function RegisterCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadEnrolledCourses();
    loadAvailableCourses();
  }, [page]);

      const loadEnrolledCourses = async () => {
    try {
      const response = await menteeAPI.getMyEnrollCourses();
      console.log("getMyCourses response:", response); // Debug log
      const myCourses = Array.isArray(response) ? response : (response.data || []);
      // Đảm bảo tất cả IDs đều là number để so sánh chính xác
      const ids = myCourses.map(c => Number(c.courseId || c.id));
      setEnrolledCourseIds(ids);
      console.log("Enrolled course IDs:", ids); // Debug log
    } catch (err) {
      console.error("Lỗi tải danh sách khóa học đã đăng ký:", err);
    }
  };

  const loadAvailableCourses = async () => {
    try {
      setLoading(true);
      const response = await menteeAPI.getCourses(page, 10);
      const paginationData = response.pagination || {};
      
      const mappedCourses = (paginationData.content || []).map((course) => ({
        id: course.courseId,
        name: course.courseName,
        teacher: course.tutorName,
        current: course.totalEnrollments || 0,
        max: course.maxMentee || 30,
        courseStatus: course.courseStatus,
        description: course.description,
      }));
      
      setCourses(mappedCourses);
      setTotalPages(paginationData.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Lỗi tải danh sách khóa học: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.id.toString().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = async (courseId) => {
    setRegistering(true);
    try {
      const payload = Number(courseId) ;
      await menteeAPI.enrollCourse(payload);
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      await loadEnrolledCourses();
      setShowSuccess(true);
      // Auto-reload page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError("Lỗi đăng ký khóa học: " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    setRegistering(true);
    try {
      const payload = Number(courseId) ;
      await menteeAPI.unenrollCourse(payload);
      setEnrolledCourseIds(enrolledCourseIds.filter(id => id !== courseId));
      await loadEnrolledCourses();
      setError("Hủy đăng ký thành công");
      // Auto-reload page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError("Lỗi hủy đăng ký: " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-xl md:text-2xl font-semibold text-[#004196] mb-4">
        Đăng ký môn học
      </h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* search + filter */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-full border rounded-md pl-8 pr-3 py-2 text-sm"
              />
            </div>
            <button className="border rounded-md px-3 py-2 text-sm text-gray-600 flex items-center gap-1">
              Lọc ▾
            </button>
          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Mã lớp</th>
                  <th className="text-left px-4 py-3 font-medium">Tên môn</th>
                  <th className="text-left px-4 py-3 font-medium">Giảng viên</th>
                  <th className="text-left px-4 py-3 font-medium">Số SV/ tối đa</th>
                  <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                  <th className="text-right px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      Không tìm thấy khóa học nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const isEnrolled = enrolledCourseIds.includes(c.id);
                    const isEnrollable = c.courseStatus === "OPEN" && c.current < c.max && !isEnrolled;
                    return (
                      <tr key={c.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{c.id}</td>
                        <td className="px-4 py-2">
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500 truncate">{c.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2">{c.teacher}</td>
                        <td className="px-4 py-2">
                          {c.current}/{c.max}
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge courseStatus={c.courseStatus} current={c.current} max={c.max} />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => isEnrolled ? handleUnenroll(c.id) : handleRegister(c.id)}
                            disabled={registering || (!isEnrollable && !isEnrolled)}
                            className={`px-4 py-1 rounded-md text-xs text-white transition ${
                              isEnrolled
                                ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                                : isEnrollable
                                ? "bg-[#0b6fe0] hover:bg-[#004bb4]"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                          >
                            {isEnrolled ? "Hủy đăng ký" : registering ? "Đang xử lý..." : "Đăng ký"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* phân trang đơn giản */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center py-3 text-xs gap-1">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-6 h-6 rounded-sm border ${
                      i === page ? "bg-[#0b6fe0] text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 mt-4 text-sm">
            <button
              onClick={() => navigate("/mentee/registered-courses")}
              className="px-4 py-2 border rounded-md text-[#0b6fe0] border-[#0b6fe0]"
            >
              Xem danh sách đã đăng ký
            </button>
          </div>

          {/* SUCCESS MODAL */}
          {showSuccess && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg px-8 py-6 w-full max-w-md text-center shadow-lg">
                <div className="text-4xl mb-3 text-green-500">✔</div>
                <p className="font-semibold mb-1">Đăng ký thành công</p>
                <p className="text-sm text-gray-600 mb-4">
                  Bạn đã đăng ký khóa học
                </p>

                <div className="flex justify-center gap-3 mt-4 text-sm">
                  <button
                    onClick={() => navigate("/mentee/registered-courses")}
                    className="px-4 py-2 border rounded-md text-[#0b6fe0] border-[#0b6fe0]"
                  >
                    Xem danh sách đăng ký
                  </button>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="px-4 py-2 rounded-md bg-[#0b6fe0] text-white"
                  >
                    Tiếp tục đăng ký
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
