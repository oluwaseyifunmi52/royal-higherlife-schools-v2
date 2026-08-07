import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CLASS_CATEGORIES } from '../../config/classes'

const steps = [
    'Student Information',
    'Admission Details',
    'Parent / Guardian',
    'Emergency & Medical',
    'Documents & Academic History',
    'Interests & Agreement',
]

const initialForm = {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    age: '',
    placeOfBirth: '',
    nationality: '',
    state: '',
    lga: '',
    homeAddress: '',
    residentialAddress: '',
    religion: '',
    bloodGroup: '',
    genotype: '',
    languages: '',
    classApplyingFor: '',
    schoolSection: '',
    academicSession: '',
    boardingStatus: '',
    previousSchool: '',
    previousSchoolAddress: '',
    currentClass: '',
    reasonForLeaving: '',
    transferStudent: 'No',
    fatherName: '',
    fatherOccupation: '',
    fatherCompany: '',
    fatherPhone: '',
    fatherWhatsapp: '',
    fatherEmail: '',
    fatherAddress: '',
    motherName: '',
    motherOccupation: '',
    motherCompany: '',
    motherPhone: '',
    motherWhatsapp: '',
    motherEmail: '',
    motherAddress: '',
    guardianName: '',
    guardianRelationship: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    emergencyAltPhone: '',
    allergies: '',
    medicalConditions: '',
    disabilities: '',
    medication: '',
    specialNeeds: '',
    doctorName: '',
    hospital: '',
    medicalNotes: '',
    yearsAttended: '',
    currentGrade: '',
    subjectsStudied: '',
    averagePerformance: '',
    awards: '',
    extracurricular: '',
    interests: [],
    certifyInfo: false,
    agreeRules: false,
    consent: false,
}

const interestOptions = [
    'Football', 'Basketball', 'Athletics', 'Music', 'Dance', 'Drama',
    'Coding', 'Robotics', 'Chess', 'Debate', 'Reading', 'Art', 'Science Club',
]

