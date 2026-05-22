import React from 'react';
import { formatCurrency } from '../lib/calculations';

export default function QuotationPreview({ clientInfo, items, charges, quotationNumber, subtotal, grandTotal }) {
  const currentDate = clientInfo.date 
    ? new Date(clientInfo.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Calculate expiry date (30 days from date)
  const expiryDate = clientInfo.date
    ? new Date(new Date(clientInfo.date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-100/60 rounded-3xl w-full max-w-[850px] mx-auto text-left aspect-[1/1.414] flex flex-col justify-between relative overflow-hidden">
      
      {/* Visual Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div>
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {clientInfo.logo && (
                <img src={clientInfo.logo} alt="Company Logo" className="h-12 w-auto object-contain rounded" />
              )}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-indigo-600/10">
                Q
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                {clientInfo.companyName || 'Your Company Ltd.'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed font-medium">
              {clientInfo.companyAddress || '101 Executive Tower, Bandra Kurla Complex, Mumbai, MH 400051'}
            </p>
          </div>
          
          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[10px] uppercase tracking-wider mb-2">
              PROPOSAL ESTIMATE
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-1">
              Quotation
            </h1>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Reference: <span className="text-slate-800 font-mono font-bold">{quotationNumber}</span>
            </div>
          </div>
        </div>

        {/* Client & Date Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 text-xs">
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider mb-2">
              Prepared For
            </span>
            <div className="text-sm font-bold text-slate-900 mb-1">
              {clientInfo.clientName || 'Valued Partner / Client'}
            </div>
            <div className="space-y-0.5 text-slate-500 font-medium">
              {clientInfo.clientEmail && <div>{clientInfo.clientEmail}</div>}
              {clientInfo.clientPhone && <div>{clientInfo.clientPhone}</div>}
              {clientInfo.clientAddress && (
                <div className="text-slate-400/90 leading-relaxed max-w-[240px] mt-1">
                  {clientInfo.clientAddress}
                </div>
              )}
            </div>
          </div>
          
          <div className="sm:text-right flex flex-col justify-start sm:items-end">
            <span className="block font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quotation Schedule
            </span>
            <div className="space-y-1 text-slate-500 font-medium">
              <div>
                Date Created: <strong className="text-slate-800 font-bold">{currentDate}</strong>
              </div>
              <div>
                Valid Until: <strong className="text-slate-800 font-bold">{expiryDate}</strong>
              </div>
              {clientInfo.projectName && (
                <div className="mt-3 inline-block px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-700 font-semibold rounded-lg">
                  Project: <span className="text-indigo-600">"{clientInfo.projectName}"</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mt-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-left bg-slate-50">
                <th className="py-3 w-8 text-center border-r border-slate-200">#</th>
                <th className="py-3 border-r border-slate-200">Description of Item / Service</th>
                <th className="py-3 text-right w-16 border-r border-slate-200">Qty</th>
                <th className="py-3 text-right w-24 border-r border-slate-200">Unit Rate</th>
                <th className="py-3 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 italic">
                    Add line items to generate invoice table contents.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="bg-white even:bg-gray-50 hover:bg-slate-50/30 transition-colors border-b border-slate-200">
                    <td className="py-3.5 text-center text-slate-400 font-bold border-r border-slate-200">{index + 1}</td>
                    <td className="py-3.5 text-slate-900 font-semibold border-r border-slate-200">{item.productName || 'Consulting Services'}</td>
                    <td className="py-3.5 text-right border-r border-slate-200">{item.quantity}</td>
                    <td className="py-3.5 text-right border-r border-slate-200">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">{formatCurrency(item.finalPrice)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
          <div className="w-64 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>

            {charges.map((charge) => (
              <div key={charge.id} className="flex justify-between text-slate-500 font-medium">
                <span>{charge.name || 'Adjustment'}:</span>
                <span className="font-bold text-slate-800">
                  {charge.type === 'percentage' 
                    ? `₹${(subtotal * charge.amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    : `₹${charge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  }
                </span>
              </div>
            ))}

            <div className="flex justify-between text-sm font-bold border-t border-slate-200/80 pt-3 mt-2">
              <span className="text-slate-800 uppercase tracking-wider text-[10px]">Grand Total (INR):</span>
              <span className="text-lg font-black text-slate-900 bg-indigo-50/50 text-indigo-700 px-2 py-0.5 rounded-lg border border-indigo-100/30">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Block */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px] text-slate-400 font-medium">
        <div>
          <h4 className="font-bold text-slate-500 uppercase tracking-widest mb-2">
            Terms & Contract Rules
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-400 max-w-[360px] leading-relaxed">
            <li>Payments should be remitted to the account details provided upon receipt.</li>
            <li>Rates are exclusive of standard municipal taxes unless explicitly itemized.</li>
            <li>Prices stated are fixed for a duration of 30 calendar days.</li>
          </ul>
        </div>
        
        <div className="text-center sm:text-right min-w-[160px]">
          <div className="h-10 border-b border-slate-200 mb-2"></div>
          <span className="block font-bold text-slate-500 uppercase tracking-wider">
            Authorized Agent Signature
          </span>
          <span className="block mt-0.5 text-slate-400">{clientInfo.companyName || 'Your Company'}</span>
        </div>
      </div>
    </div>
  );
}
