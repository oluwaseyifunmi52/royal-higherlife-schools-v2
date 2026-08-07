import api from '../api/axios'

export const getLessons = () =>
    api.get('/api/lessons')

export const getLessonById = (id) =>
    api.get(`/api/lessons/${id}`)

export const createLesson = (data) =>
    api.post('/api/lessons', data)

export const updateLesson = (id, data) =>
    api.put(`/api/lessons/${id}`, data)

export const deleteLesson = (id) =>
    api.delete(`/api/lessons/${id}`)

export const markLessonComplete = (id) =>
    api.post(`/api/lessons/${id}/complete`)
