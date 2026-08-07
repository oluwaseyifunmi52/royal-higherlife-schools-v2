import api from '../api/axios'

export const getResources = () =>
    api.get('/api/resources')

export const getResourceById = (id) =>
    api.get(`/api/resources/${id}`)

export const createResource = (data) =>
    api.post('/api/resources', data)

export const deleteResource = (id) =>
    api.delete(`/api/resources/${id}`)
