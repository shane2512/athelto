import { useMemo } from "react";
import { useWorkoutStore, MuscleGroup } from "@/store/workoutStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnatomicalMuscle {
  name: string;
  group: MuscleGroup;
  level: number;
  totalWorkouts: number;
  lastTrained?: string;
}

const BodyDiagram = () => {
  const { logs, lastTrainedByGroup } = useWorkoutStore();

  // Map anatomical muscles to workout groups
  const anatomicalMuscles = [
    // Front view muscles
    { name: "Pectoralis", group: "Chest" as MuscleGroup },
    { name: "Biceps", group: "Arms" as MuscleGroup },
    { name: "Rectus Abdominis", group: "Core" as MuscleGroup },
    { name: "Obliques", group: "Core" as MuscleGroup },
    { name: "Quadriceps", group: "Legs" as MuscleGroup },
    { name: "Deltoid", group: "Shoulders" as MuscleGroup },
    // Back view muscles
    { name: "Trapezius", group: "Shoulders" as MuscleGroup },
    { name: "Triceps", group: "Arms" as MuscleGroup },
    { name: "Latissimus Dorsi", group: "Back" as MuscleGroup },
    { name: "Gluteus Maximus", group: "Glutes" as MuscleGroup },
    { name: "Hamstrings", group: "Legs" as MuscleGroup },
  ];

  // Calculate muscle progress levels
  const muscleData = useMemo((): AnatomicalMuscle[] => {
    return anatomicalMuscles.map(muscle => {
      const groupLogs = logs.filter(log => log.muscleGroup === muscle.group);
      const totalWorkouts = groupLogs.length;
      const lastTrained = lastTrainedByGroup.get(muscle.group);
      
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
        name: muscle.name,
        group: muscle.group,
        level: Math.min(5, level),
        totalWorkouts,
        lastTrained
      };
    });
  }, [logs, lastTrainedByGroup]);

  const getIntensityColor = (level: number): string => {
    const colors = [
      "#6B7280", // 0 - Grey (untrained)
      "#9CA3AF", // 1 - Light grey  
      "#00D1B2", // 2 - Teal
      "#FF6B6B", // 3 - Coral
      "#A855F7", // 4 - Light purple
      "#7A5FFF"  // 5 - Full purple (legend)
    ];
    return colors[level] || colors[0];
  };

  const getLevelLabel = (level: number): string => {
    const labels = ["Untrained", "Beginner", "Novice", "Intermediate", "Advanced", "Legend"];
    return labels[level] || "Untrained";
  };

  const getMuscleById = (muscleName: string) => {
    return muscleData.find(m => m.name === muscleName) || { level: 0, name: muscleName, group: "Core" as MuscleGroup, totalWorkouts: 0 };
  };

  return (
    <Card className="p-6 glass">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Body Diagrams */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-6 text-center">Anatomical Progress Map</h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Front View */}
            <div className="relative">
              <h4 className="text-lg font-medium mb-4 text-center">Front View</h4>
              <div className="relative aspect-[3/4] bg-card rounded-2xl border border-border/50 overflow-hidden p-4">
                <svg viewBox="0 0 200 300" className="w-full h-full">
                  {/* Head */}
                  <ellipse cx="100" cy="30" rx="15" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Shoulders/Deltoids */}
                  <ellipse cx="75" cy="60" rx="12" ry="15" fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="125" cy="60" rx="12" ry="15" fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Pectoralis */}
                  <ellipse cx="100" cy="75" rx="18" ry="20" fill={getIntensityColor(getMuscleById("Pectoralis").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Biceps */}
                  <ellipse cx="65" cy="90" rx="8" ry="18" fill={getIntensityColor(getMuscleById("Biceps").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="135" cy="90" rx="8" ry="18" fill={getIntensityColor(getMuscleById("Biceps").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Rectus Abdominis */}
                  <rect x="88" y="100" width="24" height="35" rx="4" fill={getIntensityColor(getMuscleById("Rectus Abdominis").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Obliques */}
                  <ellipse cx="78" cy="120" rx="8" ry="15" fill={getIntensityColor(getMuscleById("Obliques").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="122" cy="120" rx="8" ry="15" fill={getIntensityColor(getMuscleById("Obliques").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Hip area */}
                  <rect x="88" y="140" width="24" height="15" rx="3" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Quadriceps */}
                  <ellipse cx="88" cy="180" rx="10" ry="25" fill={getIntensityColor(getMuscleById("Quadriceps").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="112" cy="180" rx="10" ry="25" fill={getIntensityColor(getMuscleById("Quadriceps").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Lower legs */}
                  <ellipse cx="88" cy="230" rx="8" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="112" cy="230" rx="8" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Feet */}
                  <ellipse cx="88" cy="265" rx="6" ry="10" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="112" cy="265" rx="6" ry="10" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                </svg>
              </div>
            </div>

            {/* Back View */}
            <div className="relative">
              <h4 className="text-lg font-medium mb-4 text-center">Back View</h4>
              <div className="relative aspect-[3/4] bg-card rounded-2xl border border-border/50 overflow-hidden p-4">
                <svg viewBox="0 0 200 300" className="w-full h-full">
                  {/* Head */}
                  <ellipse cx="100" cy="30" rx="15" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Trapezius */}
                  <polygon points="100,45 85,55 85,80 115,80 115,55" fill={getIntensityColor(getMuscleById("Trapezius").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Deltoids (back) */}
                  <ellipse cx="75" cy="60" rx="12" ry="15" fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="125" cy="60" rx="12" ry="15" fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Triceps */}
                  <ellipse cx="65" cy="90" rx="8" ry="18" fill={getIntensityColor(getMuscleById("Triceps").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="135" cy="90" rx="8" ry="18" fill={getIntensityColor(getMuscleById("Triceps").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Latissimus Dorsi */}
                  <polygon points="85,85 115,85 120,120 80,120" fill={getIntensityColor(getMuscleById("Latissimus Dorsi").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Lower back */}
                  <rect x="88" y="125" width="24" height="15" rx="3" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Gluteus Maximus */}
                  <ellipse cx="100" cy="150" rx="20" ry="12" fill={getIntensityColor(getMuscleById("Gluteus Maximus").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Hamstrings */}
                  <ellipse cx="88" cy="180" rx="10" ry="25" fill={getIntensityColor(getMuscleById("Hamstrings").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  <ellipse cx="112" cy="180" rx="10" ry="25" fill={getIntensityColor(getMuscleById("Hamstrings").level)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2" strokeWidth="1" stroke="#fff"/>
                  
                  {/* Calves */}
                  <ellipse cx="88" cy="230" rx="8" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="112" cy="230" rx="8" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Feet */}
                  <ellipse cx="88" cy="265" rx="6" ry="10" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="112" cy="265" rx="6" ry="10" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Legend & Stats */}
        <div className="xl:w-80 space-y-4">
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
            <h4 className="font-semibold">Muscle Progress</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {muscleData
                .sort((a, b) => b.level - a.level)
                .map(muscle => (
                  <div key={muscle.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: getIntensityColor(muscle.level) }}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{muscle.name}</span>
                        <span className="text-xs text-muted-foreground">{muscle.group}</span>
                      </div>
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