import api from '../api/axios'

export const getChildren = () =>
    api.get('/api/parent/children')

export const getChildProgress = (childId) =>
    api.get(`/api/parent/children/${childId}/progress`)

export const getChildReport = (childId) =>
    api.get(`/api/parent/children/${childId}/report`)
