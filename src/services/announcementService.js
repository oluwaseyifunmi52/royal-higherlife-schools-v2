import api from '../api/axios'

export const getAnnouncements = (params) =>
    api.get('/api/announcements', { params })

export const getAnnouncementById = (id) =>
    api.get(`/api/announcements/${id}`)

export const createAnnouncement = (data) =>
    api.post('/api/announcements', data)

export const updateAnnouncement = (id, data) =>
    api.put(`/api/announcements/${id}`, data)

export const deleteAnnouncement = (id) =>
    api.delete(`/api/announcements/${id}`)

export const publishAnnouncement = (id) =>
    api.patch(`/api/announcements/${id}/publish`)
