import api from '../api/axios'

export const getGalleryItems = (params) =>
    api.get('/api/gallery', { params })

export const getGalleryItemById = (id) =>
    api.get(`/api/gallery/${id}`)

export const uploadGalleryItem = (data) =>
    api.post('/api/gallery', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

export const updateGalleryItem = (id, data) =>
    api.put(`/api/gallery/${id}`, data)

export const deleteGalleryItem = (id) =>
    api.delete(`/api/gallery/${id}`)
