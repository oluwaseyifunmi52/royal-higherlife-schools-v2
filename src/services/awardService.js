import api from '../api/axios'

export const getAwards = (params) =>
    api.get('/api/awards', { params })

export const getAwardById = (id) =>
    api.get(`/api/awards/${id}`)

export const createAward = (data) =>
    api.post('/api/awards', data)

export const updateAward = (id, data) =>
    api.put(`/api/awards/${id}`, data)

export const deleteAward = (id) =>
    api.delete(`/api/awards/${id}`)

export const getAwardsByStudent = (studentId) =>
    api.get(`/api/awards/student/${studentId}`)

export const approveAward = (id) =>
    api.patch(`/api/awards/${id}/approve`)

export const recommendAward = (data) =>
    api.post('/api/awards/recommend', data)
