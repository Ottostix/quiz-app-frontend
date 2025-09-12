import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Beaker, 
  Clock, 
  Users, 
  Star,
  Play
} from "lucide-react";

export default function Menu() {
  const [, navigate] = useLocation();

  const quizCategories = [
    {
      id: 1,
      title: "General Knowledge",
      description: "Test your knowledge across various topics",
      icon: Globe,
      difficulty: "Medium",
      questions: 15,
      duration: "10 min",
      rating: 4.5,
      participants: 1250,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Mathematics",
      description: "Challenge yourself with math problems",
      icon: Calculator,
      difficulty: "Hard",
      questions: 20,
      duration: "15 min",
      rating: 4.2,
      participants: 890,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Science",
      description: "Explore the wonders of science",
      icon: Beaker,
      difficulty: "Medium",
      questions: 12,
      duration: "8 min",
      rating: 4.7,
      participants: 1100,
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Literature",
      description: "Dive into the world of books and authors",
      icon: BookOpen,
      difficulty: "Easy",
      questions: 10,
      duration: "7 min",
      rating: 4.3,
      participants: 650,
      color: "bg-orange-500"
    },
    {
      id: 5,
      title: "History",
      description: "Journey through time and historical events",
      icon: Clock,
      difficulty: "Medium",
      questions: 18,
      duration: "12 min",
      rating: 4.4,
      participants: 980,
      color: "bg-red-500"
    },
    {
      id: 6,
      title: "Geography",
      description: "Explore countries, capitals, and landmarks",
      icon: Globe,
      difficulty: "Easy",
      questions: 14,
      duration: "9 min",
      rating: 4.1,
      participants: 720,
      color: "bg-teal-500"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartQuiz = (category) => {
    // In a real app, this would navigate to the quiz with the specific category
    navigate("/quiz");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quiz Menu</h1>
        <p className="text-muted-foreground">
          Choose from our collection of engaging quizzes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${category.color} text-white`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <Badge className={getDifficultyColor(category.difficulty)}>
                  {category.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{category.questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{category.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{category.rating}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{category.participants}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleStartQuiz(category)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Quiz
          </CardTitle>
          <CardDescription>
            Try our most popular quiz of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Ultimate Knowledge Challenge</h3>
              <p className="text-muted-foreground">
                A comprehensive quiz covering all categories
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span>50 questions</span>
                <span>30 minutes</span>
                <span>4.8/5 rating</span>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate("/quiz")}>
              Take Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

