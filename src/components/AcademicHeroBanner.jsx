import React, { useState, useEffect } from 'react';

export default function AcademicHeroBanner({ currentUser }) {
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'

  useEffect(() => {
    let interval = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      alert(mode === 'focus' ? 'Study session completed. Take a scheduled 5-minute break.' : 'Break interval ended. Ready to resume.');
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimerSeconds(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const seconds = String(timerSeconds % 60).padStart(2, '0');

  const isStudent = currentUser?.role === 'student';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Side: Student / Faculty Credentials & R22 C24 Academic Meta */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              R22 C24 Regulation
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isStudent ? 'Enrolled Student' : 'Authorized Faculty'}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {isStudent ? `ID: ${currentUser?.regNumber || '241FA04008'}` : `Faculty ID: ${currentUser?.facultyId || 'VU-FAC-102'}`}
            </span>
            {isStudent && (
              <span className="px-2.5 py-0.5 rounded text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200">
                {currentUser?.email || 'vu.241fa04008@vignan.ac.in'}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isStudent ? `Welcome, ${currentUser?.name || 'Venkatesh Rao'}` : `Welcome, ${currentUser?.name || 'Dr. K. Srinivas'}`}
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Department of Computer Science & Engineering • Vignan's Foundation for Science, Technology & Research
            </p>
          </div>

          {/* Academic Info & Standing */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <span>Academic Term: <strong className="text-slate-800">AY 2026-27 (Semester V)</strong></span>
            <span>•</span>
            {isStudent ? (
              <span>Academic Standing: <strong className="text-emerald-700">Good Standing (CGPA: 8.82)</strong></span>
            ) : (
              <span>Designation: <strong className="text-slate-800">Professor & Course Coordinator</strong></span>
            )}
            <span>•</span>
            <span>Campus: <strong className="text-slate-800">Vadlamudi Main Campus</strong></span>
          </div>
        </div>

        {/* Right Side: Professional Study / Session Timer */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 min-w-[280px] sm:min-w-[310px] self-stretch lg:self-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Academic Session Timer
            </span>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => resetTimer('focus')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  mode === 'focus' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                Focus (25m)
              </button>
              <button
                type="button"
                onClick={() => resetTimer('break')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  mode === 'break' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                Break (5m)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-mono text-3xl font-extrabold text-slate-800 tracking-tight">
              {minutes}:{seconds}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTimer}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRunning ? 'Pause' : 'Start Timer'}
              </button>
              <button
                type="button"
                onClick={() => resetTimer(mode)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{isRunning ? (mode === 'focus' ? 'Session in progress' : 'Break in progress') : 'Timer paused'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
