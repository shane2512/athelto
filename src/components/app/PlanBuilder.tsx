import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkoutStore, MuscleGroup } from "@/store/workoutStore";

export default function PlanBuilder() {
  const { DAYS_LIST, addExercise, removeExercise, plan } = useWorkoutStore();
  const [day, setDay] = useState<string>(DAYS_LIST[0]);
  const [name, setName] = useState("");
  const [group, setGroup] = useState<MuscleGroup>("Chest");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState<number | undefined>(undefined);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addExercise(day, { name, muscleGroup: group, sets, reps, weight });
    setName("");
  };

  return (
    <section id="plan" className="container mx-auto py-8 space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Weekly Workout Plan</h2>
        <p className="text-muted-foreground">Add exercises per day with sets, reps, and weights.</p>
      </header>

      <Card className="card-elevated glass p-5">
        <form onSubmit={submit} className="grid md:grid-cols-6 gap-4">
          <div className="md:col-span-1">
            <Label>Day</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DAYS_LIST.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Exercise</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Bench Press" />
          </div>
          <div>
            <Label>Muscle Group</Label>
            <Select value={group} onValueChange={(v) => setGroup(v as MuscleGroup)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Chest","Back","Legs","Shoulders","Arms","Core","Glutes","Full Body"].map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Sets</Label>
            <Input type="number" value={sets} min={1} onChange={(e) => setSets(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label>Reps</Label>
            <Input type="number" value={reps} min={1} onChange={(e) => setReps(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input type="number" value={weight ?? ""} min={0} onChange={(e) => setWeight(e.target.value === "" ? undefined : Number(e.target.value))} />
          </div>
          <div className="md:col-span-6">
            <Button type="submit" variant="hero">Add Exercise</Button>
          </div>
        </form>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {plan.map((d) => (
          <Card key={d.day} className="card-elevated glass p-5">
            <h3 className="font-semibold mb-3">{d.day}</h3>
            {d.exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">No exercises added.</p>
            ) : (
              <ul className="space-y-2">
                {d.exercises.map((e) => (
                  <li key={e.id} className="flex items-center justify-between rounded border p-3">
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.muscleGroup} • {e.sets} x {e.reps} {e.weight ? `• ${e.weight}kg` : ""}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeExercise(d.day, e.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
