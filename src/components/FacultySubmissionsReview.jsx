import React, { useState } from 'react';

export default function FacultySubmissionsReview({
  submissions,
  onGradeSubmission,
  onOpenPdfViewer
}) {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [gradingSubId, setGradingSubId] = useState(null);
  const [marksInput, setMarksInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedCourse !== 'all' && sub.courseCode !== selectedCourse) return false;
    return true;
  });

  const handleStartGrade = (sub) => {
    setGradingSubId(sub.id);
    setMarksInput(sub.marksAwarded !== null && sub.marksAwarded !== undefined ? sub.marksAwarded : '');
    setFeedbackInput(sub.facultyFeedback || '');
  };

  const handleSaveGrade = (sub) => {
    const marksNum = Number(marksInput);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > (sub.maxMarks || 20)) {
      alert(`Please enter valid marks between 0 and ${sub.maxMarks || 20}`);
      return;
    }

    onGradeSubmission(sub.id, {
      marksAwarded: marksNum,
      facultyFeedback: feedbackInput.trim() || 'Verified and approved by course coordinator.',
      status: 'Graded'
    });

    setGradingSubId(null);
  };

  const pendingCount = submissions.filter((s) => s.status === 'Pending Verification').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-6">
      
      {/* Panel Header */}
      <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Faculty Submissions Inbox • R22 C24 Coursework
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Review student PDF submissions reached to your desk, inspect documents, and award marks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-semibold text-slate-200">
            Total Received: {submissions.length}
          </span>
          {pendingCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
              {pendingCount} Awaiting Review
            </span>
          )}
        </div>
      </div>

      {/* Submissions List */}
      <div className="p-5">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg">
            <div className="text-3xl mb-2">📥</div>
            <h3 className="text-sm font-bold text-slate-700">No Submissions in this Queue</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Switch to Student View (ID: 241FA04008) to submit an assignment in PDF format, and it will immediately appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((sub) => {
              const isGradingThis = gradingSubId === sub.id;

              return (
                <div
                  key={sub.id}
                  className={`rounded-xl border p-4 transition-all ${
                    sub.status === 'Graded'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Student Meta & Assignment */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {sub.courseCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {sub.courseName}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {sub.studentId}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {sub.studentName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({sub.studentEmail})</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{sub.assignmentTitle}</h4>

                      {/* PDF File Attachment Chip */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
                          <span className="text-base">📄</span>
                          <span className="font-mono">{sub.fileName}</span>
                          <span className="text-[11px] text-red-500 font-normal">({sub.fileSize})</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenPdfViewer(sub)}
                          className="text-xs px-2.5 py-1.5 font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>🔍</span>
                          <span>Preview PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => alert(`Downloading formal PDF document: ${sub.fileName}`)}
                          className="text-xs px-2.5 py-1.5 font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>⬇️</span>
                          <span>Download</span>
                        </button>
                      </div>

                      {/* Remarks & Timestamp */}
                      <div className="text-xs text-slate-500 pt-1">
                        <span>Submitted on: <strong className="text-slate-700">{sub.submittedAt}</strong></span>
                        {sub.studentRemarks && (
                          <p className="mt-1 text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 italic">
                            Student Note: "{sub.studentRemarks}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Grade & Feedback Status */}
                    <div className="lg:w-72 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-600">Review Status:</span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            sub.status === 'Graded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {isGradingThis ? (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Award Marks (Max: {sub.maxMarks || 20})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={sub.maxMarks || 20}
                              value={marksInput}
                              onChange={(e) => setMarksInput(e.target.value)}
                              placeholder={`0 - ${sub.maxMarks || 20}`}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-bold text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Faculty Remarks & Feedback
                            </label>
                            <textarea
                              rows="2"
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              placeholder="e.g. Excellent solution structure and query proofs."
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white resize-none"
                            />
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setGradingSubId(null)}
                              className="flex-1 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveGrade(sub)}
                              className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                            >
                              Save Grade
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">Marks Awarded:</span>
                            <span className="font-bold text-slate-900 text-sm">
                              {sub.marksAwarded !== null && sub.marksAwarded !== undefined
                                ? `${sub.marksAwarded} / ${sub.maxMarks || 20}`
                                : 'Pending'}
                            </span>
                          </div>

                          {sub.facultyFeedback && (
                            <div className="text-[11px] text-slate-600 bg-emerald-50/60 p-2 rounded border border-emerald-200">
                              <strong>Feedback:</strong> {sub.facultyFeedback}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleStartGrade(sub)}
                            className="w-full mt-2 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer transition-colors"
                          >
                            {sub.status === 'Graded' ? 'Modify Grade & Comments' : 'Grade & Verify Submission'}
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
