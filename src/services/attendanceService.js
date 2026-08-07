import api from '../api/axios'

export const getAttendance = (params) =>
    api.get('/api/attendance', { params })

export const getAttendanceByClass = (classId, params) =>
    api.get(`/api/attendance/class/${classId}`, { params })

export const getAttendanceByStudent = (studentId, params) =>
    api.get(`/api/attendance/student/${studentId}`, { params })

export const markAttendance = (data) =>
    api.post('/api/attendance', data)

export const markBulkAttendance = (data) =>
    api.post('/api/attendance/bulk', data)

export const updateAttendance = (id, data) =>
    api.put(`/api/attendance/${id}`, data)

export const deleteAttendance = (id) =>
    api.delete(`/api/attendance/${id}`)

export const getAttendanceSummary = (params) =>
    api.get('/api/attendance/summary', { params })
