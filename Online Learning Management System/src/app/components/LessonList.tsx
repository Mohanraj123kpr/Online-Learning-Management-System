import { Link } from 'react-router';
import { Module } from '../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Circle, PlayCircle, FileText, ClipboardCheck } from 'lucide-react';
import { cn } from './ui/utils';

interface LessonListProps {
  modules: Module[];
  courseId: string;
  currentLessonId?: string;
}

export function LessonList({ modules, courseId, currentLessonId }: LessonListProps) {
  const getLessonIcon = (type: string, completed?: boolean) => {
    if (completed) {
      return <CheckCircle2 className="size-5 text-green-600" />;
    }

    switch (type) {
      case 'video':
        return <PlayCircle className="size-5 text-gray-400" />;
      case 'reading':
        return <FileText className="size-5 text-gray-400" />;
      case 'quiz':
        return <ClipboardCheck className="size-5 text-gray-400" />;
      default:
        return <Circle className="size-5 text-gray-400" />;
    }
  };

  return (
    <Accordion type="multiple" defaultValue={modules.map(m => m.id)} className="w-full">
      {modules.map((module, index) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                {index + 1}
              </div>
              <span>{module.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-11 space-y-1">
              {module.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/course/${courseId}/lesson/${lesson.id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50',
                    currentLessonId === lesson.id && 'bg-blue-50'
                  )}
                >
                  {getLessonIcon(lesson.type, lesson.completed)}
                  <div className="flex-1">
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-gray-500">
                      {lesson.duration} min • {lesson.type}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
