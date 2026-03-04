import { mockCourses } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Card, CardContent } from '../components/ui/card';

export function MyLearning() {
  const enrolledCourses = mockCourses.filter(c => c.enrolled);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);
  const inProgressCourses = enrolledCourses.filter(c => c.progress && c.progress < 100);

  const overallProgress = enrolledCourses.length > 0
    ? Math.round(
        enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl">My Learning</h1>
        <p className="text-gray-600">Track your progress and continue learning</p>
      </div>

      {/* Overall Progress */}
      {enrolledCourses.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg">Overall Progress</h3>
                  <p className="text-sm text-gray-600">
                    {enrolledCourses.length} {enrolledCourses.length === 1 ? 'course' : 'courses'} enrolled
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl">{overallProgress}%</p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Courses ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCourses.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {enrolledCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <CourseCard key={course.id} course={course} showProgress />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg text-gray-600">No enrolled courses yet</p>
              <p className="text-sm text-gray-500">Start learning by browsing our catalog</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          {inProgressCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} course={course} showProgress />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg text-gray-600">No courses in progress</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((course) => (
                <CourseCard key={course.id} course={course} showProgress />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg text-gray-600">No completed courses yet</p>
              <p className="text-sm text-gray-500">Keep learning to earn certificates</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
