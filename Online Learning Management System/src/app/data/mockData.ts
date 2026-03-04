import { Course, UserProgress, Review, Certificate, Bookmark, Note } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and launch your career as a full-stack developer.',
    instructor: 'Sarah Johnson',
    instructorImage: 'https://images.unsplash.com/photo-1758685845872-4edbf0e76014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRlYWNoaW5nJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzcyNjM2ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnail: 'https://images.unsplash.com/photo-1742072594003-abf6ca86e154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZyUyMHNjcmVlbnxlbnwxfHx8fDE3NzI1NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Development',
    level: 'Beginner',
    duration: 42,
    enrolledStudents: 15678,
    rating: 4.8,
    enrolled: true,
    progress: 45,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Web Development',
        lessons: [
          {
            id: 'l1',
            title: 'What is Web Development?',
            description: 'Learn the fundamentals of web development and what you\'ll build',
            duration: 15,
            type: 'video',
            videoUrl: 'https://example.com/video1',
            completed: true,
          },
          {
            id: 'l2',
            title: 'Setting Up Your Development Environment',
            description: 'Install and configure all necessary tools',
            duration: 20,
            type: 'video',
            videoUrl: 'https://example.com/video2',
            completed: true,
          },
          {
            id: 'l3',
            title: 'HTML Basics Quiz',
            description: 'Test your understanding of HTML fundamentals',
            duration: 10,
            type: 'quiz',
            completed: false,
            quizQuestions: [
              {
                id: 'q1',
                question: 'What does HTML stand for?',
                options: [
                  'Hyper Text Markup Language',
                  'High Tech Modern Language',
                  'Home Tool Markup Language',
                  'Hyperlinks and Text Markup Language',
                ],
                correctAnswer: 0,
                explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
              },
              {
                id: 'q2',
                question: 'Which HTML tag is used for the largest heading?',
                options: ['<head>', '<h6>', '<heading>', '<h1>'],
                correctAnswer: 3,
                explanation: 'The <h1> tag is used for the largest heading in HTML, with <h6> being the smallest.',
              },
              {
                id: 'q3',
                question: 'What is the correct HTML element for inserting a line break?',
                options: ['<break>', '<br>', '<lb>', '<linebreak>'],
                correctAnswer: 1,
                explanation: 'The <br> tag is used to insert a line break in HTML.',
              },
            ],
          },
        ],
      },
      {
        id: 'm2',
        title: 'HTML & CSS Fundamentals',
        lessons: [
          {
            id: 'l4',
            title: 'HTML Elements and Structure',
            description: 'Master HTML tags and document structure',
            duration: 30,
            type: 'video',
            completed: false,
          },
          {
            id: 'l5',
            title: 'CSS Styling and Layouts',
            description: 'Learn CSS properties, selectors, and layout techniques',
            duration: 45,
            type: 'video',
            completed: false,
          },
        ],
      },
      {
        id: 'm3',
        title: 'JavaScript Programming',
        lessons: [
          {
            id: 'l6',
            title: 'JavaScript Fundamentals',
            description: 'Variables, data types, and basic programming concepts',
            duration: 40,
            type: 'video',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, statistics, data visualization, and machine learning algorithms. Work on real datasets and build predictive models.',
    instructor: 'Dr. Michael Chen',
    instructorImage: 'https://images.unsplash.com/photo-1684236685989-baafbf7bef95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwaW5zdHJ1Y3RvciUyMGV4cGVydHxlbnwxfHx8fDE3NzI2MzY4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnail: 'https://images.unsplash.com/photo-1718241905916-1f9786324de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljcyUyMGNvbXB1dGVyfGVufDF8fHx8MTc3MjYxMDk3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Data Science',
    level: 'Intermediate',
    duration: 56,
    enrolledStudents: 12450,
    rating: 4.9,
    enrolled: true,
    progress: 20,
    modules: [
      {
        id: 'm4',
        title: 'Python for Data Science',
        lessons: [
          {
            id: 'l7',
            title: 'Python Basics',
            description: 'Learn Python syntax and programming fundamentals',
            duration: 25,
            type: 'video',
            completed: true,
          },
          {
            id: 'l8',
            title: 'NumPy and Pandas',
            description: 'Work with data using powerful Python libraries',
            duration: 35,
            type: 'video',
            completed: false,
          },
        ],
      },
      {
        id: 'm5',
        title: 'Machine Learning Algorithms',
        lessons: [
          {
            id: 'l9',
            title: 'Supervised Learning',
            description: 'Classification and regression techniques',
            duration: 50,
            type: 'video',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description: 'Create beautiful, user-friendly interfaces. Learn design principles, wireframing, prototyping, and user research.',
    instructor: 'Emily Rodriguez',
    instructorImage: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjYxOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnail: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3MjU1Nzc1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Design',
    level: 'Beginner',
    duration: 38,
    enrolledStudents: 9832,
    rating: 4.7,
    enrolled: false,
    modules: [
      {
        id: 'm6',
        title: 'Design Fundamentals',
        lessons: [
          {
            id: 'l10',
            title: 'Introduction to UI/UX',
            description: 'What makes a great user experience',
            duration: 20,
            type: 'video',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Digital Marketing Strategy',
    description: 'Master SEO, social media marketing, content strategy, and analytics. Grow your brand and reach your target audience.',
    instructor: 'James Wilson',
    instructorImage: 'https://images.unsplash.com/photo-1631490238101-a1156ce9bb3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbnN0cnVjdG9yJTIwdGVhY2hlcnxlbnwxfHx8fDE3NzI1NDcyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnail: 'https://images.unsplash.com/photo-1682336869523-2c6859f781cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3MjU1MzM2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Marketing',
    level: 'Intermediate',
    duration: 32,
    enrolledStudents: 11234,
    rating: 4.6,
    enrolled: false,
    modules: [
      {
        id: 'm7',
        title: 'Marketing Fundamentals',
        lessons: [
          {
            id: 'l11',
            title: 'Marketing Strategy Basics',
            description: 'Understanding your audience and goals',
            duration: 25,
            type: 'video',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Professional Photography Course',
    description: 'Learn camera settings, composition, lighting, and post-processing. Take stunning photos like a pro.',
    instructor: 'Anna Martinez',
    instructorImage: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjYxOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnail: 'https://images.unsplash.com/photo-1588420490858-3828a17244a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzI1ODc5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Photography',
    level: 'Beginner',
    duration: 28,
    enrolledStudents: 7896,
    rating: 4.8,
    enrolled: false,
    modules: [
      {
        id: 'm8',
        title: 'Camera Basics',
        lessons: [
          {
            id: 'l12',
            title: 'Understanding Your Camera',
            description: 'Master aperture, shutter speed, and ISO',
            duration: 30,
            type: 'video',
          },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Business Management Essentials',
    description: 'Develop leadership skills, strategic thinking, and business acumen. Lead teams and drive organizational success.',
    instructor: 'Robert Taylor',
    instructorImage: 'https://images.unsplash.com/photo-1684236685989-baafbf7bef95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwaW5zdHJ1Y3RvciUyMGV4cGVydHxlbnwxfHx8fDE3NzI2MzY4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    thumbnail: 'https://images.unsplash.com/photo-1646296066880-c61cac79470b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbmFnZW1lbnQlMjBvZmZpY2V8ZW58MXx8fHwxNzcyNjA2NTczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Business',
    level: 'Advanced',
    duration: 45,
    enrolledStudents: 8567,
    rating: 4.7,
    enrolled: false,
    modules: [
      {
        id: 'm9',
        title: 'Leadership Fundamentals',
        lessons: [
          {
            id: 'l13',
            title: 'Effective Leadership',
            description: 'Building and leading high-performing teams',
            duration: 35,
            type: 'video',
          },
        ],
      },
    ],
  },
];

export const mockUserProgress: UserProgress[] = [
  {
    courseId: '1',
    completedLessons: ['l1', 'l2'],
    lastAccessedLesson: 'l3',
    progress: 45,
  },
  {
    courseId: '2',
    completedLessons: ['l7'],
    lastAccessedLesson: 'l8',
    progress: 20,
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    courseId: '1',
    userId: 'user1',
    userName: 'Alex Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?w=100',
    rating: 5,
    comment: 'This course is amazing! I learned so much and the projects were challenging but rewarding. Sarah is an excellent instructor.',
    date: new Date('2024-02-15'),
    helpful: 24,
  },
  {
    id: 'r2',
    courseId: '1',
    userId: 'user2',
    userName: 'Maria Garcia',
    userAvatar: 'https://images.unsplash.com/photo-1758685845872-4edbf0e76014?w=100',
    rating: 4,
    comment: 'Great course overall! The content is very comprehensive. Would have liked more advanced topics though.',
    date: new Date('2024-02-10'),
    helpful: 18,
  },
  {
    id: 'r3',
    courseId: '1',
    userId: 'user3',
    userName: 'John Smith',
    userAvatar: 'https://images.unsplash.com/photo-1684236685989-baafbf7bef95?w=100',
    rating: 5,
    comment: 'Perfect for beginners! The step-by-step approach made it easy to follow along.',
    date: new Date('2024-01-28'),
    helpful: 32,
  },
  {
    id: 'r4',
    courseId: '2',
    userId: 'user4',
    userName: 'Linda Chen',
    userAvatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?w=100',
    rating: 5,
    comment: 'Dr. Chen is brilliant! The machine learning section was particularly insightful.',
    date: new Date('2024-02-20'),
    helpful: 41,
  },
];

export const mockCertificates: Certificate[] = [];

export const mockBookmarks: Bookmark[] = [
  {
    courseId: '3',
    addedAt: new Date('2024-02-10'),
  },
  {
    courseId: '4',
    addedAt: new Date('2024-02-12'),
  },
];

export const mockNotes: Note[] = [
  {
    id: 'n1',
    courseId: '1',
    lessonId: 'l1',
    content: 'Web development consists of frontend and backend. Frontend is what users see and interact with.',
    timestamp: 120,
    createdAt: new Date('2024-02-15T10:30:00'),
  },
  {
    id: 'n2',
    courseId: '1',
    lessonId: 'l2',
    content: 'Important tools: VS Code, Chrome DevTools, Node.js, Git',
    timestamp: 450,
    createdAt: new Date('2024-02-16T14:20:00'),
  },
];