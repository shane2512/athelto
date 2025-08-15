"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWorkoutStore } from "@/lib/store/workoutStore";
import { User, Trophy, Flame, Target, Clock } from "lucide-react";
import { useMemo } from "react";

const MembersDashboard = () => {
  const { logs, weeklyStats, todaysPlan, todayName } = useWorkoutStore();

  const userStats = useMemo(() => {
    const totalWorkouts = logs.length;
    const daysActive = new Set(logs.map(log => log.date.split('T')[0])).size;
    const avgWorkoutsPerWeek = totalWorkouts > 0 && daysActive > 0 ? (totalWorkouts / Math.max(1, Math.ceil(daysActive / 7))) : 0;
    
    // Calculate fitness level based on consistency and volume
    let fitnessLevel = "Beginner";
    let levelProgress = 0;
    
    if (totalWorkouts >= 50) {
      fitnessLevel = "Expert";
      levelProgress = 100;
    } else if (totalWorkouts >= 25) {
      fitnessLevel = "Advanced";
      levelProgress = 75;
    } else if (totalWorkouts >= 10) {
      fitnessLevel = "Intermediate";
      levelProgress = 50;
    } else if (totalWorkouts >= 3) {
      fitnessLevel = "Novice";
      levelProgress = 25;
    }

    return {
      totalWorkouts,
      daysActive,
      avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10,
      fitnessLevel,
      levelProgress
    };
  }, [logs]);

  const streakInfo = useMemo(() => {
    if (logs.length === 0) return { current: 0, longest: 0 };
    
    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const uniqueDays = Array.from(new Set(sortedLogs.map(log => log.date.split('T')[0]))).sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    // Calculate longest streak
    for (let i = 1; i < uniqueDays.length; i++) {
      const prevDate = new Date(uniqueDays[i - 1]);
      const currDate = new Date(uniqueDays[i]);
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (uniqueDays.includes(today) || uniqueDays.includes(yesterday)) {
      let streakDate = uniqueDays.includes(today) ? today : yesterday;
      currentStreak = 1;
      
      for (let i = uniqueDays.indexOf(streakDate) - 1; i >= 0; i--) {
        const prevDate = new Date(uniqueDays[i]);
        const currDate = new Date(uniqueDays[i + 1]);
        const dayDiff = (currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    return { current: currentStreak, longest: longestStreak };
  }, [logs]);

  return (
    <Card className="glass border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="h-6 w-6 text-primary" />
              Fitness Profile
            </CardTitle>
            <CardDescription className="text-base">
              Welcome back! Here's your fitness journey overview
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {userStats.fitnessLevel}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              Level {userStats.levelProgress}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fitness Level Progress</span>
            <span>{userStats.levelProgress}%</span>
          </div>
          <Progress value={userStats.levelProgress} className="h-3" />
          <div className="text-xs text-muted-foreground">
            {userStats.totalWorkouts < 50 && `${50 - userStats.totalWorkouts} more workouts to reach Expert level`}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-blue-500">{userStats.totalWorkouts}</div>
            <div className="text-xs text-muted-foreground">Total Workouts</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
            <Flame className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-500">{streakInfo.current}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
            <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-purple-500">{streakInfo.longest}</div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-orange-500">{userStats.avgWorkoutsPerWeek}</div>
            <div className="text-xs text-muted-foreground">Avg/Week</div>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Today is {todayName}</h3>
              <p className="text-sm text-muted-foreground">
                {todaysPlan.exercises.length > 0 
                  ? `${todaysPlan.exercises.length} exercises planned`
                  : "No workouts planned - time to add some!"
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {weeklyStats.totalWorkouts}
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            🎯 {weeklyStats.consistency} Consistency
          </Badge>
          <Badge variant="secondary" className="text-xs">
            💪 {userStats.daysActive} Active Days
          </Badge>
          <Badge variant="secondary" className="text-xs">
            🔥 {weeklyStats.uniqueMuscleGroups} Muscle Groups This Week
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersDashboard;
