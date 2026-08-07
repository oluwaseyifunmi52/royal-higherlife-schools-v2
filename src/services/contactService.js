import api from '../api/axios'

export const sendContactMessage = (data) =>
    api.post('/api/admissions', {
        firstName: data.name?.split(' ')[0] || '',
        lastName: data.name?.split(' ').slice(1).join(' ') || '',
        email: data.email,
        classApplyingFor: 'Inquiry',
        academicSession: new Date().getFullYear().toString(),
        previousSchool: 'Contact Form',
        reasonForLeaving: data.message || data.subject || '',
    })
