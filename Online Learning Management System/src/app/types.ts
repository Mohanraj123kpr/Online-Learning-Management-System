export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'video' | 'reading' | 'quiz';
  videoUrl?: string;
  content?: string;
  completed?: boolean;
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
