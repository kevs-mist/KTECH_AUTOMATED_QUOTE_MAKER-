import React from 'react';
import { User, Mail, Building, Calendar, Phone, MapPin, Briefcase, Upload } from 'lucide-react';

export default function ClientInfo({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      handleChange('logo', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(99,102,241,0.04)] hover:border-indigo-100/50 animate-fade-in-up">
      <div className="flex items-center gap-3.5 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 rounded-xl border border-indigo-100/30">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Client & Company Details</h2>
          <p className="text-xs text-slate-400">Specify billing information and project context</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name & Logo */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Your Company Name & Logo
          </label>
          <div className="flex gap-2">
            <div className="relative group flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Building className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={data.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
                placeholder="e.g. Acme Studio"
              />
            </div>
            <label className="flex items-center justify-center px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>

        {/* Company Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Your Company Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <MapPin className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={data.companyAddress || ''}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
              placeholder="e.g. 101 Creative Blvd, Mumbai"
            />
          </div>
        </div>
        
        {/* Client Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Client Contact Name
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <User className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={data.clientName || ''}
              onChange={(e) => handleChange('clientName', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
              placeholder="e.g. Rajesh Kumar"
            />
          </div>
        </div>
        
        {/* Client Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Client Email
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Mail className="w-4.5 h-4.5" />
            </span>
            <input
              type="email"
              value={data.clientEmail || ''}
              onChange={(e) => handleChange('clientEmail', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
              placeholder="e.g. rajesh@company.com"
            />
          </div>
        </div>

        {/* Client Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Client Phone
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Phone className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={data.clientPhone || ''}
              onChange={(e) => handleChange('clientPhone', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
              placeholder="e.g. +91 98900 12345"
            />
          </div>
        </div>

        {/* Client Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Client Delivery/Billing Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <MapPin className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={data.clientAddress || ''}
              onChange={(e) => handleChange('clientAddress', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
              placeholder="e.g. Sector-5, Salt Lake, Kolkata"
            />
          </div>
        </div>

        {/* Project Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Project Title / Description
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Briefcase className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              value={data.projectName || ''}
              onChange={(e) => handleChange('projectName', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
              placeholder="e.g. E-Commerce Development Phase 1"
            />
          </div>
        </div>
        
        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Issue Date
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Calendar className="w-4.5 h-4.5" />
            </span>
            <input
              type="date"
              value={data.date || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/40 border border-slate-200/80 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/80 hover:bg-slate-50/80 focus:bg-white transition-all duration-200 text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
