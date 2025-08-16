import { useMemo } from "react";
import { useWorkoutStore, MuscleGroup } from "../../store/workoutStore";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

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
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Front View */}
            <div className="relative">
              <h4 className="text-lg font-medium mb-4 text-center">Front View</h4>
              <div className="relative aspect-[3/4] bg-card rounded-2xl border border-border/50 overflow-hidden p-4">
                <svg viewBox="0 0 300 400" className="w-full h-full">
                  {/* Head */}
                  <ellipse cx="150" cy="40" rx="20" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Neck */}
                  <rect x="140" y="60" width="20" height="15" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Deltoids (Shoulders) - Front */}
                  <path d="M110 85 Q105 75 95 80 L85 90 Q85 105 95 110 L110 105 Z" 
                    fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <path d="M190 85 Q195 75 205 80 L215 90 Q215 105 205 110 L190 105 Z" 
                    fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Pectoralis Major */}
                  <path d="M120 85 Q150 75 180 85 L175 110 Q150 120 125 110 Z" 
                    fill={getIntensityColor(getMuscleById("Pectoralis").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Biceps */}
                  <ellipse cx="95" cy="125" rx="8" ry="20" 
                    fill={getIntensityColor(getMuscleById("Biceps").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <ellipse cx="205" cy="125" rx="8" ry="20" 
                    fill={getIntensityColor(getMuscleById("Biceps").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Forearms */}
                  <ellipse cx="95" cy="160" rx="6" ry="18" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="205" cy="160" rx="6" ry="18" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Rectus Abdominis (Six Pack) */}
                  <path d="M130 120 L170 120 L165 165 L135 165 Z" 
                    fill={getIntensityColor(getMuscleById("Rectus Abdominis").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Ab muscle segments */}
                  <line x1="140" y1="130" x2="160" y2="130" stroke="#fff" strokeWidth="0.5"/>
                  <line x1="140" y1="140" x2="160" y2="140" stroke="#fff" strokeWidth="0.5"/>
                  <line x1="140" y1="150" x2="160" y2="150" stroke="#fff" strokeWidth="0.5"/>
                  <line x1="150" y1="120" x2="150" y2="165" stroke="#fff" strokeWidth="0.5"/>
                  
                  {/* Obliques */}
                  <path d="M115 130 Q125 125 130 135 L135 155 Q125 160 115 150 Z" 
                    fill={getIntensityColor(getMuscleById("Obliques").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <path d="M185 130 Q175 125 170 135 L165 155 Q175 160 185 150 Z" 
                    fill={getIntensityColor(getMuscleById("Obliques").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Hip/Pelvis area */}
                  <path d="M130 165 L170 165 L175 185 L125 185 Z" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Quadriceps */}
                  <path d="M120 185 L135 185 L140 240 L130 250 L115 240 Z" 
                    fill={getIntensityColor(getMuscleById("Quadriceps").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <path d="M165 185 L180 185 L185 240 L170 250 L160 240 Z" 
                    fill={getIntensityColor(getMuscleById("Quadriceps").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Quad muscle definition lines */}
                  <line x1="125" y1="200" x2="130" y2="235" stroke="#fff" strokeWidth="0.5"/>
                  <line x1="170" y1="200" x2="175" y2="235" stroke="#fff" strokeWidth="0.5"/>
                  
                  {/* Shins */}
                  <ellipse cx="127" cy="285" rx="8" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="173" cy="285" rx="8" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Calves */}
                  <ellipse cx="127" cy="320" rx="10" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="173" cy="320" rx="10" ry="20" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Feet */}
                  <ellipse cx="127" cy="355" rx="8" ry="12" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="173" cy="355" rx="8" ry="12" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                </svg>
              </div>
            </div>

            {/* Back View */}
            <div className="relative">
              <h4 className="text-lg font-medium mb-4 text-center">Back View</h4>
              <div className="relative aspect-[3/4] bg-card rounded-2xl border border-border/50 overflow-hidden p-4">
                <svg viewBox="0 0 300 400" className="w-full h-full">
                  {/* Head */}
                  <ellipse cx="150" cy="40" rx="20" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Neck */}
                  <rect x="140" y="60" width="20" height="15" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Trapezius */}
                  <path d="M125 75 L175 75 L180 95 L170 110 L130 110 L120 95 Z" 
                    fill={getIntensityColor(getMuscleById("Trapezius").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Deltoids (Shoulders) - Back */}
                  <path d="M110 85 Q105 75 95 80 L85 90 Q85 105 95 110 L110 105 Z" 
                    fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <path d="M190 85 Q195 75 205 80 L215 90 Q215 105 205 110 L190 105 Z" 
                    fill={getIntensityColor(getMuscleById("Deltoid").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Triceps */}
                  <ellipse cx="95" cy="125" rx="8" ry="20" 
                    fill={getIntensityColor(getMuscleById("Triceps").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <ellipse cx="205" cy="125" rx="8" ry="20" 
                    fill={getIntensityColor(getMuscleById("Triceps").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Latissimus Dorsi */}
                  <path d="M115 110 L125 120 L130 160 L120 170 L105 165 L110 125 Z" 
                    fill={getIntensityColor(getMuscleById("Latissimus Dorsi").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <path d="M185 110 L175 120 L170 160 L180 170 L195 165 L190 125 Z" 
                    fill={getIntensityColor(getMuscleById("Latissimus Dorsi").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Lower back */}
                  <path d="M130 120 L170 120 L165 165 L135 165 Z" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Hip/Pelvis area */}
                  <path d="M130 165 L170 165 L175 185 L125 185 Z" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Gluteus Maximus */}
                  <path d="M125 185 L175 185 L180 210 L170 220 L130 220 L120 210 Z" 
                    fill={getIntensityColor(getMuscleById("Gluteus Maximus").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Glute definition line */}
                  <line x1="150" y1="185" x2="150" y2="220" stroke="#fff" strokeWidth="0.5"/>
                  
                  {/* Hamstrings */}
                  <path d="M120 220 L135 220 L140 265 L130 275 L115 265 Z" 
                    fill={getIntensityColor(getMuscleById("Hamstrings").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  <path d="M165 220 L180 220 L185 265 L170 275 L160 265 Z" 
                    fill={getIntensityColor(getMuscleById("Hamstrings").level)} 
                    stroke="#fff" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2"/>
                  
                  {/* Hamstring muscle definition lines */}
                  <line x1="125" y1="235" x2="130" y2="260" stroke="#fff" strokeWidth="0.5"/>
                  <line x1="170" y1="235" x2="175" y2="260" stroke="#fff" strokeWidth="0.5"/>
                  
                  {/* Calves */}
                  <ellipse cx="127" cy="305" rx="10" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="173" cy="305" rx="10" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  
                  {/* Feet */}
                  <ellipse cx="127" cy="355" rx="8" ry="12" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                  <ellipse cx="173" cy="355" rx="8" ry="12" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
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
