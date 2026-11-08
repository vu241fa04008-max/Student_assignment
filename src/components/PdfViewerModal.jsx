import React from 'react';

export default function PdfViewerModal({ submission, isOpen, onClose }) {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-slate-100 rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* PDF Viewer Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-bold text-sm">
              PDF
            </span>
            <div>
              <div className="text-xs font-bold font-mono text-slate-100">{submission.fileName}</div>
              <div className="text-[11px] text-slate-400">
                Submitted by {submission.studentName} ({submission.studentId}) • {submission.fileSize}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Downloading file: ${submission.fileName}`)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-200 cursor-pointer"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* PDF Simulated Document Page */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-8 sm:p-10 max-w-2xl mx-auto space-y-6 text-slate-800">
            
            {/* University Cover Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <div className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                Vignan's Foundation for Science, Technology & Research
              </div>
              <div className="text-xs text-slate-600">
                Department of Computer Science & Engineering • R22 C24 Regulation
              </div>
              <div className="text-base font-extrabold text-blue-900 mt-3 uppercase tracking-wide">
                Coursework Submission Document
              </div>
            </div>

            {/* Student & Course Metadata Block */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Student Name:</span>
                <div className="font-bold text-slate-800">{submission.studentName}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">University Reg No:</span>
                <div className="font-bold text-blue-800 font-mono">{submission.studentId}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Student Email:</span>
                <div className="font-mono text-slate-700">{submission.studentEmail}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Academic Regulation:</span>
                <div className="font-bold text-slate-800">R22 C24 (B.Tech CSE)</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Course Code & Title:</span>
                <div className="font-bold text-slate-800">{submission.courseCode} - {submission.courseName}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Submission Timestamp:</span>
                <div className="font-medium text-slate-700">{submission.submittedAt}</div>
              </div>
            </div>

            {/* Assignment Problem & Student Solution Content */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-900 mb-1">
                  Assignment Title:
                </h4>
                <p className="font-semibold text-slate-800 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                  {submission.assignmentTitle}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-700 mb-1">
                  1. Abstract & Solution Overview:
                </h4>
                <p className="text-slate-700">
                  This technical document contains the formal implementation, algorithmic derivation, and empirical analysis submitted by {submission.studentName} ({submission.studentId}) in accordance with the university syllabus requirements for course {submission.courseCode}.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-700 mb-1">
                  2. Implementation & Structural Proof:
                </h4>
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                  <code>{`// Vignan R22 C24 Module Implementation
// Student: ${submission.studentId}
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int keys[4];
    struct Node* children[5];
    int num_keys;
    int is_leaf;
} BTreeNode;

// Node split & verification routine
void split_child(BTreeNode* parent, int index, BTreeNode* full_child) {
    BTreeNode* sibling = (BTreeNode*)malloc(sizeof(BTreeNode));
    sibling->is_leaf = full_child->is_leaf;
    sibling->num_keys = 1;
    // Redistribute keys and update pointers...
}`}</code>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-slate-700 mb-1">
                  3. Student Remarks & Declaration:
                </h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 italic">
                  "{submission.studentRemarks || 'I hereby confirm this is my original coursework prepared for Vignan University R22 C24 regulations.'}"
                </p>
              </div>
            </div>

            {/* Footer Digital Stamp */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verified PDF Submission • SHA-256 Hash Verified</span>
              <span className="font-mono text-emerald-700 font-bold">DIGITALLY SECURED</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Viewing: 1 of 1 Document</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
