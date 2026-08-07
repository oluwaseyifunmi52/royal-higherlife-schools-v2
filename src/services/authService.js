import api from '../api/axios'

export const loginUser = (credentials) =>
    api.post('/api/auth/login', credentials)

export const studentLogin = (credentials) =>
    api.post('/api/auth/student-login', credentials)

export const setupPassword = (data) =>
    api.post('/api/auth/setup-password', data)

export const getProfile = () =>
    api.get('/api/auth/me')

export const changePassword = (data) =>
    api.put('/api/auth/change-password', data)

export const forgotPassword = (email) =>
    api.post('/api/auth/forgot-password', { email })

export const resetPassword = (token, password) =>
    api.post('/api/auth/reset-password/' + token, { password })

// Teacher self-registration (account is created then awaits admin approval)
export const teacherSignup = (data) =>
    api.post('/api/auth/teacher-signup', data)

// Bursar self-registration (account is created then awaits admin approval)
export const bursarSignup = (data) =>
    api.post('/api/auth/bursar-signup', data)

// Secure admin registration (requires ADMIN_SETUP_CODE known to the school)
export const adminRegister = (data) =>
    api.post('/api/auth/admin-register', data)

export const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}
