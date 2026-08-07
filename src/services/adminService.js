import api from '../api/axios'

export const getDashboard = () =>
    api.get('/api/admin/dashboard')

export const getUsers = () =>
    api.get('/api/admin/users')

export const getStudentAnalytics = () =>
    api.get('/api/admin/analytics/students')

// Staff management (teachers + bursars)
export const getStaff = (params) =>
    api.get('/api/admin/staff', { params })

export const getPendingStaff = () =>
    api.get('/api/admin/staff/pending')

export const getBursars = () =>
    api.get('/api/admin/bursars')

export const updateStaffStatus = (id, status) =>
    api.patch(`/api/admin/staff/${id}/status`, { status })

export const getStaffMember = (id) =>
    api.get(`/api/admin/staff/${id}`)

export const updateStaff = (id, data) =>
    api.put(`/api/admin/staff/${id}`, data)

export const deleteStaff = (id) =>
    api.delete(`/api/admin/staff/${id}`)

export const getAdminVideos = (params) =>
    api.get('/api/learning-materials', { params })

export const getAdminQuestions = (params) =>
    api.get('/api/questions', { params })

export const getAdminQuizzes = (params) =>
    api.get('/api/quizzes', { params })

export const deleteAdminVideo = (id) =>
    api.delete(`/api/learning-materials/${id}`)

export const deleteAdminQuestion = (id) =>
    api.delete(`/api/questions/${id}`)

export const deleteAdminQuiz = (id) =>
    api.delete(`/api/quizzes/${id}`)

export const updateVideoStatus = (id, status) =>
    api.patch(`/api/learning-materials/${id}/status`, { status })

export const updateQuestionStatus = (id, status) =>
    api.patch(`/api/questions/${id}/status`, { status })

export const updateQuizStatus = (id, status) =>
    api.patch(`/api/quizzes/${id}/status`, { status })

export const getQuizResults = (id) =>
    api.get(`/api/quizzes/${id}/results`)
