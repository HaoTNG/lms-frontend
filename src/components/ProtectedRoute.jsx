// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles, allowedPrefix, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // Chưa login
  if (!user) {
    return <Navigate to="/login-lms" replace />;
  }

  const role = user.role; // ADMIN | MENTEE | TUTOR

  // Nếu role không hợp lệ → Redirect
  if (!allowedRoles.includes(role)) {
    const fallback =
      role === "ADMIN"
        ? "/admin"
        : role === "MENTEE"
        ? "/mentee"
        : "/tutor";

    return <Navigate to={fallback} replace />;
  }

  // ❗ Ngăn role khác truy cập prefix sai
  if (allowedPrefix && !location.pathname.startsWith(allowedPrefix)) {
    const fallback =
      role === "ADMIN"
        ? "/admin"
        : role === "MENTEE"
        ? "/mentee"
        : "/tutor";

    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
