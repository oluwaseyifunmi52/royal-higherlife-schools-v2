import api from '../api/axios'

export const initiatePayment = (data) =>
    api.post('/api/payments/initiate', data)

export const confirmPayment = (reference) =>
    api.put(`/api/payments/${reference}/confirm`)

export const getMyPayments = (params) =>
    api.get('/api/payments/my', { params })

export const getPaymentStats = (params) =>
    api.get('/api/payments/stats', { params })

export const getAllPayments = (params) =>
    api.get('/api/payments', { params })

export const getPaymentById = (id) =>
    api.get(`/api/payments/${id}`)

export const recordPayment = (data) =>
    api.post('/api/payments', data)

export const updatePayment = (id, data) =>
    api.put(`/api/payments/${id}`, data)

export const reversePayment = (id, data) =>
    api.patch(`/api/payments/${id}/reverse`, data)

export const getStudentPayments = (studentId, params) =>
    api.get(`/api/payments/student/${studentId}`, { params })

export const getStudentFeeSummary = (studentId, params) =>
    api.get(`/api/payments/student/${studentId}/summary`, { params })

export const getPaymentReports = (params) =>
    api.get('/api/payments/reports', { params })

export const getCashReport = (params) =>
    api.get('/api/payments/cash-report', { params })

export const getPaymentDashboardStats = (params) =>
    api.get('/api/payments/dashboard-stats', { params })
