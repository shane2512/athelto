"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWorkoutStore } from "@/lib/store/workoutStore";
import { Calendar, Clock, TrendingUp, Plus, Flame } from "lucide-react";
import { useMemo } from "react";

const Dashboard = () => {
  const { todaysPlan, logs, inactiveMuscleGroups, addProgressLog, weeklyStats } = useWorkoutStore();

  const todaysProgress = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return logs.filter(log => log.date.startsWith(today));
  }, [logs]);

  const weekProgress = useMemo(() => {
    const thisWeek = new Date();
    const oneWeekAgo = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    return logs.filter(log => new Date(log.date) >= oneWeekAgo).length;
  }, [logs]);

  const handleQuickLog = (muscleGroup: string) => {
    addProgressLog({
      date: new Date().toISOString(),
      muscleGroup: muscleGroup as any,
      notes: "Quick log from dashboard"
    });
  };

  const inactive7Days = inactiveMuscleGroups(7);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Workouts</CardTitle>
            <Flame className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{todaysProgress.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysPlan.exercises.length} planned exercises
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{weekProgress}</div>
            <p className="text-xs text-muted-foreground">
              {weeklyStats.consistency} consistency
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{logs.length}</div>
            <p className="text-xs text-muted-foreground">
              All time progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Plan */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Today's Plan
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
            <Badge variant={todaysPlan.exercises.length > 0 ? "default" : "secondary"}>
              {todaysPlan.exercises.length} exercises
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysPlan.exercises.length > 0 ? (
            <>
              {todaysPlan.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/40">
                  <div className="space-y-1">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{exercise.sets} sets</span>
                      <span>{exercise.reps} reps</span>
                      {exercise.weight && <span>{exercise.weight}kg</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{exercise.muscleGroup}</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleQuickLog(exercise.muscleGroup)}
                      className="bg-green-600/20 hover:bg-green-600/30 border-green-500/40"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Log
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{todaysProgress.length}/{todaysPlan.exercises.length}</span>
                </div>
                <Progress 
                  value={todaysPlan.exercises.length > 0 ? (todaysProgress.length / todaysPlan.exercises.length) * 100 : 0} 
                  className="h-3"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">No exercises planned for today</div>
              <Button variant="outline" className="glass">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Muscle Groups Alert */}
      {inactive7Days.length > 0 && (
        <Card className="glass border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-500 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Needs Attention
            </CardTitle>
            <CardDescription>
              These muscle groups haven't been trained in 7+ days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {inactive7Days.map((group) => (
                <Button
                  key={group}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLog(group)}
                  className="border-yellow-500/40 hover:bg-yellow-500/10"
                >
                  {group}
                  <Plus className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
