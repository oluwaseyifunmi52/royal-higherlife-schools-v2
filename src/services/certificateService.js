import api from '../api/axios'

export const getCertificates = (params) =>
    api.get('/api/certificates', { params })

export const getCertificateById = (id) =>
    api.get(`/api/certificates/${id}`)

export const generateCertificate = (data) =>
    api.post('/api/certificates', data)

export const updateCertificate = (id, data) =>
    api.put(`/api/certificates/${id}`, data)

export const deleteCertificate = (id) =>
    api.delete(`/api/certificates/${id}`)

export const verifyCertificate = (certificateNumber) =>
    api.get(`/api/certificates/verify/${certificateNumber}`)

export const downloadCertificate = (id) =>
    api.get(`/api/certificates/${id}/download`, { responseType: 'blob' })
