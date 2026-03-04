import { Link } from 'react-router';
import { mockCourses } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ProgressChart } from '../components/ProgressChart';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';

export function Dashboard() {
  const enrolledCourses = mockCourses.filter(c => c.enrolled);
  
  const stats = [
    {
      title: 'Courses Enrolled',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Hours Learned',
      value: '24',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Avg. Progress',
      value: '32%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Certificates',
      value: '0',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  const progressData = enrolledCourses.map(course => ({
    name: course.title.split(' ').slice(0, 2).join(' '),
    progress: course.progress || 0,
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl">Welcome back!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${stat.bgColor}`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Chart */}
      {enrolledCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart data={progressData} />
          </CardContent>
        </Card>
      )}

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">Continue Learning</h2>
            <Link to="/my-learning" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} showProgress />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl">Recommended for You</h2>
          <Link to="/catalog" className="text-sm text-blue-600 hover:underline">
            Browse all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockCourses
            .filter(c => !c.enrolled)
            .slice(0, 3)
            .map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </div>
      </div>
    </div>
  );
}
