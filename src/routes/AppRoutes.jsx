// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

// Trang chung
import HomePage from "../pages/HomePage";

// Login
import LoginLMS from "../pages/login/LoginLMS";
import LoginAdmin from "../pages/login/LoginAdmin";
import LoginTutor from "../pages/login/LoginTutor";
import LoginMentee from "../pages/login/LoginMentee";

// Admin & Tutor
import AdminPage from "../pages/admin/AdminPage";
import TutorPage from "../pages/tutor/TutorPage";
import CourseManagement from "../pages/admin/CourseManagement";
import CourseDetail from "../pages/admin/CourseDetail";
import UserDetail from "../pages/admin/UserDetail";
import ProtectedRoute from "../components/ProtectedRoute";

// 👉 THÊM 3 IMPORT NÀY ĐỂ DÙNG CHO CÁC ROUTE ADMIN
import UserManagement from "../pages/admin/UserManagement";
import ReportTickets from "../pages/admin/ReportTickets";
import Announcements from "../pages/admin/Announcements";

// Tutor pages
import TutorExerciseDetailPage from "../pages/tutor/TutorExerciseDetailPage";

// Mentee – core
import Dashboard from "../pages/mentee/Dashboard";
import CoursePage from "../pages/mentee/CoursePage";
import CourseDetailPage from "../pages/mentee/CourseDetailPage";
import LessonDetailPage from "../pages/mentee/LessonDetailPage";
import CourseSessionPage from "../pages/mentee/CourseSessionPage";
import SessionDetailPage from "../pages/mentee/SessionDetailPage";
import SessionForumPage from "../pages/mentee/SessionForumPage";
import SessionForumDetailPage from "../pages/mentee/SessionForumDetailPage";
import MessagesPage from "../pages/mentee/MessagesPage";
import NotificationPage from "../pages/mentee/NotificationPage";
import FeedbackPage from "../pages/mentee/FeedbackPage";

// Mentee – Quiz
import QuizOverviewPage from "../pages/mentee/QuizOverviewPage";
import QuizDoPage from "../pages/mentee/QuizDoPage";
import QuizDonePage from "../pages/mentee/QuizDonePage";

// Mentee – Đăng ký & lịch học
import RegisterCoursesPage from "../pages/mentee/RegisterCoursesPage";
import RegisteredCoursesPage from "../pages/mentee/RegisteredCoursesPage";
import CancelRegistrationPage from "../pages/mentee/CancelRegistrationPage";
import SchedulePage from "../pages/mentee/SchedulePage";
import RegisterPage from "../pages/auth/RegisterPage";
import MenteeReportTickets from "../pages/mentee/MenteeReportTickets";
// User
import UserPage from "../pages/user/UserPage";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Trang chủ (welcome + chọn đăng nhập) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage/>} />
          {/* Login riêng */}
          <Route path="/login" element={<LoginLMS />} />
          <Route path="/login-lms" element={<LoginLMS />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-tutor" element={<LoginTutor />} />
          <Route path="/login-mentee" element={<LoginMentee />} />

          {/* Tutor dùng layout riêng, không đi qua MainLayout */}
          <Route path="/tutor" element={<TutorPage />} />

          {/* ================== ADMIN (AdminLayout + navbar riêng) ================== */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* /admin  → trang phân tích / tổng quan */}
            <Route 
              index 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />

            {/* /admin/users  → Quản lý người dùng */}
            <Route 
              path="users" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            {/* /admin/users/:id  → Chi tiết user */}
            <Route 
              path="users/:id" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <UserDetail />
                </ProtectedRoute>
              } 
            />

            {/* /admin/courses  → Quản lý khóa học */}
            <Route 
              path="courses" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <CourseManagement />
                </ProtectedRoute>
              } 
            />
            {/* /admin/courses/:id  → Chi tiết khóa học */}
            <Route 
              path="courses/:id" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <CourseDetail />
                </ProtectedRoute>
              } 
            />

            {/* /admin/feedback  → Quản lý phản hồi / vé báo cáo */}
            <Route 
              path="feedback" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <ReportTickets />
                </ProtectedRoute>
              } 
            />

            {/* /admin/notifications  → Gởi thông báo */}
            <Route 
              path="notifications" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]} allowedPrefix="/admin">
                  <Announcements />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* ================== MENTEE + USER (MainLayout) ================== */}
          <Route element={<MainLayout />}>
            {/* Mentee – Dashboard */}
            <Route
              path="/mentee"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Mentee – Khóa học của tôi */}
            <Route
              path="/mentee/courses"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <CoursePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/courses/:courseId"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <CourseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentee/courses/:courseId/lessons/:lessonId"
              element={
                <ProtectedRoute allowedRoles={['MENTEE']} allowedPrefix="/mentee">
                  <LessonDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentee/courses/:courseId/lessons/:lessonId/exercises/:exerciseId"
              element={
                <ProtectedRoute allowedRoles={['MENTEE']} allowedPrefix="/mentee">
                  <QuizDoPage />
                </ProtectedRoute>
            }
            />
            <Route
              path="/mentee/courses/:courseId/sessions/:sessionId"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <CourseSessionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/courses/:courseId/sessions/:sessionId/forum"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <SessionForumPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/courses/:courseId/sessions/:sessionId/forum/:topicId"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <SessionForumDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Mentee – Quiz */}
            <Route
              path="/mentee/courses/:courseId/quizzes/:quizId"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <QuizOverviewPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/courses/:courseId/quizzes/:quizId/do"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <QuizDoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/courses/:courseId/quizzes/:quizId/done"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <QuizDonePage />
                </ProtectedRoute>
              }
            />

            {/* Mentee – Đăng ký môn học & lịch học */}
            <Route
              path="/mentee/register"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <RegisterCoursesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/registered-courses"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <RegisteredCoursesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/cancel-registration"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <CancelRegistrationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/schedule"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <SchedulePage />
                </ProtectedRoute>
              }
            />

            {/* Mentee – Others */}
            <Route
              path="/mentee/messages"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <MessagesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <NotificationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/feedback"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/report-tickets"
              element={
                <ProtectedRoute
                  allowedRoles={["MENTEE"]}
                  allowedPrefix="/mentee"
                >
                  <MenteeReportTickets />
                </ProtectedRoute>
              }
            />

            {/* User */}
            <Route path="/user" element={<UserPage />} />
          </Route>

          {/* 404 đơn giản */}
          <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;