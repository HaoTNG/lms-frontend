import React, { useState, useEffect } from "react";
import { authAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.me();
      console.log("API response:", response);
      
      // Handle different response formats
      const userData = response.user || response.data || response;
      console.log("Extracted user data:", userData);
      
      if (userData && userData.id) {
        setUser(userData);
        setEditData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } else {
        setError("Không thể lấy thông tin người dùng");
      }
      
      setError(null);
    } catch (err) {
      setError("Lỗi tải hồ sơ cá nhân: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="text-red-600">Không thể tải thông tin người dùng</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-semibold text-[#004196] mb-6">Hồ sơ cá nhân</h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg p-6">
        {!isEditing ? (
          <>
            {/* View mode */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Họ và tên</label>
                <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-lg font-semibold text-gray-800">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Vai trò</label>
                <p className="text-lg font-semibold text-gray-800">
                  {user.role === "MENTEE" ? "Học viên" : user.role === "TUTOR" ? "Giảng viên" : "Quản trị viên"}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">ID người dùng</label>
                <p className="text-lg font-semibold text-gray-800">{user.id}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#0b6fe0] text-white rounded-md hover:bg-[#004bb4]"
              >
                Chỉnh sửa
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit mode */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Vai trò</label>
                <p className="text-lg font-semibold text-gray-800 py-2">
                  {user.role === "MENTEE" ? "Học viên" : user.role === "TUTOR" ? "Giảng viên" : "Quản trị viên"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-[#0b6fe0] text-white rounded-md hover:bg-[#004bb4]"
              >
                Lưu thay đổi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}