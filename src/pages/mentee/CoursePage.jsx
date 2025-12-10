// src/pages/mentee/CoursePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;


const courseImages = {
  1: "1.jpeg",
  2: "2.jpeg",
  3: "3.jpeg",
  4: "4.jpeg",
  5: "5.jpg",
  6: "6.jpg",
  7: "7.jpg",
  8: "8.jpg",
  9: "9.jpg",
  10: "11.jpg"
};


  useEffect(() => {
    console.log("CoursePage component mounted, calling loadCourses");
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      console.log("Calling menteeAPI.getMyCourses()...");
      const response = await menteeAPI.getMyCourses();
      console.log("Response:", response);
      
      // Response là array trực tiếp
      const data = Array.isArray(response) ? response : (response.data || []);
      console.log("Course data:", data);
      
      // Map API data to format that matches UI
      const mappedCourses = data.map((course) => ({
        id: course.courseId,
        title: course.courseName,
        code: course.subjectRegistrationId || "N/A",
        teacher: course.tutorName,
        term: "N/A",
        classCode: course.courseId,
        status: course.courseStatus === "OPEN" ? "Đang học" : "Đã hoàn thành",
        endDate: course.endDate || new Date().toISOString().split('T')[0],
        img: `/images/${courseImages[Math.floor(Math.random() * 10)]}`,
      }));
      
      console.log("Mapped courses:", mappedCourses);
      setCourses(mappedCourses);
      setError(null);
    } catch (err) {
      setError("Lỗi tải danh sách khóa học: " + err.message);
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses; // Show all courses

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedCourses = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changePage = (p) => {
    if (p < 1 || p > pageCount) return;
    setPage(p);
  };

  return (
    <div className="bg-white">
      {/* PHẦN CONTENT – không còn header xanh ở đây nữa */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#004196] mb-6">
          Khóa học của tôi
        </h1>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-6">
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
            {/* grid courses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {pagedCourses.map((c) => (
            <Link
              key={c.id}
              to={`/mentee/courses/${c.id}`}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition text-left"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-800">
                    {c.title} ({c.code}) -
                  </p>
                  <p className="text-gray-600">
                    [{c.teacher}] ({c.term}) -
                  </p>
                  <p className="text-gray-600">[{c.classCode}]</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* pagination */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center text-xs border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default"
          >
            {"<"}
          </button>
          {Array.from({ length: pageCount }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => changePage(p)}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded-md ${
                  p === currentPage
                    ? "bg-[#0b6fe0] text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === pageCount}
            className="w-7 h-7 flex items-center justify-center text-xs border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default"
          >
            {">"}
          </button>
        </div>
        </>
        )}
      </main>
    </div>
  );
}
