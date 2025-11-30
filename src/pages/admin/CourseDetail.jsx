import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
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

    } catch (err) {
      setError("Lỗi tải khóa học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
        onClick={() => navigate("/admin/courses")}
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
        <p><strong>Gia sư:</strong> {course.tutorName} (ID: {course.tutorId})</p>
        <p><strong>Subject Registration ID:</strong> {course.subjectRegistrationId}</p>
        <p><strong>Ngày tạo:</strong> {course.createdDate}</p>
      </div>

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
