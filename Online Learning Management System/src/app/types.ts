export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'video' | 'reading' | 'quiz';
  videoUrl?: string;
  content?: string;
  completed?: boolean;
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface QuizResult {
  lessonId: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  passed: boolean;
  completedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // total hours
  enrolledStudents: number;
  rating: number;
  modules: Module[];
  price?: number;
  enrolled?: boolean;
  progress?: number; // 0-100
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  lastAccessedLesson?: string;
  progress: number;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface Note {
  id: string;
  courseId: string;
  lessonId: string;
  content: string;
  timestamp: number; // video timestamp in seconds
  createdAt: Date;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completedDate: Date;
  instructor: string;
}

export interface Bookmark {
  courseId: string;
  addedAt: Date;
}