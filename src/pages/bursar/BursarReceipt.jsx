import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPaymentById } from '../../services/paymentService'

const methodLabels = {
    cash: 'Cash', bank_transfer: 'Bank Transfer', pos: 'POS',
    paystack: 'Paystack', flutterwave: 'Flutterwave', other: 'Other',
}

export default function BursarReceipt() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getPaymentById(id)
                const data = res.data?.data || res.data
                setPayment(data)
            } catch (err) {
                setError(err.response?.data?.message || 'Receipt not found.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-slate-400">Loading receipt...</p>
            </main>
        )
    }

    if (error || !payment) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-red-400">{error || 'Receipt not found.'}</p>
                <Link to="/bursar/payment-history" className="mt-4 inline-block text-amber-400">← Back to Payment History</Link>
            </main>
        )
    }

    const student = payment.studentId || {}
    const studentName = payment.studentName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim()
    const admissionNumber = payment.admissionNumber || student.studentProfile?.admissionNumber || '—'
    const studentClass = payment.studentClass || student.studentProfile?.class || '—'
    const bursar = payment.recordedByName || ''
    const date = new Date(payment.paymentDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })

    const receipt = (
        <div className="mx-auto max-w-3xl">
            <div className="border-2 border-dashed border-slate-700/50 p-8 md:p-12">
                <div className="mb-8 flex flex-col items-center">
                    <h1 className="text-3xl font-extrabold text-white">ROYAL HIGHER LIFE SCHOOLS</h1>
                    <p className="mt-1 text-sm text-amber-400">Official Payment Receipt</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 mb-8">
                    <div>
                        <p className="text-sm text-slate-500">Receipt Number</p>
                        <p className="font-mono font-semibold text-white">{payment.receiptNumber || '—'}</p>
                    </div>
                    <div className="sm:text-right">
                        <p className="text-sm text-slate-500">Date</p>
                        <p className="font-semibold text-white">{date}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Student Name</p>
                        <p className="font-semibold text-white">{studentName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Admission Number</p>
                        <p className="font-semibold text-white">{admissionNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Class</p>
                        <p className="font-semibold text-white">{studentClass}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Fee Type</p>
                        <p className="font-semibold text-white">{payment.feeType || '—'}</p>
                    </div>
                </div>

                <div className="mb-8 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-slate-500">Amount Paid:</p>
                        <p className="text-right font-bold text-2xl text-white">₦{Number(payment.amount || 0).toLocaleString()}</p>
                        <p className="text-slate-500">Payment Method:</p>
                        <p className="text-right text-white">{methodLabels[payment.paymentMethod] || payment.paymentMethod || '—'}</p>
                        <p className="text-slate-500">Reference Number:</p>
                        <p className="text-right text-white">{payment.reference || '—'}</p>
                        <p className="text-slate-500">Term / Session:</p>
                        <p className="text-right text-white">{payment.term || '—'} / {payment.session || '—'}</p>
                    </div>
                    {payment.description && (
                        <>
                            <div className="mt-4 border-t border-slate-800 pt-3">
                                <p className="text-sm text-slate-500">Description / Note</p>
                                <p className="text-white">{payment.description}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-between border-t border-slate-700 pt-6 text-sm">
                    <div className="text-center">
                        <p className="text-slate-500">Authorized Staff / Bursar</p>
                        <p className="mt-1 font-semibold text-white">{bursar || '—'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-500">Status</p>
                        <p className="mt-1 font-semibold text-green-300 uppercase">{payment.status}</p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-slate-500">
                    This is an official receipt for fees paid to Royal Higherlife Schools. Print this document as proof of payment.
                </p>
            </div>
        </div>
    )

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Receipt</h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/bursar/payment-history"
                        className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        ← Payment History
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>

            <div className="print:shadow-none print:border-0">
                {receipt}
            </div>
        </main>
    )
}
