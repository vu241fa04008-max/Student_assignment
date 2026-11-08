import React, { useState } from 'react';

export default function SubmitPdfModal({ assignment, studentUser, isOpen, onClose, onSubmitSuccess }) {
  if (!isOpen || !assignment) return null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const defaultPdfName = `${studentUser?.regNumber || '241FA04008'}_${assignment.courseCode}_${assignment.title.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files (.pdf) are permitted by Vignan University submission guidelines.');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUseSimulatedPdf = () => {
    setSelectedFile({
      name: defaultPdfName,
      size: 2457600, // ~2.4 MB
      simulated: true
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or attach your PDF solution document before submitting.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const submissionRecord = {
        id: `sub-${Date.now()}`,
        assignmentId: assignment.id,
        studentId: studentUser?.regNumber || '241FA04008',
        studentName: studentUser?.name || 'Venkatesh Rao',
        studentEmail: studentUser?.email || 'vu.241fa04008@vignan.ac.in',
        courseCode: assignment.courseCode,
        courseName: assignment.subject,
        assignmentTitle: assignment.title,
        fileName: selectedFile.name,
        fileSize: selectedFile.size ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.4 MB',
        submittedAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        studentRemarks: remarks.trim() || 'Assignment solution document submitted in PDF format as per coursework instructions.',
        status: 'Pending Verification', // 'Pending Verification' | 'Graded'
        marksAwarded: null,
        maxMarks: assignment.maxMarks || 20,
        facultyFeedback: ''
      };

      onSubmitSuccess(submissionRecord);
      setIsSubmitting(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                {assignment.courseCode}
              </span>
              <h3 className="text-sm font-bold tracking-tight">Submit Assignment (PDF Format)</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{assignment.subject}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Assignment Info Pill */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-800">{assignment.title}</div>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 pt-1">
              <span>Student ID: <strong className="text-slate-700">{studentUser?.regNumber || '241FA04008'}</strong></span>
              <span>•</span>
              <span>Regulation: <strong className="text-blue-700">R22 C24</strong></span>
              <span>•</span>
              <span>Max Score: <strong className="text-slate-700">{assignment.maxMarks || 20} Marks</strong></span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* PDF Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Upload PDF Document <span className="text-red-500">*</span>
            </label>
            
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="pdf-file-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="hidden"
              />

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl mb-2">
                  📄
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓ Selected:</span>
                      <span className="font-mono">{selectedFile.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      File Size: {selectedFile.size ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.4 MB'} • Verified PDF
                    </div>
                    <label
                      htmlFor="pdf-file-input"
                      className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Change Selected File
                    </label>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="pdf-file-input"
                      className="px-3.5 py-1.5 rounded-md bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer inline-block"
                    >
                      Browse PDF From Device
                    </label>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Strictly PDF format (.pdf) • Maximum file limit: 25 MB
                    </p>
                    <button
                      type="button"
                      onClick={handleUseSimulatedPdf}
                      className="mt-2 text-xs text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
                    >
                      Or Attach Generated {studentUser?.regNumber || '241FA04008'} PDF Solution
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Remarks / Note to Faculty */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Remarks / Comments to Faculty <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., Attached complete problem proofs and code traces as required by R22 C24 course instructions."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-blue-600 resize-none"
            />
          </div>

          {/* Progress Bar when Uploading */}
          {isSubmitting && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Uploading PDF to Vignan Academic Server...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? 'Uploading...' : 'Submit PDF to Faculty'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
