import React, { useState } from 'react';
import { formatAcademicDate } from '../utils/dateUtils';
import { R22_C24_COURSES } from '../data/r22c24Courses';

export default function StudentSubmissionsView({
  submissions,
  currentUser,
  assignments,
  onOpenPdfViewer,
  onNavigateToAssignments
}) {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const studentReg = currentUser?.regNumber || '241FA04008';
  
  // Filter only this student's submissions
  const studentSubmissions = submissions.filter(
    (sub) => sub.studentId === studentReg
  );

  const filtered = studentSubmissions.filter((sub) => {
    if (selectedCourse !== 'all' && sub.courseCode !== selectedCourse) return false;
    if (statusFilter === 'graded' && sub.status !== 'Graded') return false;
    if (statusFilter === 'pending' && sub.status === 'Graded') return false;
    return true;
  });

  // Calculate statistics
  const totalSubmitted = studentSubmissions.length;
  const gradedCount = studentSubmissions.filter((s) => s.status === 'Graded').length;
  const pendingCount = totalSubmitted - gradedCount;
  
  const totalMarksAwarded = studentSubmissions
    .filter((s) => s.status === 'Graded' && typeof s.marksAwarded === 'number')
    .reduce((acc, curr) => acc + curr.marksAwarded, 0);

  const totalMaxMarks = studentSubmissions
    .filter((s) => s.status === 'Graded' && typeof s.marksAwarded === 'number')
    .reduce((acc, curr) => acc + (curr.maxMarks || 20), 0);

  const percentage = totalMaxMarks > 0 ? Math.round((totalMarksAwarded / totalMaxMarks) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Student Submission Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                My Submitted Assignments (PDF Repository)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official archive of coursework submitted in PDF format for faculty review • Student ID: <strong className="font-mono text-slate-800">{studentReg}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold font-mono">
              {currentUser?.email || 'vu.241fa04008@vignan.ac.in'}
            </span>
            <button
              onClick={onNavigateToAssignments}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Submit New Assignment</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Submitted</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalSubmitted} <span className="text-xs font-normal text-slate-500">PDFs</span></div>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Verified & Graded</div>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">{gradedCount} <span className="text-xs font-normal text-emerald-600">tasks</span></div>
          </div>
          <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Awaiting Faculty</div>
            <div className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount} <span className="text-xs font-normal text-amber-600">in review</span></div>
          </div>
          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Average Performance</div>
            <div className="text-2xl font-extrabold text-blue-900 mt-1">
              {totalMaxMarks > 0 ? `${percentage}%` : 'N/A'}
              {totalMaxMarks > 0 && (
                <span className="text-xs font-normal text-blue-600 ml-1.5">({totalMarksAwarded}/{totalMaxMarks})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Course filter */}
          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-slate-600">Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:border-blue-500"
            >
              <option value="all">All R22 C24 Courses</option>
              {R22_C24_COURSES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-slate-600">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:border-blue-500"
            >
              <option value="all">All Submissions</option>
              <option value="graded">Graded & Evaluated</option>
              <option value="pending">Awaiting Review</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> of {totalSubmitted} submission records
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl text-blue-600 mb-3">
            📄
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Submissions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {selectedCourse !== 'all' || statusFilter !== 'all'
              ? 'No submissions match your selected filter criteria. Try resetting the filters.'
              : 'You have not submitted any assignments in PDF format yet. Visit the Assignments tab to submit your coursework.'}
          </p>
          <button
            onClick={onNavigateToAssignments}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Go to Assignments
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const courseMeta = R22_C24_COURSES.find((c) => c.code === sub.courseCode);
            const isGraded = sub.status === 'Graded';

            return (
              <div
                key={sub.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Left Column: Course & Assignment Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 font-mono border border-blue-200">
                        {sub.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {sub.courseName || courseMeta?.name || 'R22 C24 Coursework'}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          isGraded
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isGraded ? '✓ Verified & Evaluated' : '⏳ Awaiting Faculty Evaluation'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {sub.assignmentTitle}
                    </h3>

                    {/* PDF File Pill */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                        <span className="text-red-600 font-bold">PDF</span>
                        <span className="font-semibold text-slate-900">{sub.fileName}</span>
                        <span className="text-slate-400 text-[11px]">({sub.fileSize || '1.4 MB'})</span>
                        <span className="text-emerald-600 text-[11px] font-sans font-bold">✓ Verified</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Submitted: {formatAcademicDate(sub.submittedAt)}
                      </span>
                    </div>

                    {/* Student notes if any */}
                    {sub.studentRemarks && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                        <strong className="text-slate-700">Student Remarks:</strong> {sub.studentRemarks}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Faculty Evaluation & Actions */}
                  <div className="min-w-[260px] flex flex-col justify-between space-y-3 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Evaluation Results
                      </div>
                      
                      {isGraded ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-extrabold text-emerald-700">
                              {sub.marksAwarded}
                            </span>
                            <span className="text-xs text-slate-500 font-bold">
                              / {sub.maxMarks || 20} Marks
                            </span>
                          </div>

                          <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-emerald-200">
                            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                              Faculty Remarks (Dr. K. Srinivas)
                            </div>
                            <div className="italic text-slate-800 mt-0.5">
                              "{sub.facultyFeedback || 'Good submission. Accurate solution methodology.'}"
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded border border-amber-300">
                            Reached Course Coordinator Desk
                          </span>
                          <p className="text-[11px] text-slate-500 mt-2">
                            Dr. K. Srinivas is currently reviewing submissions for this module. Marks will update automatically.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* PDF Inspection Action Button */}
                    <div className="pt-2 border-t border-slate-200 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenPdfViewer(sub)}
                        className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>📄</span>
                        <span>View / Inspect PDF</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
