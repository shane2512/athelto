import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Counter from "@/components/visual/Counter";
import { toast } from "@/components/ui/sonner";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function SetTimer() {
  const [seconds, setSeconds] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const progress = useMemo(() => (seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 0), [seconds, remaining]);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          if ("vibrate" in navigator) navigator.vibrate?.(200);
          toast("Rest complete", { description: "Time to start your next set." });
          if (typeof Notification !== "undefined") {
            if (Notification.permission === "granted") {
              new Notification("Rest Timer", { body: "Rest complete. Let's go!" });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((perm) => {
                if (perm === "granted") new Notification("Rest Timer", { body: "Rest complete. Let's go!" });
              });
            }
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const start = () => {
    setRemaining(seconds);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset = () => {
    setRunning(false);
    setRemaining(seconds);
  };

  return (
    <Card className="card-elevated glass p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Rest Timer</h3>
        <div className="text-sm text-muted-foreground">Between sets</div>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm">Seconds</label>
        <Input
          type="number"
          min={10}
          max={600}
          value={seconds}
          onChange={(e) => {
            const v = Number(e.target.value) || 0;
            setSeconds(v);
            setRemaining(v);
          }}
          className="w-24"
        />
      </div>
      <div className="rounded-md border p-6 text-center">
        <div className="flex items-end justify-center gap-2">
          <Counter value={mins} fontSize={48} places={[10,1]} textColor="hsl(var(--primary))" />
          <span className="text-4xl font-bold">:</span>
          <Counter value={secs} fontSize={48} places={[10,1]} textColor="hsl(var(--primary))" />
        </div>
        <div className="mt-3 h-2 w-full rounded bg-muted overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {!running && remaining === seconds && (
          <Button variant="hero" onClick={start} className="flex-1">Start</Button>
        )}
        {running && (
          <Button variant="secondary" onClick={pause} className="flex-1">Pause</Button>
        )}
        {!running && remaining !== seconds && remaining > 0 && (
          <Button variant="default" onClick={resume} className="flex-1">Resume</Button>
        )}
        <Button variant="outline" onClick={reset} className="flex-1">Reset</Button>
      </div>
    </Card>
  );
}
