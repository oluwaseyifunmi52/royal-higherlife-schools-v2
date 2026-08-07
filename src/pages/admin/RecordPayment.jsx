import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recordPayment } from '../../services/paymentService'

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'pos', label: 'POS' },
  { value: 'paystack', label: 'Paystack' },
  { value: 'flutterwave', label: 'Flutterwave' },
  { value: 'other', label: 'Other' },
]

const feeTypes = [
  { value: 'tuition', label: 'Tuition' },
  { value: 'development', label: 'Development' },
  { value: 'exam', label: 'Examination' },
  { value: 'uniform', label: 'Uniform' },
  { value: 'books', label: 'Books' },
  { value: 'transport', label: 'Transport' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'trip', label: 'Excursion/Trip' },
  { value: 'other', label: 'Other' },
]

const terms = ['First Term', 'Second Term', 'Third Term']

export default function RecordPayment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    admissionNumber: '',
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    session: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    term: 'First Term',
    feeType: 'tuition',
    description: '',
  })

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const api = (await import('../../api/axios')).default
        const res = await api.get('/api/admin/users?role=student&limit=500')
        setStudents(res.data.data?.users || [])
      } catch {
        // ignore
      }
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    const q = searchQuery.toLowerCase()
    const results = students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.studentProfile?.admissionNumber?.toLowerCase().includes(q)
    )
    setSearchResults(results)
    setShowDropdown(results.length > 0)
  }, [searchQuery, students])

  const selectStudent = (student) => {
    setForm((prev) => ({
      ...prev,
      studentId: student._id,
      studentName: student.name,
      admissionNumber: student.studentProfile?.admissionNumber || '',
    }))
    setSearchQuery(student.name)
    setShowDropdown(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.studentId) {
      setError('Please select a student')
      return
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      await recordPayment({
        studentId: form.studentId,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        paymentDate: form.paymentDate,
        session: form.session,
        term: form.term,
        feeType: form.feeType,
        description: form.description,
      })
      setSuccess('Payment recorded successfully!')
      setTimeout(() => navigate('/admin/payments'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin portal</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Record Payment</h1>
        <p className="mt-3 text-lg text-slate-400">Manually record a cash, bank transfer, POS, or online payment.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Student Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Search Student *</span>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setForm((prev) => ({ ...prev, studentId: '', admissionNumber: '' }))
                    }}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500"
                    placeholder="Search by name or admission number"
                    required
                  />
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
                      {searchResults.map((student) => (
                        <button
                          key={student._id}
                          type="button"
                          onMouseDown={() => selectStudent(student)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-800"
                        >
                          <span>{student.name}</span>
                          <span className="text-xs text-slate-500">{student.studentProfile?.admissionNumber || 'N/A'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Admission Number</span>
                <input
                  type="text"
                  value={form.admissionNumber}
                  readOnly
                  className="w-full rounded-full border border-slate-700 bg-slate-800 px-4 py-3 text-slate-300"
                  placeholder="Auto-filled"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Payment Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Amount (₦) *</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500"
                  placeholder="e.g. 100000"
                  min="1"
                  required
                />
              </label>
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Payment Method *</span>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                >
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Payment Date *</span>
                <input
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={handleChange}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                  required
                />
              </label>
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Fee Type *</span>
                <select
                  name="feeType"
                  value={form.feeType}
                  onChange={handleChange}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                >
                  {feeTypes.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Academic Period</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Session *</span>
                <input
                  type="text"
                  name="session"
                  value={form.session}
                  onChange={handleChange}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500"
                  placeholder="2026/2027"
                  required
                />
              </label>
              <label className="block text-sm text-slate-400">
                <span className="mb-2 block">Term *</span>
                <select
                  name="term"
                  value={form.term}
                  onChange={handleChange}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                >
                  {terms.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Additional Details</h2>
            <label className="block text-sm text-slate-400">
              <span className="mb-2 block">Description / Note</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="min-h-[100px] w-full rounded-[1.25rem] border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500"
                placeholder="e.g. School fees payment for first term"
              />
            </label>
          </div>

          {form.paymentMethod === 'cash' && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              A unique cash receipt number (RHS-CASH-XXXXXX) will be automatically generated for this payment.
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-amber-500 px-8 py-3 font-semibold text-slate-950 disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/payments')}
              className="rounded-full border border-slate-700 px-8 py-3 font-semibold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
