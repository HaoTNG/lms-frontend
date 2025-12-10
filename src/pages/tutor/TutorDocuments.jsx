// TutorDocuments.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Video,
  File,
  Link as LinkIcon,
  Code,
} from "lucide-react";
import { tutorAPI } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export function TeacherDocuments({ user }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editResource, setEditResource] = useState({});

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await tutorAPI.getMyResources();
      if (response && response.data) {
        setResources(Array.isArray(response.data) ? response.data : []);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.resourceType?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  const handleEditResource = (resource) => {
    setEditingResourceId(resource.id);
    setEditResource({ ...resource });
  };

  const handleSaveResource = async () => {
    try {
      await tutorAPI.updateResource(editingResourceId, editResource);
      loadResources();
      setEditingResourceId(null);
      setEditResource({});
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa tài liệu này?")) {
      try {
        await tutorAPI.deleteResource(resourceId);
        loadResources();
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const getIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "PDF":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "VIDEO":
        return <Video className="w-5 h-5 text-blue-500" />;
      case "DOC":
        return <File className="w-5 h-5 text-yellow-500" />;
      case "LINK":
        return <LinkIcon className="w-5 h-5 text-purple-500" />;
      case "SOURCE_CODE":
        return <Code className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      PDF: "PDF",
      VIDEO: "Video",
      DOC: "Tài liệu",
      LINK: "Liên kết",
      SOURCE_CODE: "Mã nguồn",
    };
    return labels[type] || type;
  };

  const getStats = () => {
    return {
      total: resources.length,
      pdf: resources.filter((r) => r.resourceType === "PDF").length,
      video: resources.filter((r) => r.resourceType === "VIDEO").length,
      doc: resources.filter((r) => r.resourceType === "DOC").length,
      link: resources.filter((r) => r.resourceType === "LINK").length,
      code: resources.filter((r) => r.resourceType === "SOURCE_CODE").length,
    };
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tài liệu và tài nguyên</h1>
          <p className="text-gray-600">Quản lý tài liệu, video, và tài nguyên học tập</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="text-xs font-medium text-gray-600">Tổng</div>
          <div className="text-blue-600 text-xl font-bold">{stats.total}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="text-xs font-medium text-gray-600">PDF</div>
          <div className="text-red-600 text-xl font-bold">{stats.pdf}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="text-xs font-medium text-gray-600">Video</div>
          <div className="text-blue-600 text-xl font-bold">{stats.video}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="text-xs font-medium text-gray-600">Tài liệu</div>
          <div className="text-yellow-600 text-xl font-bold">{stats.doc}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="text-xs font-medium text-gray-600">Liên kết</div>
          <div className="text-purple-600 text-xl font-bold">{stats.link}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="text-xs font-medium text-gray-600">Mã nguồn</div>
          <div className="text-green-600 text-xl font-bold">{stats.code}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Tìm kiếm tài liệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Resources Table */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Danh sách tài liệu ({filteredResources.length})
          </h2>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium">Tiêu đề</th>
                <th className="text-left py-3 font-medium">Loại</th>
                <th className="text-left py-3 font-medium">Bài học ID</th>
                <th className="text-left py-3 font-medium">Liên kết</th>
                <th className="text-right py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr
                  key={resource.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {getIcon(resource.resourceType)}
                      {editingResourceId === resource.id ? (
                        <input
                          type="text"
                          value={editResource.title}
                          onChange={(e) =>
                            setEditResource({
                              ...editResource,
                              title: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                      ) : (
                        <span>{resource.title}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {getTypeLabel(resource.resourceType)}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{resource.lessonId}</td>
                  <td className="py-3">
                    {editingResourceId === resource.id ? (
                      <input
                        type="text"
                        value={editResource.fileUrl}
                        onChange={(e) =>
                          setEditResource({
                            ...editResource,
                            fileUrl: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full text-xs"
                      />
                    ) : (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs truncate block"
                      >
                        {resource.fileUrl}
                      </a>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {editingResourceId === resource.id ? (
                        <>
                          <button
                            onClick={handleSaveResource}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditingResourceId(null);
                              setEditResource({});
                            }}
                            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditResource(resource)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Mở"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="p-2 hover:bg-gray-100 rounded text-red-600"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResources.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {resources.length === 0
                ? "Chưa có tài liệu nào"
                : "Không tìm thấy tài liệu"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
