import api from '../api/axios'

export const getReportCards = () =>
    api.get('/api/report-cards')

export const getReportCardById = (id) =>
    api.get(`/api/report-cards/${id}`)

export const createReportCard = (data) =>
    api.post('/api/report-cards', data)

export const updateReportCard = (id, data) =>
    api.put(`/api/report-cards/${id}`, data)
