import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';
import Submission from './models/Submission.js';

dotenv.config();

const INITIAL_ASSIGNMENTS = [
  {
    title: 'Lab Exercise 4: Balanced AVL & Red-Black Trees Implementation',
    courseCode: '22CS201',
    subject: 'Data Structures & Algorithms',
    deadline: '2026-11-15',
    priority: 'high',
    maxMarks: 20,
    description: 'Implement self-balancing search tree rotations in C/C++. Analyze height bounds and submit complete PDF documentation.',
    facultyName: 'Dr. K. Srinivas, Ph.D.',
    facultyId: 'VU-FAC-102'
  },
  {
    title: 'Theory Assignment 3: Relational Calculus & BCNF Normalization',
    courseCode: '22CS203',
    subject: 'Database Management Systems',
    deadline: '2026-11-18',
    priority: 'high',
    maxMarks: 25,
    description: 'Solve schema decomposition problems up to Boyce-Codd Normal Form. Prove lossless join and dependency preservation in submitted PDF.',
    facultyName: 'Dr. K. Srinivas, Ph.D.',
    facultyId: 'VU-FAC-102'
  },
  {
    title: 'Programming Lab 3: Multithreaded Bank Transaction Simulation',
    courseCode: '22CS202',
    subject: 'Object Oriented Programming with Java',
    deadline: '2026-11-20',
    priority: 'medium',
    maxMarks: 20,
    description: 'Demonstrate synchronization, deadlock avoidance using wait/notify in Java. Include source code screenshots and execution logs in PDF.',
    facultyName: 'Dr. K. Srinivas, Ph.D.',
    facultyId: 'VU-FAC-102'
  },
  {
    title: 'Coursework 2: CPU Scheduling Algorithms & Semaphore IPC',
    courseCode: '22CS301',
    subject: 'Operating Systems',
    deadline: '2026-11-24',
    priority: 'medium',
    maxMarks: 20,
    description: 'Comparative analysis of Round Robin vs Priority Preemptive scheduling using Gantt charts. Submit formal technical write-up in PDF.',
    facultyName: 'Dr. K. Srinivas, Ph.D.',
    facultyId: 'VU-FAC-102'
  },
  {
    title: 'Assignment 2: Network Protocol Packet Analysis with Wireshark',
    courseCode: '22CS303',
    subject: 'Computer Networks',
    deadline: '2026-11-28',
    priority: 'low',
    maxMarks: 15,
    description: 'Capture TCP 3-way handshake and analyze sequence/acknowledgment flow. Compile findings and Wireshark trace exports into PDF.',
    facultyName: 'Dr. K. Srinivas, Ph.D.',
    facultyId: 'VU-FAC-102'
  }
];

export async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('<db_password>')) {
      console.log('⚠️ MongoDB URI contains placeholder <db_password>. Skipping automatic seeding until password is provided.');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas for seeding check...');

    const count = await Assignment.countDocuments();
    if (count === 0) {
      console.log('Seeding initial R22 C24 coursework assignments...');
      const createdAssignments = await Assignment.insertMany(INITIAL_ASSIGNMENTS);

      // Add sample initial submission for student 241FA04008
      const dsaAsg = createdAssignments[0];
      await Submission.create({
        assignmentId: dsaAsg._id.toString(),
        assignmentTitle: dsaAsg.title,
        courseCode: dsaAsg.courseCode,
        courseName: dsaAsg.subject,
        studentId: '241FA04008',
        studentName: 'Venkatesh Rao',
        studentEmail: 'vu.241fa04008@vignan.ac.in',
        fileName: '241FA04008_22CS201_AVL_Trees_Lab4.pdf',
        fileSize: '1.4 MB',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        studentRemarks: 'Included AVL double rotation proofs and test cases.',
        status: 'Graded',
        marksAwarded: 19,
        maxMarks: 20,
        facultyFeedback: 'Excellent time-complexity analysis and tree balance verification. Full marks awarded.'
      });

      console.log('✓ Successfully seeded initial assignments and sample submission for 241FA04008!');
    } else {
      console.log(`Database already has ${count} assignment records. Seeding skipped.`);
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => mongoose.disconnect());
}
