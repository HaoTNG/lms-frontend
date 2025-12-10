import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { tutorAPI } from "../../services/api";

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
      >
        <span className="font-medium text-gray-800">{title}</span>
        <span className="text-xs text-gray-500">{open ? "▴" : "▾"}</span>
      </button>
      {open && <div className="border-t px-4 py-2 bg-white">{children}</div>}
    </div>
  );
}

export const TeacherSessionDetail = function TutorSessionDetailPage({ courseId, sessionId, onNavigate }) {
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [forumCreated, setForumCreated] = useState(false);
  const [showQuestionsTab, setShowQuestionsTab] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [answeringLoading, setAnsweringLoading] = useState(false);
  
  const [sessionForm, setSessionForm] = useState({
    type: "LECTURE",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  useEffect(() => {
    loadSessionDetail();
  }, [sessionId]);

  const loadSessionDetail = async () => {
    try {
      setLoading(true);
      
      // Load session detail
      const sessionRes = await tutorAPI.getSessionDetail(sessionId);
      const sessionData = sessionRes.data || sessionRes;
      
      setSession(sessionData);
      setSessionForm({
        type: sessionData.type || "LECTURE",
        date: sessionData.date || "",
        startTime: sessionData.startTime || "",
        endTime: sessionData.endTime || "",
        room: sessionData.room || "",
      });
      setForumCreated(!!sessionData.forumId);
      
      // Load questions from forum if it exists
      if (sessionData.forumId) {
        try {
          const questionsRes = await tutorAPI.getQuestionsByForum(sessionData.forumId);
          const questionsData = Array.isArray(questionsRes) ? questionsRes : (questionsRes.data || []);
          setQuestions(questionsData);
        } catch (err) {
          console.error("Lỗi tải câu hỏi:", err);
        }
      }
      
      setError(null);
    } catch (err) {
      setError("Lỗi tải chi tiết phiên học: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSession = async () => {
    try {
      const updateData = {
        type: sessionForm.type,
        date: sessionForm.date,
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        room: sessionForm.room,
      };
      
      await tutorAPI.updateSession(courseId, updateData);
      
      setEditDialogOpen(false);
      await loadSessionDetail();
    } catch (err) {
      setError("Lỗi cập nhật phiên học: " + err.message);
    }
  };

  const handleCreateForum = async () => {
    try {
      await tutorAPI.createForum(sessionId);
      setForumCreated(true);
      await loadSessionDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi tạo forum: " + err.message);
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !session?.forumId) {
      setError("Vui lòng nhập câu hỏi");
      return;
    }

    setCreatingQuestion(true);
    try {
      await tutorAPI.askQuestion(session.forumId, newQuestion);
      setNewQuestion("");
      setShowCreateQuestion(false);
      await loadSessionDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi tạo câu hỏi: " + err.message);
    } finally {
      setCreatingQuestion(false);
    }
  };

  const handleAnswerQuestion = async (questionId) => {
    if (!answerText.trim()) {
      setError("Vui lòng nhập câu trả lời");
      return;
    }

    setAnsweringLoading(true);
    try {
      await tutorAPI.answerQuestion(questionId, answerText);
      setAnswerText("");
      setAnsweringQuestionId(null);
      await loadSessionDetail();
      setError(null);
    } catch (err) {
      setError("Lỗi trả lời câu hỏi: " + err.message);
    } finally {
      setAnsweringLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  if (!session) {
    return (
      <div>
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          onClick={() => onNavigate("courses")}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy phiên học
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            onClick={() => onNavigate("courses")}
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div>
            <h1 className="text-2xl font-bold">{session.type} - {session.room}</h1>
            <p className="text-gray-600 text-sm">
              {session.date} | {session.startTime} - {session.endTime}
            </p>
          </div>
        </div>

        <button
          onClick={() => setEditDialogOpen(true)}
          className="p-2 hover:bg-gray-100 rounded text-blue-600"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Session Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Ngày</p>
            <p className="font-semibold text-gray-800">
              {new Date(session.date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Loại phiên học</p>
            <p className="font-semibold text-gray-800">{session.type}</p>
          </div>
          <div>
            <p className="text-gray-600">Thời gian bắt đầu</p>
            <p className="font-semibold text-gray-800">{session.startTime}</p>
          </div>
          <div>
            <p className="text-gray-600">Thời gian kết thúc</p>
            <p className="font-semibold text-gray-800">{session.endTime}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Phòng học</p>
            <p className="font-semibold text-gray-800">{session.room}</p>
          </div>
        </div>
        {session.averageRating > 0 && (
          <p className="text-gray-700 mt-3 text-sm">
            <strong>Đánh giá:</strong> {session.averageRating}/10 ({session.ratingCount} đánh giá)
          </p>
        )}
      </div>

      {/* Forum Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Forum thảo luận</h2>
          {!forumCreated && (
            <button
              onClick={handleCreateForum}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Tạo Forum
            </button>
          )}
        </div>
        
        {forumCreated ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm">
                ✓ Forum đã được tạo. Có {questions.length} câu hỏi.
              </p>
              <button
                onClick={() => setShowCreateQuestion(!showCreateQuestion)}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                {showCreateQuestion ? "Hủy" : "Đặt câu hỏi"}
              </button>
            </div>

            {showCreateQuestion && (
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50 mb-4">
                <textarea
                  placeholder="Nhập câu hỏi của bạn..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={creatingQuestion || !newQuestion.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                >
                  {creatingQuestion ? "Đang gửi..." : "Gửi câu hỏi"}
                </button>
              </div>
            )}
            
            {questions.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Các câu hỏi trong forum:</h3>
                {questions.map((question) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{question.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Từ: <span className="font-semibold">{question.mentee?.name || question.tutor?.name || "Ẩn danh"}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Display existing answer if available */}
                    {question.answer && (
                      <div className="mt-3 pt-3 border-t border-gray-200 bg-white p-2 rounded">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Trả lời:</p>
                        <p className="text-sm text-gray-800">{question.answer}</p>
                        {question.answeredAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Trả lời lúc: {new Date(question.answeredAt).toLocaleString('vi-VN')}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Answer button and form */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {!question.answer && answeringQuestionId !== question.id && (
                        <button
                          onClick={() => setAnsweringQuestionId(question.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Trả lời
                        </button>
                      )}
                      
                      {answeringQuestionId === question.id && (
                        <div className="space-y-2">
                          <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="Nhập câu trả lời..."
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAnswerQuestion(question.id)}
                              disabled={answeringLoading}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                              {answeringLoading ? "Đang gửi..." : "Gửi trả lời"}
                            </button>
                            <button
                              onClick={() => {
                                setAnsweringQuestionId(null);
                                setAnswerText("");
                              }}
                              className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Chưa có câu hỏi nào từ học viên.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Tạo forum để học viên có thể thảo luận về phiên học này.
          </p>
        )}
      </div>

      {/* Session Details Accordion */}
      <div className="border rounded-md bg-gray-50">
        <AccordionSection title="Thông tin chi tiết" defaultOpen>
          <div className="divide-y text-sm">
            <div className="flex items-center justify-between py-2">
              <span>Loại phiên:</span>
              <span className="font-semibold">{session.type}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Phòng:</span>
              <span className="font-semibold">{session.room}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Ngày:</span>
              <span className="font-semibold">
                {new Date(session.date).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Thời gian:</span>
              <span className="font-semibold">
                {session.startTime} - {session.endTime}
              </span>
            </div>
            {session.averageRating > 0 && (
              <div className="flex items-center justify-between py-2">
                <span>Đánh giá trung bình:</span>
                <span className="font-semibold">
                  {session.averageRating}/10 ({session.ratingCount} lượt)
                </span>
              </div>
            )}
          </div>
        </AccordionSection>
      </div>

      {/* Edit Session Dialog */}
      {editDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Chỉnh sửa phiên học</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loại phiên học <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionForm.type}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="LECTURE">LECTURE - Học lý thuyết</option>
                  <option value="LAB">LAB - Thực hành</option>
                  <option value="EXAM">EXAM - Thi</option>
                  <option value="ONLINE">ONLINE - Học trực tuyến</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngày
                </label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thời gian bắt đầu
                  </label>
                  <input
                    type="time"
                    value={sessionForm.startTime}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, startTime: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thời gian kết thúc
                  </label>
                  <input
                    type="time"
                    value={sessionForm.endTime}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, endTime: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phòng học
                </label>
                <input
                  placeholder="Nhập phòng học (Phòng 123, Online, v.v.)"
                  value={sessionForm.room}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, room: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setEditDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleUpdateSession}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
