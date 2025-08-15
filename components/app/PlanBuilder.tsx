"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWorkoutStore, MuscleGroup, DAYS_LIST } from "@/lib/store/workoutStore";
import { Plus, Trash2, Calendar, Dumbbell } from "lucide-react";

const PlanBuilder = () => {
  const { plan, addExercise, removeExercise } = useWorkoutStore();
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [exerciseName, setExerciseName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("Chest");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const muscleGroups: MuscleGroup[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Glutes", "Full Body"];

  const handleAddExercise = () => {
    if (exerciseName.trim()) {
      addExercise(selectedDay, {
        name: exerciseName,
        muscleGroup,
        sets,
        reps,
        weight: weight > 0 ? weight : undefined,
      });
      setExerciseName("");
      setSets(3);
      setReps(10);
      setWeight(0);
    }
  };

  const dayPlan = plan.find(p => p.day === selectedDay);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Exercise Form */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Exercise
            </CardTitle>
            <CardDescription>
              Plan your workouts for {selectedDay}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_LIST.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise Name</Label>
              <Input
                id="exercise"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g., Bench Press"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscle">Muscle Group</Label>
              <Select value={muscleGroup} onValueChange={(value) => setMuscleGroup(value as MuscleGroup)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <Button onClick={handleAddExercise} className="w-full" disabled={!exerciseName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </CardContent>
        </Card>

        {/* Current Day's Plan */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {selectedDay}'s Plan
            </CardTitle>
            <CardDescription>
              {dayPlan?.exercises.length || 0} exercises planned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayPlan?.exercises.length ? (
                dayPlan.exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
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
                        variant="destructive"
                        onClick={() => removeExercise(selectedDay, exercise.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exercises planned for {selectedDay}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your complete workout schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {DAYS_LIST.map(day => {
              const dayExercises = plan.find(p => p.day === day)?.exercises || [];
              return (
                <div
                  key={day}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDay === day
                      ? 'border-primary bg-primary/10'
                      : 'border-border/40 bg-muted/10 hover:bg-muted/20'
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <h3 className="font-medium mb-2">{day}</h3>
                  <div className="space-y-1">
                    {dayExercises.length > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {dayExercises.length} exercises
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(dayExercises.map(e => e.muscleGroup))).map(group => (
                            <Badge key={group} variant="secondary" className="text-xs">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Rest day</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanBuilder;
