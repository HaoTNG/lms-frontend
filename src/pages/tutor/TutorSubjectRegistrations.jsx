// src/pages/tutor/TutorSubjectRegistrations.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export function TutorSubjectRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getSubjectRegistrations();
      const data = Array.isArray(response) ? response : (response.data || []);
      setRegistrations(data);
      setError(null);
    } catch (err) {
      setError("Lỗi tải danh sách đơn đăng ký: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "APPROVED") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Đã phê duyệt
        </div>
      );
    } else if (status === "PENDING") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          <Clock className="w-3 h-3" />
          Chờ phê duyệt
        </div>
      );
    } else if (status === "REJECTED") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          Bị từ chối
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Đơn đăng ký khóa học</h1>
        <p className="text-gray-600 mt-1">
          Quản lý các đơn đăng ký giảng dạy các môn học
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Registrations List */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            Tổng cộng: {registrations.length} đơn đăng ký
          </h3>
        </div>

        {registrations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Chưa có đơn đăng ký nào</p>
          </div>
        ) : (
          <div className="divide-y">
            {registrations.map((registration) => (
              <div
                key={registration.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Subject Info */}
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {registration.subject.subjectName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {registration.subject.description}
                      </p>
                    </div>

                    {/* Registration Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Mã đơn đăng ký
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          #{registration.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Ngày đăng ký
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(registration.registeredAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Trạng thái
                        </p>
                        <div className="mt-1">
                          {getStatusBadge(registration.registrationStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tutor Info */}
                {registration.tutor && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-xs text-gray-500 font-medium mb-3">
                      Thông tin giáo viên
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tên:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {registration.tutor.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {registration.tutor.email}
                        </span>
                      </div>
                      {registration.tutor.experience && (
                        <div className="flex items-start justify-between">
                          <span className="text-sm text-gray-600">Kinh nghiệm:</span>
                          <span className="text-sm font-medium text-gray-800 text-right">
                            {registration.tutor.experience}
                          </span>
                        </div>
                      )}
                      {registration.tutor.expertise && (
                        <div className="flex items-start justify-between">
                          <span className="text-sm text-gray-600">Chuyên môn:</span>
                          <span className="text-sm font-medium text-gray-800 text-right">
                            {registration.tutor.expertise}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {registrations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600">Tổng đơn đăng ký</div>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              {registrations.length}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600">Đã phê duyệt</div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {registrations.filter(r => r.registrationStatus === "APPROVED").length}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600">Chờ phê duyệt</div>
            <div className="text-2xl font-bold text-yellow-600 mt-2">
              {registrations.filter(r => r.registrationStatus === "PENDING").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
