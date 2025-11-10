
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import AdminPage from '../pages/admin/AdminPage'
import TutorPage from '../pages/tutor/TutorPage'
import MenteePage from '../pages/mentee/MenteePage'
import UserPage from '../pages/user/UserPage'
import MainLayout from '../layouts/MainLayout'
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/tutor" element={<TutorPage />} />
                    <Route path="/mentee" element={<MenteePage />} />
                    <Route path="/user" element={<UserPage />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes;
