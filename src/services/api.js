/**
 * API service for communicating with the MongoDB Atlas Express Backend
 * Falls back gracefully to local browser storage if the server or database is not reachable.
 */

const API_BASE_URL = 'http://localhost:5000/api';

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchAssignmentsApi(fallbackAssignments) {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // Normalize _id to id for frontend compatibility
      return data.map((item) => ({ ...item, id: item._id || item.id }));
    }
    return fallbackAssignments;
  } catch (err) {
    console.info('MongoDB backend not reachable, using local storage assignments.');
    return fallbackAssignments;
  }
}

export async function createAssignmentApi(assignmentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });
    if (!res.ok) throw new Error('Failed to create on server');
    const saved = await res.json();
    return { ...saved, id: saved._id || saved.id };
  } catch (err) {
    console.info('Backend unavailable, saving locally.');
    return { ...assignmentData, id: `asg-${Date.now()}` };
  }
}

export async function updateAssignmentApi(id, assignmentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });
    if (!res.ok) throw new Error('Failed to update on server');
    const updated = await res.json();
    return { ...updated, id: updated._id || updated.id };
  } catch (err) {
    return { ...assignmentData, id };
  }
}

export async function deleteAssignmentApi(id) {
  try {
    await fetch(`${API_BASE_URL}/assignments/${id}`, { method: 'DELETE' });
  } catch (err) {}
}

export async function fetchSubmissionsApi(studentId, fallbackSubmissions) {
  try {
    const url = studentId
      ? `${API_BASE_URL}/submissions?studentId=${studentId}`
      : `${API_BASE_URL}/submissions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({ ...item, id: item._id || item.id }));
    }
    return fallbackSubmissions;
  } catch (err) {
    return fallbackSubmissions;
  }
}

export async function submitAssignmentApi(submissionRecord) {
  try {
    const res = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionRecord)
    });
    if (!res.ok) throw new Error('Server submission error');
    const saved = await res.json();
    return { ...saved, id: saved._id || saved.id };
  } catch (err) {
    console.info('Backend unavailable, storing submission in local session.');
    return { ...submissionRecord, id: `sub-${Date.now()}` };
  }
}

export async function gradeSubmissionApi(submissionId, gradeData) {
  try {
    const res = await fetch(`${API_BASE_URL}/submissions/${submissionId}/grade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gradeData)
    });
    if (!res.ok) throw new Error('Server grade error');
    const updated = await res.json();
    return { ...updated, id: updated._id || updated.id };
  } catch (err) {
    return { ...gradeData, id: submissionId };
  }
}
