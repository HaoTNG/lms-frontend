import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState(null);
  const [approving, setApproving] = useState(false);
  const [form, setForm] = useState({
    description: "",
    maxMentee: "",
    courseStatus: "",
    startDate: "",
    endDate: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load course detail
  useEffect(() => {
    loadCourseDetail();
  }, [id]);

  const loadCourseDetail = async () => {
    try {
      const res = await adminAPI.getCourseById(id);
      const data = res.data;

      setCourse(data);

      // Fill form
      setForm({
        description: data.description || "",
        maxMentee: data.maxMentee || "",
        courseStatus: data.courseStatus,
        startDate: data.startDate,
        endDate: data.endDate
      });

      // Load enrollment stats
      loadEnrollmentStats();

    } catch (err) {
      setError("Lỗi tải khóa học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollmentStats = async () => {
    try {
      const res = await adminAPI.getEnrollmentCounts(id);
      setEnrollmentStats(res.data);
    } catch (err) {
      console.error("Lỗi tải enrollment stats:", err);
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate dates
    if (form.startDate && form.endDate) {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

      if (startDate < today) {
        setError("Ngày bắt đầu phải là ngày hôm nay hoặc trong tương lai");
        return;
      }

      if (endDate < today) {
        setError("Ngày kết thúc phải là ngày hôm nay hoặc trong tương lai");
        return;
      }

      if (endDate <= startDate) {
        setError("Ngày kết thúc phải sau ngày bắt đầu");
        return;
      }
    }

    try {
      const payload = {
        description: form.description,
        maxMentee: form.maxMentee,
        courseStatus: form.courseStatus,
        startDate: form.startDate,
        endDate: form.endDate
      };

      await adminAPI.updateCourse(id, payload);

      setSuccess("Cập nhật thành công!");
      loadCourseDetail();

    } catch (err) {
      setError("Lỗi cập nhật: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleApproveEnrollments = async () => {
    setApproving(true);
    setError("");
    setSuccess("");

    try {
      await adminAPI.ApproveEnrollments(id);
      setSuccess("Phê duyệt đơn đăng ký thành công!");
      loadEnrollmentStats();
    } catch (err) {
      setError("Lỗi phê duyệt đơn đăng ký: " + err.message);
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!course)
    return (
      <div className="p-4 text-center text-red-600">
        Không tìm thấy khóa học.
      </div>
    );

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate("/admin")}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Quay lại
      </button>

      <h2 className="text-3xl font-bold text-gray-800">
        Chi tiết khóa học: {course.courseName}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>
      )}

      {/* COURSE INFO */}
      <div className="bg-white p-6 border rounded-xl space-y-4 shadow">
        <p><strong>ID:</strong> {course.courseId}</p>
        <p><strong>Mô tả:</strong> {course.description}</p>
        <p><strong>Trạng thái:</strong> {course.courseStatus}</p>
        <p><strong>Số mentee tối đa:</strong> {course.maxMentee ?? "Không có"}</p>
        <p><strong>Giảng viên:</strong> {course.tutorName} (ID: {course.tutorId})</p>
        <p><strong>Subject Registration ID:</strong> {course.subjectRegistrationId}</p>
        <p><strong>Ngày tạo:</strong> {course.createdDate}</p>
      </div>

      {/* ENROLLMENT STATS */}
      {enrollmentStats && (
        <div className="bg-blue-50 p-6 border-2 border-blue-200 rounded-xl space-y-4 shadow">
          <h3 className="text-xl font-bold text-blue-800">Thống kê Đăng ký</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-sm">Tổng cộng</p>
              <p className="text-3xl font-bold text-blue-600">{enrollmentStats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm">Đã phê duyệt</p>
              <p className="text-3xl font-bold text-green-600">{enrollmentStats.approved}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <p className="text-gray-600 text-sm">Đang chờ</p>
              <p className="text-3xl font-bold text-yellow-600">{enrollmentStats.pending}</p>
            </div>
          </div>
          {enrollmentStats.pending > 0 && (
            <button
              onClick={handleApproveEnrollments}
              disabled={approving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-3 rounded-lg font-bold transition"
            >
              {approving ? "Đang xử lý..." : "✓ Phê duyệt tất cả đơn đăng ký"}
            </button>
          )}
        </div>
      )}

      {/* UPDATE FORM */}
      <div className="bg-gray-50 p-6 border rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Cập nhật khóa học</h3>

        <form onSubmit={handleUpdate} className="space-y-4">

          <textarea
            name="description"
            placeholder="Mô tả khóa học"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg h-24"
          />

          <input
            type="number"
            name="maxMentee"
            placeholder="Số học viên tối đa"
            value={form.maxMentee}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <select
            name="courseStatus"
            value={form.courseStatus}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="OPEN">OPEN</option>
            <option value="END">END</option>
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Cập nhật khóa học
          </button>

        </form>
      </div>
    </div>
  );
}
