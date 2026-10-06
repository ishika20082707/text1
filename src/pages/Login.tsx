import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useBeacon } from '../context/BeaconContext';
import { KeyRound, Mail, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, showToast, currentUser } = useBeacon();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleSelection, setRoleSelection] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');

  // Handle mode transitions from URL queries (?mode=register)
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleDemoFill = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setEmail('admin@school.com');
      setPassword('admin123');
      setRoleSelection('admin');
    } else {
      setEmail('student@school.com');
      setPassword('student123');
      setRoleSelection('student');
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide all mandatory credentials.');
      return;
    }

    if (isRegister && !fullName) {
      setError('Please provide your full legal name.');
      return;
    }

    // Demo Authenticator checks
    if (!isRegister) {
      if (email === 'admin@school.com' && password === 'admin123') {
        login('admin@school.com', 'admin', 'System Administrator');
        navigate('/admin/dashboard');
      } else if (email === 'student@school.com' && password === 'student123') {
        login('student@school.com', 'student', 'Alex Carter');
        
        // If they had a course query, preserve it
        const preSelectedCourse = searchParams.get('course');
        if (preSelectedCourse) {
          navigate(`/student/dashboard?course=${preSelectedCourse}`);
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // Support general custom student logins for realistic simulation
        if (email.includes('@') && password.length >= 6) {
          const simulatedName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
          login(email, 'student', simulatedName);
          navigate('/student/dashboard');
        } else {
          setError('Invalid credentials. Hint: use the demo credentials provided below.');
        }
      }
    } else {
      // Registration flow
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      
      // Successfully register student
      login(email, 'student', fullName);
      
      const preSelectedCourse = searchParams.get('course');
      if (preSelectedCourse) {
        navigate(`/student/dashboard?course=${preSelectedCourse}`);
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Toggle tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => {
              setIsRegister(false);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className={`w-full py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              !isRegister ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className={`w-full py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              isRegister ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Register Portal
          </button>
        </div>

        {/* Headings */}
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {isRegister ? 'Create Applicant Profile' : 'Access Student Admission Portal'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            {isRegister
              ? 'Complete registration to unlock your electronic application dossier.'
              : 'Sign in to continue your admissions dossier, upload marksheets, and track decisions.'}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="text-xs font-semibold text-slate-700">Full Legal Name</label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="e.g., Alex Carter"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="e.g., name@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="text-xs font-semibold text-slate-700">Account Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {isRegister ? 'Register Applicant Account' : 'Authenticate Credentials'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Interactive Demo Credentials</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Click a button to pre-fill standard credentials and explore both student and administrator workflows.
          </p>
          
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleDemoFill('student')}
              className="py-2 px-2.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-center border border-blue-100"
            >
              Student Portal
            </button>
            <button
              onClick={() => handleDemoFill('admin')}
              className="py-2 px-2.5 text-[11px] font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-all text-center border border-slate-300"
            >
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
