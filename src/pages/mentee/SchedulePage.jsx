import React, { useState, useEffect } from "react";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function SchedulePage() {
  const [autoReminder, setAutoReminder] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      
      // Load all my courses
      const coursesRes = await menteeAPI.getMyCourses();
      const coursesData = Array.isArray(coursesRes) ? coursesRes : (coursesRes.data || []);
      
      // Load sessions for each course
      const allSessions = [];
      for (const course of coursesData) {
        try {
          const sessionsRes = await menteeAPI.getSessions(course.courseId);
          const sessionsData = Array.isArray(sessionsRes) ? sessionsRes : (sessionsRes.data || []);
          
          const mappedSessions = sessionsData.map((s) => ({
            ...s,
            courseName: course.courseName,
            courseId: course.courseId,
          }));
          
          allSessions.push(...mappedSessions);
        } catch (err) {
          console.error(`Lỗi tải sessions cho khóa ${course.courseId}:`, err);
        }
      }
      
      setSessions(allSessions);
      setError(null);
    } catch (err) {
      setError("Lỗi tải lịch học: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSessionsForDate = (date) => {
    return sessions.filter((s) => {
      const sessionDate = new Date(s.date);
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      );
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="border rounded-lg overflow-hidden">
        {/* header thứ trong tuần */}
        <div className="grid grid-cols-7 bg-gray-50 border-b text-xs text-center">
          {weekDays.map((d) => (
            <div key={d} className="py-2 font-medium text-gray-600">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 text-xs">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-24 border border-gray-100 bg-gray-50" />;
            }

            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const daySessionsData = getSessionsForDate(dateObj);

            return (
              <div
                key={day}
                className="h-24 border border-gray-100 p-2 align-top overflow-auto"
              >
                <div className="text-[11px] font-semibold text-gray-700">{day}</div>
                <div className="mt-1 space-y-1">
                  {daySessionsData.map((session) => (
                    <div
                      key={session.id}
                      className="text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate hover:bg-blue-200 cursor-pointer"
                      title={`${session.courseName} - ${session.startTime}`}
                    >
                      {session.courseName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-xl md:text-2xl font-semibold text-[#004196] mb-4">
        Lịch học
      </h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Thanh điều khiển trên lịch */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="text-sm font-semibold">{monthYear}</div>

            <div className="flex items-center gap-2 text-xs ml-auto">
              <span>Nhắc lịch tự động</span>
              <button
                onClick={() => setAutoReminder(!autoReminder)}
                className={`w-10 h-5 rounded-full flex items-center px-1 ${
                  autoReminder ? "bg-[#0b6fe0]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                    autoReminder ? "translate-x-4" : ""
                  }`}
                />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="px-2 text-lg hover:bg-gray-100 rounded"
              >
                ‹
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="px-2 text-lg hover:bg-gray-100 rounded"
              >
                ›
              </button>
            </div>
          </div>

          {/* Lịch */}
          {renderCalendar()}

          {/* Danh sách sessions sắp tới */}
          {sessions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[#004196] mb-4">Các buổi học sắp tới</h2>
              <div className="grid gap-3">
                {sessions
                  .filter((s) => new Date(s.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 10)
                  .map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{session.courseName}</p>
                          <p className="text-sm text-gray-600">{session.type} - {session.room}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.date).toLocaleDateString("vi-VN")} {session.startTime} - {session.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
