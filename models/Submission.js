import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: String,
      required: true,
      index: true
    },
    assignmentTitle: {
      type: String,
      required: true
    },
    courseCode: {
      type: String,
      required: true,
      uppercase: true
    },
    courseName: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      required: true,
      default: '241FA04008',
      index: true
    },
    studentName: {
      type: String,
      required: true,
      default: 'Venkatesh Rao'
    },
    studentEmail: {
      type: String,
      required: true,
      default: 'vu.241fa04008@vignan.ac.in'
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: String,
      default: '1.4 MB'
    },
    fileData: {
      type: String, // Base64 data or server file path
      default: ''
    },
    submittedAt: {
      type: String,
      default: () => new Date().toISOString()
    },
    studentRemarks: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending Verification', 'Graded'],
      default: 'Pending Verification'
    },
    marksAwarded: {
      type: Number,
      default: null
    },
    maxMarks: {
      type: Number,
      default: 20
    },
    facultyFeedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure 1 active submission per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 });

export default mongoose.model('Submission', submissionSchema);
