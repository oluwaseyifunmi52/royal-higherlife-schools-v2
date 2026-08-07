import { useRef } from 'react'
import { FiDownload, FiCheckCircle } from 'react-icons/fi'

const methodLabels = {
    cash: 'Cash',
    bank_transfer: 'Bank Transfer',
    pos: 'POS',
    paystack: 'Paystack',
    flutterwave: 'Flutterwave',
    other: 'Other',
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatAmount(amount) {
    return `₦${Number(amount || 0).toLocaleString()}`
}

export default function PaymentReceipt({ payment, onDownload }) {
    const receiptRef = useRef(null)

    if (!payment) return null

    const handleDownload = () => {
        if (onDownload) {
            onDownload(payment)
            return
        }
        const el = receiptRef.current
        if (!el) return
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt ${payment.receiptNumber || payment.reference || ''}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Roboto, sans-serif; background: #fff; color: #1e293b; }
                    .receipt { max-width: 600px; margin: 40px auto; padding: 40px; border: 2px solid #0f172a; }
                    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
                    .school-name { font-size: 20px; font-weight: 700; letter-spacing: 0.1em; color: #0f172a; }
                    .receipt-title { font-size: 16px; font-weight: 600; margin-top: 8px; color: #b45309; letter-spacing: 0.15em; }
                    .status-badge { display: inline-block; margin-top: 12px; padding: 4px 16px; border-radius: 9999px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; }
                    .status-paid { background: #dcfce7; color: #166534; }
                    .status-pending { background: #fef9c3; color: #854d0e; }
                    .status-reversed { background: #fee2e2; color: #991b1b; }
                    .details { margin-top: 24px; }
                    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                    .row:last-child { border-bottom: none; }
                    .label { font-size: 13px; color: #64748b; }
                    .value { font-size: 14px; font-weight: 600; color: #0f172a; }
                    .amount-row { background: #f8fafc; margin: 16px -10px; padding: 16px 10px; border-radius: 8px; }
                    .amount-row .value { font-size: 20px; color: #b45309; }
                    .footer { margin-top: 32px; border-top: 2px solid #0f172a; padding-top: 16px; text-align: center; }
                    .footer-text { font-size: 11px; color: #94a3b8; }
                    .signature { margin-top: 40px; display: flex; justify-content: space-between; }
                    .sig-line { width: 180px; border-top: 1px solid #0f172a; padding-top: 8px; text-align: center; font-size: 12px; color: #64748b; }
                    @media print { body { background: #fff; } .receipt { border: none; } }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <div class="school-name">ROYAL HIGHER LIFE SCHOOLS</div>
                        <div class="receipt-title">PAYMENT RECEIPT</div>
                        <div class="status-badge status-${payment.status === 'paid' ? 'paid' : payment.status === 'reversed' ? 'reversed' : 'pending'}">
                            ${payment.status === 'paid' ? 'PAID' : payment.status === 'reversed' ? 'REVERSED' : 'PENDING'}
                        </div>
                    </div>
                    <div class="details">
                        <div class="row"><span class="label">Student Name</span><span class="value">${payment.studentName || payment.student?.firstName + ' ' + payment.student?.lastName || 'N/A'}</span></div>
                        <div class="row"><span class="label">Admission No.</span><span class="value">${payment.admissionNumber || payment.student?.admissionNumber || 'N/A'}</span></div>
                        <div class="row"><span class="label">Class</span><span class="value">${payment.studentClass || payment.student?.class || 'N/A'}</span></div>
                        <div class="row"><span class="label">Fee Type</span><span class="value">${payment.feeType || 'School Fees'}</span></div>
                        <div class="row"><span class="label">Session</span><span class="value">${payment.session || 'N/A'}</span></div>
                        <div class="row"><span class="label">Term</span><span class="value">${payment.term || 'N/A'}</span></div>
                        <div class="amount-row">
                            <div class="row"><span class="label">Amount Paid</span><span class="value">${formatAmount(payment.amount)}</span></div>
                        </div>
                        <div class="row"><span class="label">Payment Method</span><span class="value">${methodLabels[payment.paymentMethod] || payment.paymentMethod || 'N/A'}</span></div>
                        <div class="row"><span class="label">Date</span><span class="value">${formatDate(payment.paymentDate || payment.createdAt)}</span></div>
                        <div class="row"><span class="label">Receipt No.</span><span class="value">${payment.receiptNumber || payment.reference || 'N/A'}</span></div>
                        ${payment.description ? `<div class="row"><span class="label">Description</span><span class="value">${payment.description}</span></div>` : ''}
                        <div class="row"><span class="label">Recorded By</span><span class="value">${payment.recordedByName || payment.recordedBy?.name || 'System'}</span></div>
                    </div>
                    <div class="signature">
                        <div class="sig-line">Bursar/Accounts</div>
                        <div class="sig-line">Principal</div>
                    </div>
                    <div class="footer">
                        <div class="footer-text">This is an official receipt from Royal Higher Life Schools.</div>
                        <div class="footer-text" style="margin-top: 4px;">For verification, visit our website or contact the school office.</div>
                    </div>
                </div>
            </body>
            </html>
        `)
        printWindow.document.close()
        printWindow.print()
    }

    return (
        <div>
            <div ref={receiptRef} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
                <div className="text-center border-b-2 border-slate-700 pb-6">
                    <p className="text-2xl font-bold tracking-[0.1em] text-white">ROYAL HIGHER LIFE SCHOOLS</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Payment Receipt</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold"
                        style={{
                            background: payment.status === 'paid' ? 'rgba(34,197,94,0.15)' : payment.status === 'reversed' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                            color: payment.status === 'paid' ? '#4ade80' : payment.status === 'reversed' ? '#f87171' : '#facc15',
                        }}>
                        <FiCheckCircle />
                        {payment.status === 'paid' ? 'PAID' : payment.status === 'reversed' ? 'REVERSED' : 'PENDING'}
                    </div>
                </div>

                <div className="mt-6 space-y-1">
                    <ReceiptRow label="Student" value={payment.studentName || `${payment.student?.firstName || ''} ${payment.student?.lastName || ''}`} />
                    <ReceiptRow label="Admission No." value={payment.admissionNumber || payment.student?.admissionNumber || 'N/A'} />
                    <ReceiptRow label="Class" value={payment.studentClass || payment.student?.class || 'N/A'} />
                    <ReceiptRow label="Fee Type" value={payment.feeType || 'School Fees'} />
                    <ReceiptRow label="Session" value={payment.session || 'N/A'} />
                    <ReceiptRow label="Term" value={payment.term || 'N/A'} />
                </div>

                <div className="my-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Amount Paid</span>
                        <span className="text-2xl font-bold text-amber-400">{formatAmount(payment.amount)}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <ReceiptRow label="Payment Method" value={methodLabels[payment.paymentMethod] || payment.paymentMethod || 'N/A'} />
                    <ReceiptRow label="Date" value={formatDate(payment.paymentDate || payment.createdAt)} />
                    <ReceiptRow label="Receipt No." value={payment.receiptNumber || payment.reference || 'N/A'} />
                    {payment.description && <ReceiptRow label="Description" value={payment.description} />}
                    <ReceiptRow label="Recorded By" value={payment.recordedByName || payment.recordedBy?.name || 'System'} />
                </div>

                <div className="mt-8 flex justify-between">
                    <div className="w-40 border-t border-slate-600 pt-2 text-center text-xs text-slate-400">Bursar/Accounts</div>
                    <div className="w-40 border-t border-slate-600 pt-2 text-center text-xs text-slate-400">Principal</div>
                </div>
            </div>

            <div className="mt-4 flex gap-3">
                <button onClick={handleDownload} className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950">
                    <FiDownload /> Download Receipt
                </button>
            </div>
        </div>
    )
}

function ReceiptRow({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800/50 py-2">
            <span className="text-sm text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-white">{value || 'N/A'}</span>
        </div>
    )
}
