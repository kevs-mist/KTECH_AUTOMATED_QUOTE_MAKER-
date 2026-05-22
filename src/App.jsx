import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, Save, Plus, FileText, Database, HardDrive, AlertTriangle, CheckCircle, RefreshCw, Trash2, FolderOpen, Layers } from 'lucide-react';
import ClientInfo from './components/ClientInfo';
import LineItems from './components/LineItems';
import Charges from './components/Charges';
import QuotationPreview from './components/QuotationPreview';
import { getOrCreateSessionId } from './lib/sessionManager';
import { calculateSubtotal, calculateGrandTotal, formatCurrency } from './lib/calculations';
import { generateQuotationNumber, downloadPDF, printQuotation } from './lib/quotationGenerator';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

export default function App() {
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    companyName: '',
    companyAddress: '',
    logo: '',
    projectName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState([]);
  const [charges, setCharges] = useState([]);
  const [quotationNumber, setQuotationNumber] = useState('');
  const [sessionId] = useState(getOrCreateSessionId());
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const previewRef = useRef(null);

  useEffect(() => {
    setQuotationNumber(generateQuotationNumber());
    loadRecentDrafts();
  }, []);

  const subtotal = parseFloat(calculateSubtotal(items));
  const totalCharges = charges.reduce((sum, charge) => {
    if (charge.type === 'fixed') {
      return sum + parseFloat(charge.amount || 0);
    } else {
      return sum + (subtotal * parseFloat(charge.amount || 0) / 100);
    }
  }, 0);
  const grandTotal = parseFloat(calculateGrandTotal(subtotal, charges));

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const loadRecentDrafts = async () => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('quotations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentDrafts(data || []);
      } else {
        const localData = localStorage.getItem('local_quotations');
        if (localData) {
          setRecentDrafts(JSON.parse(localData).slice(0, 5));
        }
      }
    } catch (err) {
      console.error('Error loading drafts:', err);
    }
  };

  const loadDraft = (draft) => {
    setQuotationNumber(draft.quotation_number);
    setClientInfo({
      clientName: draft.client_name || '',
      clientEmail: draft.client_email || '',
      clientPhone: draft.client_phone || '',
      clientAddress: draft.client_address || '',
      companyName: draft.company_name || '',
      companyAddress: draft.company_address || '',
      logo: draft.logo || '',
      projectName: draft.project_name || '',
      date: draft.date || new Date().toISOString().split('T')[0]
    });
    setItems(draft.items || []);
    setCharges(draft.charges || []);
    showStatus('info', `Loaded quotation draft ${draft.quotation_number}`);
  };

  const deleteDraft = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('quotations').delete().eq('id', id);
        if (error) throw error;
      } else {
        const localData = localStorage.getItem('local_quotations');
        if (localData) {
          const list = JSON.parse(localData).filter(item => item.id !== id);
          localStorage.setItem('local_quotations', JSON.stringify(list));
        }
      }
      showStatus('success', 'Draft removed.');
      loadRecentDrafts();
    } catch (err) {
      showStatus('error', 'Error deleting: ' + err.message);
    }
  };

  const saveQuotation = async () => {
    if (!clientInfo.companyName && !clientInfo.clientName) {
      showStatus('error', 'Please fill in Company or Client Name first.');
      return;
    }

    setIsSaving(true);
    const draftPayload = {
      id: quotationNumber,
      quotation_number: quotationNumber,
      client_name: clientInfo.clientName,
      client_email: clientInfo.clientEmail,
      client_phone: clientInfo.clientPhone,
      client_address: clientInfo.clientAddress,
      company_name: clientInfo.companyName,
      company_address: clientInfo.companyAddress,
      logo: clientInfo.logo,
      project_name: clientInfo.projectName,
      date: clientInfo.date,
      items: items,
      charges: charges,
      subtotal: subtotal,
      total_charges: totalCharges,
      grand_total: grandTotal,
      session_id: sessionId,
      status: 'draft',
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('quotations').upsert([
          {
            quotation_number: quotationNumber,
            client_name: clientInfo.clientName,
            client_email: clientInfo.clientEmail,
            items: items,
            charges: charges,
            subtotal: subtotal,
            total_charges: totalCharges,
            grand_total: grandTotal,
            session_id: sessionId,
            status: 'draft',
            notes: clientInfo.projectName
          }
        ], { onConflict: 'quotation_number' });

        if (error) throw error;
      } else {
        const localData = localStorage.getItem('local_quotations');
        let list = localData ? JSON.parse(localData) : [];
        const existingIndex = list.findIndex(item => item.quotation_number === quotationNumber);
        if (existingIndex > -1) {
          list[existingIndex] = draftPayload;
        } else {
          list.unshift(draftPayload);
        }
        localStorage.setItem('local_quotations', JSON.stringify(list));
      }

      showStatus('success', `Quotation ${quotationNumber} saved successfully!`);
      loadRecentDrafts();
    } catch (error) {
      showStatus('error', 'Failed to save quotation: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const startNewQuotation = () => {
    setQuotationNumber(generateQuotationNumber());
    setClientInfo({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      companyName: '',
      companyAddress: '',
      logo: '',
      projectName: '',
      date: new Date().toISOString().split('T')[0]
    });
    setItems([]);
    setCharges([]);
    showStatus('info', 'Started new blank quotation.');
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased pb-16 relative">
      
      {/* Top Connection Status Ribbon */}
      <div className="no-print border-b border-slate-100 bg-white/70 backdrop-blur-md px-4 sm:px-8 py-2.5 text-[11px] flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 font-semibold">
          {isSupabaseConfigured ? (
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <Database className="w-3.5 h-3.5" />
              Supabase Cloud Database Sync Enabled
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/60 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Offline Sandbox Mode (Autosaving to Browser Local Storage)
            </span>
          )}
        </div>
        <div className="text-slate-400 font-medium">
          Session Token: <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{sessionId.slice(8, 22)}</span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation & Header */}
        <header className="no-print mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 rounded-2xl text-white shadow-xl shadow-indigo-600/10 hover:rotate-2 transition duration-300">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Quotation Maker
              </h1>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                Generate high-resolution billing quotes, invoices, and estimations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startNewQuotation}
              className="flex items-center gap-2 px-4.5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 shadow-sm active:scale-95 transition-all duration-150"
            >
              <Plus className="w-4 h-4 text-indigo-500" />
              New Quote
            </button>
            <button
              onClick={saveQuotation}
              disabled={isSaving}
              className="flex items-center gap-2 px-5.5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/10 active:scale-95 transition-all duration-150 disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving Draft...' : 'Save Draft'}
            </button>
          </div>
        </header>

        {/* Global Notifications Panel */}
        {statusMessage && (
          <div className={`no-print max-w-md mx-auto mb-8 p-4 rounded-2xl border flex items-start gap-3.5 shadow-xl shadow-slate-200/50 animate-fade-in-up ${
            statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200/80 text-emerald-800' :
            statusMessage.type === 'error' ? 'bg-rose-50 border-rose-200/80 text-rose-800' :
            'bg-indigo-50 border-indigo-200/80 text-indigo-800'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
            {statusMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {statusMessage.type === 'info' && <FolderOpen className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />}
            <div className="text-xs font-semibold leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

        {/* Split Screen Workspace Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Fields & Settings Panels (3/5 Width) */}
          <div className="no-print xl:col-span-3 space-y-6">
            <ClientInfo data={clientInfo} onChange={setClientInfo} />
            <LineItems items={items} onChange={setItems} />
            <Charges charges={charges} onChange={setCharges} />
            
            {/* Recent Quotes Card */}
            {recentDrafts.length > 0 && (
              <div className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(99,102,241,0.04)] hover:border-indigo-100/50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Recent Documents
                </h3>
                <div className="divide-y divide-slate-100">
                  {recentDrafts.map((draft) => (
                    <div
                      key={draft.id || draft.quotation_number}
                      onClick={() => loadDraft(draft)}
                      className="py-3.5 flex items-center justify-between group cursor-pointer hover:bg-slate-50/40 rounded-xl px-3 -mx-3 transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50/50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase border border-indigo-100/20">
                          QT
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition">
                            {draft.quotation_number}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {draft.company_name || draft.client_name || 'Generic Quote'} • {new Date(draft.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(draft.grand_total)}
                        </span>
                        <button
                          onClick={(e) => deleteDraft(draft.id || draft.quotation_number, e)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                          title="Delete draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Summary Card & WYSIWYG Document Viewer (2/5 Width) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Invoice Total Summary Card */}
            <div className="no-print glass-card p-6 sm:p-8 rounded-3xl xl:sticky xl:top-6 z-10 hover:shadow-[0_12px_40px_rgba(99,102,241,0.04)] transition duration-300">
              <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">Summary & Export Options</h2>
              
              <div className="space-y-3.5 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Reference ID:</span>
                  <span className="font-mono text-slate-800 font-bold">{quotationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Client:</span>
                  <span className="font-bold text-slate-700 truncate max-w-[220px]">
                    {clientInfo.clientName || clientInfo.companyName || 'Not Defined'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                {charges.length > 0 && (
                  <div className="flex justify-between">
                    <span>Tax & Fees:</span>
                    <span className={`font-bold ${totalCharges >= 0 ? 'text-slate-800' : 'text-emerald-600'}`}>
                      {totalCharges >= 0 ? '+' : ''}{formatCurrency(totalCharges)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-base font-extrabold border-t border-slate-100 pt-4 mt-2 text-slate-900 items-baseline">
                  <span>Grand Total (INR):</span>
                  <span className="text-xl font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/30">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => downloadPDF('quotation-print-element', `quotation-${quotationNumber}.pdf`)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition duration-200 active:scale-95 shadow-md shadow-slate-900/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>

                <button
                  onClick={printQuotation}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition duration-200 active:scale-95 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  Print Estimate
                </button>
              </div>
            </div>

            {/* Float View Live Document Preview */}
            <div className="xl:sticky xl:top-[330px]">
              <div className="no-print flex items-center justify-between mb-4 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Live WYSIWYG PDF View
                </span>
                <span className="text-[10px] text-slate-400 font-medium italic">
                  A4 Print Dimensions Check
                </span>
              </div>
              
              <div id="quotation-print-element" ref={previewRef} className="print-container scale-[0.97] sm:scale-100 origin-top transition-transform duration-300">
                <QuotationPreview
                  clientInfo={clientInfo}
                  items={items}
                  charges={charges}
                  quotationNumber={quotationNumber}
                  subtotal={subtotal}
                  grandTotal={grandTotal}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
