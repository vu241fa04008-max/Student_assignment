import React, { useState } from 'react';
import AssignmentCard from './AssignmentCard';
import { isOverdue, isDueToday, isDueTomorrow } from '../utils/dateUtils';

export default function SectionView({
  assignments,
  submissions,
  currentUser,
  viewMode,
  onOpenSubmitModal,
  onOpenPdfViewer,
  onEdit,
  onDelete
}) {
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  // Map submissions by assignment ID for quick lookup
  const studentSubmissionsMap = {};
  const allSubmissionsByAsg = {};

  submissions.forEach((sub) => {
    // Group all submissions by assignment ID (for faculty)
    if (!allSubmissionsByAsg[sub.assignmentId]) {
      allSubmissionsByAsg[sub.assignmentId] = [];
    }
    allSubmissionsByAsg[sub.assignmentId].push(sub);

    // Map student's own submission
    if (currentUser?.role === 'student' && sub.studentId === (currentUser?.regNumber || '241FA04008')) {
      studentSubmissionsMap[sub.assignmentId] = sub;
    }
  });

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <h3 className="text-sm font-bold text-slate-700">No Coursework Records Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          No assignments match the active search or R22 course module filter.
        </p>
      </div>
    );
  }

  // Helper to render an individual card
  const renderCard = (asg) => (
    <AssignmentCard
      key={asg.id}
      assignment={asg}
      currentUser={currentUser}
      studentSubmission={studentSubmissionsMap[asg.id]}
      allSubmissionsForAsg={allSubmissionsByAsg[asg.id]}
      onOpenSubmitModal={onOpenSubmitModal}
      onOpenPdfViewer={onOpenPdfViewer}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  // 1. TIMELINE SCHEDULE VIEW
  if (viewMode === 'timeline') {
    const overdueList = assignments.filter((a) => {
      const isSubmitted = !!studentSubmissionsMap[a.id];
      return !isSubmitted && isOverdue(a.deadline, 'pending');
    });

    const todayList = assignments.filter((a) => {
      const isSubmitted = !!studentSubmissionsMap[a.id];
      return !isSubmitted && (isDueToday(a.deadline) || isDueTomorrow(a.deadline));
    });

    const upcomingList = assignments.filter((a) => {
      const isSubmitted = !!studentSubmissionsMap[a.id];
      return !isSubmitted && !isOverdue(a.deadline, 'pending') && !isDueToday(a.deadline) && !isDueTomorrow(a.deadline);
    });

    const submittedList = assignments.filter((a) => !!studentSubmissionsMap[a.id]);

    return (
      <div className="space-y-6">
        {/* Overdue Section */}
        {overdueList.length > 0 && (
          <section className="bg-white rounded-xl border border-red-200 overflow-hidden shadow-xs">
            <div className="bg-red-50/80 border-b border-red-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Overdue Submissions ({overdueList.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-red-700">Immediate Action Required</span>
            </div>
            <div className="p-4 space-y-3">
              {overdueList.map(renderCard)}
            </div>
          </section>
        )}

        {/* Due Today & Tomorrow */}
        {todayList.length > 0 && (
          <section className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-xs">
            <div className="bg-amber-50/80 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Due Within 48 Hours ({todayList.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-700">Urgent Coursework</span>
            </div>
            <div className="p-4 space-y-3">
              {todayList.map(renderCard)}
            </div>
          </section>
        )}

        {/* Upcoming Section */}
        {upcomingList.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Upcoming Coursework Deadlines ({upcomingList.length})
                </h3>
              </div>
              <span className="text-[11px] font-medium text-slate-500">R22 C24 Syllabus</span>
            </div>
            <div className="p-4 space-y-3">
              {upcomingList.map(renderCard)}
            </div>
          </section>
        )}

        {/* Submitted in PDF Section */}
        {submittedList.length > 0 && (
          <section className="bg-white rounded-xl border border-emerald-200 overflow-hidden shadow-xs">
            <div className="bg-emerald-50/70 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Submitted PDF Coursework ({submittedList.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompletedCollapsed(!completedCollapsed)}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
              >
                {completedCollapsed ? 'Show Records' : 'Hide Records'}
              </button>
            </div>
            {!completedCollapsed && (
              <div className="p-4 space-y-3">
                {submittedList.map(renderCard)}
              </div>
            )}
          </section>
        )}
      </div>
    );
  }

  // 2. BY COURSE MODULE VIEW
  if (viewMode === 'subject') {
    const subjectGroups = assignments.reduce((acc, curr) => {
      acc[curr.subject] = acc[curr.subject] || [];
      acc[curr.subject].push(curr);
      return acc;
    }, {});

    return (
      <div className="space-y-5">
        {Object.entries(subjectGroups).map(([subject, list]) => {
          const courseCode = list[0]?.courseCode || '22CS';
          const submittedCount = list.filter((a) => !!studentSubmissionsMap[a.id]).length;

          return (
            <div key={subject} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {courseCode}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {subject}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {currentUser?.role === 'student' ? `${submittedCount} of ${list.length} Submitted` : `${list.length} Assignments`}
                </span>
              </div>
              <div className="p-4 space-y-3">
                {list.map(renderCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. BY PRIORITY TIER VIEW
  if (viewMode === 'priority') {
    const priorities = [
      { key: 'high', label: 'High Priority (Crucial Deadlines)', border: 'border-red-200', bg: 'bg-red-50/50', dot: 'bg-red-600' },
      { key: 'medium', label: 'Medium Priority (Standard Coursework)', border: 'border-amber-200', bg: 'bg-amber-50/50', dot: 'bg-amber-600' },
      { key: 'low', label: 'Low Priority (Flexible Submissions)', border: 'border-slate-200', bg: 'bg-slate-50', dot: 'bg-slate-500' }
    ];

    return (
      <div className="space-y-5">
        {priorities.map(({ key, label, border, bg, dot }) => {
          const list = assignments.filter((a) => a.priority === key);
          if (list.length === 0) return null;
          return (
            <div key={key} className={`bg-white rounded-xl border ${border} overflow-hidden shadow-xs`}>
              <div className={`${bg} border-b ${border} px-4 py-2.5 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{label}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-600">{list.length} Assignments</span>
              </div>
              <div className="p-4 space-y-3">
                {list.map(renderCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
