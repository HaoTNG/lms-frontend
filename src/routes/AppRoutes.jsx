import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import HomePage from '../pages/HomePage'
import AdminPage from '../pages/admin/AdminPage'
import TutorPage from '../pages/tutor/TutorPage'
import MenteePage from '../pages/mentee/MenteePage'
import UserPage from '../pages/user/UserPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import CourseDetail from '../pages/admin/CourseDetail'
const AppRoutes = () => {
  console.log('[AppRoutes] Rendering...')
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes - Công khai */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/courses/:id" element={<CourseDetail />} />

          {/* Protected Routes - Yêu cầu đăng nhập */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            
            {/* Admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            
            {/* Tutor and Admin */}
            <Route
              path="/tutor"
              element={
                <ProtectedRoute allowedRoles={['TUTOR', 'ADMIN']}>
                  <TutorPage />
                </ProtectedRoute>
              }
            />
            
            {/* Mentee and Admin */}
            <Route
              path="/mentee"
              element={
                <ProtectedRoute allowedRoles={['MENTEE', 'ADMIN']}>
                  <MenteePage />
                </ProtectedRoute>
              }
            />
            
            {/* All authenticated users */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default AppRoutes
