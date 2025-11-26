// API Base URL - thay đổi theo backend của bạn
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Helper function để gọi API
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // 👈 Tự động gửi/nhận cookies
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API Error')
    }

    return data
  } catch (error) {
    throw error
  }
}

// Auth APIs
export const authAPI = {
  register: async (name, email, password, role = 'MENTEE') => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    })
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    })
  },

  me: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    })
  },
}

// Admin APIs
export const adminAPI = {
  // User Management
  getUsers: async (page = 0, size = 10, search = '', role = '') => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (size) params.append('size', size)
    if (search) params.append('search', search)
    if (role) params.append('role', role)
    
    return apiCall(`/admin/manage-user?${params.toString()}`, {
      method: 'GET',
    })
  },

  createUser: async (name, email, password, role) => {
    return apiCall('/admin/create-user', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    })
  },

  getUser: async (userId) => {
    return apiCall(`/admin/get-user/${userId}`, {
      method: 'GET',
    })
  },

  // Course Management
  getCourses: async (page = 0, size = 10, tutor = '', status = '', course_name = '') => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (size) params.append('size', size)
    if (tutor) params.append('tutor', tutor)
    if (status) params.append('status', status)
    if (course_name) params.append('course_name', course_name)
    
    return apiCall(`/admin/courses?${params.toString()}`, {
      method: 'GET',
    })
  },

  createCourse: async (courseData) => {
    return apiCall('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  },

  // Report Ticket Management
  createReportTicket: async (title, description, ticketStatus = 'OPEN') => {
    return apiCall('/admin/report-tickets', {
      method: 'POST',
      body: JSON.stringify({ title, description, ticketStatus }),
    })
  },

  getReportTickets: async (page = 0, size = 10) => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (size) params.append('size', size)
    
    return apiCall(`/admin/report-tickets?${params.toString()}`, {
      method: 'GET',
    })
  },

  getReportTicketsByStatus: async (status) => {
    return apiCall(`/admin/report-tickets/status/${status}`, {
      method: 'GET',
    })
  },

  updateReportTicket: async (ticketId, status, adminResponse = '') => {
    const params = new URLSearchParams()
    params.append('status', status)
    if (adminResponse) params.append('adminResponse', adminResponse)
    
    return apiCall(`/admin/report-tickets/${ticketId}?${params.toString()}`, {
      method: 'PUT',
    })
  },

  deleteReportTicket: async (ticketId) => {
    return apiCall(`/admin/report-tickets/${ticketId}`, {
      method: 'DELETE',
    })
  },

  // Announcement Management
  sendAnnouncementToAll: async (title, content) => {
    return apiCall('/admin/announcements/send-all', {
      method: 'POST',
      body: JSON.stringify({ title, content, recipientType: 'ALL' }),
    })
  },

  sendAnnouncementToMentee: async (title, content) => {
    return apiCall('/admin/announcements/send-mentee', {
      method: 'POST',
      body: JSON.stringify({ title, content, recipientType: 'MENTEE' }),
    })
  },

  sendAnnouncementToTutor: async (title, content) => {
    return apiCall('/admin/announcements/send-tutor', {
      method: 'POST',
      body: JSON.stringify({ title, content, recipientType: 'TUTOR' }),
    })
  },

  sendAnnouncementToUser: async (userId, title, content) => {
    return apiCall(`/admin/announcements/send-user/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ title, content, recipientUserId: userId }),
    })
  },

  getAnnouncements: async (page = 0, size = 10, recipientType = '', title = '', adminId = '') => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (size) params.append('size', size)
    if (recipientType) params.append('recipientType', recipientType)
    if (title) params.append('title', title)
    if (adminId) params.append('adminId', adminId)
    
    return apiCall(`/admin/announcements?${params.toString()}`, {
      method: 'GET',
    })
  },

  getAnnouncementsByAdmin: async (adminId, page = 0, size = 10) => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('size', size)
    
    return apiCall(`/admin/announcements/admin/${adminId}?${params.toString()}`, {
      method: 'GET',
    })
  },

  deleteAnnouncement: async (announcementId) => {
    return apiCall(`/admin/announcements/${announcementId}`, {
      method: 'DELETE',
    })
  },

  // Analytics Management
  getAllAnalytics: async () => {
    return apiCall('/admin/analytics', {
      method: 'GET',
    })
  },

  getSystemAnalytics: async () => {
    return apiCall('/admin/analytics/system', {
      method: 'GET',
    })
  },

  getStudentAnalytics: async () => {
    return apiCall('/admin/analytics/students', {
      method: 'GET',
    })
  },

  getTutorAnalytics: async () => {
    return apiCall('/admin/analytics/tutors', {
      method: 'GET',
    })
  },
}