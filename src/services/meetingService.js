import api from '../api/axios'

export const getMeetings = () =>
    api.get('/api/meetings')

export const getMeetingById = (id) =>
    api.get(`/api/meetings/${id}`)

export const createMeeting = (data) =>
    api.post('/api/meetings', data)

export const updateMeeting = (id, data) =>
    api.put(`/api/meetings/${id}`, data)

export const deleteMeeting = (id) =>
    api.delete(`/api/meetings/${id}`)
