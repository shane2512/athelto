import { useEffect, useMemo, useState } from "react";

export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Glutes"
  | "Full Body";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  weight?: number;
}

export interface DayPlan {
  day: string; // e.g., "Monday"
  exercises: Exercise[];
}

export type WeeklyPlan = DayPlan[];

export interface ProgressLog {
  id: string;
  date: string; // ISO date
  muscleGroup: MuscleGroup;
  weight?: number;
  reps?: number;
  notes?: string;
}

const PLAN_KEY = "gp_weekly_plan_v1";
const LOGS_KEY = "gp_progress_logs_v1";

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export const DAYS_LIST = [...DAYS];

export function useWorkoutStore() {
  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    const initial = safeGet<WeeklyPlan>(PLAN_KEY, DAYS_LIST.map((d) => ({ day: d, exercises: [] })));
    return initial;
  });

  const [logs, setLogs] = useState<ProgressLog[]>(() => safeGet<ProgressLog[]>(LOGS_KEY, []));

  useEffect(() => safeSet(PLAN_KEY, plan), [plan]);
  useEffect(() => safeSet(LOGS_KEY, logs), [logs]);

  const addExercise = (day: string, exercise: Omit<Exercise, "id">) => {
    const id = crypto.randomUUID();
    setPlan((prev) =>
      prev.map((dp) =>
        dp.day === day ? { ...dp, exercises: [...dp.exercises, { ...exercise, id }] } : dp
      )
    );
  };

  const removeExercise = (day: string, id: string) => {
    setPlan((prev) => prev.map((dp) => (dp.day === day ? { ...dp, exercises: dp.exercises.filter((e) => e.id !== id) } : dp)));
  };

  const addProgressLog = (log: Omit<ProgressLog, "id">) => {
    const id = crypto.randomUUID();
    setLogs((prev) => [{ ...log, id }, ...prev]);
  };

  // Trigger re-computation of today at midnight automatically
  const [dayTick, setDayTick] = useState(0);
  useEffect(() => {
    const schedule = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1, 0);
      const ms = next.getTime() - now.getTime();
      const timeout = window.setTimeout(() => {
        setDayTick((t) => t + 1);
        schedule();
      }, ms);
      return timeout;
    };
    const tid = schedule();
    return () => clearTimeout(tid);
  }, []);

  const todayName = useMemo(() => {
    const idx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    return DAYS_LIST[idx];
  }, [dayTick]);

  const todaysPlan = useMemo(
    () => plan.find((p) => p.day === todayName) ?? { day: todayName, exercises: [] },
    [plan, todayName]
  );


  const lastTrainedByGroup = useMemo(() => {
    const map = new Map<MuscleGroup, string>();
    for (const log of logs) {
      const existing = map.get(log.muscleGroup);
      if (!existing || new Date(log.date) > new Date(existing)) {
        map.set(log.muscleGroup, log.date);
      }
    }
    return map;
  }, [logs]);

  const inactiveMuscleGroups = (days: number): MuscleGroup[] => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const groups: MuscleGroup[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Glutes", "Full Body"];
    return groups.filter((g) => {
      const last = lastTrainedByGroup.get(g);
      return !last || new Date(last).getTime() < cutoff;
    });
  };

  const progressByGroup = (group: MuscleGroup) => logs.filter((l) => l.muscleGroup === group).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    plan,
    setPlan,
    logs,
    addExercise,
    removeExercise,
    addProgressLog,
    todaysPlan,
    todayName,
    lastTrainedByGroup,
    inactiveMuscleGroups,
    progressByGroup,
    DAYS_LIST,
  } as const;
}
