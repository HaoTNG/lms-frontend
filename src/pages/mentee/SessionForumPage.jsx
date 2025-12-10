// src/pages/mentee/SessionForumPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { menteeAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function SessionForumPage() {
  const { courseId, sessionId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [creating, setCreating] = useState(false);
  const [forumId, setForumId] = useState(null);
  const [creatingForum, setCreatingForum] = useState(false);

  useEffect(() => {
    loadSessionAndQuestions();
  }, [sessionId]);

  const loadSessionAndQuestions = async () => {
    try {
      setLoading(true);
      
      // Load session detail để lấy forumId
      const sessionRes = await menteeAPI.getSessionDetail(sessionId);
      const sessionData = sessionRes;
      
      if (!sessionData.forumId) {
        setForumId(null);
        setError(null);
        setLoading(false);
        return;
      }
      
      setForumId(sessionData.forumId);
      
      // Load questions từ forum
      const questionsRes = await menteeAPI.getQuestionsByForum(sessionData.forumId);
      const questionsData = Array.isArray(questionsRes) ? questionsRes : (questionsRes.data || []);
      setQuestions(questionsData);
      setError(null);
    } catch (err) {
      setError("Lỗi tải forum: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async () => {
    setCreatingForum(true);
    try {
      await menteeAPI.createForum(sessionId);
      await loadSessionAndQuestions();
      setError(null);
    } catch (err) {
      setError("Lỗi tạo forum: " + err.message);
      console.error(err);
    } finally {
      setCreatingForum(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !forumId) {
      console.log("Missing data:", { newQuestion: newQuestion.trim(), forumId });
      return;
    }
    setCreating(true);
    
    try {
      console.log("Asking question with forumId:", forumId, "content:", newQuestion);
      await menteeAPI.askQuestion(forumId, newQuestion);
      setNewQuestion("");
      setShowCreate(false);
      await loadSessionAndQuestions();
    } catch (err) {
      setError("Lỗi tạo câu hỏi: " + err.message);
      console.error("Error:", err);
    } finally {
      setCreating(false);
      window.location.reload();
      
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* breadcrumb */}
      <div className="text-xs text-gray-500 mb-2">
        <Link to="/mentee" className="hover:underline">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link to="/mentee/courses" className="hover:underline">
          Các khóa học của tôi
        </Link>{" "}
        /{" "}
        <Link to={`/mentee/courses/${courseId}`} className="hover:underline">
          [Tên lớp học]
        </Link>{" "}
        /{" "}
        <Link
          to={`/mentee/courses/${courseId}/sessions/${sessionId}`}
          className="hover:underline"
        >
          Buổi {sessionId}
        </Link>{" "}
        / <span>Forum buổi {sessionId}</span>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        Forum buổi {sessionId}
      </h1>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : !forumId ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4">Phiên học này chưa có forum. Hãy tạo forum để bắt đầu thảo luận.</p>
          <button
            onClick={handleCreateForum}
            disabled={creatingForum}
            className="px-6 py-2 bg-[#0b6fe0] text-white rounded-md hover:bg-[#004bb4] disabled:opacity-50"
          >
            {creatingForum ? "Đang tạo..." : "+ Tạo Forum"}
          </button>
        </div>
      ) : (
        <>
      <div className="flex gap-6 text-sm border-b mb-4">
        <button className="pb-2 border-b-2 border-[#0b6fe0] text-[#0b6fe0] font-semibold">
          Hỏi đáp
        </button>
      </div>

      {/* thanh công cụ */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <input
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-9 py-2 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#0b6fe0] text-white rounded-md px-4 py-2 text-sm"
        >
          + Đặt câu hỏi
        </button>
      </div>

      {/* bảng questions */}
      <div className="bg-white border rounded-lg overflow-hidden text-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Câu hỏi</th>
              <th className="text-left px-4 py-3 font-medium">Thời gian</th>
              <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question) => (
              <React.Fragment key={question.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 truncate">{question.content}</p>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(question.askedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      question.answer 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {question.answer ? "Đã trả lời" : "Chưa trả lời"}
                    </span>
                  </td>
                </tr>
                {question.answer && (
                  <tr className="border-t bg-blue-50">
                    <td colSpan="3" className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-700">💬 Trả lời:</p>
                        <p className="text-sm text-gray-800">{question.answer}</p>
                        {question.answeredAt && (
                          <p className="text-xs text-gray-500">
                            Trả lời lúc: {new Date(question.answeredAt).toLocaleString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredQuestions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            Chưa có câu hỏi nào
          </div>
        )}
      </div>
        </>
      )}

      {/* modal tạo question */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-sm font-semibold">Đặt câu hỏi</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-500 text-lg"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium">* Câu hỏi</label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={4}
                  placeholder="Nhập câu hỏi của bạn"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">{newQuestion.length}/1000</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 border-t text-sm">
              <button
                onClick={() => setShowCreate(false)}
                disabled={creating}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAskQuestion}
                disabled={!newQuestion.trim() || creating}
                className="px-4 py-2 rounded-md bg-[#0b6fe0] text-white disabled:opacity-50"
              >
                {creating ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
