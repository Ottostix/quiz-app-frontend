import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  FileQuestion, 
  TrendingUp, 
  Award, 
  Store,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { useLocation } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchStats(selectedStore);
    }
  }, [selectedStore]);

  const fetchStores = async () => {
    if (user?.role === 'master' || user?.role === 'admin') {
      try {
        const response = await fetch('/api/stores', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setStores(data);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    }
  };

  const fetchStats = async (storeId = null) => {
    try {
      const url = storeId ? `/api/dashboard-stats?store_id=${storeId}` : '/api/dashboard-stats';
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No data available</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete some quizzes to see analytics.
        </p>
      </div>
    );
  }

  // Prepare chart data
  const difficultyChartData = Object.entries(stats.difficulty_performance || {}).map(([difficulty, data]) => ({
    difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    score: data.average_score,
    count: data.count,
    passRate: data.pass_rate
  }));

  const scoreDistributionData = [
    { name: 'Excellent (86-100)', value: Math.round((stats.pass_rate || 0) * 0.4), color: '#22c55e' },
    { name: 'Good (71-85)', value: Math.round((stats.pass_rate || 0) * 0.6), color: '#3b82f6' },
    { name: 'Pass (51-70)', value: Math.round((100 - (stats.pass_rate || 0)) * 0.7), color: '#f59e0b' },
    { name: 'Fail (0-50)', value: Math.round((100 - (stats.pass_rate || 0)) * 0.3), color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor training progress and performance analytics
          </p>
        </div>
        
        {(user?.role === 'master' || user?.role === 'admin') && stores.length > 0 && (
          <div className="w-64">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active training participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Completions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_completions || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recent_completions || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.average_score || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.pass_rate || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Scores ≥ 70%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      {difficultyChartData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance by Difficulty */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty</CardTitle>
              <CardDescription>
                Average scores across different difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'score' ? `${value.toFixed(1)}%` : value,
                      name === 'score' ? 'Average Score' : name === 'count' ? 'Attempts' : 'Pass Rate'
                    ]}
                  />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>
                Breakdown of performance levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Performers and Popular Quizzes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Highest scoring users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats.top_performers || []).map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{performer.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {performer.quiz_count} quizzes completed
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {performer.average_score.toFixed(1)}%
                  </Badge>
                </div>
              ))}
              {(!stats.top_performers || stats.top_performers.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quiz completions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Quizzes</CardTitle>
            <CardDescription>
              Most completed training modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats.popular_quizzes || []).map((quiz, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{quiz.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {quiz.completions} completions
                    </p>
                  </div>
                  <Badge variant="outline">
                    {quiz.average_score.toFixed(1)}% avg
                  </Badge>
                </div>
              ))}
              {(!stats.popular_quizzes || stats.popular_quizzes.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quiz data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common training management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setLocation('/quiz')}>
              <FileQuestion className="mr-2 h-4 w-4" />
              Take Quiz
            </Button>
            <Button variant="outline" onClick={() => setLocation('/results')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Results
            </Button>
            {(user?.role === 'master' || user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <Button variant="outline" onClick={() => setLocation('/quiz-generator')}>
                  <Target className="mr-2 h-4 w-4" />
                  Generate Quiz
                </Button>
                <Button variant="outline" onClick={() => setLocation('/menus')}>
                  <Clock className="mr-2 h-4 w-4" />
                  Manage Content
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

