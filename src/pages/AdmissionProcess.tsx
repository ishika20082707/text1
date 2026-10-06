import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  FileEdit, 
  Upload, 
  SearchCode, 
  GraduationCap, 
  ArrowRight, 
  Clock, 
  BookOpen 
} from 'lucide-react';

export const AdmissionProcess: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <UserPlus className="h-6 w-6 text-blue-600" />,
      title: 'Portal Registration',
      description: 'Create an applicant account on our responsive system using your primary email and password. Your portal dashboard remains active throughout the complete review cycle.',
      action: 'Register Now',
      link: '/login?mode=register'
    },
    {
      num: '02',
      icon: <FileEdit className="h-6 w-6 text-blue-600" />,
      title: 'Complete Application Form',
      description: 'Provide your personal and contact details, high school academic marks (including board, GPA/percentage, and passing year), and select your primary and secondary course preferences.',
      action: 'Explore Degrees',
      link: '/courses'
    },
    {
      num: '03',
      icon: <Upload className="h-6 w-6 text-blue-600" />,
      title: 'Document Upload with Previews',
      description: 'Upload high-resolution scans of your passport-sized photograph, formal transcripts/marksheets, and government ID. Our live preview system verifies visual readability before submissions.',
      action: null,
      link: null
    },
    {
      num: '04',
      icon: <SearchCode className="h-6 w-6 text-blue-600" />,
      title: 'Review and Submit Application',
      description: 'Double check all form entries against validations, save drafts if you need to fetch supplementary records, and click final submit. Once submitted, your status automatically changes to "Submitted".',
      action: null,
      link: null
    },
    {
      num: '05',
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />,
      title: 'Rolling Review and Results',
      description: 'The Beacon Admissions Office verifies documents on a rolling basis. Monitor your interactive student dashboard to track progress updates (Submitted > Under Review > Waitlisted > Approved or Rejected).',
      action: 'Track Application',
      link: '/login'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Our Admission Timeline</h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Follow our streamlined online application cycle. You can complete the process in one sitting or save ongoing drafts as needed.
          </p>
        </div>

        {/* Timeline Cards (using editorial natural list layout and zero-elevation flat borders) */}
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col md:flex-row gap-6 relative"
            >
              {/* Number and Icon Left Side */}
              <div className="flex items-center md:items-start gap-4 shrink-0">
                <span className="font-mono text-3xl font-extrabold text-blue-600/20 tracking-wider">
                  {step.num}
                </span>
                <div className="p-3 bg-blue-50 rounded-lg">
                  {step.icon}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {step.action && step.link && (
                  <div className="pt-2">
                    <Link
                      to={step.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {step.action}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 rounded-xl p-8 text-center text-white space-y-4">
          <h2 className="font-serif text-2xl font-bold">Ready to take the next step?</h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Register your online applicant portal today, fill out the form at your own pace, and join our vibrant academic class.
          </p>
          <div className="pt-2">
            <Link
              to="/login?mode=register"
              className="px-6 py-3 text-xs font-semibold text-blue-600 bg-white hover:bg-slate-50 rounded-lg shadow-sm transition-all inline-block"
            >
              Start Admission Portal
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
