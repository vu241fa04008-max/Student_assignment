import React, { useState, useEffect, useMemo } from 'react';
import AuthPage from './components/AuthPage';
import AcademicHeroBanner from './components/AcademicHeroBanner';
import AssignmentForm from './components/AssignmentForm';
import AssignmentStats from './components/AssignmentStats';
import FilterBar from './components/FilterBar';
import SectionView from './components/SectionView';
import SubmitPdfModal from './components/SubmitPdfModal';
import StudentSubmissionsView from './components/StudentSubmissionsView';
import FacultySubmissionsReview from './components/FacultySubmissionsReview';
import PdfViewerModal from './components/PdfViewerModal';
import { formatAcademicDate, getRelativeDeadline } from './utils/dateUtils';
import {
  fetchAssignmentsApi,
  createAssignmentApi,
  updateAssignmentApi,
  deleteAssignmentApi,
  fetchSubmissionsApi,
  submitAssignmentApi,
  gradeSubmissionApi,
  checkServerHealth
} from './services/api';
import {
  R22_C24_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  DEFAULT_STUDENT_USER,
  DEFAULT_FACULTY_USER
} from './data/r22c24Courses';

const ASSIGNMENTS_STORAGE_KEY = 'vignan_r22_assignments_v5';
const SUBMISSIONS_STORAGE_KEY = 'vignan_r22_submissions_v5';
const USER_STORAGE_KEY = 'vignan_r22_user_v5';

