import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useWorkoutStore, MuscleGroup } from "../../store/workoutStore";
import SetTimer from "./SetTimer";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { todaysPlan, todayName, plan, inactiveMuscleGroups, progressByGroup } = useWorkoutStore();
  const todayGroups = useMemo(
    () => Array.from(new Set(todaysPlan.exercises.map((e) => e.muscleGroup))),
    [todaysPlan]
  );

  const [group, setGroup] = useState<MuscleGroup>(todayGroups[0] ?? "Chest");
  const data = progressByGroup(group).map((d) => ({
    date: new Date(d.date).toLocaleDateString(),
    weight: d.weight ?? 0,
  }));

  const inactive = inactiveMuscleGroups(7);

  return (
    <main className="container mx-auto py-8 space-y-8">
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">Gym Workout Planner & Progress Tracker</h1>
        <p className="text-muted-foreground">Plan your week, track each muscle group, and stay consistent.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <Card className="card-elevated glass p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today • {todayName}</h2>
            <div className="flex gap-2 flex-wrap">
              {todayGroups.length > 0 ? (
                todayGroups.map((g) => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))
              ) : (
                <Badge variant="secondary">Rest Day</Badge>
              )}
            </div>
          </div>
          {todaysPlan.exercises.length > 0 ? (
            <ul className="space-y-3">
              {todaysPlan.exercises.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.sets} x {e.reps} {e.weight ? `• ${e.weight}kg` : ""}</div>
                  </div>
                  <Badge>{e.muscleGroup}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground">No exercises planned today.</div>
          )}
        </Card>

        <SetTimer />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="card-elevated glass p-5">
          <h2 className="text-xl font-semibold mb-4">Weekly Plan Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {plan.map((d) => (
              <div key={d.day} className="rounded border p-4">
                <div className="font-medium">{d.day}</div>
                <div className="text-sm text-muted-foreground">{d.exercises.length} exercise(s)</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="hero" asChild>
              <a href="#plan">Build/Update Plan</a>
            </Button>
          </div>
        </Card>

        <Card className="card-elevated glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress • Muscle Group</h2>
            <Select value={group} onValueChange={(v) => setGroup(v as MuscleGroup)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Chest","Back","Legs","Shoulders","Arms","Core","Glutes","Full Body"].map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" hide tick={{ fontSize: 12 }} />
                <YAxis hide tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {data.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">No logs yet for {group}.</p>
          )}
        </Card>
      </section>

      <section>
        <Card className="card-elevated glass p-5">
          <h2 className="text-xl font-semibold mb-3">Needs Attention</h2>
          {inactive.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {inactive.map((g) => (
                <Badge key={g} variant="outline">{g}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Great job! You've trained all muscle groups in the last 7 days.</p>
          )}
        </Card>
      </section>
    </main>
  );
}
