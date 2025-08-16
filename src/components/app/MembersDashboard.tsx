import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../../integrations/supabase/client";

export type Member = {
  id: string;
  name: string;
  avatar_url: string | null;
  status: "offline" | "online" | "in_workout" | "resting";
  last_seen: string;
  role: string;
};

const statusCopy: Record<Member["status"], string> = {
  in_workout: "In workout",
  online: "Online",
  resting: "Resting",
  offline: "Offline",
};

const statusDot: Record<Member["status"], string> = {
  in_workout: "bg-primary",
  online: "bg-secondary",
  resting: "bg-accent",
  offline: "bg-muted-foreground",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
}

export default function MembersDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase
        .from("members")
        .select("*")
        .order("name", { ascending: true });
      if (active && data) setMembers(data as Member[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel("members-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        (payload) => {
          setMembers((cur) => {
            const copy = [...cur];
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const row = payload.new as Member;
              const idx = copy.findIndex((m) => m.id === row.id);
              if (idx >= 0) copy[idx] = row;
              else copy.unshift(row);
              return copy.sort((a, b) => a.name.localeCompare(b.name));
            } else if (payload.eventType === "DELETE") {
              const id = (payload.old as any).id as string;
              return copy.filter((m) => m.id !== id);
            }
            return copy;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const onlineCount = useMemo(
    () => members.filter((m) => m.status === "online" || m.status === "in_workout").length,
    [members]
  );

  return (
    <section className="container mx-auto px-4 md:px-0">
      <Card className="glass card-elevated rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Community Status</h2>
            <p className="text-sm text-muted-foreground">Who's active right now</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {onlineCount} online
          </Badge>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading members…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border bg-card p-4 shadow-sm transition-smooth hover:shadow-glow hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-ring/40">
                      <AvatarImage src={m.avatar_url ?? undefined} alt={`${m.name} avatar`} />
                      <AvatarFallback>{initials(m.name)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-background ${statusDot[m.status]}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{statusCopy[m.status]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}
