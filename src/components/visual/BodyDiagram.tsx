import { useMemo } from "react";
import { useWorkoutStore, MuscleGroup } from "@/store/workoutStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MuscleGroupData {
  name: MuscleGroup;
  level: number; // 0-5 (0 = untrained/grey, 5 = legend/purple)
  lastTrained?: string;
  totalWorkouts: number;
}

const BodyDiagram = () => {
  const { logs, lastTrainedByGroup } = useWorkoutStore();

  // Calculate muscle group progress levels
  const muscleGroupData = useMemo((): MuscleGroupData[] => {
    const muscleGroups: MuscleGroup[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Glutes"];
    
    return muscleGroups.map(group => {
      const groupLogs = logs.filter(log => log.muscleGroup === group);
      const totalWorkouts = groupLogs.length;
      const lastTrained = lastTrainedByGroup.get(group);
      
      // Calculate level based on frequency and recency
      let level = 0;
      if (totalWorkouts > 0) {
        // Base level from workout count (max 3 points)
        level = Math.min(3, Math.floor(totalWorkouts / 3));
        
        // Bonus points for recent activity (max 2 points)
        if (lastTrained) {
          const daysSinceLastWorkout = Math.floor(
            (Date.now() - new Date(lastTrained).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSinceLastWorkout <= 3) level += 2;
          else if (daysSinceLastWorkout <= 7) level += 1;
        }
      }
      
      return {
        name: group,
        level: Math.min(5, level),
        lastTrained,
        totalWorkouts
      };
    });
  }, [logs, lastTrainedByGroup]);

  const getIntensityColor = (level: number): string => {
    const colors = [
      "hsl(var(--muted))", // 0 - Grey (untrained)
      "hsl(var(--muted-foreground))", // 1 - Light grey
      "hsl(var(--secondary))", // 2 - Teal start
      "hsl(var(--accent))", // 3 - Coral
      "hsl(var(--primary) / 0.7)", // 4 - Light purple
      "hsl(var(--primary))" // 5 - Full purple (legend)
    ];
    return colors[level] || colors[0];
  };

  const getLevelLabel = (level: number): string => {
    const labels = ["Untrained", "Beginner", "Novice", "Intermediate", "Advanced", "Legend"];
    return labels[level] || "Untrained";
  };

  const getMuscleGroupPosition = (group: MuscleGroup) => {
    const positions = {
      "Shoulders": { top: "15%", left: "42%", width: "16%", height: "12%" },
      "Chest": { top: "25%", left: "45%", width: "10%", height: "15%" },
      "Arms": { top: "25%", left: "32%", width: "12%", height: "20%" },
      "Core": { top: "40%", left: "44%", width: "12%", height: "15%" },
      "Back": { top: "20%", left: "65%", width: "12%", height: "25%" },
      "Glutes": { top: "45%", left: "66%", width: "10%", height: "12%" },
      "Legs": { top: "60%", left: "40%", width: "20%", height: "35%" },
    };
    return positions[group] || { top: "50%", left: "50%", width: "10%", height: "10%" };
  };

  return (
    <Card className="p-6 glass">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Body Diagram */}
        <div className="flex-1 relative">
          <h3 className="text-xl font-semibold mb-4 text-center">Your Progress Map</h3>
          <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-card rounded-2xl border border-border/50 overflow-hidden">
            {/* Human silhouette background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 300"
                className="w-full h-full text-muted-foreground/20"
                fill="currentColor"
              >
                {/* Simple human silhouette */}
                <ellipse cx="100" cy="30" rx="20" ry="25" /> {/* Head */}
                <rect x="85" y="50" width="30" height="50" rx="5" /> {/* Torso */}
                <rect x="70" y="60" width="15" height="40" rx="7" /> {/* Left arm */}
                <rect x="115" y="60" width="15" height="40" rx="7" /> {/* Right arm */}
                <rect x="90" y="100" width="20" height="40" rx="3" /> {/* Abs/Core */}
                <rect x="88" y="140" width="24" height="20" rx="3" /> {/* Hips */}
                <rect x="85" y="160" width="12" height="60" rx="6" /> {/* Left leg */}
                <rect x="103" y="160" width="12" height="60" rx="6" /> {/* Right leg */}
              </svg>
            </div>

            {/* Interactive muscle group overlays */}
            {muscleGroupData.map((muscle) => {
              const position = getMuscleGroupPosition(muscle.name);
              const color = getIntensityColor(muscle.level);
              
              return (
                <div
                  key={muscle.name}
                  className="absolute rounded-lg border-2 border-white/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 group"
                  style={{
                    ...position,
                    backgroundColor: color,
                    opacity: muscle.level === 0 ? 0.3 : 0.8,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow-lg text-center px-1">
                      {muscle.name}
                    </span>
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                    <div className="text-sm font-medium">{muscle.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Level: {getLevelLabel(muscle.level)} ({muscle.totalWorkouts} workouts)
                    </div>
                    {muscle.lastTrained && (
                      <div className="text-xs text-muted-foreground">
                        Last: {new Date(muscle.lastTrained).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Legend & Stats */}
        <div className="lg:w-80 space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold">Progress Levels</h4>
            {[0, 1, 2, 3, 4, 5].map(level => (
              <div key={level} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: getIntensityColor(level) }}
                />
                <span className="text-sm">{getLevelLabel(level)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Muscle Group Stats</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {muscleGroupData
                .sort((a, b) => b.level - a.level)
                .map(muscle => (
                  <div key={muscle.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getIntensityColor(muscle.level) }}
                      />
                      <span className="text-sm font-medium">{muscle.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {muscle.totalWorkouts}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: getIntensityColor(muscle.level) }}
                      >
                        {getLevelLabel(muscle.level)}
                      </Badge>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BodyDiagram;