import React from 'react';
import { isOverdue } from '../utils/dateUtils';

export default function AssignmentStats({
  assignments,
  submissions,
  currentUser,
  activeFilter,
  onFilterChange
}) {
  const isFaculty = currentUser?.role === 'faculty';
  const total = assignments.length;

  if (isFaculty) {
    const totalSubmissions = submissions.length;
    const pendingGrading = submissions.filter((s) => s.status === 'Pending Verification').length;
    const gradedSubmissions = submissions.filter((s) => s.status === 'Graded').length;

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Faculty Coursework & Submissions Overview • R22 C24 Regulation
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {total} Published Tasks
            </span>
          </div>
          <span className="text-xs font-bold text-blue-700">
            {gradedSubmissions} of {totalSubmissions} Submissions Graded
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Published Coursework
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">R22 C24 Syllabus</div>
          </div>

          <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/40">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              PDFs Received
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{totalSubmissions}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Reached faculty desk</div>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
              <span>Awaiting Review</span>
              {pendingGrading > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
            </div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{pendingGrading}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Needs grading</div>
          </div>

          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/40">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Evaluated & Graded
            </div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{gradedSubmissions}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Marks verified</div>
          </div>
        </div>
      </div>
    );
  }

  // Student Statistics View (specifically for 241FA04008)
  const submittedIds = new Set(submissions.map((s) => s.assignmentId));
  const completed = assignments.filter((a) => submittedIds.has(a.id)).length;
  const pending = total - completed;
  const overdue = assignments.filter((a) => !submittedIds.has(a.id) && isOverdue(a.deadline, 'pending')).length;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      {/* Top Academic Completion Metric */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Semester PDF Submission Completion Rate (R22 C24)
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {completed} of {total} Submitted
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900">{completionPercentage}%</span>
        </div>

        {/* Corporate Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Student KPI Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Coursework
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Enrolled R22 modules</div>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('pending')}
          className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeFilter === 'pending'
              ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            Pending PDF Uploads
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{pending}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Requires submission</div>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('overdue')}
          className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeFilter === 'overdue'
              ? 'border-red-600 bg-red-50/60 ring-1 ring-red-600'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-red-600 uppercase tracking-wider">
            <span>Overdue Tasks</span>
            {overdue > 0 && <span className="w-2 h-2 rounded-full bg-red-600" />}
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">{overdue}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {overdue > 0 ? 'Urgent attention' : 'Zero late submissions'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('completed')}
          className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeFilter === 'completed'
              ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Submitted in PDF
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{completed}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Reached faculty desk</div>
        </button>
      </div>
    </div>
  );
}
