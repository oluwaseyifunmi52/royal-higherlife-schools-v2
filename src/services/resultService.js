import api from '../api/axios'

export const getResults = (params) =>
    api.get('/api/results', { params })

export const getResultById = (id) =>
    api.get(`/api/results/${id}`)

export const createResult = (data) =>
    api.post('/api/results', data)

export const updateResult = (id, data) =>
    api.put(`/api/results/${id}`, data)

export const deleteResult = (id) =>
    api.delete(`/api/results/${id}`)

export const getResultsByStudent = (studentId, params) =>
    api.get(`/api/results/student/${studentId}`, { params })

export const getResultsByClass = (classId, params) =>
    api.get(`/api/results/class/${classId}`, { params })

export const approveResult = (id) =>
    api.patch(`/api/results/${id}/approve`)

export const publishResult = (id) =>
    api.patch(`/api/results/${id}/publish`)

export const enterBatchScores = (data) =>
    api.post('/api/results/batch', data)
