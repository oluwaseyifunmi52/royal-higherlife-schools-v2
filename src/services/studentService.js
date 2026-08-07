import api from '../api/axios'

export const getStudents = (params) =>
    api.get('/api/students', { params })

export const getStudentById = (id) =>
    api.get('/api/students/' + id)

export const createStudent = (data) =>
    api.post('/api/students', data)

export const updateStudent = (id, data) =>
    api.put('/api/students/' + id, data)

export const deleteStudent = (id) =>
    api.delete('/api/students/' + id)

export const deactivateStudent = (id) =>
    api.patch('/api/students/' + id + '/deactivate')

export const activateStudent = (id) =>
    api.patch('/api/students/' + id + '/activate')

export const assignStudentClass = (id, data) =>
    api.put('/api/students/' + id + '/class', data)

export const assignStudentHouse = (id, data) =>
    api.put('/api/students/' + id + '/house', data)

export const uploadStudentPhoto = (id, data) =>
    api.post('/api/students/' + id + '/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

export const searchStudents = (params) =>
    api.get('/api/students/search', { params })

export const getStudentsByClass = (classId) =>
    api.get('/api/students/class/' + classId)

export const getAdminUsers = (params) =>
    api.get('/api/admin/users', { params })

export const getMyProfile = () =>
    api.get('/api/students/me')

export const updateMyProfile = (data) =>
    api.patch('/api/students/me', data)

export const getMyResults = () =>
    api.get('/api/students/me/results')

export const getMyAttendance = () =>
    api.get('/api/students/me/attendance')

export const getMyPayments = () =>
    api.get('/api/students/me/payments')

export const getMyFees = () =>
    api.get('/api/students/me/fees')

export const getMyAwards = () =>
    api.get('/api/students/me/awards')

export const getMyCertificates = () =>
    api.get('/api/students/me/certificates')

export const getMyAnnouncements = () =>
    api.get('/api/students/me/announcements')

export const getMyMaterials = () =>
    api.get('/api/students/me/materials')

export const getMyAssignments = () =>
    api.get('/api/students/me/assignments')

export const getMyVideos = () =>
    api.get('/api/learning-materials')

export const getMyQuizzes = () =>
    api.get('/api/quizzes')

export const getMyQuizById = (id) =>
    api.get(`/api/quizzes/${id}`)

export const submitMyQuiz = (id, data) =>
    api.post(`/api/quizzes/${id}/submit`, data)

export const getMyQuizResults = () =>
    api.get('/api/quizzes/attempts/all')

export const getMyQuizAttempt = (attemptId) =>
    api.get(`/api/quizzes/attempts/${attemptId}`)

export const getQuizAttemptsByQuiz = (quizId) =>
    api.get(`/api/quizzes/attempts/all?quizId=${quizId}`)

export const getActiveQuizzes = () =>
    api.get('/api/quizzes/student/active')

export const getQuizForTaking = (id) =>
    api.get(`/api/quizzes/${id}/take`)

export const submitQuizAttempt = (id, data) =>
    api.post(`/api/quizzes/${id}/submit`, data)

export const getMyQuizAttempts = () =>
    api.get('/api/quizzes/student/my-attempts')

export const getQuizAttemptResult = (attemptId) =>
    api.get(`/api/quizzes/student/attempts/${attemptId}`)

export const getVideosByClass = (className, subject) =>
    api.get(`/api/learning-materials/class/${className}`, { params: { subject } })

export const askAI = (question) =>
    api.post('/api/ai-study/ask', { question })

export const getAIRateStatus = () =>
    api.get('/api/ai-study/rate-status')
