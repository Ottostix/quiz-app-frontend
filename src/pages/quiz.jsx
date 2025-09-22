import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { ohsFoodSafetyQuiz } from "../data/ohsFoodSafetyQuiz"; // Import the OHS and Food Safety quiz data

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Use the imported OHS and Food Safety quiz data
  const quizData = ohsFoodSafetyQuiz;

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const currentQ = quizData.questions[currentQuestion];

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQ.id]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / quizData.questions.length) * 100);
  };

  if (isCompleted) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>
              You\'ve successfully completed the {quizData.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-muted-foreground">Your Score</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold">{quizData.questions.length}</div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
              <div>
                <div className="text-2xl font-semibold text-green-600">
                  {Object.values(answers).filter((answer, index) => 
                    answer === quizData.questions[index].correct
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div>
                <div className="text-2xl font-semibold text-red-600">
                  {quizData.questions.length - Object.values(answers).filter((answer, index) => 
                    answer === quizData.questions[index].correct
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Take Again
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quizData.title}</CardTitle>
              <CardDescription>{quizData.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Question {currentQuestion + 1} of {quizData.questions.length}</span>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
            
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
            >
              {currentQuestion === quizData.questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


