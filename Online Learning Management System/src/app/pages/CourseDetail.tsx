import { useParams, Link } from 'react-router';
import { mockCourses, mockReviews } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LessonList } from '../components/LessonList';
import { ReviewSection } from '../components/ReviewSection';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Clock, Users, Star, BookOpen, Award, ChevronLeft, Play } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function CourseDetail() {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl">Course not found</h2>
          <Link to="/catalog">
            <Button className="mt-4">Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter(l => l.completed).length,
    0
  );

  const firstIncompleteLesson = course.modules
    .flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })))
    .find(l => !l.completed);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/catalog">
        <Button variant="ghost" className="gap-2">
          <ChevronLeft className="size-4" />
          Back to Catalog
        </Button>
      </Link>

      {/* Course Header */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Badge>{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="mb-3 text-4xl">{course.title}</h1>
            <p className="text-lg text-gray-600">{course.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              <span>{course.enrolledStudents.toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5" />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-5" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>

          {/* Instructor */}
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={course.instructorImage} />
                <AvatarFallback>{course.instructor[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{course.instructor}</p>
                <p className="text-gray-600">Expert Instructor</p>
              </div>
            </CardContent>
          </Card>

          {/* Course Content Tabs */}
          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <p className="text-sm text-gray-600">
                    {course.modules.length} modules • {totalLessons} lessons
                  </p>
                </CardHeader>
                <CardContent>
                  <LessonList modules={course.modules} courseId={course.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <Award className="size-5 shrink-0 text-green-600" />
                      <span>Master core concepts and best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="size-5 shrink-0 text-green-600" />
                      <span>Build real-world projects from scratch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="size-5 shrink-0 text-green-600" />
                      <span>Get hands-on experience with industry tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="size-5 shrink-0 text-green-600" />
                      <span>Receive certificate upon completion</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewSection
                reviews={mockReviews.filter(r => r.courseId === course.id)}
                averageRating={course.rating}
                totalReviews={mockReviews.filter(r => r.courseId === course.id).length}
                onAddReview={(rating, comment) => {
                  console.log('New review:', rating, comment);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img src={course.thumbnail} alt={course.title} className="size-full object-cover" />
            </div>
            <CardContent className="space-y-4 p-6">
              {course.enrolled ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Your Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {completedLessons} of {totalLessons} lessons completed
                    </p>
                  </div>
                  {firstIncompleteLesson && (
                    <Link to={`/course/${course.id}/lesson/${firstIncompleteLesson.id}`}>
                      <Button className="w-full gap-2">
                        <Play className="size-4" />
                        Continue Learning
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-3xl">${course.price || 49.99}</p>
                    <p className="text-sm text-gray-600">One-time payment</p>
                  </div>
                  <Button className="w-full">Enroll Now</Button>
                  <p className="text-center text-sm text-gray-600">
                    30-day money-back guarantee
                  </p>
                </>
              )}

              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">This course includes:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Clock className="size-4" />
                    {course.duration} hours on-demand video
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="size-4" />
                    {totalLessons} lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="size-4" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}