import api from '../api/axios'

export const getSubjects = (params) =>
    api.get('/api/subjects', { params })

export const getSubjectById = (id) =>
    api.get(`/api/subjects/${id}`)

export const createSubject = (data) =>
    api.post('/api/subjects', data)

export const updateSubject = (id, data) =>
    api.put(`/api/subjects/${id}`, data)

export const deleteSubject = (id) =>
    api.delete(`/api/subjects/${id}`)

export const assignSubjectToTeacher = (id, data) =>
    api.put(`/api/subjects/${id}/assign-teacher`, data)

export const assignSubjectToClass = (id, data) =>
    api.put(`/api/subjects/${id}/assign-class`, data)

export const getSubjectsByClass = (classId) =>
    api.get(`/api/subjects/class/${classId}`)

export const getSubjectsByTeacher = (teacherId) =>
    api.get(`/api/subjects/teacher/${teacherId}`)
