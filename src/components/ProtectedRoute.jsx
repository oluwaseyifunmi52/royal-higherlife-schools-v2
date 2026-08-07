import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleRoutes = {
    student: '/student/dashboard',
    teacher: '/teacher/dashboard',
    bursar: '/bursar/dashboard',
    parent: '/parent/dashboard',
    admin: '/admin/dashboard',
}

export default function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={roleRoutes[user.role] || '/'} replace />
    }

    return <Outlet />
}
