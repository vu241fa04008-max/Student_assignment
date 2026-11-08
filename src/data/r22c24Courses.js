import { getDateOffsetString } from '../utils/dateUtils';

// Vignan's University - R22 C24 Regulation Courses (B.Tech Computer Science & Engineering)
export const R22_C24_COURSES = [
  { code: '22CS201', name: 'Data Structures & Algorithms', credits: 4, sem: 'Semester III' },
  { code: '22CS202', name: 'Database Management Systems', credits: 4, sem: 'Semester III' },
  { code: '22CS203', name: 'Object Oriented Programming through Java', credits: 3, sem: 'Semester III' },
  { code: '22CS204', name: 'Computer Organization & Architecture', credits: 3, sem: 'Semester III' },
  { code: '22CS301', name: 'Operating Systems', credits: 4, sem: 'Semester IV' },
  { code: '22CS302', name: 'Design and Analysis of Algorithms', credits: 4, sem: 'Semester IV' },
  { code: '22CS303', name: 'Computer Networks', credits: 4, sem: 'Semester V' },
  { code: '22CS304', name: 'Formal Languages & Automata Theory (FLAT)', credits: 3, sem: 'Semester V' },
  { code: '22CS305', name: 'Software Engineering & Agile Methodologies', credits: 3, sem: 'Semester V' },
  { code: '22CS306', name: 'Artificial Intelligence & Machine Learning', credits: 4, sem: 'Semester V' },
  { code: '22CS307', name: 'Web Technologies & Full Stack Development', credits: 4, sem: 'Semester V' },
  { code: '22CS308', name: 'Cryptography & Network Security', credits: 3, sem: 'Semester VI' },
  { code: '22CS309', name: 'Cloud Computing & DevOps', credits: 3, sem: 'Semester VI' },
  { code: '22MA201', name: 'Probability, Statistics and Queuing Theory', credits: 4, sem: 'Semester III' },
  { code: '22EC201', name: 'Digital Logic & Microprocessors', credits: 3, sem: 'Semester III' },
  { code: '22HS201', name: 'Professional Communication & Soft Skills', credits: 2, sem: 'Semester IV' }
];

// Initial assignments created by Faculty
export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-101',
    title: 'Lab Exercise 4: B+ Tree Indexing & SQL Query Optimization',
    courseCode: '22CS202',
    subject: 'Database Management Systems',
    facultyName: 'Dr. K. Srinivas',
    facultyEmail: 'dr.srinivas.cse@vignan.ac.in',
    deadline: getDateOffsetString(-2), // Overdue if not submitted
    priority: 'high',
    maxMarks: 20,
    allowedFormat: 'PDF Document (.pdf)',
    description: 'Implement B+ Tree leaf node splitting and benchmark nested loop vs hash join operations on 50,000 records. Include execution plan screenshots and query cost comparison.'
  },
  {
    id: 'asg-102',
    title: 'Assignment 3: Dynamic Programming - Matrix Chain Multiplication & 0/1 Knapsack',
    courseCode: '22CS302',
    subject: 'Design and Analysis of Algorithms',
    facultyName: 'Dr. P. V. Ramana',
    facultyEmail: 'ramana.cse@vignan.ac.in',
    deadline: getDateOffsetString(0), // Due Today
    priority: 'high',
    maxMarks: 15,
    allowedFormat: 'PDF Document (.pdf)',
    description: 'Provide step-by-step asymptotic complexity proofs and compare memoization (top-down) vs tabulation (bottom-up) runtime efficiency with graphs.'
  },
  {
    id: 'asg-103',
    title: 'Kernel Lab 2: Multi-threading & Semaphore Synchronization in Linux',
    courseCode: '22CS301',
    subject: 'Operating Systems',
    facultyName: 'Prof. S. Lakshmi',
    facultyEmail: 'lakshmi.cse@vignan.ac.in',
    deadline: getDateOffsetString(1), // Due Tomorrow
    priority: 'medium',
    maxMarks: 20,
    allowedFormat: 'PDF Document (.pdf)',
    description: 'Solve the classical Dining Philosophers problem avoiding starvation and deadlocks using POSIX semaphores and pthread mutex locks in C.'
  },
  {
    id: 'asg-104',
    title: 'Full Stack Project Milestone: RESTful API & Authentication Architecture',
    courseCode: '22CS307',
    subject: 'Web Technologies & Full Stack Development',
    facultyName: 'Dr. K. Srinivas',
    facultyEmail: 'dr.srinivas.cse@vignan.ac.in',
    deadline: getDateOffsetString(4),
    priority: 'medium',
    maxMarks: 25,
    allowedFormat: 'PDF Document (.pdf)',
    description: 'Document your JWT auth middleware, schema validation, and Swagger/OpenAPI documentation. Attach architectural diagrams and endpoint test logs.'
  },
  {
    id: 'asg-105',
    title: 'Problem Set 5: Poisson Processes & M/M/1 Queuing Network Analysis',
    courseCode: '22MA201',
    subject: 'Probability, Statistics and Queuing Theory',
    facultyName: 'Dr. M. Venkat',
    facultyEmail: 'venkat.math@vignan.ac.in',
    deadline: getDateOffsetString(7),
    priority: 'low',
    maxMarks: 10,
    allowedFormat: 'PDF Document (.pdf)',
    description: 'Solve textbook analytical problems 12.1 through 12.8 on steady state probabilities and mean wait time derivations.'
  },
  {
    id: 'asg-106',
    title: 'Lab 1: Red-Black Tree Height Verification & AVL Rotations',
    courseCode: '22CS201',
    subject: 'Data Structures & Algorithms',
    facultyName: 'Prof. A. Rajesh',
    facultyEmail: 'rajesh.cse@vignan.ac.in',
    deadline: getDateOffsetString(-5),
    priority: 'low',
    maxMarks: 15,
    allowedFormat: 'PDF Document (.pdf)',
    description: 'Demonstrate balance factor re-computation after double left and right rotations with visual output traces.'
  }
];

// Initial submissions reached to the faculty
export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-201',
    assignmentId: 'asg-106',
    studentId: '241FA04008',
    studentName: 'Venkatesh Rao',
    studentEmail: 'vu.241fa04008@vignan.ac.in',
    courseCode: '22CS201',
    courseName: 'Data Structures & Algorithms',
    fileName: '241FA04008_DSA_Lab1_AVL_Trees.pdf',
    fileSize: '1.8 MB',
    submittedAt: '2026-11-02 14:22',
    studentRemarks: 'Attached complete implementation of AVL tree self-balancing rotations with screenshot test suite for all test cases.',
    status: 'Graded', // 'Pending Verification' | 'Graded'
    marksAwarded: 14,
    maxMarks: 15,
    facultyFeedback: 'Excellent implementation. Code structure and rotation proofs are well documented.'
  }
];

export const DEFAULT_STUDENT_USER = {
  role: 'student',
  name: 'Venkatesh Rao',
  regNumber: '241FA04008',
  email: 'vu.241fa04008@vignan.ac.in',
  department: 'Computer Science & Engineering',
  regulation: 'R22 C24',
  semester: 'Semester V',
  cgpa: '8.82'
};

export const DEFAULT_FACULTY_USER = {
  role: 'faculty',
  name: 'Dr. K. Srinivas, Ph.D.',
  facultyId: 'VU-FAC-102',
  email: 'dr.srinivas.cse@vignan.ac.in',
  designation: 'Professor & Course Coordinator',
  department: 'Computer Science & Engineering',
  regulation: 'R22 C24 Coordinator'
};
