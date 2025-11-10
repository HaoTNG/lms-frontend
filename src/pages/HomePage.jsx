// src/pages/HomePage.jsx
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to LMS</h1>
      <p className="text-gray-600 max-w-md">
        A simple Learning Management System platform for Admins, Tutors, and Mentees.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
        >
          Register
        </Link>
      </div>
    </div>
  )
}
