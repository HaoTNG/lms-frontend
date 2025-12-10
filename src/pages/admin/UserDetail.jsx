import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { adminAPI } from "../../services/api"
import LoadingSpinner from "../../components/LoadingSpinner"

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUser()
  }, [id])

  const loadUser = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getUserById(id)
      setUser(response.user || response)
    } catch (err) {
      setError("Không tải được thông tin người dùng: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error)
    return (
      <div className="p-4 text-red-600 font-bold">
        {error}
      </div>
    )

  if (!user) return null

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/admin")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Quay lại
      </button>

      <h2 className="text-2xl font-bold">Chi tiết người dùng</h2>

      <div className="bg-white rounded-lg border p-6 space-y-3">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>
      </div>
    </div>
  )
}
