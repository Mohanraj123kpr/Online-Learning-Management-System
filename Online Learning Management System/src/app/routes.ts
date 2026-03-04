import { createBrowserRouter } from 'react-router';
import { RootLayout } from './pages/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseDetail } from './pages/CourseDetail';
import { LessonViewer } from './pages/LessonViewer';
import { MyLearning } from './pages/MyLearning';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'catalog', Component: CourseCatalog },
      { path: 'my-learning', Component: MyLearning },
      { path: 'course/:courseId', Component: CourseDetail },
      { path: 'course/:courseId/lesson/:lessonId', Component: LessonViewer },
      { path: '*', Component: NotFound },
    ],
  },
]);
