import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Calendar, Award } from "lucide-react";

export default function Results() {
  // Sample results data
  const results = [
    {
      id: 1,
      title: "General Knowledge Quiz",
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      date: "2024-01-15",
      duration: "5 min",
      category: "General"
    },
    {
      id: 2,
      title: "Science Quiz",
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      date: "2024-01-14",
      duration: "8 min",
      category: "Science"
    },
    {
      id: 3,
      title: "Math Quiz",
      score: 78,
      totalQuestions: 12,
      correctAnswers: 9,
      date: "2024-01-13",
      duration: "6 min",
      category: "Mathematics"
    },
    {
      id: 4,
      title: "History Quiz",
      score: 88,
      totalQuestions: 20,
      correctAnswers: 17,
      date: "2024-01-12",
      duration: "12 min",
      category: "History"
    }
  ];

  const averageScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  const totalQuizzes = results.length;
  const bestScore = Math.max(...results.map(r => r.score));

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    if (score >= 70) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quiz Results</h1>
        <p className="text-muted-foreground">
          Track your performance and progress over time
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              Completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{bestScore}%</div>
            <p className="text-xs text-muted-foreground">
              Personal best
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Results</CardTitle>
          <CardDescription>
            Your latest quiz performances and scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{result.title}</h3>
                    <Badge variant={getScoreBadgeVariant(result.score)}>
                      {result.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {result.date}
                    </div>
                    <span>Duration: {result.duration}</span>
                    <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={result.score} className="h-2" />
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>
            Your quiz performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Performance chart would be displayed here</p>
              <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

