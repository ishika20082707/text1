import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeacon } from '../context/BeaconContext';
import { Application, Course } from '../data/mockData';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  Trash2,
  Plus,
  Edit2,
  X,
  FileSpreadsheet,
  GraduationCap,
  Eye,
  FileText,
  Building,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Settings,
  AlertTriangle,
  Award
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    applications,
    updateApplicationStatus,
    addCourse,
    updateCourse,
    deleteCourse,
    showToast
  } = useBeacon();

  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'admin') {
      navigate('/student/dashboard');
    }
  }, [currentUser, navigate]);

  // Tab selections within Admin Workspace
  const [activeTab, setActiveTab] = useState<'applications' | 'courses'>('applications');

  // Table filters & controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'marks' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Selected Application for detail modal inspection
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');

  // Course CRUD state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<Course>({
    id: '',
    name: '',
    duration: '',
    eligibility: '',
    seats: 60,
    fees: '',
    description: ''
  });

  // Calculate Application Stats
  const stats = useMemo(() => {
    const total = applications.filter((a) => a.status !== 'Draft').length;
    const pending = applications.filter((a) => a.status === 'Submitted' || a.status === 'Under Review').length;
    const approved = applications.filter((a) => a.status === 'Approved').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;
    const waitlisted = applications.filter((a) => a.status === 'Waitlisted').length;
    
    return { total, pending, approved, rejected, waitlisted };
  }, [applications]);

  // Calculate Applications by Course (for beautiful bar chart)
  const applicationsByCourse = useMemo(() => {
    const counts: Record<string, number> = {};
    // Initialize
    courses.forEach((c) => {
      counts[c.name] = 0;
    });

    // Populate
    applications.forEach((app) => {
      if (app.status !== 'Draft') {
        const cName = courses.find((c) => c.id === app.coursePreference1)?.name;
        if (cName) {
          counts[cName] = (counts[cName] || 0) + 1;
        }
      }
    });

    return Object.entries(counts).map(([courseName, count]) => ({
      courseName,
      count
    }));
  }, [applications, courses]);

  // Filters, search, and sort applications
  const processedApplications = useMemo(() => {
    let result = applications.filter((app) => app.status !== 'Draft');

    // Search term matching
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.personalDetails.fullName.toLowerCase().includes(q) ||
          app.personalDetails.email.toLowerCase().includes(q) ||
          app.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Course filter
    if (courseFilter !== 'all') {
      result = result.filter((app) => app.coursePreference1 === courseFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.personalDetails.fullName.localeCompare(b.personalDetails.fullName);
      } else if (sortField === 'marks') {
        comparison = a.academicDetails.marksPercentage - b.academicDetails.marksPercentage;
      } else if (sortField === 'date') {
        comparison = a.submittedDate.localeCompare(b.submittedDate);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [applications, searchTerm, statusFilter, courseFilter, sortField, sortOrder]);

  // Paginated applications
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedApplications.slice(startIndex, startIndex + rowsPerPage);
  }, [processedApplications, currentPage]);

  const totalPages = Math.ceil(processedApplications.length / rowsPerPage) || 1;

  // Toggle Sorting
  const toggleSort = (field: 'name' | 'marks' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // CSV Export Trigger
  const handleExportCSV = () => {
    // Generate CSV lines
    const headers = 'Application ID,Student Name,Email,Phone,DOB,Previous School,Marks (%),First Preference,Second Preference,Submitted Date,Status,Admin Remarks';
    const rows = applications
      .filter((app) => app.status !== 'Draft')
      .map((app) => {
        const pd = app.personalDetails;
        const ad = app.academicDetails;
        const c1Name = courses.find((c) => c.id === app.coursePreference1)?.name || '';
        const c2Name = courses.find((c) => c.id === app.coursePreference2)?.name || '';
        
        return `"${app.id}","${pd.fullName}","${pd.email}","${pd.phone}","${pd.dob}","${ad.previousSchool}",${ad.marksPercentage},"${c1Name}","${c2Name}","${app.submittedDate}","${app.status}","${app.remarks.replace(/"/g, '""')}"`;
      });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'beacon_college_applications_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Applications database exported successfully as CSV!', 'success');
  };

  // Inspect application detail
  const handleInspectApp = (app: Application) => {
    setSelectedApp(app);
    setAdminRemarks(app.remarks);
  };

  const handleUpdateStatus = (status: Application['status']) => {
    if (selectedApp) {
      updateApplicationStatus(selectedApp.id, status, adminRemarks);
      // Update local state copy to immediately reflect in modal
      setSelectedApp({
        ...selectedApp,
        status,
        remarks: adminRemarks
      });
    }
  };

  // Course CRUD handlers
  const handleOpenCourseModal = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm(course);
    } else {
      setEditingCourse(null);
      setCourseForm({
        id: '',
        name: '',
        duration: '',
        eligibility: '',
        seats: 60,
        fees: '',
        description: ''
      });
    }
    setCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.id || !courseForm.name || !courseForm.duration || !courseForm.fees) {
      showToast('Please fulfill all mandatory program fields.', 'error');
      return;
    }

    if (editingCourse) {
      updateCourse(courseForm);
    } else {
      const added = addCourse(courseForm);
      if (!added) return; // duplicate validation failed
    }

    setCourseModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course from the institution roster?')) {
      deleteCourse(id);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Admin Section Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="h-7 w-7 text-blue-600" />
              Beacon Administration Workspace
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Review documents, modify student statuses, allocate seats, and manage course configurations.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={() => {
                navigate('/');
                showToast('Returned to main website view.', 'info');
              }}
              className="px-4 py-2.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
            >
              Back to Website
            </button>
          </div>
        </div>

        {/* 1. Dashboard Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Applications</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">{stats.total}</span>
              <Users className="h-5 w-5 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Pending Audit</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold font-mono text-amber-600 tabular-nums">{stats.pending}</span>
              <Clock className="h-5 w-5 text-amber-200" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Approved / Accepted</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold font-mono text-emerald-600 tabular-nums">{stats.approved}</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Waitlisted Seats</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold font-mono text-blue-600 tabular-nums">{stats.waitlisted}</span>
              <AlertCircle className="h-5 w-5 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Rejected Files</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold font-mono text-red-600 tabular-nums">{stats.rejected}</span>
              <AlertCircle className="h-5 w-5 text-red-200" />
            </div>
          </div>
        </div>

        {/* 2. Applications by Course Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Application Density by Academic Program</h3>
            <p className="text-[11px] text-slate-500">Live summary showing the count of submitted first-preference candidatures.</p>
          </div>

          <div className="space-y-3 pt-2">
            {applicationsByCourse.map((item, idx) => {
              // Calculate percent width
              const maxCount = Math.max(...applicationsByCourse.map((x) => x.count)) || 1;
              const percent = Math.min(100, Math.round((item.count / maxCount) * 100));

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate max-w-[250px] sm:max-w-md">{item.courseName}</span>
                    <span className="font-mono text-blue-600 font-bold tabular-nums">{item.count} Apps</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Selection Area */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-5 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'applications' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Dossiers Review ({processedApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'courses' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Manage Programs ({courses.length})
          </button>
        </div>

        {/* ----------------- TAB: APPLICATIONS REVIEW ----------------- */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            
            {/* Filter controls */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Search bar */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Select filters */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={courseFilter}
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="all">All Programs</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.id.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Application Data Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Dossier ID</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('name')}>
                      Student Profile {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4">Desired Program</th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('marks')}>
                      Marks Score {sortField === 'marks' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('date')}>
                      Submission {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {paginatedApplications.length > 0 ? (
                    paginatedApplications.map((app) => {
                      let statusBadge = 'text-blue-600 bg-blue-50';
                      if (app.status === 'Under Review') statusBadge = 'text-amber-600 bg-amber-50';
                      if (app.status === 'Approved') statusBadge = 'text-emerald-600 bg-emerald-50';
                      if (app.status === 'Waitlisted') statusBadge = 'text-orange-600 bg-orange-50';
                      if (app.status === 'Rejected') statusBadge = 'text-red-600 bg-red-50';

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold tracking-tight text-slate-900">{app.id}</td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900">{app.personalDetails.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{app.personalDetails.email}</div>
                          </td>
                          <td className="p-4 font-medium text-slate-800">{courses.find((c) => c.id === app.coursePreference1)?.id.toUpperCase() || 'CSE'}</td>
                          <td className="p-4 font-mono font-bold text-blue-600 tabular-nums">{app.academicDetails.marksPercentage}%</td>
                          <td className="p-4 font-mono text-slate-400 tabular-nums">{app.submittedDate}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 font-semibold text-[10px] uppercase px-2 py-0.5 rounded-sm ${statusBadge}`}>
                              <span className={`w-1 h-1 rounded-full ${app.status === 'Approved' ? 'bg-emerald-500' : app.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleInspectApp(app)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-all flex items-center gap-1.5 ml-auto"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No active admissions dossiers found matching current search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="p-4 border-t border-slate-150 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
              <div>
                Showing <strong className="text-slate-700">{processedApplications.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to{' '}
                <strong className="text-slate-700">{Math.min(currentPage * rowsPerPage, processedApplications.length)}</strong> of{' '}
                <strong className="text-slate-700">{processedApplications.length}</strong> dossiers
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2.5 py-1 text-xs font-semibold font-mono text-slate-700">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB: MANAGE COURSES (CRUD) ----------------- */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-slate-900">Institutional Roster of Academic Degrees</h3>
              <button
                onClick={() => handleOpenCourseModal(null)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Academic Course
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">{course.id}</span>
                      
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenCourseModal(course)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-slate-900 text-sm leading-tight">{course.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{course.description}</p>

                    <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div><strong className="text-slate-700 font-medium">Duration:</strong> {course.duration}</div>
                      <div><strong className="text-slate-700 font-medium">Intake Seats:</strong> <span className="font-mono tabular-nums font-semibold">{course.seats}</span></div>
                      <div><strong className="text-slate-700 font-medium">Annual Fee:</strong> <span className="font-mono tabular-nums font-semibold text-blue-600">{course.fees}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- MODAL: DOSSIER INSPECTOR ----------------- */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl flex flex-col justify-between animate-fadeIn">
              
              {/* Modal Header */}
              <div className="p-4 md:p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Admissions Dossier Inspector</span>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">DOCKET ID: {selectedApp.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 text-slate-700 text-xs leading-relaxed">
                
                {/* 1. Student Identity */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Photo Headshot Left */}
                  <div className="md:col-span-3 text-center space-y-2">
                    {selectedApp.documents.photoUrl ? (
                      <div className="aspect-square w-28 mx-auto rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={selectedApp.documents.photoUrl} alt="Photo ID" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-square w-24 bg-slate-100 rounded-lg flex items-center justify-center mx-auto text-slate-300">
                        <Users className="h-8 w-8" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 block truncate">{selectedApp.documents.photoName || 'photo_headshot.jpg'}</span>
                  </div>

                  {/* Core Personal/Academic Details Right */}
                  <div className="md:col-span-9 space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Student Personal Profile</span>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                        <div>Name: <strong className="text-slate-900">{selectedApp.personalDetails.fullName}</strong></div>
                        <div>DOB: <span className="font-mono">{selectedApp.personalDetails.dob}</span> ({selectedApp.personalDetails.gender})</div>
                        <div>Phone: <span className="font-mono">{selectedApp.personalDetails.phone}</span></div>
                        <div>Email: <span className="font-mono text-blue-600">{selectedApp.personalDetails.email}</span></div>
                        <div className="col-span-2">Address: <span className="text-slate-800">{selectedApp.personalDetails.address}</span></div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Academic Achievement Summary</span>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                        <div>School: <span className="font-medium text-slate-800">{selectedApp.academicDetails.previousSchool}</span></div>
                        <div>Board: <span className="text-slate-700">{selectedApp.academicDetails.board}</span></div>
                        <div>Merit Marks Percentage: <strong className="text-blue-600 font-mono">{selectedApp.academicDetails.marksPercentage}%</strong></div>
                        <div>Passing Year: <span className="font-mono">{selectedApp.academicDetails.yearOfPassing}</span></div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Program Preferences & File Attachments */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Selected Preferences & Official Credentials</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <div className="font-semibold text-slate-900">Course Preference 1 (Primary Goal)</div>
                      <div className="text-blue-600 font-medium mt-1">{courses.find((c) => c.id === selectedApp.coursePreference1)?.name || selectedApp.coursePreference1}</div>
                      {selectedApp.coursePreference2 && (
                        <div className="text-slate-500 mt-2">
                          <span className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">Preference 2:</span> {courses.find((c) => c.id === selectedApp.coursePreference2)?.name || selectedApp.coursePreference2}
                        </div>
                      )}
                    </div>

                    {/* Transcripts visual previews */}
                    <div className="bg-slate-50 rounded-lg p-3 border flex flex-col justify-between">
                      <div className="font-semibold text-slate-900">Certificate Credentials</div>
                      <div className="flex gap-2.5 mt-2">
                        {selectedApp.documents.marksheetUrl ? (
                          <a href={selectedApp.documents.marksheetUrl} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-lg border hover:bg-blue-50/50 flex items-center gap-1.5 font-semibold text-[10px] tracking-tight truncate max-w-[140px]" title="Inspect Marks Sheet">
                            <FileText className="h-4 w-4 text-slate-400" />
                            Marksheet File
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No marksheet uploaded.</span>
                        )}

                        {selectedApp.documents.idProofUrl ? (
                          <a href={selectedApp.documents.idProofUrl} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-lg border hover:bg-blue-50/50 flex items-center gap-1.5 font-semibold text-[10px] tracking-tight truncate max-w-[140px]" title="Inspect ID Scan">
                            <Award className="h-4 w-4 text-slate-400" />
                            ID Proof File
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No ID uploaded.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Status Action & Remarks */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label htmlFor="modal-remarks" className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Admissions panel remarks / decision reason</label>
                  <textarea
                    id="modal-remarks"
                    rows={3}
                    placeholder="Provide reasons for Approval, Waitlisting, or Rejecting candidate details..."
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                  ></textarea>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                    <span className="text-xs font-semibold text-slate-700">Dossier Admissions Decision:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus('Approved')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-100 cursor-pointer ${
                          selectedApp.status === 'Approved' ? 'ring-2 ring-emerald-500 font-bold' : ''
                        }`}
                      >
                        Approve Candidate
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('Waitlisted')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-100 cursor-pointer ${
                          selectedApp.status === 'Waitlisted' ? 'ring-2 ring-amber-500 font-bold' : ''
                        }`}
                      >
                        Waitlist Seat
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('Rejected')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-100 cursor-pointer ${
                          selectedApp.status === 'Rejected' ? 'ring-2 ring-rose-500 font-bold' : ''
                        }`}
                      >
                        Reject dossier
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-150 flex justify-end bg-slate-50">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Close Inspector
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- MODAL: COURSE CREATION/EDIT ----------------- */}
        {courseModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full border shadow-2xl flex flex-col justify-between animate-fadeIn">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {editingCourse ? 'Edit Academic Course' : 'Create Academic Course'}
                </h3>
                <button onClick={() => setCourseModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSaveCourse} className="p-5 space-y-4 text-xs text-slate-700">
                
                <div className="space-y-1">
                  <label htmlFor="course-id" className="font-semibold text-slate-600 block">Course Key / ID Code (Lowercase, unique)</label>
                  <input
                    id="course-id"
                    type="text"
                    required
                    disabled={!!editingCourse}
                    placeholder="e.g. mbbs"
                    value={courseForm.id}
                    onChange={(e) => setCourseForm({ ...courseForm, id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="course-name" className="font-semibold text-slate-600 block">Full Program Name</label>
                  <input
                    id="course-name"
                    type="text"
                    required
                    placeholder="e.g. Master of Science in AI"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="course-duration" className="font-semibold text-slate-600 block">Duration</label>
                    <input
                      id="course-duration"
                      type="text"
                      required
                      placeholder="e.g. 3 Years (6 Semesters)"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="course-seats" className="font-semibold text-slate-600 block">Intake Seats Limit</label>
                    <input
                      id="course-seats"
                      type="number"
                      required
                      placeholder="60"
                      value={courseForm.seats}
                      onChange={(e) => setCourseForm({ ...courseForm, seats: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="course-fees" className="font-semibold text-slate-600 block">Annual Tuition Fees</label>
                  <input
                    id="course-fees"
                    type="text"
                    required
                    placeholder="e.g. $4,000 / year"
                    value={courseForm.fees}
                    onChange={(e) => setCourseForm({ ...courseForm, fees: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="course-eligibility" className="font-semibold text-slate-600 block">Eligibility Requirements</label>
                  <input
                    id="course-eligibility"
                    type="text"
                    required
                    placeholder="e.g. 10+2 with minimum 60% in Science/Math"
                    value={courseForm.eligibility}
                    onChange={(e) => setCourseForm({ ...courseForm, eligibility: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="course-desc" className="font-semibold text-slate-600 block">Short Description</label>
                  <textarea
                    id="course-desc"
                    rows={3}
                    required
                    placeholder="Provide overview of syllabus and core specializations..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                  ></textarea>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCourseModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    Save Program Details
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