export default function App() {
  // 1. Current Authenticated User (Student ID 241FA04008 or Faculty)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Failed to load user', e);
    }
    return DEFAULT_STUDENT_USER; // Default to student 241FA04008
  });

  // 2. Navigation Bar Active Tab: 'dashboard' | 'assignments' | 'submitted'
  const [activeNavTab, setActiveNavTab] = useState('dashboard');

  // 3. Assignments State (Managed by Faculty)
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load assignments', e);
    }
    return INITIAL_ASSIGNMENTS;
  });

  // 4. Submissions State (Submitted in PDF by students, reviewed by faculty)
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load submissions', e);
    }
    return INITIAL_SUBMISSIONS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
    } catch (e) {}
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
    } catch (e) {}
  }, [submissions]);

  // MongoDB Atlas Backend Connection & Initial Sync
  const [serverHealth, setServerHealth] = useState(null);

  useEffect(() => {
    checkServerHealth().then((health) => {
      if (health) setServerHealth(health);
    });

    fetchAssignmentsApi(assignments).then((data) => {
      if (data && data.length > 0) setAssignments(data);
    });

    fetchSubmissionsApi(null, submissions).then((data) => {
      if (data && data.length > 0) setSubmissions(data);
    });
  }, []);

  // UI State
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline-asc');
  const [viewMode, setViewMode] = useState('timeline');
  const [notification, setNotification] = useState(null);

  // Modals state
  const [activeSubmitAsg, setActiveSubmitAsg] = useState(null); // assignment being submitted by student
  const [activePdfPreview, setActivePdfPreview] = useState(null); // submission object for PDF preview

  const isStudent = currentUser?.role === 'student';
  const isFaculty = currentUser?.role === 'faculty';

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  // --- AUTH HANDLERS ---
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveNavTab('dashboard');
    triggerNotification(`Logged in as ${user.name} (${user.role === 'student' ? user.regNumber : user.facultyId})`);
  };

  const handleSignOut = () => {
    if (window.confirm('Sign out of Vignan Academic Portal?')) {
      setCurrentUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      triggerNotification('Signed out of academic session', 'info');
    }
  };

  // --- FACULTY ASSIGNMENT CRUD (RESTRICTED TO FACULTY) ---
  const handleSaveAssignment = async (formData) => {
    if (!isFaculty) {
      alert('Unauthorized: Only faculty members can author assignments.');
      return;
    }

    if (editingAssignment) {
      const updated = await updateAssignmentApi(editingAssignment.id, formData);
      setAssignments((prev) =>
        prev.map((item) => (item.id === editingAssignment.id ? updated : item))
      );
      setEditingAssignment(null);
      triggerNotification('R22 C24 Coursework Assignment updated successfully');
    } else {
      const created = await createAssignmentApi(formData);
      setAssignments((prev) => [created, ...prev]);
      triggerNotification('New assignment published to student portal & database');
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!isFaculty) {
      alert('Unauthorized: Only faculty members can delete assignments.');
      return;
    }

    const item = assignments.find((a) => a.id === id);
    if (!item) return;

    if (window.confirm(`Delete assignment "${item.title}"? This cannot be undone.`)) {
      await deleteAssignmentApi(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      if (editingAssignment?.id === id) setEditingAssignment(null);
      triggerNotification('Assignment record deleted', 'info');
    }
  };

  const handleStartEdit = (assignment) => {
    if (!isFaculty) return;
    setEditingAssignment(assignment);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // --- STUDENT PDF SUBMISSION HANDLER ---
  const handlePdfSubmitSuccess = async (submissionRecord) => {
    const saved = await submitAssignmentApi(submissionRecord);
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.assignmentId === saved.assignmentId && s.studentId === saved.studentId)
      );
      return [saved, ...filtered];
    });

    triggerNotification(
      `Assignment submitted in PDF format! Dispatched to MongoDB & faculty desk.`,
      'success'
    );
  };

  // --- FACULTY GRADING HANDLER ---
  const handleGradeSubmission = async (submissionId, gradeData) => {
    const updated = await gradeSubmissionApi(submissionId, gradeData);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, ...updated } : s))
    );
    triggerNotification('Marks and feedback recorded in database!', 'success');
  };

  // --- RESET DEMO DATA ---
  const handleResetDemoData = () => {
    if (window.confirm('Reset all R22 C24 coursework and submission data to default university records?')) {
      setAssignments(INITIAL_ASSIGNMENTS);
      setSubmissions(INITIAL_SUBMISSIONS);
      setEditingAssignment(null);
      triggerNotification('Default R22 C24 data restored', 'info');
    }
  };

  // Student specific submissions list
  const studentSubmissions = useMemo(() => {
    const reg = currentUser?.regNumber || '241FA04008';
    return submissions.filter((s) => s.studentId === reg);
  }, [submissions, currentUser]);

  // Filtered Assignments for Coursework view
  const filteredAssignments = useMemo(() => {
    const studentSubmissionsMap = {};
    studentSubmissions.forEach((sub) => {
      studentSubmissionsMap[sub.assignmentId] = true;
    });

    return assignments
      .filter((assignment) => {
        // Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = assignment.title.toLowerCase().includes(query);
          const matchSub = assignment.subject.toLowerCase().includes(query);
          const matchCode = (assignment.courseCode || '').toLowerCase().includes(query);
          const matchDesc = (assignment.description || '').toLowerCase().includes(query);
          if (!matchTitle && !matchSub && !matchCode && !matchDesc) return false;
        }

        // Course filter
        if (selectedSubject !== 'all' && assignment.courseCode !== selectedSubject) {
          return false;
        }

        // Priority filter
        if (selectedPriority !== 'all' && assignment.priority !== selectedPriority) {
          return false;
        }

        // Status filter for students
        if (isStudent) {
          const hasSubmitted = !!studentSubmissionsMap[assignment.id];
          if (statusFilter === 'pending' && hasSubmitted) return false;
          if (statusFilter === 'completed' && !hasSubmitted) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline-asc') {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        if (sortBy === 'deadline-desc') {
          return new Date(b.deadline) - new Date(a.deadline);
        }
        if (sortBy === 'priority-desc') {
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [assignments, studentSubmissions, searchQuery, selectedSubject, selectedPriority, statusFilter, sortBy, isStudent]);

  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'Pending Verification').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between">
      <div>
        
        {/* Top Institutional Header */}
        <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Crest & Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                V
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">
                    Vignan's Student Assignment Portal
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                    R22 C24 Regulation
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Vignan's Foundation for Science, Technology & Research (Deemed to be University)
                </div>
              </div>
            </div>

            {/* Profile & Session Controls (Role Switch Button Removed as requested) */}
            <div className="flex items-center gap-3 self-end md:self-auto text-xs">
              
              {/* User Identity Chip */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold">{currentUser.name}</span>
                  <span className="text-slate-400 ml-1.5 font-mono">
                    ({isStudent ? currentUser.regNumber : currentUser.facultyId})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetDemoData}
                title="Reset sample data"
                className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer transition-colors"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out of portal"
                className="px-2.5 py-1.5 rounded border border-red-900 bg-red-950/80 hover:bg-red-900 text-red-200 font-medium cursor-pointer transition-colors"
              >
                Sign Out
              </button>

            </div>
          </div>

          {/* MAIN INSTITUTIONAL NAVIGATION BAR (Dashboard • Assignments • Submitted Assignments) */}
          <div className="bg-slate-950/90 border-t border-slate-800 backdrop-blur-xs">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              
              <nav className="flex items-center space-x-1 sm:space-x-2 py-1.5 overflow-x-auto text-xs">
                
                {/* 1. Dashboard Tab */}
                <button
                  type="button"
                  onClick={() => setActiveNavTab('dashboard')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeNavTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </button>

                {/* 2. Assignments Tab */}
                <button
                  type="button"
                  onClick={() => setActiveNavTab('assignments')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeNavTab === 'assignments'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>📚</span>
                  <span>Assignments</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeNavTab === 'assignments' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {assignments.length}
                  </span>
                </button>

                {/* 3. Submitted Assignments Tab */}
                <button
                  type="button"
                  onClick={() => setActiveNavTab('submitted')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeNavTab === 'submitted'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>📄</span>
                  <span>Submitted Assignments</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeNavTab === 'submitted' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isStudent ? studentSubmissions.length : submissions.length}
                  </span>
                  {isFaculty && pendingSubmissionsCount > 0 && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-amber-400 text-slate-900 font-extrabold animate-pulse">
                      {pendingSubmissionsCount} Pending
                    </span>
                  )}
                </button>

              </nav>

              <div className="hidden md:flex items-center gap-2.5 text-[11px] text-slate-400">
                <div
                  title="MongoDB Atlas Database Status"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[10px] font-semibold ${
                    serverHealth?.database?.connected
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${serverHealth?.database?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>Atlas: {serverHealth?.database?.connected ? 'Connected' : 'vu241fa04008_db_user'}</span>
                </div>

                <span>Current Role:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded border ${
                    isStudent
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : 'bg-purple-950 text-purple-300 border-purple-800'
                  }`}
                >
                  {isStudent ? 'Student (241FA04008)' : 'Faculty Reviewer'}
                </span>
              </div>

            </div>
          </div>
        </header>

        {/* Floating Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div
              className={`px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border ${
                notification.type === 'info'
                  ? 'bg-slate-900 text-white border-slate-800'
                  : 'bg-emerald-700 text-white border-emerald-600'
              }`}
            >
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Main Content Area Controlled by Navigation Bar */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">
          
          {/* ==================== 1. DASHBOARD VIEW ==================== */}
          {activeNavTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Academic Hero Banner */}
              <AcademicHeroBanner currentUser={currentUser} />

              {/* Academic KPI Cards */}
              <AssignmentStats
                assignments={assignments}
                submissions={submissions}
                currentUser={currentUser}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
              />

              {/* Quick Actions & Recent Activity 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Upcoming Coursework Deadlines */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⏰</span>
                      <h2 className="text-sm font-bold text-slate-900">Upcoming Coursework Deadlines</h2>
                    </div>
                    <button
                      onClick={() => setActiveNavTab('assignments')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      View All in Assignments →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {assignments.slice(0, 3).map((asg) => {
                      const hasSubmitted = studentSubmissions.some((s) => s.assignmentId === asg.id);
                      const relative = getRelativeDeadline(asg.deadline);

                      return (
                        <div
                          key={asg.id}
                          className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                                {asg.courseCode}
                              </span>
                              <span className="text-xs font-bold text-slate-800 line-clamp-1">{asg.title}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Deadline: <strong className="text-slate-700">{formatAcademicDate(asg.deadline)}</strong> ({relative.label})
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isStudent ? (
                              hasSubmitted ? (
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                                  ✓ Submitted in PDF
                                </span>
                              ) : (
                                <button
                                  onClick={() => setActiveSubmitAsg(asg)}
                                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                                >
                                  Submit PDF
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveNavTab('assignments');
                                  handleStartEdit(asg);
                                }}
                                className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded shadow-xs cursor-pointer"
                              >
                                Edit Task
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Submission Status / Faculty Queue */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{isStudent ? '📄' : '📥'}</span>
                      <h2 className="text-sm font-bold text-slate-900">
                        {isStudent ? 'My Submissions Status' : 'Submissions Review Desk'}
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveNavTab('submitted')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {isStudent ? (
                    <div className="space-y-3">
                      {studentSubmissions.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-500">
                          No submissions uploaded yet. Choose an assignment to submit in PDF.
                        </div>
                      ) : (
                        studentSubmissions.slice(0, 3).map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-slate-800 line-clamp-1">{sub.assignmentTitle}</div>
                              <div className="text-[11px] font-mono text-slate-500">{sub.fileName}</div>
                            </div>
                            <div className="text-right">
                              {sub.status === 'Graded' ? (
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {sub.marksAwarded} / {sub.maxMarks} Marks
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  In Review
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      <button
                        onClick={() => setActiveNavTab('submitted')}
                        className="w-full mt-3 py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer text-center block"
                      >
                        Open Submitted Assignments Tab
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-600">Total Student PDFs:</span>
                          <span className="font-bold text-slate-900">{submissions.length}</span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-600">Awaiting Evaluation:</span>
                          <span className="font-bold text-amber-700">{pendingSubmissionsCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-600">Evaluated & Recorded:</span>
                          <span className="font-bold text-emerald-700">{submissions.length - pendingSubmissionsCount}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveNavTab('submitted')}
                        className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-center block"
                      >
                        Inspect & Grade Submissions Inbox
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ==================== 2. ASSIGNMENTS VIEW ==================== */}
          {activeNavTab === 'assignments' && (
            <div className="space-y-6">
              
              {/* Header Banner for Assignments */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      R22 C24 Coursework Assignments
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isFaculty
                      ? 'Author, edit, and organize official semester assignments for Computer Science courses'
                      : 'View your enrolled subject assignments, track due dates, and submit solutions in PDF format'}
                  </p>
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Total Active Coursework: <strong className="text-slate-800 font-bold">{assignments.length}</strong>
                </div>
              </div>

              {/* Main Coursework Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Assignment Form (Only Faculty can create/edit; informative notice for students) */}
                <div className="lg:col-span-5 lg:sticky lg:top-24">
                  <AssignmentForm
                    editingAssignment={editingAssignment}
                    currentUser={currentUser}
                    onSubmitAssignment={handleSaveAssignment}
                    onCancelEdit={() => setEditingAssignment(null)}
                  />
                </div>

                {/* Right Column: Filter Bar & Assignment Cards */}
                <div className="lg:col-span-7">
                  <FilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedSubject={selectedSubject}
                    onSubjectChange={setSelectedSubject}
                    selectedPriority={selectedPriority}
                    onPriorityChange={setSelectedPriority}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />

                  {/* Filter Indicator */}
                  {isStudent && statusFilter !== 'all' && (
                    <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg text-xs text-blue-900 font-medium">
                      <span>
                        Filtering: <strong>{statusFilter.toUpperCase()}</strong> ({filteredAssignments.length} records)
                      </span>
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="underline hover:text-blue-950 font-bold cursor-pointer"
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}

                  {/* Section View with PDF submission & preview triggers */}
                  <SectionView
                    assignments={filteredAssignments}
                    submissions={submissions}
                    currentUser={currentUser}
                    viewMode={viewMode}
                    onOpenSubmitModal={(asg) => setActiveSubmitAsg(asg)}
                    onOpenPdfViewer={(sub) => setActivePdfPreview(sub)}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteAssignment}
                  />
                </div>

              </div>

            </div>
          )}

          {/* ==================== 3. SUBMITTED ASSIGNMENTS VIEW ==================== */}
          {activeNavTab === 'submitted' && (
            <div>
              {isStudent ? (
                <StudentSubmissionsView
                  submissions={submissions}
                  currentUser={currentUser}
                  assignments={assignments}
                  onOpenPdfViewer={(sub) => setActivePdfPreview(sub)}
                  onNavigateToAssignments={() => setActiveNavTab('assignments')}
                />
              ) : (
                <FacultySubmissionsReview
                  submissions={submissions}
                  onGradeSubmission={handleGradeSubmission}
                  onOpenPdfViewer={(sub) => setActivePdfPreview(sub)}
                />
              )}
            </div>
          )}

        </main>
      </div>

      {/* Student PDF Submission Modal */}
      <SubmitPdfModal
        assignment={activeSubmitAsg}
        studentUser={currentUser}
        isOpen={!!activeSubmitAsg}
        onClose={() => setActiveSubmitAsg(null)}
        onSubmitSuccess={handlePdfSubmitSuccess}
      />

      {/* PDF Document Preview Modal */}
      <PdfViewerModal
        submission={activePdfPreview}
        isOpen={!!activePdfPreview}
        onClose={() => setActivePdfPreview(null)}
      />

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        Vignan's Foundation for Science, Technology and Research (Deemed to be University) • R22 C24 Academic Regulation Portal
      </footer>
    </div>
  );
}
