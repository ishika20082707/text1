import React, { useState } from 'react';
import { useBeacon } from '../context/BeaconContext';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldAlert } from 'lucide-react';

export const Contact: React.FC = () => {
  const { showToast } = useBeacon();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all mandatory fields.', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      showToast('Thank you! Your message has been sent to our admissions helpdesk.', 'success');
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Contact Our Admissions Office</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have specialized questions regarding credit transfers, scholarship conditions, or residency documents? Reach out and our helpdesk will respond within 24 business hours.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Contact details & Map Placeholder (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Admissions Information Hub</h2>
              
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Main Campus</strong>
                    <span>100 Scholars Way, Academic District, Boston, MA 02108</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Admissions Helpline</strong>
                    <span className="font-mono tabular-nums">+1 (555) 300-8000</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Direct Email Helpdesk</strong>
                    <span>admissions@beaconcollege.edu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Campus Geographic Layout</h3>
              <div className="bg-slate-100 h-64 rounded-lg relative overflow-hidden flex flex-col justify-center items-center text-center p-6 border border-slate-200">
                
                {/* Simulated interactive map vector */}
                <svg className="absolute inset-0 h-full w-full opacity-10" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,20 L100,50 M0,80 L100,30 M40,0 L60,100 M10,0 L90,100" stroke="#000" strokeWidth="2" />
                  <circle cx="50" cy="40" r="15" stroke="#000" strokeWidth="1" />
                  <rect x="20" y="30" width="10" height="20" stroke="#000" strokeWidth="1" />
                  <rect x="70" y="45" width="15" height="15" stroke="#000" strokeWidth="1" />
                </svg>

                <MapPin className="h-10 w-10 text-blue-600 animate-bounce relative z-10" />
                <span className="font-serif font-semibold text-slate-800 text-sm mt-3 relative z-10">Beacon College Quadrangle</span>
                <span className="text-[11px] text-slate-500 max-w-xs mt-1 relative z-10">Opposite Boston Common Library, Entrance Gate 2. Visitor Parking Slot B available.</span>
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Contact Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Send Admissions Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g., Alex Carter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g., alex.carter@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-700">Query Subject</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Application Status Help">Application Status Help</option>
                  <option value="Fees & Scholarship Aid">Fees & Scholarship Aid</option>
                  <option value="Document Upload Issues">Document Upload Issues</option>
                  <option value="Credit Transfer Request">Credit Transfer Request</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-slate-700">Message details <span className="text-red-500">*</span></label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Type your academic questions or procedural queries in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Sending Message...' : 'Submit Inquiry'}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
