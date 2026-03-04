import { useState } from 'react';
import { QuizQuestion } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { Progress } from './ui/progress';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowFeedback(true);
    setAnswers([...answers, selectedAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz completed
      const finalAnswers = [...answers, selectedAnswer!];
      const correctCount = finalAnswers.reduce((count, answer, index) => {
        return count + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= 70; // 70% passing grade

      setQuizCompleted(true);
      onComplete(score, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const correctCount = answers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className={`mx-auto mb-4 flex size-20 items-center justify-center rounded-full ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Trophy className="size-10 text-green-600" />
            ) : (
              <XCircle className="size-10 text-red-600" />
            )}
          </div>
          <h2 className="mb-2 text-2xl">
            {passed ? 'Congratulations!' : 'Quiz Not Passed'}
          </h2>
          <p className="mb-6 text-gray-600">
            You scored {correctCount} out of {questions.length} ({score}%)
          </p>
          {passed ? (
            <p className="text-green-600 mb-6">
              Great job! You've passed the quiz.
            </p>
          ) : (
            <p className="text-red-600 mb-6">
              You need 70% to pass. Review the material and try again.
            </p>
          )}
          <Button onClick={handleRetry} variant={passed ? 'outline' : 'default'}>
            {passed ? 'Retake Quiz' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <CardTitle className="mt-4">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
          disabled={showFeedback}
        >
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                  showFeedback
                    ? index === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : index === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-50'
                      : ''
                    : 'hover:bg-gray-50'
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
                {showFeedback && index === question.correctAnswer && (
                  <CheckCircle2 className="size-5 text-green-600" />
                )}
                {showFeedback && index === selectedAnswer && !isCorrect && (
                  <XCircle className="size-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </RadioGroup>

        {showFeedback && question.explanation && (
          <Alert className={isCorrect ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription>
              <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {question.explanation}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-3">
          {!showFeedback ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
