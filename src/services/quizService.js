import api from '../api/axios'

export const getQuizzes = () =>
    api.get('/api/quizzes')

export const getQuizById = (id) =>
    api.get(`/api/quizzes/${id}`)

export const createQuiz = (data) =>
    api.post('/api/quizzes', data)

export const updateQuiz = (id, data) =>
    api.put(`/api/quizzes/${id}`, data)

export const deleteQuiz = (id) =>
    api.delete(`/api/quizzes/${id}`)

export const submitQuiz = (id, data) =>
    api.post(`/api/quizzes/${id}/submit`, data)

export const publishQuiz = (id) =>
    api.patch(`/api/quizzes/${id}/publish`)

export const unpublishQuiz = (id) =>
    api.patch(`/api/quizzes/${id}/unpublish`)

export const getAllAttempts = () =>
    api.get('/api/quizzes/attempts/all')
