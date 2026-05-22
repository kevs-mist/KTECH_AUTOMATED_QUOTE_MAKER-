import React from 'react';
import { Trash2, Plus, Percent, Sparkles } from 'lucide-react';

export default function Charges({ charges, onChange }) {
  const addCharge = () => {
    const newCharge = {
      id: Date.now(),
      name: '',
      amount: 0,
      type: 'fixed'
    };
    onChange([...charges, newCharge]);
  };

  const updateCharge = (id, field, value) => {
    const updated = charges.map(charge => {
      if (charge.id === id) {
        let parsedVal = value;
        if (field === 'amount') {
          parsedVal = parseFloat(value);
          if (isNaN(parsedVal)) parsedVal = 0;
        }
        return { ...charge, [field]: parsedVal };
      }
      return charge;
    });
    onChange(updated);
  };

  const deleteCharge = (id) => {
    onChange(charges.filter(charge => charge.id !== id));
  };

  const commonCharges = [
    { name: 'Shipping & Delivery', type: 'fixed', amount: 500 },
    { name: 'GST (18%)', type: 'percentage', amount: 18 },
    { name: 'Discount (10%)', type: 'percentage', amount: -10 },
    { name: 'Installation Service', type: 'fixed', amount: 1200 }
  ];

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(99,102,241,0.04)] hover:border-indigo-100/50 mt-6 animate-fade-in-up">
      <div className="flex items-center gap-3.5 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 rounded-xl border border-indigo-100/30">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Additional Charges & Discounts</h2>
          <p className="text-xs text-slate-400">Configure delivery fees, VAT/GST taxes, or overall discounts</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {charges.map((charge) => (
          <div key={charge.id} className="flex flex-col md:flex-row gap-4 items-stretch md:items-end bg-slate-50/40 p-4 sm:p-5 rounded-2xl border border-slate-100 animate-fade-in-up">
            {/* Charge Name */}
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Adjustment Name
              </label>
              <input
                type="text"
                value={charge.name}
                onChange={(e) => updateCharge(charge.id, 'name', e.target.value)}
                placeholder="e.g. Courier Shipping, CGST, Discount"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 transition-all duration-200 text-sm font-medium"
              />
            </div>
            
            <div className="flex gap-4 items-end">
              {/* Charge Value */}
              <div className="w-28 sm:w-32 space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rate / Value
                </label>
                <input
                  type="number"
                  value={charge.amount === 0 ? '' : charge.amount}
                  onChange={(e) => updateCharge(charge.id, 'amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200/80 rounded-xl text-right text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 transition-all duration-200 text-sm font-semibold"
                  step="any"
                />
              </div>
              
              {/* Charge Type */}
              <div className="w-28 sm:w-32 space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Type
                </label>
                <select
                  value={charge.type}
                  onChange={(e) => updateCharge(charge.id, 'type', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 transition-all duration-200 text-sm font-semibold"
                >
                  <option value="fixed">₹ Fixed</option>
                  <option value="percentage">% Percent</option>
                </select>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => deleteCharge(charge.id)}
                className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-100 bg-white shadow-sm flex items-center justify-center self-stretch h-[44px]"
                title="Remove adjustment"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-4 border-t border-slate-100/60">
        <button
          onClick={addCharge}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition duration-200 active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Adjustment
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Quick presets:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {commonCharges.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  const newCharge = { 
                    id: Date.now(), 
                    name: preset.name, 
                    type: preset.type, 
                    amount: preset.amount 
                  };
                  onChange([...charges, newCharge]);
                }}
                className="px-2.5 py-1.5 bg-indigo-50/40 hover:bg-indigo-50 hover:text-indigo-700 text-indigo-600 border border-indigo-100/30 rounded-lg text-xs font-bold transition duration-200 active:scale-95"
              >
                + {preset.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
