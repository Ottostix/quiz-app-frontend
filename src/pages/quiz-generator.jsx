import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, ChefHat, Menu, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { useLocation } from 'wouter';

export default function QuizGenerator() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [quizSettings, setQuizSettings] = useState({
    quiz_title: '',
    difficulty: 'medium',
    num_questions: 5
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/quiz-suggestions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!selectedSuggestion) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          source_type: selectedSuggestion.type,
          source_id: selectedSuggestion.id,
          quiz_title: quizSettings.quiz_title || selectedSuggestion.title,
          difficulty: quizSettings.difficulty,
          num_questions: quizSettings.num_questions
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedQuiz(data.quiz);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const viewQuiz = (quizId) => {
    setLocation(`/quiz?id=${quizId}`);
  };

  const canGenerateQuizzes = user?.role && ['master', 'admin', 'manager'].includes(user.role);

  if (!canGenerateQuizzes) {
    return (
      <div className="text-center py-12">
        <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You need manager access or above to generate AI quizzes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading quiz suggestions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Sparkles className="mr-3 h-8 w-8 text-primary" />
            AI Quiz Generator
          </h1>
          <p className="text-muted-foreground">
            Generate intelligent training quizzes from your menu and recipe content
          </p>
        </div>
      </div>

      {generatedQuiz && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Quiz Generated Successfully!</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your AI-powered quiz "{generatedQuiz.title}" has been created with {generatedQuiz.question_count} questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Button onClick={() => viewQuiz(generatedQuiz.id)}>
                Take Quiz Now
              </Button>
              <Button variant="outline" onClick={() => setGeneratedQuiz(null)}>
                Generate Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!generatedQuiz && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSuggestion?.id === suggestion.id && selectedSuggestion?.type === suggestion.type
                    ? 'ring-2 ring-primary border-primary' 
                    : ''
                }`}
                onClick={() => setSelectedSuggestion(suggestion)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {suggestion.type === 'menu' ? (
                      <Menu className="h-5 w-5 text-primary" />
                    ) : (
                      <ChefHat className="h-5 w-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {suggestion.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {suggestion.content_preview}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {suggestion.type === 'menu' ? 'Full Menu' : 'Single Recipe'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ~{suggestion.estimated_questions} questions
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {suggestions.length === 0 && (
            <div className="text-center py-12">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No content available</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create some menus and recipes first to generate AI quizzes.
              </p>
            </div>
          )}

          {selectedSuggestion && (
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
                <CardDescription>
                  Customize your AI-generated quiz for "{selectedSuggestion.title}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quiz_title">Quiz Title</Label>
                  <Input
                    id="quiz_title"
                    value={quizSettings.quiz_title}
                    onChange={(e) => setQuizSettings({ ...quizSettings, quiz_title: e.target.value })}
                    placeholder={selectedSuggestion.title}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={quizSettings.difficulty} onValueChange={(value) => setQuizSettings({ ...quizSettings, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="num_questions">Number of Questions</Label>
                    <Select value={quizSettings.num_questions.toString()} onValueChange={(value) => setQuizSettings({ ...quizSettings, num_questions: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="7">7 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={generateQuiz} 
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

