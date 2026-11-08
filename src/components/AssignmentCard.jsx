import React from 'react';
import {
  formatDisplayDate,
  isOverdue,
  getDeadlineBadgeInfo
} from '../utils/dateUtils';

export default function AssignmentCard({
  assignment,
  currentUser,
  studentSubmission, // submission record if current student submitted
  allSubmissionsForAsg, // list of submissions for faculty view
  onOpenSubmitModal,
  onOpenPdfViewer,
  onEdit,
  onDelete
}) {
  const isFaculty = currentUser?.role === 'faculty';
  const isSubmitted = !!studentSubmission;
  const overdue = !isSubmitted && isOverdue(assignment.deadline, 'pending');
  const deadlineBadge = getDeadlineBadgeInfo(assignment.deadline, isSubmitted);

  const priorityStyles = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const priorityBadge = priorityStyles[assignment.priority] || priorityStyles.medium;

  let cardClass = 'border-slate-200 bg-white hover:border-slate-300';
  if (isSubmitted) {
    cardClass = 'border-emerald-200 bg-emerald-50/20';
  } else if (overdue) {
    cardClass = 'border-red-300 bg-red-50/20 ring-1 ring-red-200';
  }

  return (
    <div className={`rounded-xl border p-4 shadow-2xs transition-all ${cardClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Left Content Area */}
        <div className="flex-1 min-w-0 space-y-2">
          
          {/* Metadata Row: Course Code, Priority, Deadline, Format */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              {assignment.courseCode}
            </span>
            <span className="text-[11px] font-semibold text-slate-700">
              {assignment.subject}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Max: {assignment.maxMarks || 20} Marks
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${priorityBadge}`}>
              {assignment.priority}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${deadlineBadge.className}`}>
              {deadlineBadge.text}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-sm font-bold text-slate-900 break-words ${isSubmitted ? 'text-slate-800' : ''}`}>
            {assignment.title}
          </h3>

          {/* Description */}
          {assignment.description && (
            <p className="text-xs text-slate-600 line-clamp-2">
              {assignment.description}
            </p>
          )}

          {/* Deadline Date & Faculty info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
            <span>Deadline: <strong className="text-slate-700">{formatDisplayDate(assignment.deadline)}</strong></span>
            {assignment.facultyName && (
              <>
                <span>•</span>
                <span>Course Faculty: <strong className="text-slate-700">{assignment.facultyName}</strong></span>
              </>
            )}
            <span>•</span>
            <span className="text-red-700 font-medium">Format: PDF Only</span>
          </div>

          {/* If Student has submitted: Display PDF Details & Grade Status */}
          {isSubmitted && (
            <div className="mt-3 p-3 rounded-lg bg-white border border-emerald-200 shadow-2xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base text-red-600">📄</span>
                  <span className="font-mono text-xs font-bold text-slate-800">{studentSubmission.fileName}</span>
                  <span className="text-[11px] text-slate-400">({studentSubmission.fileSize})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPdfViewer(studentSubmission)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🔍</span>
                  <span>View PDF Document</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Submitted at: <strong className="text-slate-700">{studentSubmission.submittedAt}</strong>
                </span>
                
                {studentSubmission.status === 'Graded' ? (
                  <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    <span>✓ Faculty Graded:</span>
                    <span>{studentSubmission.marksAwarded} / {studentSubmission.maxMarks || 20} Marks</span>
                  </div>
                ) : (
                  <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                    Reached Faculty Desk • Pending Review
                  </span>
                )}
              </div>

              {studentSubmission.facultyFeedback && (
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  <strong className="text-slate-700">Faculty Feedback:</strong> {studentSubmission.facultyFeedback}
                </div>
              )}
            </div>
          )}

          {/* If Faculty View: Display Submissions Count */}
          {isFaculty && (
            <div className="mt-2 text-xs text-slate-600 font-medium flex items-center gap-2">
              <span className="text-blue-600 font-bold">📥 Student PDF Submissions:</span>
              <span className="font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                {allSubmissionsForAsg ? allSubmissionsForAsg.length : 0} received from students
              </span>
            </div>
          )}

        </div>

        {/* Right Action Controls */}
        <div className="shrink-0 flex sm:flex-col items-end justify-between gap-2">
          
          {/* Student Actions */}
          {!isFaculty ? (
            <div>
              {isSubmitted ? (
                <button
                  type="button"
                  onClick={() => onOpenSubmitModal(assignment)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🔄</span>
                  <span>Resubmit PDF</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenSubmitModal(assignment)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>📄</span>
                  <span>Submit PDF Assignment</span>
                </button>
              )}
            </div>
          ) : (
            /* Faculty Actions (Edit & Delete) */
            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={() => onEdit(assignment)}
                className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(assignment.id)}
                className="px-2.5 py-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
