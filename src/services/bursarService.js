import api from '../api/axios'

export const getBursarProfile = () =>
    api.get('/api/bursar/profile')

export const updateBursarProfile = (data) =>
    api.put('/api/bursar/profile', data)
