import api from '../api/axios'

export const getTeachers = (params) =>
    api.get('/api/teachers', { params })

export const getTeacherById = (id) =>
    api.get('/api/teachers/' + id)

export const createTeacher = (data) =>
    api.post('/api/teachers', data)

export const updateTeacher = (id, data) =>
    api.put('/api/teachers/' + id, data)

export const deleteTeacher = (id) =>
    api.delete('/api/teachers/' + id)

export const deactivateTeacher = (id) =>
    api.patch('/api/teachers/' + id + '/deactivate')

export const activateTeacher = (id) =>
    api.patch('/api/teachers/' + id + '/activate')

export const assignTeacherClass = (id, data) =>
    api.put('/api/teachers/' + id + '/class', data)

export const assignTeacherSubjects = (id, data) =>
    api.put('/api/teachers/' + id + '/subjects', data)

export const getMyAssignedClasses = () =>
    api.get('/api/teachers/my-classes')

export const getMyAssignedStudents = () =>
    api.get('/api/teachers/my-students')

export const getMyProfile = () =>
    api.get('/api/teachers/profile')

export const updateMyProfile = (data) =>
    api.patch('/api/teachers/profile', data)

export const uploadProfilePhoto = (formData) =>
    api.post('/api/teachers/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

export const approveTeacherProfile = (id) =>
    api.patch('/api/teachers/' + id + '/approve')

export const rejectTeacherProfile = (id) =>
    api.patch('/api/teachers/' + id + '/reject')

export const getPendingTeachers = () =>
    api.get('/api/admin/teachers/pending')

export const getPublicTeachers = () =>
    api.get('/api/teachers/public')

export const getPublicTeacherById = (id) =>
    api.get('/api/teachers/public/' + id)

export const getMySubjects = () =>
    api.get('/api/teachers/my-subjects')

export const getMyVideos = () =>
    api.get('/api/learning-materials')

export const createVideo = (data) =>
    api.post('/api/learning-materials', data)

export const updateVideo = (id, data) =>
    api.put(`/api/learning-materials/${id}`, data)

export const deleteVideo = (id) =>
    api.delete(`/api/learning-materials/${id}`)

export const getMyQuestions = () =>
    api.get('/api/questions')

export const createQuestion = (data) =>
    api.post('/api/questions', data)

export const updateQuestion = (id, data) =>
    api.put(`/api/questions/${id}`, data)

export const deleteQuestion = (id) =>
    api.delete(`/api/questions/${id}`)

export const getQuestionById = (id) =>
    api.get(`/api/questions/${id}`)

export const publishVideo = (id, status) =>
    api.patch(`/api/learning-materials/${id}/status`, { status })

export const getMyQuizzes = () =>
    api.get('/api/quizzes')

export const createQuiz = (data) =>
    api.post('/api/quizzes', data)

export const updateQuiz = (id, data) =>
    api.put(`/api/quizzes/${id}`, data)

export const deleteQuiz = (id) =>
    api.delete(`/api/quizzes/${id}`)

export const publishQuiz = (id, status) =>
    api.patch(`/api/quizzes/${id}/status`, { status })

export const getQuizResults = (id) =>
    api.get(`/api/quizzes/${id}/results`)

export const getQuizAttempt = (attemptId) =>
    api.get(`/api/quizzes/attempts/${attemptId}`)

export const gradeQuizAttempt = (attemptId, data) =>
    api.patch(`/api/quizzes/attempts/${attemptId}/grade`, data)
