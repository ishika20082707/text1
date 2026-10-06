import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBeacon } from '../context/BeaconContext';
import { Application, Course } from '../data/mockData';
import {
  FileText,
  User,
  GraduationCap,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Download,
  Trash2,
  FileCheck,
  Building,
  ArrowRight,
  ShieldAlert,
  Printer
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    applications,
    submitApplication,
    saveApplicationDraft,
    showToast
  } = useBeacon();
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'student') {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  // Find existing application for this student
  const studentEmail = currentUser?.email || '';
  const existingApp = applications.find((app) => app.studentId === studentEmail);

  // Form step state
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Multi-step form values
  const [formData, setFormData] = useState<Application>({
    id: '',
    studentId: studentEmail,
    personalDetails: {
      fullName: currentUser?.fullName || '',
      dob: '',
      gender: '',
      phone: '',
      email: studentEmail,
      address: ''
    },
    academicDetails: {
      previousSchool: '',
      board: '',
      marksPercentage: 0,
      yearOfPassing: ''
    },
    coursePreference1: '',
    coursePreference2: '',
    documents: {
      photoName: '',
      photoUrl: '',
      marksheetName: '',
      marksheetUrl: '',
      idProofName: '',
      idProofUrl: ''
    },
    status: 'Draft',
    submittedDate: '',
    remarks: ''
  });

  // Load draft or default into state
  useEffect(() => {
    if (existingApp) {
      setFormData(existingApp);
    } else {
      // Pre-populate with course preference if passed in URL
      const courseQuery = searchParams.get('course');
      if (courseQuery) {
        setFormData((prev) => ({
          ...prev,
          coursePreference1: courseQuery
        }));
      }
    }
  }, [existingApp, searchParams, studentEmail]);

  // Handle Input Changes
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value
      }
    }));
  };

  const handleAcademicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      academicDetails: {
        ...prev.academicDetails,
        [name]: name === 'marksPercentage' ? parseFloat(value) || 0 : value
      }
    }));
  };

  // Convert uploaded files to base64 for instant preview & mock database saves
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'photo' | 'marksheet' | 'idProof') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast(`File "${file.name}" is too large. Limit is 2MB.`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [`${fieldName}Name`]: file.name,
          [`${fieldName}Url`]: dataUrl
        }
      }));
      showToast(`Document "${file.name}" uploaded successfully!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Form Step Validations
  const validateStep = (currentStep: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      const pd = formData.personalDetails;
      if (!pd.fullName.trim()) stepErrors.fullName = 'Full Legal Name is required.';
      if (!pd.dob) stepErrors.dob = 'Date of birth is required.';
      if (!pd.gender) stepErrors.gender = 'Gender selection is required.';
      if (!pd.phone.trim()) stepErrors.phone = 'Phone number is required.';
      if (!pd.address.trim()) stepErrors.address = 'Current permanent address is required.';
      
      // DOB verification (minimum age 15)
      if (pd.dob) {
        const birthYear = new Date(pd.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        if (currentYear - birthYear < 15) {
          stepErrors.dob = 'Applicant must be at least 15 years old.';
        }
      }
    }

    if (currentStep === 2) {
      const ad = formData.academicDetails;
      if (!ad.previousSchool.trim()) stepErrors.previousSchool = 'Previous high school name is required.';
      if (!ad.board) stepErrors.board = 'Academic board is required.';
      if (ad.marksPercentage <= 0 || ad.marksPercentage > 100) {
        stepErrors.marksPercentage = 'Marks percentage must be a decimal between 1.0 and 100.0.';
      }
      if (!ad.yearOfPassing) stepErrors.yearOfPassing = 'Passing year is required.';
    }

    if (currentStep === 3) {
      if (!formData.coursePreference1) {
        stepErrors.coursePreference1 = 'First course preference is required.';
      }
      if (formData.coursePreference1 === formData.coursePreference2) {
        stepErrors.coursePreference2 = 'First and second preference cannot be the identical program.';
      }
    }

    if (currentStep === 4) {
      const docs = formData.documents;
      if (!docs.photoUrl) stepErrors.photo = 'Passport size photograph is required.';
      if (!docs.marksheetUrl) stepErrors.marksheet = 'High school transcript marksheet is required.';
      if (!docs.idProofUrl) stepErrors.idProof = 'Government identity card scan is required.';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSaveDraft = () => {
    saveApplicationDraft(formData);
  };

  const handleSubmitFinal = () => {
    if (validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)) {
      submitApplication(formData);
      setStep(1);
    } else {
      showToast('Validation failed. Please review all steps for completeness.', 'error');
    }
  };

  // Printable summary window print trigger
  const handlePrintSummary = () => {
    window.print();
  };

  // Test-aid reset: Delete this student's application so they can re-apply
  const handleResetApplication = () => {
    if (window.confirm('Are you sure you want to discard your current application status to test the step-by-step submission process?')) {
      const stored = localStorage.getItem('beacon_applications');
      if (stored) {
        const apps = JSON.parse(stored) as Application[];
        const filtered = apps.filter((a) => a.studentId !== studentEmail);
        localStorage.setItem('beacon_applications', JSON.stringify(filtered));
        window.location.reload();
      }
    }
  };

  // Find Course names by ID
  const getCourseName = (id: string) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.name : 'Not Specified';
  };

  // Render Status Progress Elements
  const renderStatusTracker = (status: Application['status']) => {
    const stages = [
      { key: 'Submitted', label: 'Dossier Submitted', desc: 'Application received' },
      { key: 'Under Review', label: 'Under Verification', desc: 'Documents and grades audit' },
      { key: 'Decision', label: 'Admissions Decision', desc: 'Final review status' }
    ];

    let activeIdx = 0;
    let statusThemeColor = 'text-blue-600 bg-blue-500';

    if (status === 'Submitted') activeIdx = 0;
    if (status === 'Under Review') activeIdx = 1;
    if (status === 'Approved' || status === 'Rejected' || status === 'Waitlisted') activeIdx = 2;

    if (status === 'Approved') statusThemeColor = 'text-emerald-600 bg-emerald-500';
    if (status === 'Rejected') statusThemeColor = 'text-rose-600 bg-rose-500';
    if (status === 'Waitlisted') statusThemeColor = 'text-amber-600 bg-amber-500';

    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8 space-y-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Docket Identification</span>
            <h2 className="text-lg font-bold text-slate-900 font-mono tracking-tight uppercase">
              {formData.id || 'APP-PENDING'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Current Status:</span>
            <span className={`inline-flex items-center gap-1.5 font-bold text-xs ${statusThemeColor.split(' ')[0]}`}>
              <span className={`w-2 h-2 rounded-full ${statusThemeColor.split(' ')[1]}`}></span>
              {status}
            </span>
          </div>
        </div>

        {/* Visual Progress Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {stages.map((stage, i) => {
            const isCompleted = i < activeIdx;
            const isCurrent = i === activeIdx;
            
            return (
              <div key={stage.key} className="relative flex gap-4 md:flex-col md:text-center items-start md:items-center">
                {/* Visual Connector Line (for Desktop) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-slate-100 -z-10" />
                )}

                {/* Circle step badge */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 font-mono font-bold text-sm ${
                  isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : isCurrent 
                      ? 'bg-white border-blue-600 text-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : `0${i + 1}`}
                </div>

                <div className="space-y-1">
                  <div className={`text-sm font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    {stage.key === 'Decision' && activeIdx === 2 ? `Decision: ${status}` : stage.label}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed max-w-xs md:mx-auto">
                    {stage.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision Notification Callouts */}
        {activeIdx === 2 && (
          <div className={`p-5 rounded-xl border ${
            status === 'Approved' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : status === 'Waitlisted'
                ? 'bg-amber-50 border-amber-100 text-amber-800'
                : 'bg-red-50 border-red-100 text-red-800'
          } space-y-2`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="h-5 w-5" />
              <span>
                {status === 'Approved' && 'Congratulations! Your Admission is Confirmed.'}
                {status === 'Waitlisted' && 'Admissions Status: Waitlisted.'}
                {status === 'Rejected' && 'Admissions Status: Application Not Accepted.'}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90 pl-7">
              {formData.remarks || 'Your electronic application has been processed. Remarks from the admissions panel are pending.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-slate-900">Applicant Portal</h1>
            <p className="text-sm text-slate-500">
              Welcome back, <strong className="text-slate-700 font-semibold">{currentUser?.fullName}</strong>. Maintain and audit your registration details.
            </p>
          </div>

          <div className="flex gap-2">
            {existingApp && existingApp.status !== 'Draft' && (
              <button
                onClick={handlePrintSummary}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </button>
            )}

            <button
              onClick={handleResetApplication}
              className="px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1.5"
              title="Reset submission data to test from scratch"
            >
              <Trash2 className="h-4 w-4" />
              Reset System
            </button>
          </div>
        </div>

        {/* ----------------- SUBMITTED / PROGRESS VIEW ----------------- */}
        {existingApp && existingApp.status !== 'Draft' ? (
          <div className="space-y-8">
            
            {/* Status Progress Area */}
            {renderStatusTracker(existingApp.status)}

            {/* Application Dossier Summary Display (PDF/Print Target) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-8 shadow-xs print:border-0 print:shadow-none">
              
              <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                <GraduationCap className="h-10 w-10 text-blue-600 mx-auto" />
                <h2 className="font-serif text-2xl font-bold text-slate-900">Beacon College</h2>
                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Admissions Application Dossier Summary</h3>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Submitted On: {existingApp.submittedDate} · Reference: {existingApp.id}
                </div>
              </div>

              {/* Grid 1: Personal Profile */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-50 pb-1.5">
                  01. Student Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Full Name:</span>
                    <span className="text-slate-900 font-semibold">{existingApp.personalDetails.fullName}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Date of Birth:</span>
                    <span className="text-slate-900 font-mono">{existingApp.personalDetails.dob}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Gender:</span>
                    <span className="text-slate-900">{existingApp.personalDetails.gender}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Phone:</span>
                    <span className="text-slate-900 font-mono">{existingApp.personalDetails.phone}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Email:</span>
                    <span className="text-slate-900 font-mono">{existingApp.personalDetails.email}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Address:</span>
                    <span className="text-slate-900">{existingApp.personalDetails.address}</span>
                  </div>
                </div>
              </div>

              {/* Grid 2: Academic Profile */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-50 pb-1.5">
                  02. Academic Records
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">School:</span>
                    <span className="text-slate-900">{existingApp.academicDetails.previousSchool}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Board:</span>
                    <span className="text-slate-900">{existingApp.academicDetails.board}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Score %:</span>
                    <span className="text-slate-900 font-mono font-bold text-blue-600">{existingApp.academicDetails.marksPercentage}%</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Graduation Year:</span>
                    <span className="text-slate-900 font-mono">{existingApp.academicDetails.yearOfPassing}</span>
                  </div>
                </div>
              </div>

              {/* Grid 3: Selected Preferences */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-50 pb-1.5">
                  03. Selected Program Preferences
                </h3>
                <div className="space-y-2 text-sm text-slate-900">
                  <div className="flex justify-between sm:justify-start sm:gap-4 border-b border-slate-50 sm:border-0 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Preference 1:</span>
                    <span className="font-semibold text-slate-800">{getCourseName(existingApp.coursePreference1)}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 pb-1.5 sm:pb-0">
                    <span className="text-slate-400 font-medium sm:w-28 shrink-0">Preference 2:</span>
                    <span className="text-slate-600">{getCourseName(existingApp.coursePreference2)}</span>
                  </div>
                </div>
              </div>

              {/* Document Check Area */}
              <div className="space-y-3 print:hidden">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-50 pb-1.5">
                  04. Uploaded Documentation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-700 truncate">{existingApp.documents.photoName}</div>
                      <div className="text-slate-400 text-[10px]">Photograph (Validated)</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-700 truncate">{existingApp.documents.marksheetName}</div>
                      <div className="text-slate-400 text-[10px]">Academic Marksheet</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-700 truncate">{existingApp.documents.idProofName}</div>
                      <div className="text-slate-400 text-[10px]">ID Proof Scan</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* ----------------- MULTI-STEP BUILDER FORM ----------------- */
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            
            {/* Steps Progress Header */}
            <div className="bg-slate-50 border-b border-slate-150 p-4 sm:p-6 flex items-center justify-between gap-4">
              <div className="flex gap-1.5 sm:gap-3 text-xs font-semibold text-slate-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => {
                      // Let them click back to any step less than current step
                      if (i < step) setStep(i);
                    }}
                    className={`h-6 px-2 rounded flex items-center justify-center transition-all ${
                      step === i 
                        ? 'bg-blue-600 text-white font-bold' 
                        : i < step 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-700">
                Step {step} of 5: {
                  step === 1 ? 'Personal Details' :
                  step === 2 ? 'Academic details' :
                  step === 3 ? 'Program Selection' :
                  step === 4 ? 'Document Scans' : 'Confirm Dossier'
                }
              </div>
            </div>

            {/* Form Steps Body */}
            <div className="p-6 md:p-8">
              
              {/* ---------- STEP 1: PERSONAL DETAILS ---------- */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="h-5 w-5 text-blue-600" />
                      Applicant Personal Profile
                    </h2>
                    <p className="text-xs text-slate-500">Provide legal contact information as listed on government documents.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-semibold text-slate-700">Full Legal Name <span className="text-red-500">*</span></label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        value={formData.personalDetails.fullName}
                        onChange={handlePersonalChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                          errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.fullName && <p className="text-[10px] text-red-500 font-medium">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="dob" className="text-xs font-semibold text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                        <input
                          id="dob"
                          type="date"
                          name="dob"
                          required
                          value={formData.personalDetails.dob}
                          onChange={handlePersonalChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                            errors.dob ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                          }`}
                        />
                        {errors.dob && <p className="text-[10px] text-red-500 font-medium">{errors.dob}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="gender" className="text-xs font-semibold text-slate-700">Gender <span className="text-red-500">*</span></label>
                        <select
                          id="gender"
                          name="gender"
                          required
                          value={formData.personalDetails.gender}
                          onChange={handlePersonalChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                            errors.gender ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                          }`}
                        >
                          <option value="">Choose...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-[10px] text-red-500 font-medium">{errors.gender}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-semibold text-slate-700">Active Mobile Phone <span className="text-red-500">*</span></label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="e.g. +1 (555) 123-4567"
                        required
                        value={formData.personalDetails.phone}
                        onChange={handlePersonalChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-700">Primary Email (Locked)</label>
                      <input
                        id="email"
                        type="email"
                        disabled
                        value={formData.personalDetails.email}
                        className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
                      />
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-xs font-semibold text-slate-700">Permanent Home Address <span className="text-red-500">*</span></label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required
                      value={formData.personalDetails.address}
                      onChange={handlePersonalChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                        errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                    ></textarea>
                    {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address}</p>}
                  </div>
                </div>
              )}

              {/* ---------- STEP 2: ACADEMIC DETAILS ---------- */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      High School Academic Record
                    </h2>
                    <p className="text-xs text-slate-500">Provide official high school transcripts or qualification records.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 col-span-1 sm:col-span-2">
                      <label htmlFor="previousSchool" className="text-xs font-semibold text-slate-700">Previous High School / College Name <span className="text-red-500">*</span></label>
                      <input
                        id="previousSchool"
                        type="text"
                        name="previousSchool"
                        required
                        value={formData.academicDetails.previousSchool}
                        onChange={handleAcademicChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                          errors.previousSchool ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.previousSchool && <p className="text-[10px] text-red-500 font-medium">{errors.previousSchool}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="board" className="text-xs font-semibold text-slate-700">Academic Board / Curriculum <span className="text-red-500">*</span></label>
                      <select
                        id="board"
                        name="board"
                        required
                        value={formData.academicDetails.board}
                        onChange={handleAcademicChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                          errors.board ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select board...</option>
                        <option value="State Board">State Board / National Curriculum</option>
                        <option value="CBSE Board">CBSE Board (Central)</option>
                        <option value="IB Diploma">IB Diploma (International)</option>
                        <option value="CIE A-Levels">Cambridge CIE A-Levels</option>
                        <option value="AP Curriculum">US Advanced Placement Curriculum</option>
                      </select>
                      {errors.board && <p className="text-[10px] text-red-500 font-medium">{errors.board}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="marksPercentage" className="text-xs font-semibold text-slate-700">Marks Percentage / GPA % <span className="text-red-500">*</span></label>
                        <input
                          id="marksPercentage"
                          type="number"
                          step="0.01"
                          name="marksPercentage"
                          required
                          value={formData.academicDetails.marksPercentage || ''}
                          onChange={handleAcademicChange}
                          placeholder="e.g. 85.50"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                            errors.marksPercentage ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                          }`}
                        />
                        {errors.marksPercentage && <p className="text-[10px] text-red-500 font-medium">{errors.marksPercentage}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="yearOfPassing" className="text-xs font-semibold text-slate-700">Year of Passing <span className="text-red-500">*</span></label>
                        <select
                          id="yearOfPassing"
                          name="yearOfPassing"
                          required
                          value={formData.academicDetails.yearOfPassing}
                          onChange={handleAcademicChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                            errors.yearOfPassing ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                          }`}
                        >
                          <option value="">Year...</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                        {errors.yearOfPassing && <p className="text-[10px] text-red-500 font-medium">{errors.yearOfPassing}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- STEP 3: COURSE PREFERENCE ---------- */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Building className="h-5 w-5 text-blue-600" />
                      Academic Course Preferences
                    </h2>
                    <p className="text-xs text-slate-500">Choose your target major of study and a secondary preference stream.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="space-y-1.5">
                      <label htmlFor="coursePreference1" className="text-xs font-semibold text-slate-700">Course Preference 1 (Primary Goal) <span className="text-red-500">*</span></label>
                      <select
                        id="coursePreference1"
                        value={formData.coursePreference1}
                        onChange={(e) => setFormData({ ...formData, coursePreference1: e.target.value })}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                          errors.coursePreference1 ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Choose program...</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.coursePreference1 && <p className="text-[10px] text-red-500 font-medium">{errors.coursePreference1}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="coursePreference2" className="text-xs font-semibold text-slate-700">Course Preference 2 (Alternate Back-up)</label>
                      <select
                        id="coursePreference2"
                        value={formData.coursePreference2}
                        onChange={(e) => setFormData({ ...formData, coursePreference2: e.target.value })}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden ${
                          errors.coursePreference2 ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Choose program...</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.coursePreference2 && <p className="text-[10px] text-red-500 font-medium">{errors.coursePreference2}</p>}
                    </div>

                  </div>
                </div>
              )}

              {/* ---------- STEP 4: DOCUMENT UPLOADER ---------- */}
              {step === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Upload className="h-5 w-5 text-blue-600" />
                      Upload Mandatory Certificates
                    </h2>
                    <p className="text-xs text-slate-500">Provide official documentation scans (Limit: 2MB per file, formats: JPG, PNG).</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Doc 1: Photo */}
                    <div className="space-y-2 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">Applicant Photo <span className="text-red-500">*</span></span>
                        
                        {formData.documents.photoUrl ? (
                          <div className="relative aspect-square w-32 mx-auto rounded-lg overflow-hidden border border-slate-200">
                            <img src={formData.documents.photoUrl} alt="Photo Preview" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square w-32 mx-auto rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-3">
                            <User className="h-8 w-8 text-slate-300 mb-1" />
                            <span className="text-[10px] text-slate-500">Passport photo (Square ratio)</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="w-full block py-1.5 text-center text-xs font-semibold bg-slate-100 text-slate-700 rounded-md border hover:bg-slate-200 transition-all cursor-pointer">
                          Upload Photo
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} className="hidden" />
                        </label>
                        {errors.photo && <p className="text-[10px] text-red-500 font-medium text-center mt-1">{errors.photo}</p>}
                      </div>
                    </div>

                    {/* Doc 2: Marksheet */}
                    <div className="space-y-2 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">Academic Marksheet <span className="text-red-500">*</span></span>
                        
                        {formData.documents.marksheetUrl ? (
                          <div className="relative aspect-square w-32 mx-auto rounded-lg overflow-hidden border border-slate-200">
                            <img src={formData.documents.marksheetUrl} alt="Marksheet Preview" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square w-32 mx-auto rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-3">
                            <FileText className="h-8 w-8 text-slate-300 mb-1" />
                            <span className="text-[10px] text-slate-500">10+2 Grade sheet Scan</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="w-full block py-1.5 text-center text-xs font-semibold bg-slate-100 text-slate-700 rounded-md border hover:bg-slate-200 transition-all cursor-pointer">
                          Upload Transcript
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'marksheet')} className="hidden" />
                        </label>
                        {errors.marksheet && <p className="text-[10px] text-red-500 font-medium text-center mt-1">{errors.marksheet}</p>}
                      </div>
                    </div>

                    {/* Doc 3: ID Proof */}
                    <div className="space-y-2 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">ID Proof Scan <span className="text-red-500">*</span></span>
                        
                        {formData.documents.idProofUrl ? (
                          <div className="relative aspect-square w-32 mx-auto rounded-lg overflow-hidden border border-slate-200">
                            <img src={formData.documents.idProofUrl} alt="ID Preview" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square w-32 mx-auto rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-3">
                            <ShieldAlert className="h-8 w-8 text-slate-300 mb-1" />
                            <span className="text-[10px] text-slate-500">Passport / License Scan</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="w-full block py-1.5 text-center text-xs font-semibold bg-slate-100 text-slate-700 rounded-md border hover:bg-slate-200 transition-all cursor-pointer">
                          Upload Government ID
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'idProof')} className="hidden" />
                        </label>
                        {errors.idProof && <p className="text-[10px] text-red-500 font-medium text-center mt-1">{errors.idProof}</p>}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ---------- STEP 5: FINAL DOSSIER REVIEW ---------- */}
              {step === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCheck className="h-5 w-5 text-blue-600" />
                      Review and Certify Details
                    </h2>
                    <p className="text-xs text-slate-500">Double check your application profile. Once submitted, records cannot be modified.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-150">
                      <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">Personal Identity</h3>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div>Name: <strong className="text-slate-800">{formData.personalDetails.fullName}</strong></div>
                        <div>Date of Birth: <span className="font-mono">{formData.personalDetails.dob}</span> ({formData.personalDetails.gender})</div>
                        <div>Mobile Phone: <span className="font-mono">{formData.personalDetails.phone}</span></div>
                        <div>Address: <span className="text-slate-700">{formData.personalDetails.address}</span></div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-150">
                      <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">Academic Merit & Stream</h3>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div>High School: <span className="text-slate-700 font-medium">{formData.academicDetails.previousSchool}</span></div>
                        <div>Board: <span className="text-slate-700">{formData.academicDetails.board}</span></div>
                        <div>Merit Marks Score: <strong className="text-blue-600 font-mono">{formData.academicDetails.marksPercentage}%</strong></div>
                        <div>Preference 1: <strong className="text-slate-800">{getCourseName(formData.coursePreference1)}</strong></div>
                        {formData.coursePreference2 && (
                          <div>Preference 2: <span className="text-slate-600">{getCourseName(formData.coursePreference2)}</span></div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg text-xs text-blue-800 leading-relaxed border border-blue-100">
                    <strong>Institutional Declaration:</strong> I hereby certify that the academic scores and documents uploaded are authentic. I understand that supplying forged transcripts will lead to immediate cancellation of admission and disciplinary oversight.
                  </div>
                </div>
              )}

              {/* Action Buttons (Footer of Form) */}
              <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-100">
                <div>
                  {step > 1 && (
                    <button
                      onClick={handlePrev}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                  >
                    Save Draft
                  </button>

                  {step < 5 ? (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitFinal}
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      Submit Application
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