export default function AdmissionForm() {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })

    const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step])

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleInterestToggle = (interest) => {
        setForm((current) => ({
            ...current,
            interests: current.interests.includes(interest)
                ? current.interests.filter((item) => item !== interest)
                : [...current.interests, interest],
        }))
    }

    const nextStep = () => setStep((current) => Math.min(current + 1, steps.length - 1))
    const prevStep = () => setStep((current) => Math.max(current - 1, 0))

    const handleSubmit = async () => {
        setLoading(true)
        setStatus({ type: '', message: '' })
        try {
            const api = (await import('../../api/axios')).default
            await api.post('/api/admissions', {
                firstName: form.firstName,
                middleName: form.middleName,
                lastName: form.lastName,
                gender: form.gender,
                dateOfBirth: form.dob,
                age: form.age,
                placeOfBirth: form.placeOfBirth,
                nationality: form.nationality,
                stateOfOrigin: form.state,
                lga: form.lga,
                homeAddress: form.homeAddress,
                residentialAddress: form.residentialAddress,
                religion: form.religion,
                bloodGroup: form.bloodGroup,
                genotype: form.genotype,
                languages: form.languages,
                classApplyingFor: form.classApplyingFor,
                schoolSection: form.schoolSection,
                academicSession: form.academicSession,
                boardingStatus: form.boardingStatus,
                previousSchool: form.previousSchool,
                previousSchoolAddress: form.previousSchoolAddress,
                currentClass: form.currentClass,
                reasonForLeaving: form.reasonForLeaving,
                transferStudent: form.transferStudent,
                parents: {
                    father: {
                        name: form.fatherName,
                        occupation: form.fatherOccupation,
                        company: form.fatherCompany,
                        phone: form.fatherPhone,
                        whatsapp: form.fatherWhatsapp,
                        email: form.fatherEmail,
                        address: form.fatherAddress,
                    },
                    mother: {
                        name: form.motherName,
                        occupation: form.motherOccupation,
                        company: form.motherCompany,
                        phone: form.motherPhone,
                        whatsapp: form.motherWhatsapp,
                        email: form.motherEmail,
                        address: form.motherAddress,
                    },
                    guardian: {
                        name: form.guardianName,
                        relationship: form.guardianRelationship,
                        phone: form.guardianPhone,
                        email: form.guardianEmail,
                        address: form.guardianAddress,
                    },
                },
                emergency: {
                    name: form.emergencyName,
                    relationship: form.emergencyRelationship,
                    phone: form.emergencyPhone,
                    altPhone: form.emergencyAltPhone,
                },
                medical: {
                    allergies: form.allergies,
                    conditions: form.medicalConditions,
                    disabilities: form.disabilities,
                    medication: form.medication,
                    specialNeeds: form.specialNeeds,
                    doctorName: form.doctorName,
                    hospital: form.hospital,
                    notes: form.medicalNotes,
                },
                academicHistory: {
                    yearsAttended: form.yearsAttended,
                    currentGrade: form.currentGrade,
                    subjectsStudied: form.subjectsStudied,
                    averagePerformance: form.averagePerformance,
                    awards: form.awards,
                    extracurricular: form.extracurricular,
                },
                interests: form.interests,
                certifications: {
                    certifyInfo: form.certifyInfo,
                    agreeRules: form.agreeRules,
                    consent: form.consent,
                },
            })
            setStatus({ type: 'success', message: 'Admission application submitted successfully! We will contact you soon.' })
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Submission failed. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Student Information</label>
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle Name" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
                        <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="gender" value={form.gender} onChange={handleChange}>
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="dob" value={form.dob} onChange={handleChange} type="date" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="age" value={form.age} onChange={handleChange} placeholder="Age" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} placeholder="Place of Birth" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="state" value={form.state} onChange={handleChange} placeholder="State of Origin" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="lga" value={form.lga} onChange={handleChange} placeholder="LGA" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="homeAddress" value={form.homeAddress} onChange={handleChange} placeholder="Home Address" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="residentialAddress" value={form.residentialAddress} onChange={handleChange} placeholder="Residential Address" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="religion" value={form.religion} onChange={handleChange} placeholder="Religion" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="Blood Group" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="genotype" value={form.genotype} onChange={handleChange} placeholder="Genotype" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="languages" value={form.languages} onChange={handleChange} placeholder="Languages Spoken" />
                    </div>
                )
            case 1:
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Admission Details</label>
                        <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="schoolSection" value={form.schoolSection} onChange={handleChange}>
                            <option value="">School Section</option>
                            {Object.keys(CLASS_CATEGORIES).map((section) => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                        <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="classApplyingFor" value={form.classApplyingFor} onChange={handleChange} disabled={!form.schoolSection}>
                            <option value="">Class Applying For</option>
                            {(form.schoolSection ? CLASS_CATEGORIES[form.schoolSection] : []).map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="academicSession" value={form.academicSession} onChange={handleChange} placeholder="Academic Session" />
                        <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="boardingStatus" value={form.boardingStatus} onChange={handleChange}>
                            <option value="">Boarding or Day Student</option>
                            <option value="Day">Day</option>
                            <option value="Boarding">Boarding</option>
                        </select>
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="previousSchool" value={form.previousSchool} onChange={handleChange} placeholder="Previous School Name" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="previousSchoolAddress" value={form.previousSchoolAddress} onChange={handleChange} placeholder="Previous School Address" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="currentClass" value={form.currentClass} onChange={handleChange} placeholder="Current Class" />
                        <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="transferStudent" value={form.transferStudent} onChange={handleChange}>
                            <option value="No">Transfer Student? No</option>
                            <option value="Yes">Transfer Student? Yes</option>
                        </select>
                        <textarea className="min-h-[120px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="reasonForLeaving" value={form.reasonForLeaving} onChange={handleChange} placeholder="Reason for Leaving Previous School" />
                    </div>
                )
            case 2:
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Parent / Guardian Information</label>
                        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                            <h3 className="text-lg font-semibold text-white">Father</h3>
                            <div className="mt-3 grid gap-4 md:grid-cols-2">
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Full Name" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} placeholder="Occupation" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="fatherCompany" value={form.fatherCompany} onChange={handleChange} placeholder="Company" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="fatherPhone" value={form.fatherPhone} onChange={handleChange} placeholder="Phone Number" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="fatherWhatsapp" value={form.fatherWhatsapp} onChange={handleChange} placeholder="WhatsApp Number" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="fatherEmail" value={form.fatherEmail} onChange={handleChange} placeholder="Email Address" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="fatherAddress" value={form.fatherAddress} onChange={handleChange} placeholder="Home Address" />
                            </div>
                        </div>
                        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                            <h3 className="text-lg font-semibold text-white">Mother</h3>
                            <div className="mt-3 grid gap-4 md:grid-cols-2">
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="motherName" value={form.motherName} onChange={handleChange} placeholder="Full Name" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="motherOccupation" value={form.motherOccupation} onChange={handleChange} placeholder="Occupation" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="motherCompany" value={form.motherCompany} onChange={handleChange} placeholder="Company" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="motherPhone" value={form.motherPhone} onChange={handleChange} placeholder="Phone Number" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="motherWhatsapp" value={form.motherWhatsapp} onChange={handleChange} placeholder="WhatsApp Number" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="motherEmail" value={form.motherEmail} onChange={handleChange} placeholder="Email Address" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="motherAddress" value={form.motherAddress} onChange={handleChange} placeholder="Home Address" />
                            </div>
                        </div>
                        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                            <h3 className="text-lg font-semibold text-white">Guardian (Optional)</h3>
                            <div className="mt-3 grid gap-4 md:grid-cols-2">
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="Full Name" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="guardianRelationship" value={form.guardianRelationship} onChange={handleChange} placeholder="Relationship" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="guardianPhone" value={form.guardianPhone} onChange={handleChange} placeholder="Phone Number" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="guardianEmail" value={form.guardianEmail} onChange={handleChange} placeholder="Email" />
                                <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="guardianAddress" value={form.guardianAddress} onChange={handleChange} placeholder="Address" />
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Emergency & Medical Information</label>
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="Contact Name" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="emergencyRelationship" value={form.emergencyRelationship} onChange={handleChange} placeholder="Relationship" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="Phone Number" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="emergencyAltPhone" value={form.emergencyAltPhone} onChange={handleChange} placeholder="Alternate Phone Number" />
                        <textarea className="min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="allergies" value={form.allergies} onChange={handleChange} placeholder="Any Allergies" />
                        <textarea className="min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="medicalConditions" value={form.medicalConditions} onChange={handleChange} placeholder="Medical Conditions" />
                        <textarea className="min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="disabilities" value={form.disabilities} onChange={handleChange} placeholder="Physical Disabilities" />
                        <textarea className="min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="medication" value={form.medication} onChange={handleChange} placeholder="Current Medication" />
                        <textarea className="min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="specialNeeds" value={form.specialNeeds} onChange={handleChange} placeholder="Special Needs" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="Doctor's Name" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="hospital" value={form.hospital} onChange={handleChange} placeholder="Hospital" />
                        <textarea className="min-h-[100px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="medicalNotes" value={form.medicalNotes} onChange={handleChange} placeholder="Emergency Medical Notes" />
                    </div>
                )
            case 4:
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="md:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Documents & Academic History</label>
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="yearsAttended" value={form.yearsAttended} onChange={handleChange} placeholder="Years Attended" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="currentGrade" value={form.currentGrade} onChange={handleChange} placeholder="Current Grade" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="subjectsStudied" value={form.subjectsStudied} onChange={handleChange} placeholder="Subjects Studied" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="averagePerformance" value={form.averagePerformance} onChange={handleChange} placeholder="Average Performance" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" name="awards" value={form.awards} onChange={handleChange} placeholder="Awards Received" />
                        <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" name="extracurricular" value={form.extracurricular} onChange={handleChange} placeholder="Extracurricular Activities" />
                    </div>
                )
            case 5:
                return (
                    <div className="grid gap-4">
                        <label className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Student Interests & Agreement</label>
                        <div className="grid gap-3 md:grid-cols-2">
                            {interestOptions.map((interest) => (
                                <label key={interest} className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                                    <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => handleInterestToggle(interest)} />
                                    <span>{interest}</span>
                                </label>
                            ))}
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                            <label className="flex items-start gap-3 text-sm text-slate-300">
                                <input type="checkbox" name="certifyInfo" checked={form.certifyInfo} onChange={handleChange} />
                                <span>I certify that the information provided is correct.</span>
                            </label>
                            <label className="mt-3 flex items-start gap-3 text-sm text-slate-300">
                                <input type="checkbox" name="agreeRules" checked={form.agreeRules} onChange={handleChange} />
                                <span>I agree to the school&apos;s rules and regulations.</span>
                            </label>
                            <label className="mt-3 flex items-start gap-3 text-sm text-slate-300">
                                <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
                                <span>I consent to the processing of my child&apos;s information.</span>
                            </label>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admissions</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Student Admission Application</h1>
                <p className="mt-3 text-lg leading-8 text-slate-400">A professional, multi-step form to collect complete student, parent, medical, academic, and document information for the admissions office.</p>

                {status.message && (
                    <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                        status.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}>
                        {status.message}
                    </div>
                )}

                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                        <span>Application Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {steps.map((item, index) => (
                            <span key={item} className={`rounded-full px-3 py-1 text-xs font-semibold ${index === step ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-400'}`}>
                                {index + 1}. {item}
                            </span>
                        ))}
                    </div>
                </div>

                <form className="mt-8">
                    {renderStep()}
                </form>

                <div className="mt-8 flex flex-wrap justify-between gap-3">
                    <button type="button" onClick={prevStep} className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white">Back</button>
                    {step < steps.length - 1 ? (
                        <button type="button" onClick={nextStep} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">Next Step</button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={loading || !form.certifyInfo || !form.agreeRules || !form.consent} className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>

                <p className="mt-6 text-sm text-slate-400">
                    Already enrolled? <Link to="/login" className="font-semibold text-amber-400">Go to portal login</Link>
                </p>
            </div>
        </main>
    )
}
