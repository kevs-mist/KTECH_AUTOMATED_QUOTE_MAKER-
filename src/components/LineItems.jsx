import React from 'react';
import { Trash2, Plus, ShoppingBag } from 'lucide-react';
import { calculateFinalPrice } from '../lib/calculations';

export default function LineItems({ items, onChange }) {
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productName: '',
      quantity: 1,
      unitPrice: 0,
      finalPrice: 0
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id, field, value) => {
    const updated = items.map(item => {
      if (item.id === id) {
        let parsedVal = value;
        if (field === 'quantity' || field === 'unitPrice') {
          parsedVal = parseFloat(value);
          if (isNaN(parsedVal)) parsedVal = 0;
        }
        
        const updatedItem = { 
          ...item, 
          [field]: parsedVal 
        };
        
        updatedItem.finalPrice = parseFloat(
          calculateFinalPrice(updatedItem.quantity, updatedItem.unitPrice)
        );
        
        return updatedItem;
      }
      return item;
    });
    onChange(updated);
  };

  const deleteItem = (id) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(99,102,241,0.04)] hover:border-indigo-100/50 mt-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 rounded-xl border border-indigo-100/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Line Items</h2>
            <p className="text-xs text-slate-400">Add products, services, hours, or materials</p>
          </div>
        </div>
        
        {items.length > 0 && (
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 font-bold rounded-lg text-xs transition duration-200 active:scale-95 border border-indigo-100/50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 text-indigo-600 border border-indigo-100/30 flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Add items to get started</h3>
          <p className="text-xs text-slate-400 max-w-[280px] text-center mt-1.5 mb-5 leading-relaxed">
            Create quote items to automatically calculate quantities, rates, and totals.
          </p>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition duration-200 shadow-md shadow-indigo-600/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100/80 bg-white/40">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-4 py-3 text-center w-12">#</th>
                <th className="px-4 py-3">Product/Service Details</th>
                <th className="px-4 py-3 text-right w-24">Qty</th>
                <th className="px-4 py-3 text-right w-32">Unit Rate</th>
                <th className="px-4 py-3 text-right w-36">Total Amount</th>
                <th className="px-4 py-3 text-center w-14"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {items.map((item, index) => (
                <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-4 py-3 text-center text-xs font-semibold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-transparent rounded-lg text-slate-800 placeholder-slate-400/80 focus:border-indigo-500/50 hover:bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition text-sm font-medium"
                      placeholder="e.g. Frontend Development Hours"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="number"
                      value={item.quantity === 0 ? '' : item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 bg-transparent border border-transparent rounded-lg text-right text-slate-800 focus:border-indigo-500/50 hover:bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition text-sm font-semibold"
                      min="0.01"
                      step="any"
                      placeholder="1"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-2.5 flex items-center text-xs text-slate-400 font-medium">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-transparent border border-transparent rounded-lg text-right text-slate-800 focus:border-indigo-500/50 hover:bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition text-sm font-semibold"
                        min="0"
                        step="any"
                        placeholder="0.00"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 text-sm">
                    ₹{item.finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition opacity-60 group-hover:opacity-100"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {items.length > 0 && (
        <button
          onClick={addItem}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Line
        </button>
      )}
    </div>
  );
}
