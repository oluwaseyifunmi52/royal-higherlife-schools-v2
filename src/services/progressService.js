import api from '../api/axios'

export const getProgress = () =>
    api.get('/api/progress')

export const getOverallProgress = () =>
    api.get('/api/progress/overall')

export const getStudentClassProgress = (studentId, classId) =>
    api.get(`/api/progress/student/${studentId}/class/${classId}`)
