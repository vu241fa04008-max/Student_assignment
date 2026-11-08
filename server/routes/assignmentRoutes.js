import express from 'express';
import Assignment from '../models/Assignment.js';

const router = express.Router();

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ deadline: 1 });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to retrieve assignments from database' });
  }
});

// GET single assignment
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment record not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assignment' });
  }
});

// POST create new assignment (Faculty only)
router.post('/', async (req, res) => {
  try {
    const { title, courseCode, subject, deadline, priority, maxMarks, description, facultyName, facultyId } = req.body;
    
    if (!title || !courseCode || !subject || !deadline) {
      return res.status(400).json({ error: 'Missing required assignment fields' });
    }

    const newAssignment = new Assignment({
      title,
      courseCode: courseCode.toUpperCase(),
      subject,
      deadline,
      priority: priority || 'medium',
      maxMarks: Number(maxMarks) || 20,
      description: description || 'Submission must be strictly compiled in university PDF format.',
      facultyName: facultyName || 'Dr. K. Srinivas, Ph.D.',
      facultyId: facultyId || 'VU-FAC-102'
    });

    const saved = await newAssignment.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: error.message || 'Failed to create assignment' });
  }
});

// PUT update assignment (Faculty only)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update assignment' });
  }
});

// DELETE assignment (Faculty only)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: 'Assignment record deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;
