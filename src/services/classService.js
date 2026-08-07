import api from '../api/axios'

export const getClasses = () =>
    api.get('/api/classes')

export const getClassById = (id) =>
    api.get(`/api/classes/${id}`)

export const createClass = (data) =>
    api.post('/api/classes', data)

export const updateClass = (id, data) =>
    api.put(`/api/classes/${id}`, data)

export const deleteClass = (id) =>
    api.delete(`/api/classes/${id}`)

export const enrollStudent = (classId, data) =>
    api.post(`/api/classes/${classId}/enroll`, data)
