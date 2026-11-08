import { getDateOffsetString } from '../utils/dateUtils';

// Vignan's University - R22 C24 Regulation Courses (B.Tech Computer Science & Engineering)
export const COURSE_OPTIONS = [
  { code: '22CS201', name: 'Data Structures & Algorithms' },
  { code: '22CS202', name: 'Database Management Systems' },
  { code: '22CS203', name: 'Object Oriented Programming through Java' },
  { code: '22CS204', name: 'Computer Organization & Architecture' },
  { code: '22CS301', name: 'Operating Systems' },
  { code: '22CS302', name: 'Design and Analysis of Algorithms' },
  { code: '22CS303', name: 'Computer Networks' },
  { code: '22CS304', name: 'Formal Languages & Automata Theory (FLAT)' },
  { code: '22CS305', name: 'Software Engineering & Agile Methodologies' },
  { code: '22CS306', name: 'Artificial Intelligence & Machine Learning' },
  { code: '22CS307', name: 'Web Technologies & Full Stack Development' },
  { code: '22MA201', name: 'Probability, Statistics and Queuing Theory' },
  { code: '22EC201', name: 'Digital Logic & Microprocessors' },
  { code: '22HS201', name: 'Professional Communication & Soft Skills' }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'Lab Exercise 4: B+ Tree Indexing & SQL Query Optimization',
    courseCode: '22CS202',
    subject: 'Database Management Systems',
    deadline: getDateOffsetString(-2), // Overdue
    priority: 'high',
    status: 'pending',
    description: 'Implement B+ Tree leaf node splitting and benchmark nested loop vs hash join operations on 50k tuples.'
  },
  {
    id: 'asg-2',
    title: 'Assignment 3: Dynamic Programming - Matrix Chain Multiplication & 0/1 Knapsack',
    courseCode: '22CS302',
    subject: 'Design and Analysis of Algorithms',
    deadline: getDateOffsetString(0), // Due Today
    priority: 'high',
    status: 'pending',
    description: 'Provide asymptotic complexity proofs and write C++/Java code with memoization vs tabulation comparison.'
  },
  {
    id: 'asg-3',
    title: 'Kernel Lab 2: Multi-threading & Semaphore Synchronization in Linux',
    courseCode: '22CS301',
    subject: 'Operating Systems',
    deadline: getDateOffsetString(1), // Due Tomorrow
    priority: 'medium',
    status: 'pending',
    description: 'Solve the classical Dining Philosophers problem avoiding starvation using POSIX semaphores and mutex locks.'
  },
  {
    id: 'asg-4',
    title: 'Full Stack Milestone: RESTful API Development using Node.js & React',
    courseCode: '22CS307',
    subject: 'Web Technologies & Full Stack Development',
    deadline: getDateOffsetString(4),
    priority: 'medium',
    status: 'pending',
    description: 'Build JWT authentication and CRUD endpoints for student assignment submission portal with MongoDB connection.'
  },
  {
    id: 'asg-5',
    title: 'Problem Set 5: Poisson Distribution, Markov Chains & Queuing Models',
    courseCode: '22MA201',
    subject: 'Probability, Statistics and Queuing Theory',
    deadline: getDateOffsetString(7),
    priority: 'low',
    status: 'pending',
    description: 'Solve textbook problems on M/M/1 and M/M/c queuing systems under steady state conditions.'
  },
  {
    id: 'asg-6',
    title: 'Lab 1: Red-Black Trees & AVL Tree Rotations Implementation',
    courseCode: '22CS201',
    subject: 'Data Structures & Algorithms',
    deadline: getDateOffsetString(-5),
    priority: 'low',
    status: 'completed',
    description: 'Implement left and right balance rotations with verified height consistency.'
  }
];
