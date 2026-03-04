import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { mockCourses, mockNotes } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { QuizComponent } from '../components/QuizComponent';
import { NotesPanel } from '../components/NotesPanel';
import { CertificateModal } from '../components/CertificateModal';
import { Certificate } from '../types';

export function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === courseId);

  const [activeTab, setActiveTab] = useState('lesson');
  const [lessonNotes, setLessonNotes] = useState(
    mockNotes.filter(n => n.courseId === courseId && n.lessonId === lessonId)
  );
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

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

  const allLessons = course.modules.flatMap(m => 
    m.lessons.map(l => ({ ...l, moduleTitle: m.title }))
  );
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex];

  if (!currentLesson) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl">Lesson not found</h2>
          <Link to={`/course/${courseId}`}>
            <Button className="mt-4">Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const handleMarkComplete = () => {
    // In a real app, this would update the backend
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    } else {
      // Course completed! Show certificate
      if (course) {
        const newCertificate: Certificate = {
          id: `cert-${Date.now()}`,
          courseId: course.id,
          courseName: course.title,
          studentName: 'John Doe', // In real app, use actual user name
          completedDate: new Date(),
          instructor: course.instructor,
        };
        setCertificate(newCertificate);
        setShowCertificate(true);
      }
      navigate(`/course/${courseId}`);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      // Auto-advance to next lesson after quiz
      setTimeout(() => {
        handleMarkComplete();
      }, 2000);
    }
  };

  const handleAddNote = (content: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      courseId: courseId!,
      lessonId: lessonId!,
      content,
      timestamp: 0, // In real app, get current video timestamp
      createdAt: new Date(),
    };
    setLessonNotes([...lessonNotes, newNote]);
  };

  const handleDeleteNote = (noteId: string) => {
    setLessonNotes(lessonNotes.filter(n => n.id !== noteId));
  };

  const completedCount = allLessons.filter(l => l.completed).length;
  const progressPercentage = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to={`/course/${courseId}`}>
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="size-4" />
            Back to Course
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Lesson {currentLessonIndex + 1} of {allLessons.length}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video/Content Area */}
          {currentLesson.type === 'quiz' && currentLesson.quizQuestions ? (
            <QuizComponent
              questions={currentLesson.quizQuestions}
              onComplete={handleQuizComplete}
            />
          ) : (
            <Card className="overflow-hidden">
              {currentLesson.type === 'video' && (
                <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayCircle className="size-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg">Video Player</p>
                    <p className="text-sm text-gray-400">
                      In a real application, this would be an embedded video player
                    </p>
                  </div>
                </div>
              )}
              {currentLesson.type === 'reading' && (
                <div className="aspect-video bg-gray-50 flex items-center justify-center p-8">
                  <div className="max-w-2xl text-center">
                    <p className="text-lg text-gray-600">
                      Reading material would be displayed here
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Lesson Details */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{currentLesson.moduleTitle}</p>
                <CardTitle>{currentLesson.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="lesson">Overview</TabsTrigger>
                  <TabsTrigger value="notes">Notes ({lessonNotes.length})</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="lesson" className="mt-4 space-y-4">
                  <p className="text-gray-600">{currentLesson.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Duration: {currentLesson.duration} minutes</span>
                    <span>•</span>
                    <span>Type: {currentLesson.type}</span>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <NotesPanel
                    notes={lessonNotes}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                  />
                </TabsContent>

                <TabsContent value="resources" className="mt-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Downloadable resources and additional materials would be listed here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {previousLesson ? (
              <Link to={`/course/${courseId}/lesson/${previousLesson.id}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              {!currentLesson.completed && (
                <Button onClick={handleMarkComplete}>
                  Mark as Complete
                </Button>
              )}
              {nextLesson && (
                <Link to={`/course/${courseId}/lesson/${nextLesson.id}`}>
                  <Button className="gap-2">
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Progress */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Course Progress</CardTitle>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-gray-600">
                  {completedCount} of {allLessons.length} lessons completed
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
              {allLessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  to={`/course/${courseId}/lesson/${lesson.id}`}
                  className={`flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 ${
                    lesson.id === lessonId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="shrink-0">
                    {lesson.completed ? (
                      <CheckCircle2 className="size-5 text-green-600" />
                    ) : (
                      <div className="flex size-5 items-center justify-center rounded-full border-2 border-gray-300 text-xs">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm line-clamp-2 ${
                      lesson.id === lessonId ? 'font-medium' : ''
                    }`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500">{lesson.duration} min</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && certificate && (
        <CertificateModal
          certificate={certificate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}