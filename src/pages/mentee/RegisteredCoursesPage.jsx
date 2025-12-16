import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function RegisteredCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRegisteredCourses();
  }, []);

  const loadRegisteredCourses = async () => {
    try {
      setLoading(true);
      const response = await menteeAPI.getMyCourses();
      const data = Array.isArray(response) ? response : (response.data || []);
      
      // Map API data to table format
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.id.toString().toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-xl md:text-2xl font-semibold text-[#004196] mb-4">
        Danh sách môn học đăng ký đã được phê duyệt
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

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Mã lớp</th>
              <th className="text-left px-4 py-3 font-medium">Tên môn</th>
              <th className="text-left px-4 py-3 font-medium">Giảng viên</th>
              <th className="text-left px-4 py-3 font-medium">
                Số SV/ tối đa
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{c.id}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.teacher}</td>
                <td className="px-4 py-2">
                  {c.current}/{c.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center py-3 text-xs gap-1">
          
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button
          onClick={() => navigate("/mentee/cancel-registration")}
          className="px-4 py-2 border rounded-md text-[#0b6fe0] border-[#0b6fe0]"
        >
          Hủy đăng ký
        </button>
        <button
          onClick={() => navigate("/mentee/register")}
          className="px-4 py-2 rounded-md bg-[#7b5cff] text-white"
        >
          Đăng ký mới
        </button>
      </div>
        </>
      )}
    </div>
  );
}
