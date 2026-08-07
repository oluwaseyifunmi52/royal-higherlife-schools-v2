import api from '../api/axios'

export const getAssignments = () =>
    api.get('/api/assignments')

export const getAssignmentById = (id) =>
    api.get(`/api/assignments/${id}`)

export const createAssignment = (data) =>
    api.post('/api/assignments', data)

export const updateAssignment = (id, data) =>
    api.put(`/api/assignments/${id}`, data)

export const deleteAssignment = (id) =>
    api.delete(`/api/assignments/${id}`)

export const submitAssignment = (id, data) =>
    api.post(`/api/assignments/${id}/submit`, data)

export const getSubmissions = (assignmentId) =>
    api.get(`/api/assignments/${assignmentId}/submissions`)

export const reviewSubmission = (id, data) =>
    api.put(`/api/assignments/submissions/${id}/review`, data)
