import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Institutional Wordmark & Pitch */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <GraduationCap className="h-6 w-6 text-blue-400" />
              <span className="font-serif text-lg font-bold tracking-tight">Beacon College</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Nurturing leadership, academic excellence, and creative innovation for tomorrow's leaders. Fully accredited, globally recognized degrees.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Institution</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-blue-400 transition-colors">Courses & Fees</Link>
              </li>
              <li>
                <Link to="/admission" className="hover:text-blue-400 transition-colors">Admission Process</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Form</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions Office */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Admissions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">Student Login</Link>
              </li>
              <li>
                <Link to="/login?mode=register" className="hover:text-blue-400 transition-colors">Register as Applicant</Link>
              </li>
              <li>
                <span className="text-xs text-slate-500">Helpline Hours: Mon-Fri 9AM - 5PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-3 text-sm">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Campus Contact</h4>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <span>100 Scholars Way, Academic District, Boston, MA 02108</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="font-mono tabular-nums">+1 (555) 300-8000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400 shrink-0" />
              <span>admissions@beaconcollege.edu</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} Beacon College. All Rights Reserved. Fully accredited institution.
          </div>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <Link to="/login" className="text-slate-500 hover:text-slate-300 flex items-center gap-1">
              Admin Portal <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
