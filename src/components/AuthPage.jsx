import React, { useState } from 'react';
import { DEFAULT_STUDENT_USER, DEFAULT_FACULTY_USER } from '../data/r22c24Courses';

export default function AuthPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'faculty'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Student form state with ID 241FA04008 and email vu.241fa04008@vignan.ac.in
  const [studentForm, setStudentForm] = useState({
    name: 'Venkatesh Rao',
    regNumber: '241FA04008',
    email: 'vu.241fa04008@vignan.ac.in',
    password: '',
    department: 'Computer Science & Engineering',
    regulation: 'R22 C24',
    semester: 'Semester V'
  });

  // Faculty form state
  const [facultyForm, setFacultyForm] = useState({
    name: 'Dr. K. Srinivas',
    facultyId: 'VU-FAC-102',
    email: 'dr.srinivas.cse@vignan.ac.in',
    password: '',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Course Coordinator'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleStudentChange = (e) => {
    setStudentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleFacultyChange = (e) => {
    setFacultyForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'student') {
      if (!studentForm.email.trim() || !studentForm.regNumber.trim()) {
        setError('Please provide student email and university registration number.');
        return;
      }
      onLoginSuccess({
        role: 'student',
        name: studentForm.name.trim() || 'Venkatesh Rao',
        regNumber: studentForm.regNumber.trim().toUpperCase(),
        email: studentForm.email.trim().toLowerCase(),
        department: studentForm.department,
        regulation: 'R22 C24',
        semester: studentForm.semester,
        cgpa: '8.82'
      });
    } else {
      if (!facultyForm.email.trim()) {
        setError('Please provide faculty university email.');
        return;
      }
      onLoginSuccess({
        role: 'faculty',
        name: facultyForm.name.trim() || 'Dr. K. Srinivas, Ph.D.',
        facultyId: facultyForm.facultyId.trim() || 'VU-FAC-102',
        email: facultyForm.email.trim().toLowerCase(),
        department: facultyForm.department,
        designation: facultyForm.designation
      });
    }
  };

  // Google SSO Simulation for student vu.241fa04008@vignan.ac.in or faculty
  const handleGoogleSignIn = () => {
    setLoadingGoogle(true);
    setTimeout(() => {
      setLoadingGoogle(false);
      if (selectedRole === 'student') {
        onLoginSuccess(DEFAULT_STUDENT_USER);
      } else {
        onLoginSuccess(DEFAULT_FACULTY_USER);
      }
    }, 550);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800">
      {/* Top Institutional Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white py-3.5 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-xs">
              V
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide text-white uppercase">
                Vignan's Foundation for Science, Technology & Research
              </div>
              <div className="text-xs text-slate-400">
                (Deemed to be University) • R22 C24 Academic Regulation Portal
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
            <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">R22 C24 Syllabus</span>
            <span>•</span>
            <span>AY 2026-27</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Card Top Title Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 text-center">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic Assignment Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your academic role to proceed with verified institutional access
            </p>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Primary Role Selector: Student vs Faculty */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-lg bg-slate-100 border border-slate-200 mb-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setError('');
                }}
                className={`py-2.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <span>🎓</span>
                <span>Student Portal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('faculty');
                  setError('');
                }}
                className={`py-2.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'faculty'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <span>👨‍🏫</span>
                <span>Faculty Portal</span>
              </button>
            </div>

            {/* Role Capability Banner */}
            <div className={`p-3 rounded-lg border text-xs mb-5 font-medium flex items-center justify-between ${
              selectedRole === 'student'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}>
              {selectedRole === 'student' ? (
                <div>
                  <strong>Student Access:</strong> View assignments for R22 C24 courses & submit answers in PDF format.
                </div>
              ) : (
                <div>
                  <strong>Faculty Access:</strong> Create, edit assignments & review/grade PDF submissions from students.
                </div>
              )}
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="w-full py-2.5 px-4 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs mb-4 cursor-pointer"
            >
              {loadingGoogle ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.68-5.17 3.68-9.09z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.25 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.38l4-3.09z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              )}
              <span>
                {selectedRole === 'student'
                  ? 'Continue with Google (vu.241fa04008@vignan.ac.in)'
                  : 'Continue with Google (Faculty Account)'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-medium absolute">
                Or sign in with Vignan ID
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedRole === 'student' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Assigned Student ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="regNumber"
                        value={studentForm.regNumber}
                        onChange={handleStudentChange}
                        placeholder="241FA04008"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold uppercase focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Academic Regulation
                      </label>
                      <input
                        type="text"
                        disabled
                        value="R22 C24 Regulation"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official University Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={studentForm.email}
                      onChange={handleStudentChange}
                      placeholder="vu.241fa04008@vignan.ac.in"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Password</label>
                      <span className="text-[11px] text-slate-400">Default: student password</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={studentForm.password}
                        onChange={handleStudentChange}
                        placeholder="Enter password (optional for demo)"
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-xs text-slate-500"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Sign In as Student (ID: 241FA04008)
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Faculty ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="facultyId"
                        value={facultyForm.facultyId}
                        onChange={handleFacultyChange}
                        placeholder="VU-FAC-102"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono font-bold uppercase focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Faculty Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={facultyForm.name}
                        onChange={handleFacultyChange}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Faculty University Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={facultyForm.email}
                      onChange={handleFacultyChange}
                      placeholder="dr.srinivas.cse@vignan.ac.in"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={facultyForm.password}
                      onChange={handleFacultyChange}
                      placeholder="Enter faculty password"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Sign In as Faculty (Dr. K. Srinivas)
                  </button>
                </>
              )}
            </form>

            {/* Quick 1-Click Access Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-1">
                Quick Evaluator Testing
              </div>
              <button
                type="button"
                onClick={() => onLoginSuccess(DEFAULT_STUDENT_USER)}
                className="w-full py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>🎓 Launch as Student: 241FA04008</span>
                <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded text-blue-800">Submit PDF</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess(DEFAULT_FACULTY_USER)}
                className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>👨‍🏫 Launch as Faculty: Dr. K. Srinivas</span>
                <span className="text-[10px] bg-slate-300 px-1.5 py-0.5 rounded text-slate-900">Add & Grade</span>
              </button>
            </div>

          </div>

          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Secure SSL Encrypted Connection • Vignan IT Systems &copy; 2026
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        Vignan's Foundation for Science, Technology and Research • Vadlamudi, Guntur, Andhra Pradesh, India
      </footer>
    </div>
  );
}
