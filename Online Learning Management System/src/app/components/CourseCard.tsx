import { Link } from 'react-router';
import { Course } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, Users, Star } from 'lucide-react';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

export function CourseCard({ course, showProgress = false }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/course/${course.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="size-full object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute right-3 top-3">{course.level}</Badge>
        </div>
      </Link>

      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{course.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{course.rating}</span>
          </div>
        </div>
        <Link to={`/course/${course.id}`}>
          <h3 className="line-clamp-2 text-lg hover:text-blue-600">
            {course.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={course.instructorImage} />
            <AvatarFallback>{course.instructor[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{course.instructor}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{course.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{course.enrolledStudents.toLocaleString()}</span>
          </div>
        </div>

        {showProgress && course.enrolled && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} />
          </div>
        )}
      </CardContent>

      <CardFooter>
        {course.enrolled ? (
          <Link to={`/course/${course.id}`} className="w-full">
            <Button className="w-full">Continue Learning</Button>
          </Link>
        ) : (
          <Link to={`/course/${course.id}`} className="w-full">
            <Button className="w-full" variant="outline">
              View Course
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
