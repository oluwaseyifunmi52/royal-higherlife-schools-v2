import api from '../api/axios'

export const submitAdmission = (data) =>
    api.post('/api/admissions', { ...data, schoolSection: data.schoolSection })

export const getAdmissions = () =>
    api.get('/api/admissions')

export const getAdmissionById = (id) =>
    api.get(`/api/admissions/${id}`)

export const approveAdmission = (id) =>
    api.put(`/api/admissions/${id}/approve`)

export const rejectAdmission = (id) =>
    api.put(`/api/admissions/${id}/reject`)
