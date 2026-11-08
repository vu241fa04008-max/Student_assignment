import express from 'express';
import Submission from '../models/Submission.js';

const router = express.Router();

// GET all submissions with optional filters
router.get('/', async (req, res) => {
  try {
    const { studentId, courseCode, status } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (courseCode && courseCode !== 'all') filter.courseCode = courseCode.toUpperCase();
    if (status && status !== 'all') filter.status = status === 'graded' ? 'Graded' : 'Pending Verification';

    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to retrieve submission records' });
  }
});

// POST submit assignment in PDF format (Student)
router.post('/', async (req, res) => {
  try {
    const {
      assignmentId,
      assignmentTitle,
      courseCode,
      courseName,
      studentId,
      studentName,
      studentEmail,
      fileName,
      fileSize,
      fileData,
      studentRemarks,
      maxMarks
    } = req.body;

    if (!assignmentId || !fileName) {
      return res.status(400).json({ error: 'Missing required assignmentId or PDF fileName' });
    }

    const reg = studentId || '241FA04008';

    // Update existing submission if student previously submitted for this assignment, or create new
    const updated = await Submission.findOneAndUpdate(
      { assignmentId, studentId: reg },
      {
        assignmentId,
        assignmentTitle: assignmentTitle || 'Coursework Assignment',
        courseCode: (courseCode || '22CS201').toUpperCase(),
        courseName: courseName || 'Computer Science & Engineering',
        studentId: reg,
        studentName: studentName || 'Venkatesh Rao',
        studentEmail: studentEmail || 'vu.241fa04008@vignan.ac.in',
        fileName,
        fileSize: fileSize || '1.4 MB',
        fileData: fileData || '',
        submittedAt: new Date().toISOString(),
        studentRemarks: studentRemarks || 'PDF coursework uploaded for faculty review.',
        status: 'Pending Verification',
        maxMarks: Number(maxMarks) || 20
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(updated);
  } catch (error) {
    console.error('Error submitting PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to record student PDF submission' });
  }
});

// PUT grade submission & add faculty feedback (Faculty only)
router.put('/:id/grade', async (req, res) => {
  try {
    const { marksAwarded, facultyFeedback } = req.body;
    
    if (marksAwarded === undefined || marksAwarded === null) {
      return res.status(400).json({ error: 'Marks awarded is required' });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission record not found' });
    }

    submission.marksAwarded = Number(marksAwarded);
    submission.facultyFeedback = facultyFeedback || 'Verified and approved by Course Coordinator.';
    submission.status = 'Graded';

    const saved = await submission.save();
    res.json(saved);
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: error.message || 'Failed to update grade record' });
  }
});

export default router;
