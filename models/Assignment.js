import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true
    },
    courseCode: {
      type: String,
      required: [true, 'R22 C24 course code is required'],
      trim: true,
      uppercase: true
    },
    subject: {
      type: String,
      required: [true, 'Subject title is required'],
      trim: true
    },
    deadline: {
      type: String,
      required: [true, 'Submission deadline date is required']
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    maxMarks: {
      type: Number,
      default: 20,
      min: 1
    },
    description: {
      type: String,
      default: 'Submission must be strictly compiled in university PDF format.'
    },
    facultyName: {
      type: String,
      default: 'Dr. K. Srinivas, Ph.D.'
    },
    facultyId: {
      type: String,
      default: 'VU-FAC-102'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Assignment', assignmentSchema);
