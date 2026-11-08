import React from 'react';
import { R22_C24_COURSES } from '../data/r22c24Courses';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-xs space-y-3">
      {/* Top row: Search & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assignments by title, course code, or faculty..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onViewModeChange('timeline')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline Schedule
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('subject')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'subject'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Course Module
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('priority')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'priority'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Priority Tier
          </button>
        </div>
      </div>

      {/* Bottom row: Filter & Sort Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* R22 C24 Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium whitespace-nowrap">R22 Course:</span>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-blue-600"
          >
            <option value="all">All R22 C24 Courses</option>
            {R22_C24_COURSES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium whitespace-nowrap">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-blue-600"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-blue-600"
          >
            <option value="deadline-asc">Deadline: Earliest First</option>
            <option value="deadline-desc">Deadline: Latest First</option>
            <option value="priority-desc">Priority: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
