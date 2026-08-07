import api from '../api/axios'

export const getFees = () =>
    api.get('/api/fees')

export const getFeesByClass = (classId) =>
    api.get(`/api/fees/class/${classId}`)

export const getFeeById = (id) =>
    api.get(`/api/fees/${id}`)

export const createFee = (data) =>
    api.post('/api/fees', data)

export const updateFee = (id, data) =>
    api.put(`/api/fees/${id}`, data)

export const deleteFee = (id) =>
    api.delete(`/api/fees/${id}`)
