// TutorPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TeacherDashboard } from "./TutorDashboard";
import { TeacherCourses } from "./TutorCourses";
import { TeacherCourseDetail } from "./TutorCourseDetail";
import { TeacherAssignments } from "./TutorAssignments";
import { TeacherDocuments } from "./TutorDocuments";
import { TeacherStudents } from "./TutorStudents";
import { TeacherReports } from "./TutorReports";
import { TeacherSessionDetail } from "./SessionDetailPage";
import TutorLessonDetailPage from "./TutorLessonDetailPage";
import TutorExerciseDetailPage from "./TutorExerciseDetailPage";
import { TutorSubjectRegistrations } from "./TutorSubjectRegistrations";
import { Menu, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import HCMUTLogo from "../../../image/HCMUT_logo.png";
import { authAPI } from "../../services/api";
import { useAuthContext } from "../../context/AuthContext";

export default function TutorPage() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize currentPage from URL params or default to "dashboard"
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || "dashboard");
  const [pageStack, setPageStack] = useState(["dashboard"]); // Track page history
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseIdForDetail, setCourseIdForDetail] = useState(searchParams.get("courseId") || null);
  const [sessionIdForDetail, setSessionIdForDetail] = useState(searchParams.get("sessionId") || null);
  const [lessonIdForDetail, setLessonIdForDetail] = useState(searchParams.get("lessonId") || null);
  const [exerciseIdForDetail, setExerciseIdForDetail] = useState(searchParams.get("exerciseId") || null);

  useEffect(() => {
    loadUser();
  }, []);

  // Sync URL params with state when currentPage changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    if (courseIdForDetail) params.set("courseId", courseIdForDetail);
    if (sessionIdForDetail) params.set("sessionId", sessionIdForDetail);
    if (lessonIdForDetail) params.set("lessonId", lessonIdForDetail);
    if (exerciseIdForDetail) params.set("exerciseId", exerciseIdForDetail);
    setSearchParams(params);
  }, [currentPage, courseIdForDetail, sessionIdForDetail, lessonIdForDetail, exerciseIdForDetail, setSearchParams]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (pageStack.length > 1) {
        const newStack = pageStack.slice(0, -1);
        const previousPage = newStack[newStack.length - 1];
        setPageStack(newStack);
        setCurrentPage(previousPage);
      } else {
        // Prevent going back past tutor page
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pageStack]);

  const loadUser = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.user || response);
    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Tổng quan" },
    { id: "courses", label: "Lớp học" },
    { id: "assignments", label: "Bài tập" },
    { id: "documents", label: "Tài liệu" },
    { id: "students", label: "Sinh viên" },
    { id: "reports", label: "Báo cáo" },
    { id: "registrations", label: "Đơn đăng ký" },
  ];

  const handleNavigate = (page, data) => {
    console.log("handleNavigate called with:", page, data);
    setCurrentPage(page);
    // Add to page stack for back button tracking
    setPageStack([...pageStack, page]);
    // Push a new state to browser history
    window.history.pushState({ page }, "");
    
    if (data?.courseId) {
      console.log("Setting courseIdForDetail to:", data.courseId);
      setCourseIdForDetail(data.courseId);
    }
    
    if (data?.sessionId) {
      console.log("Setting sessionIdForDetail to:", data.sessionId);
      setSessionIdForDetail(data.sessionId);
    }

    if (data?.lessonId) {
      console.log("Setting lessonIdForDetail to:", data.lessonId);
      setLessonIdForDetail(data.lessonId);
    }

    if (data?.exerciseId) {
      console.log("Setting exerciseIdForDetail to:", data.exerciseId);
      setExerciseIdForDetail(data.exerciseId);
    }
  };

  const renderCurrentPage = () => {
    if (loading) {
      return <div className="p-8 text-center">Đang tải...</div>;
    }

    switch (currentPage) {
      case "dashboard":
        return <TeacherDashboard user={user} onNavigate={handleNavigate} />;
      case "courses":
        return <TeacherCourses user={user} onNavigate={handleNavigate} />;
      case "course-detail":
        return (
          <TeacherCourseDetail
            courseId={courseIdForDetail}
            onNavigate={handleNavigate}
          />
        );
      case "session":
        return (
          <TeacherSessionDetail
            courseId={courseIdForDetail}
            sessionId={sessionIdForDetail}
            onNavigate={handleNavigate}
          />
        );
      case "lesson":
        return (
          <TutorLessonDetailPage
            courseId={courseIdForDetail}
            lessonId={lessonIdForDetail}
            onNavigate={handleNavigate}
          />
        );
      case "exercise-detail":
        return (
          <TutorExerciseDetailPage
            exerciseId={exerciseIdForDetail}
          />
        );
      case "assignments":
        return (
          <TeacherAssignments user={user} onNavigate={handleNavigate} />
        );
      case "documents":
        return <TeacherDocuments user={user} />;
      case "students":
        return <TeacherStudents user={user} />;
      case "reports":
        return <TeacherReports user={user} />;
      case "registrations":
        return <TutorSubjectRegistrations />;
      default:
        return <TeacherDashboard user={user} onNavigate={handleNavigate} />;
    }
  };

  const getCurrentPageLabel = () => {
    const currentItem = menuItems.find((item) => item.id === currentPage);
    return currentItem ? currentItem.label : "Tổng quan";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với nền xanh giống Navbar mentee/admin */}
      <header className="bg-[#4EA5FF] text-white shadow-md">
        <div className="flex items-center justify-between px-6 h-14">
          {/* Logo + tên hệ thống */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center border border-white/40 overflow-hidden">
              <img
                src={HCMUTLogo}
                alt="HCMUT Logo"
                className="w-full h-full object-contain scale-150"
              />
            </div>
          </div>

          {/* Menu chính – Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`pb-1 ${
                  currentPage === item.id
                    ? "font-semibold border-b-2 border-white"
                    : "hover:border-b hover:border-white/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Khu vực icon bên phải */}
          <div className="flex items-center gap-3 relative">
            {/* Mobile menu button */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-white hover:bg-white/20"
              >
                <Menu className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Mobile menu dropdown */}
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 w-full px-4 py-2 text-sm text-left ${
                        currentPage === item.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs md:text-sm hover:bg-white/25"
                onClick={() => setOpenUserMenu((v) => !v)}
              >
                <span className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-[11px] font-bold">
                  {user?.name?.charAt(0) || 'T'}
                </span>
                <span className="hidden sm:inline">{user?.name || 'Giáo viên'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* User menu dropdown */}
              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-lg z-40 text-sm">
                  {/* Hồ sơ */}
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    onClick={() => {
                      setOpenUserMenu(false);
                      navigate("/user");
                    }}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Hồ sơ</span>
                  </button>

                  {/* Thoát */}
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 border-t border-gray-100 text-red-600"
                    onClick={async () => {
                      try {
                        await authAPI.logout();
                        logout();
                        navigate("/login-lms");
                      } catch (err) {
                        console.error("Logout error:", err);
                        logout();
                        navigate("/login-lms");
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Thoát</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">{renderCurrentPage()}</div>
        </div>
      </div>
    </div>
  );
}
