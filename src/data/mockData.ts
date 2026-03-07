import type { Course, UserProgress, Note, Certificate } from '@/types'

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description:
      'Master HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and launch your career as a full-stack developer.',
    instructor: {
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1758685845872-4edbf0e76014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRlYWNoaW5nJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzcyNjM2ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1742072594003-abf6ca86e154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZyUyMHNjcmVlbnxlbnwxfHx8fDE3NzI1NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Development',
    level: 'Beginner',
    duration: '42h',
    studentsEnrolled: 15678,
    rating: 4.8,
    enrolled: true,
    progress: 45,
    bookmarked: true,
    currentLesson: 'l3',
    organizationId: 'org-1',
    visibility: 'assigned',
    createdBy: 'user-3',
    reviews: [
      {
        id: 'r1',
        courseId: '1',
        userId: 'u1',
        userName: 'John Doe',
        rating: 5,
        comment:
          'Excellent course! The instructor explains everything clearly and the projects are very practical.',
        createdAt: new Date('2024-02-15'),
        helpful: 12,
      },
      {
        id: 'r2',
        courseId: '1',
        userId: 'u2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Great content, but I wish there were more advanced topics covered.',
        createdAt: new Date('2024-02-20'),
        helpful: 5,
      },
    ],
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Web Development',
        lessons: [
          {
            id: 'l1',
            title: 'What is Web Development?',
            description: "Learn the fundamentals of web development and what you'll build",
            duration: 15,
            type: 'video',
            videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            completed: true,
          },
          {
            id: 'l2',
            title: 'Setting Up Your Development Environment',
            description: 'Install and configure all necessary tools',
            duration: 20,
            type: 'video',
            videoUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            completed: true,
          },
          {
            id: 'l3',
            title: 'HTML Basics Quiz',
            description: 'Test your knowledge of HTML fundamentals',
            duration: 10,
            type: 'quiz',
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
                explanation:
                  'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
              },
              {
                id: 'q2',
                question: 'Which HTML tag is used for the largest heading?',
                options: ['<heading>', '<h6>', '<h1>', '<head>'],
                correctAnswer: 2,
                explanation:
                  'The <h1> tag is used for the largest heading in HTML, with <h6> being the smallest.',
              },
              {
                id: 'q3',
                question: 'What is the correct HTML element for inserting a line break?',
                options: ['<break>', '<br>', '<lb>', '<newline>'],
                correctAnswer: 1,
                explanation: 'The <br> tag is used to insert a line break in HTML.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Data Science & Machine Learning',
    description:
      'Learn Python, statistics, data visualization, and machine learning algorithms. Work on real datasets and build predictive models.',
    instructor: {
      name: 'Dr. Michael Chen',
      avatar:
        'https://images.unsplash.com/photo-1684236685989-baafbf7bef95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwaW5zdHJ1Y3RvciUyMGV4cGVydHxlbnwxfHx8fDE3NzI2MzY4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1718241905916-1f9786324de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljcyUyMGNvbXB1dGVyfGVufDF8fHx8MTc3MjYxMDk3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '56h',
    studentsEnrolled: 12450,
    rating: 4.9,
    enrolled: true,
    progress: 20,
    currentLesson: 'l8',
    organizationId: 'org-1',
    visibility: 'assigned',
    createdBy: 'user-3',
    modules: [],
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description:
      'Create beautiful, user-friendly interfaces. Learn design principles, wireframing, prototyping, and user research.',
    instructor: {
      name: 'Emily Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjYxOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3MjU1Nzc1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Design',
    level: 'Beginner',
    duration: '38h',
    studentsEnrolled: 9832,
    rating: 4.7,
    enrolled: false,
    organizationId: 'org-1',
    visibility: 'assigned',
    createdBy: 'user-3',
    modules: [],
  },
  // Courses for org-2 (TechStart Inc)
  {
    id: '4',
    title: 'Startup Fundamentals',
    description:
      'Learn how to build and scale a successful startup. From ideation to product-market fit.',
    instructor: {
      name: 'Alex Turner',
      avatar:
        'https://images.unsplash.com/photo-1684236685989-baafbf7bef95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwaW5zdHJ1Y3RvciUyMGV4cGVydHxlbnwxfHx8fDE3NzI2MzY4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1080',
    category: 'Business',
    level: 'Beginner',
    duration: '24h',
    studentsEnrolled: 450,
    rating: 4.6,
    enrolled: false,
    organizationId: 'org-2',
    visibility: 'assigned',
    createdBy: 'user-5',
    modules: [],
  },
  {
    id: '5',
    title: 'Agile Project Management',
    description:
      'Master Agile methodologies, Scrum framework, and sprint planning for effective team collaboration.',
    instructor: {
      name: 'Maria Garcia',
      avatar:
        'https://images.unsplash.com/photo-1758685845872-4edbf0e76014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRlYWNoaW5nJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzcyNjM2ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1080',
    category: 'Management',
    level: 'Intermediate',
    duration: '18h',
    studentsEnrolled: 320,
    rating: 4.7,
    enrolled: false,
    organizationId: 'org-2',
    visibility: 'assigned',
    createdBy: 'user-5',
    modules: [],
  },
]

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
]

export const mockNotes: Note[] = [
  {
    id: 'n1',
    courseId: '1',
    lessonId: 'l1',
    content: 'Remember to practice HTML tags daily',
    timestamp: 120,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'n2',
    courseId: '1',
    lessonId: 'l1',
    content: 'Important: Semantic HTML improves accessibility',
    timestamp: 300,
    createdAt: new Date('2024-02-10'),
  },
]

export const mockCertificates: Certificate[] = []
