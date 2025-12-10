// API Base URL - thay đổi theo backend của bạn
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

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
  getSubjectRegistrations: async () => {
    return apiCall('/admin/subject-registrations', {
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

  getUserById: async (id) => {
    return apiCall(`/admin/get-user/${id}`, {
      method: 'GET',
    })
  },

  getCourseById: async (id) => {
    return apiCall(`/admin/courses/${id}`, {
      method: 'GET',
    })
  },

  updateCourse: async (id, payload) => {
    return apiCall(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  createCourse: async (courseData) => {
    return apiCall('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  },

  // Report Ticket Management
  createReportTicket: async (title, description, status = 'OPEN') => {
    return apiCall('/admin/report-tickets', {
      method: 'POST',
      body: JSON.stringify({ title, description, status }),
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

  getEnrollmentCounts: async (courseId) => {
    return apiCall(`/admin/courses/${courseId}/enrollments/stats`, {
      method: 'GET',
    })
  },
  ApproveEnrollments: async (courseId) => {
    return apiCall(`/admin/courses/${courseId}/enrollments/approve`, {
      method: 'POST',
    })
  },
}

export const menteeAPI = {
  // =============================
  // LẤY THÔNG TIN MENTEE
  // =============================
  getProfile: async (id) => {
    return apiCall(`/mentee/${id}`, {
      method: 'GET',
    })
  },

  // =============================
  // ĐĂNG KÝ KHÓA HỌC
  // =============================
  enrollCourse: async (courseId) => {
    return apiCall('/mentee/enroll', {
      method: 'POST',
      body: JSON.stringify({courseId}),
    })
  },

  unenrollCourse: async (courseId) => {
    return apiCall('/mentee/unenroll', {
      method: 'POST',
      body: JSON.stringify({courseId}),
    })
  },

  // =============================
  // LẤY DANH SÁCH KHÓA HỌC CỦA MENTEE
  // =============================
  getMyCourses: async () => {
    return apiCall('/mentee/mycourses', {
      method: 'GET',
    })
  },
  getMyEnrollCourses: async () => {
    return apiCall('/mentee/myenrollcourses', {
      method: 'GET',
    })
  },

  getCourses: async (page = 0, size = 10, tutor = '', status = '', course_name = '') => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (size) params.append('size', size)
    if (tutor) params.append('tutor', tutor)
    if (status) params.append('status', status)
    if (course_name) params.append('course_name', course_name)
    
    return apiCall(`/mentee/courses?${params.toString()}`, {
      method: 'GET',
    })
  },


  // =============================
  // XEM CHI TIẾT KHÓA HỌC
  // =============================
  getCourseDetail: async (courseId) => {
    return apiCall(`/mentee/courses/${courseId}`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY DANH SÁCH BÀI GIẢNG
  // =============================
  getLessons: async (courseId) => {
    return apiCall(`/mentee/course/${courseId}/lessons`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY CHI TIẾT MỘT BÀI GIẢNG
  // =============================
  getLesson: async (lessonId) => {
    return apiCall(`/mentee/lesson/${lessonId}`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY RESOURCES TRONG BÀI GIẢNG
  // =============================
  getResources: async (lessonId) => {
    return apiCall(`/mentee/lesson/${lessonId}/resources`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY EXERCISES TRONG BÀI GIẢNG
  // =============================
  getExercises: async (lessonId) => {
    return apiCall(`/mentee/lesson/${lessonId}/exercises`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY CHI TIẾT MỘT EXERCISE
  // =============================
  getExerciseDetail: async (exerciseId) => {
    return apiCall(`/mentee/exercise/${exerciseId}`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY SUBMISSIONS CỦA EXERCISE
  // =============================
  getSubmissions: async (exerciseId) => {
    return apiCall(`/mentee/exercise/${exerciseId}/submissions`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY TÀI NGUYÊN TRONG BÀI GIẢNG
  // =============================
  getResources: async (lessonId) => {
    return apiCall(`/mentee/lesson/${lessonId}/resources`, {
      method: 'GET',
    })
  },

  // =============================
  // NỘP BÀI
  // =============================
  submitExercise: async (exerciseId, submissionData) => {
    return apiCall(`/mentee/exercise/${exerciseId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    })
  },

  // =============================
  // LẤY LỊCH HỌC (SESSIONS)
  // =============================
  getSessions: async (courseId) => {
    return apiCall(`/mentee/course/${courseId}/sessions`, {
      method: 'GET',
    })
  },

  getSessionDetail: async (sessionId) => {
    return apiCall(`/mentee/course/sessions/${sessionId}`, {
      method: 'GET',
    })
  },

  // =============================
  // ĐÁNH GIÁ BUỔI HỌC
  // =============================
  rateSession: async (sessionId, score, comment) => {
    return apiCall(`/mentee/session/${sessionId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ score, comment }),
    })
  },

  // =============================
  // LẤY RATING CỦA MENTEE
  // =============================
  getMyRatings: async () => {
    return apiCall('/mentee/ratings', {
      method: 'GET',
    })
  },

  // =============================
  // LẤY QUESTION (FORUM)
  // =============================
  getMyQuestions: async () => {
    return apiCall('/mentee/questions', {
      method: 'GET',
    })
  },

  getQuestionsByForum: async (forumId) => {
    return apiCall(`/mentee/forum/${forumId}/questions`, {
      method: 'GET',
    })
  },

  createForum: async (sessionId) => {
    return apiCall(`/mentee/forum/${sessionId}`, {
      method: 'POST',
    })
  },

  // =============================
  // TẠO CÂU HỎI
  // =============================
  askQuestion: async (forumId, content) => {
    return apiCall(`/mentee/forum/${forumId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },

  // =============================
  // LẤY CONVERSATION
  // =============================
  getMyConversations: async (menteeId) => {
    return apiCall(`/mentee/${menteeId}/conversations`, {
      method: 'GET',
    })
  },

  // =============================
  // LẤY MESSAGES TRONG CONVERSATION
  // =============================
  getMessages: async (menteeId, conversationId) => {
    return apiCall(`/mentee/${menteeId}/conversation/${conversationId}/messages`, {
      method: 'GET',
    })
  },

  // =============================
  // GỬI MESSAGE
  // =============================
  sendMessage: async (menteeId, conversationId, receiverId, content) => {
    return apiCall(`/mentee/${menteeId}/conversation/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    })
  },

  // =============================
  // REPORT TICKETS
  // =============================
  createReportTicket: async (title, description) => {
    return apiCall('/mentee/report-tickets', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    })
  },

  getMyReportTickets: async () => {
    
    return apiCall(`/mentee/report-tickets`, {
      method: 'GET',
    })
  },
}


// Tutor APIs
export const tutorAPI = {
  // =============================
  // COURSE MANAGEMENT
  // =============================

  // Lấy khóa học của chính tutor
  getMyCourses: async () => {
    return apiCall('/tutors/courses/my', { method: 'GET' })
  },

  // Tạo khóa học mới
  createCourse: async (courseData) => {
    return apiCall('/tutors/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  },

  // Lấy chi tiết 1 khóa học
  getCourseById: async (courseId) => {
    return apiCall(`/tutors/courses/${courseId}`, { method: 'GET' })
  },

  // Lấy danh sách mentee trong khóa học
  getMenteesInCourse: async (courseId, page = 0, size = 10) => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('size', size)

    return apiCall(`/tutors/courses/${courseId}/mentees?${params.toString()}`, {
      method: 'GET',
    })
  },

  // =============================
  // EXERCISE MANAGEMENT
  // =============================

  createExercise: async (exerciseData) => {
    return apiCall('/tutors/exercises', {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    })
  },

  deleteExercise: async (exerciseId) => {
    return apiCall(`/tutors/exercises/${exerciseId}`, {
      method: 'DELETE',
    })
  },

  getExerciseDetail: async (exerciseId) => {
    return apiCall(`/tutors/exercises/${exerciseId}`, {
      method: 'GET',
    })
  },

  // =============================
  // SUBMISSION MANAGEMENT
  // =============================

  getSubmissions: async (exerciseId, page = 0, size = 10) => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('size', size)

    return apiCall(`/tutors/exercises/${exerciseId}/submissions?${params.toString()}`, {
      method: 'GET',
    })
  },

  gradeSubmission: async (submissionId, grade) => {
    return apiCall('/tutors/submission', {
      method: 'POST',
      body: JSON.stringify({ id: submissionId, grade }),
    })
  },

  // =============================
  // RATING MANAGEMENT
  // =============================

  getRatings: async (sessionId, page = 0, size = 10) => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('size', size)

    return apiCall(`/tutors/sessions/${sessionId}/ratings?${params.toString()}`, {
      method: 'GET',
    })
  },

  replyRating: async (ratingId, reply) => {
    return apiCall(`/tutors/ratings/${ratingId}/reply?reply=${encodeURIComponent(reply)}`, {
      method: 'PUT',
    })
  },

  reportRating: async (ratingId, title, description) => {
    return apiCall(`/tutors/ratings/${ratingId}/report`, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    })
  },

  // =============================
  // CONVERSATION & MESSAGING
  // =============================

  joinConversation: async (menteeId, tutorId) => {
    const params = new URLSearchParams()
    params.append('menteeId', menteeId)
    params.append('tutorId', tutorId)

    return apiCall(`/tutors/conversations/join?${params.toString()}`, {
      method: 'POST',
    })
  },

  sendMessage: async (conversationId, senderId, content) => {
    return apiCall(`/tutors/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ senderId, content }),
    })
  },

  // =============================
  // SUBJECT REGISTRATION
  // =============================

  getAvailableSubjects: async () => {
    return apiCall('/tutors/subjects', {
      method: 'GET',
    })
  },

  getSubjectRegistrations: async () => {
    return apiCall('/tutors/subject-registrations', {
      method: 'GET',
    })
  },

  createSubjectRegistration: async (payload) => {
    return apiCall('/tutors/subject-registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  // =============================
  // LESSON MANAGEMENT
  // =============================

  // Lấy tất cả bài giảng trong khóa học
  getLessonsByCourseId: async (courseId) => {
    return apiCall(`/tutors/lessons/courses/${courseId}`, { method: 'GET' })
  },

  // Lấy bài giảng cụ thể theo courseId + lessonId
  getLessonDetail: async (courseId, lessonId) => {
    return apiCall(`/tutors/lessons/courses/${courseId}/lessons/${lessonId}`, {
      method: 'GET',
    })
  },

  // Tạo bài học mới
  createLesson: async (lessonData) => {
    return apiCall('/tutors/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    })
  },

  // Cập nhật bài học
  updateLesson: async (lessonId, lessonData) => {
    return apiCall(`/tutors/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    })
  },

  // =============================
  // SESSION MANAGEMENT
  // =============================

  // Lấy tất cả phiên học trong khóa học
  getSessionsByCourseId: async (courseId) => {
    return apiCall(`/tutors/course/${courseId}/sessions`, { method: 'GET' })
  },

  // Lấy chi tiết phiên học
  getSessionDetail: async (sessionId) => {
    return apiCall(`/tutors/course/sessions/${sessionId}`, {
      method: 'GET',
    })
  },

  // Tạo phiên học mới
  createSession: async (courseId, sessionData) => {
    return apiCall(`/tutors/course/${courseId}/sessions`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  },

  // Cập nhật phiên học
  updateSession: async (courseId, sessionData) => {
    return apiCall(`/tutors/course/${courseId}/sessions`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    })
  },

  // =============================
  // ANNOUNCEMENT
  // =============================

  getAnnouncements: async (page = 0, size = 10, recipientType = '', title = '', adminId = '') => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('size', size)
    if (recipientType) params.append('recipientType', recipientType)
    if (title) params.append('title', title)
    if (adminId) params.append('adminId', adminId)

    return apiCall(`/tutors/announcements?${params.toString()}`, { method: 'GET' })
  },

  getAnnouncementsByAdmin: async (adminId, page = 0, size = 10) => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('size', size)

    return apiCall(`/tutors/announcements/admin/${adminId}?${params.toString()}`, {
      method: 'GET',
    })
  },

  // =============================
  // FORUM MANAGEMENT
  // =============================

  createForum: async (sessionId) => {
    return apiCall(`/tutors/forum/${sessionId}`, {
      method: 'POST',
    })
  },

  getQuestionsByForum: async (forumId) => {
    return apiCall(`/tutors/forum/${forumId}/questions`, {
      method: 'GET',
    })
  },

  getSessionDetail: async (sessionId) => {
    return apiCall(`/tutors/course/sessions/${sessionId}`, {
      method: 'GET',
    })
  },

  askQuestion: async (forumId, content) => {
    return apiCall(`/tutors/forum/${forumId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },

  answerQuestion: async (questionId, answer) => {
    return apiCall(`/tutors/forum/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(answer),
    })
  },

  // =============================
  // RESOURCE MANAGEMENT
  // =============================

  getResources: async (lessonId) => {
    return apiCall(`/tutors/lesson/${lessonId}/resources`, {
      method: 'GET',
    })
  },

  createResource: async (resourceData) => {
    return apiCall('/tutors/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    })
  },

  updateResource: async (resourceId, resourceData) => {
    return apiCall(`/tutors/resources/${resourceId}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    })
  },

  deleteResource: async (resourceId) => {
    return apiCall(`/tutors/resources/${resourceId}`, {
      method: 'DELETE',
    })
  },

  // =============================
  // EXERCISE MANAGEMENT (Additional)
  // =============================

  getExercises: async (lessonId) => {
    return apiCall(`/tutors/lesson/${lessonId}/exercises`, {
      method: 'GET',
    })
  },

  getMyExercises: async () => {
    return apiCall('/tutors/myexercises', {
      method: 'GET',
    })
  },

  getMyResources: async () => {
    return apiCall('/tutors/myresources', {
      method: 'GET',
    })
  },
}


