/**
 * Utility functions for handling date operations and professional academic status badges
 */

export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(deadlineStr) {
  if (!deadlineStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deadlineStr.includes('-')) {
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadline = new Date(year, month - 1, day);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  const d = new Date(deadlineStr);
  if (!isNaN(d.getTime())) {
    d.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
}

export function isOverdue(deadlineStr, status) {
  if (status === 'completed' || status === 'submitted') return false;
  return getDaysDifference(deadlineStr) < 0;
}

export function isDueToday(deadlineStr) {
  return getDaysDifference(deadlineStr) === 0;
}

export function isDueTomorrow(deadlineStr) {
  return getDaysDifference(deadlineStr) === 1;
}

export function formatDisplayDate(dateStr) {
  return formatAcademicDate(dateStr);
}

export function formatAcademicDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateStr;
}

export function getRelativeDeadline(deadlineStr) {
  const diff = getDaysDifference(deadlineStr);
  if (diff < 0) {
    return { label: `${Math.abs(diff)} days overdue`, badge: 'bg-red-50 text-red-700 border-red-200' };
  }
  if (diff === 0) {
    return { label: 'Due today', badge: 'bg-amber-50 text-amber-800 border-amber-300' };
  }
  if (diff === 1) {
    return { label: 'Due tomorrow', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
  }
  return { label: `${diff} days remaining`, badge: 'bg-slate-100 text-slate-700 border-slate-200' };
}

export function getDeadlineBadgeInfo(deadlineStr, isSubmitted) {
  if (isSubmitted) {
    return {
      text: 'Submitted (PDF)',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  const diff = getDaysDifference(deadlineStr);

  if (diff < 0) {
    const days = Math.abs(diff);
    return {
      text: `Overdue (${days}d late)`,
      className: 'bg-red-50 text-red-700 border-red-300 font-semibold'
    };
  }
  if (diff === 0) {
    return {
      text: 'Due Today',
      className: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
    };
  }
  if (diff === 1) {
    return {
      text: 'Due Tomorrow',
      className: 'bg-blue-50 text-blue-700 border-blue-200'
    };
  }
  return {
    text: `Due in ${diff} days`,
    className: 'bg-slate-100 text-slate-700 border-slate-200'
  };
}
