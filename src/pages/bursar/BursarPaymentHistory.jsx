import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPayments } from '../../services/paymentService'
import PaymentTable from '../../components/PaymentTable'

export default function BursarPaymentHistory() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await getAllPayments({ limit: 500 })
                setPayments(res.data.data?.payments || [])
            } catch { /* ignore */ }
            finally { setLoading(false) }
        }
        fetchPayments()
    }, [])

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Payment History</h1>
                </div>
                <Link to="/bursar/record-payment" className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">+ Record Payment</Link>
            </div>
            <PaymentTable payments={payments} loading={loading} viewPath="/bursar/receipt" />
        </main>
    )
}
