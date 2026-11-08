import React, { useState, useEffect } from 'react';
import { getTodayString, getDateOffsetString } from '../utils/dateUtils';
import { R22_C24_COURSES } from '../data/r22c24Courses';

export default function AssignmentForm({
  editingAssignment,
  currentUser,
  onSubmitAssignment,
  onCancelEdit
}) {
  const isFaculty = currentUser?.role === 'faculty';

  const initialFormState = {
    title: '',
    courseCode: '22CS202',
    subject: 'Database Management Systems',
    deadline: getTodayString(),
    priority: 'medium',
    maxMarks: 20,
    allowedFormat: 'PDF Document (.pdf)',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title || '',
        courseCode: editingAssignment.courseCode || '22CS202',
        subject: editingAssignment.subject || 'Database Management Systems',
        deadline: editingAssignment.deadline || getTodayString(),
        priority: editingAssignment.priority || 'medium',
        maxMarks: editingAssignment.maxMarks || 20,
        allowedFormat: 'PDF Document (.pdf)',
        description: editingAssignment.description || ''
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [editingAssignment]);

  // If user is a student, the creation form is completely restricted!
  if (!isFaculty) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <span>🔒</span>
          <span>Assignment Creation Restricted</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          As an enrolled student (<strong>{currentUser?.regNumber || '241FA04008'}</strong>), you have view-and-submit permissions. Only authorized faculty members can create, schedule, or modify coursework assignments.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 space-y-1">
          <div className="font-bold">Student Quick Action:</div>
          <div>1. Review R22 C24 assignments in the timeline schedule on the right.</div>
          <div>2. Click <strong>"Submit PDF Assignment"</strong> on any task to upload your solution.</div>
          <div>3. Your PDF will be dispatched directly to the faculty desk for grading.</div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'course') {
      const selectedCourse = R22_C24_COURSES.find((c) => c.code === value);
      if (selectedCourse) {
        setFormData((prev) => ({
          ...prev,
          courseCode: selectedCourse.code,
          subject: selectedCourse.name
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const setQuickDeadline = (daysOffset) => {
    setFormData((prev) => ({
      ...prev,
      deadline: getDateOffsetString(daysOffset)
    }));
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Please specify a deadline date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitAssignment({
      ...formData,
      facultyName: currentUser?.name || 'Dr. K. Srinivas',
      facultyEmail: currentUser?.email || 'dr.srinivas.cse@vignan.ac.in'
    });

    if (!editingAssignment) {
      setFormData(initialFormState);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {editingAssignment ? 'Edit Assignment Record' : 'Faculty Coursework Authoring'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Create or publish an official R22 C24 regulation task for students
          </p>
        </div>
        {editingAssignment && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Lab Exercise 5: Transaction Concurrency & ACID Isolation"
            className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
              errors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Course Module Selector (R22 C24 Regulation) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Course Module (R22 C24 Regulation) <span className="text-red-500">*</span>
          </label>
          <select
            name="course"
            value={formData.courseCode}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600 font-medium"
          >
            {R22_C24_COURSES.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name} ({course.sem})
              </option>
            ))}
          </select>
        </div>

        {/* Max Marks & Allowed Submission Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maximum Marks
            </label>
            <input
              type="number"
              min="5"
              max="100"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Format
            </label>
            <input
              type="text"
              disabled
              value="PDF Document (.pdf)"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium"
            />
          </div>
        </div>

        {/* Deadline with Quick Presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Submission Deadline <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setQuickDeadline(0)}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(1)}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                +3 Days
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                +1 Week
              </button>
            </div>
          </div>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
              errors.deadline ? 'border-red-400' : 'border-slate-300'
            }`}
          />
        </div>

        {/* Priority Tier */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Priority Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Low', class: 'bg-slate-100 text-slate-700 border-slate-300' },
              { id: 'medium', label: 'Medium', class: 'bg-amber-50 text-amber-800 border-amber-300' },
              { id: 'high', label: 'High', class: 'bg-red-50 text-red-700 border-red-300' }
            ].map((p) => {
              const isSelected = formData.priority === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setFormData((prev) => ({ ...prev, priority: p.id }))}
                  className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    isSelected
                      ? `${p.class} ring-2 ring-blue-600 font-semibold shadow-xs`
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guidelines / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Instructions & Submission Guidelines
          </label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detail expectations, required code outputs, proof format, and evaluation criteria..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          {editingAssignment ? 'Update Coursework Assignment' : 'Publish Assignment to Students'}
        </button>
      </form>
    </div>
  );
}
