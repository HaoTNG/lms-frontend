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
import CourseManagement from '../pages/admin/CourseManagement'

import UserDetail from '../pages/admin/UserDetail'
const AppRoutes = () => {
  console.log('[AppRoutes] Rendering...')
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* -------------------- AUTH ROUTES -------------------- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* -------------------- PROTECTED ROUTES -------------------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Home */}
            <Route index element={<HomePage />} />

            {/* Admin - Only ADMIN can access */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Course Management */}
            <Route
              path="admin/courses"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CourseManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/courses/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserDetail />
                </ProtectedRoute>
              }
            />


            {/* Tutor */}
            <Route
              path="tutor"
              element={
                <ProtectedRoute allowedRoles={['TUTOR', 'ADMIN']}>
                  <TutorPage />
                </ProtectedRoute>
              }
            />

            {/* Mentee */}
            <Route
              path="mentee"
              element={
                <ProtectedRoute allowedRoles={['MENTEE', 'ADMIN']}>
                  <MenteePage />
                </ProtectedRoute>
              }
            />

            {/* User common */}
            <Route
              path="user"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* -------------------- CATCH ALL -------------------- */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default AppRoutes
