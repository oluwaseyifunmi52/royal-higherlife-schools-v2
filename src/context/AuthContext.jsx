import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginUser, studentLogin, getProfile, logoutUser, teacherSignup, adminRegister } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const response = await loginUser({ email, password })
        const { token, user: userData } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return userData
    }

    const loginAsStudent = async (admissionNumber, password) => {
        const response = await studentLogin({ admissionNumber, password })
        const { token, user: userData, mustChangePassword } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return { ...userData, mustChangePassword }
    }

    // Teacher self-registration: account is pending admin approval, so we do NOT log in.
    // Returns the API response so the page can show the appropriate message.
    const registerTeacher = async (data) => {
        const response = await teacherSignup(data)
        return response.data
    }

    // Admin registration: account is active (gated by setup code on the backend).
    // Auto-log the newly created admin in.
    const registerAdmin = async (data) => {
        const response = await adminRegister(data)
        const { token, user: userData } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return userData
    }

    const refreshUser = async () => {
        try {
            const response = await getProfile()
            const userData = response.data.user || response.data
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)
            return userData
        } catch {
            logout()
        }
    }

    const logout = () => {
        logoutUser()
        setUser(null)
    }

    const value = useMemo(
        () => ({ user, setUser, login, loginAsStudent, registerTeacher, registerAdmin, logout, refreshUser, loading }),
        [user, loading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}
