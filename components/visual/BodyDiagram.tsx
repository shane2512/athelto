"use client"

import { useMemo, useState } from "react";
import { useWorkoutStore, MuscleGroup } from "@/lib/store/workoutStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Zap, 
  Calendar, 
  TrendingUp,
  Info,
  Target,
  Award
} from "lucide-react";

interface AnatomicalMuscle {
  name: string;
  group: MuscleGroup;
  level: number;
  totalWorkouts: number;
  lastTrained?: string;
}

const BodyDiagram = () => {
  const { logs, lastTrainedByGroup } = useWorkoutStore();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  // Enhanced muscle mapping with more detailed anatomical muscles
  const anatomicalMuscles = [
    // Front view muscles
    { name: "Pectoralis Major", group: "Chest" as MuscleGroup },
    { name: "Pectoralis Minor", group: "Chest" as MuscleGroup },
    { name: "Biceps Brachii", group: "Arms" as MuscleGroup },
    { name: "Brachialis", group: "Arms" as MuscleGroup },
    { name: "Rectus Abdominis", group: "Core" as MuscleGroup },
    { name: "External Obliques", group: "Core" as MuscleGroup },
    { name: "Internal Obliques", group: "Core" as MuscleGroup },
    { name: "Quadriceps", group: "Legs" as MuscleGroup },
    { name: "Vastus Lateralis", group: "Legs" as MuscleGroup },
    { name: "Rectus Femoris", group: "Legs" as MuscleGroup },
    { name: "Vastus Medialis", group: "Legs" as MuscleGroup },
    { name: "Anterior Deltoid", group: "Shoulders" as MuscleGroup },
    { name: "Medial Deltoid", group: "Shoulders" as MuscleGroup },
    { name: "Serratus Anterior", group: "Core" as MuscleGroup },
    // Back view muscles
    { name: "Trapezius", group: "Shoulders" as MuscleGroup },
    { name: "Triceps Brachii", group: "Arms" as MuscleGroup },
    { name: "Latissimus Dorsi", group: "Back" as MuscleGroup },
    { name: "Rhomboids", group: "Back" as MuscleGroup },
    { name: "Erector Spinae", group: "Back" as MuscleGroup },
    { name: "Gluteus Maximus", group: "Glutes" as MuscleGroup },
    { name: "Gluteus Medius", group: "Glutes" as MuscleGroup },
    { name: "Hamstrings", group: "Legs" as MuscleGroup },
    { name: "Biceps Femoris", group: "Legs" as MuscleGroup },
    { name: "Gastrocnemius", group: "Legs" as MuscleGroup },
    { name: "Soleus", group: "Legs" as MuscleGroup },
    { name: "Posterior Deltoid", group: "Shoulders" as MuscleGroup },
  ];

  // Enhanced level calculation
  const muscleData = useMemo((): AnatomicalMuscle[] => {
    return anatomicalMuscles.map(muscle => {
      const groupLogs = logs.filter(log => log.muscleGroup === muscle.group);
      const totalWorkouts = groupLogs.length;
      const lastTrained = lastTrainedByGroup.get(muscle.group);
      
      let level = 0;
      if (totalWorkouts > 0) {
        // More nuanced level calculation
        level = Math.min(4, Math.floor(totalWorkouts / 2));
        
        // Recent activity bonus
        if (lastTrained) {
          const daysSinceLastWorkout = Math.floor(
            (Date.now() - new Date(lastTrained).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSinceLastWorkout <= 1) level += 1;
          else if (daysSinceLastWorkout <= 3) level += 0.5;
        }
        
        // Consistency bonus
        if (totalWorkouts >= 10) level += 1;
      }
      
      return {
        name: muscle.name,
        group: muscle.group,
        level: Math.min(5, Math.floor(level)),
        totalWorkouts,
        lastTrained
      };
    });
  }, [logs, lastTrainedByGroup]);

  const getIntensityColor = (level: number): string => {
    const colors = [
      "#6B7280", // 0 - Grey (untrained)
      "#94A3B8", // 1 - Light grey  
      "#06B6D4", // 2 - Cyan
      "#10B981", // 3 - Emerald
      "#8B5CF6", // 4 - Violet
      "#7C3AED"  // 5 - Purple (legend)
    ];
    return colors[level] || colors[0];
  };

  const getLevelLabel = (level: number): string => {
    const labels = ["Untrained", "Beginner", "Developing", "Intermediate", "Advanced", "Legend"];
    return labels[level] || "Untrained";
  };

  const getMuscleById = (muscleName: string) => {
    return muscleData.find(m => m.name === muscleName) || { 
      level: 0, 
      name: muscleName, 
      group: "Core" as MuscleGroup, 
      totalWorkouts: 0 
    };
  };

  const handleMuscleClick = (muscleName: string) => {
    setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName);
  };

  return (
    <TooltipProvider>
      <Card className="glass border-2 border-primary/20 shadow-2xl">
        <div className="p-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Enhanced Body Diagrams */}
            <div className="flex-1">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <User className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    Interactive Anatomy Map
                  </h3>
                  <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-muted-foreground">
                  Click on muscle groups to see detailed progress information
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Enhanced Front View */}
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Target className="h-5 w-5 text-primary" />
                    <h4 className="text-xl font-semibold">Front View</h4>
                  </div>
                  <div className="relative aspect-[3/4] bg-gradient-to-b from-card/50 to-card rounded-3xl border-2 border-border/50 overflow-hidden p-6 shadow-inner">
                    <svg viewBox="0 0 350 450" className="w-full h-full">
                      {/* Enhanced Head */}
                      <ellipse cx="175" cy="45" rx="22" ry="28" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
                      
                      {/* Neck */}
                      <rect x="162" y="70" width="26" height="18" rx="4" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      
                      {/* Clavicle line */}
                      <line x1="140" y1="95" x2="210" y2="95" stroke="#D1D5DB" strokeWidth="1"/>
                      
                      {/* Anterior Deltoids */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M130 95 Q120 85 105 90 L95 105 Q95 125 110 130 L130 120 Z" 
                            fill={getIntensityColor(getMuscleById("Anterior Deltoid").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Anterior Deltoid")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Anterior Deltoid - {getLevelLabel(getMuscleById("Anterior Deltoid").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M220 95 Q230 85 245 90 L255 105 Q255 125 240 130 L220 120 Z" 
                            fill={getIntensityColor(getMuscleById("Anterior Deltoid").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Anterior Deltoid")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Anterior Deltoid - {getLevelLabel(getMuscleById("Anterior Deltoid").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Pectoralis Major */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M140 100 Q175 90 210 100 L205 135 Q175 145 145 135 Z" 
                            fill={getIntensityColor(getMuscleById("Pectoralis Major").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Pectoralis Major")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pectoralis Major - {getLevelLabel(getMuscleById("Pectoralis Major").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Pec definition lines */}
                      <line x1="175" y1="100" x2="175" y2="135" stroke="#fff" strokeWidth="1" opacity="0.6"/>
                      <line x1="155" y1="115" x2="195" y2="115" stroke="#fff" strokeWidth="1" opacity="0.4"/>
                      
                      {/* Enhanced Biceps */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="115" cy="150" rx="12" ry="25" 
                            fill={getIntensityColor(getMuscleById("Biceps Brachii").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Biceps Brachii")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Biceps Brachii - {getLevelLabel(getMuscleById("Biceps Brachii").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="235" cy="150" rx="12" ry="25" 
                            fill={getIntensityColor(getMuscleById("Biceps Brachii").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Biceps Brachii")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Biceps Brachii - {getLevelLabel(getMuscleById("Biceps Brachii").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Serratus Anterior */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M145 140 L155 145 L160 170 L150 175 L140 165 Z" 
                            fill={getIntensityColor(getMuscleById("Serratus Anterior").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Serratus Anterior")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Serratus Anterior - {getLevelLabel(getMuscleById("Serratus Anterior").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M205 140 L195 145 L190 170 L200 175 L210 165 Z" 
                            fill={getIntensityColor(getMuscleById("Serratus Anterior").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Serratus Anterior")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Serratus Anterior - {getLevelLabel(getMuscleById("Serratus Anterior").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Rectus Abdominis with 6-pack definition */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M150 145 L200 145 L195 200 L155 200 Z" 
                            fill={getIntensityColor(getMuscleById("Rectus Abdominis").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Rectus Abdominis")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rectus Abdominis - {getLevelLabel(getMuscleById("Rectus Abdominis").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* 6-pack definition lines */}
                      <line x1="165" y1="155" x2="185" y2="155" stroke="#fff" strokeWidth="1"/>
                      <line x1="165" y1="170" x2="185" y2="170" stroke="#fff" strokeWidth="1"/>
                      <line x1="165" y1="185" x2="185" y2="185" stroke="#fff" strokeWidth="1"/>
                      <line x1="175" y1="145" x2="175" y2="200" stroke="#fff" strokeWidth="1"/>
                      
                      {/* External Obliques */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M135 155 Q145 150 150 160 L155 185 Q145 190 135 180 Z" 
                            fill={getIntensityColor(getMuscleById("External Obliques").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("External Obliques")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>External Obliques - {getLevelLabel(getMuscleById("External Obliques").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M215 155 Q205 150 200 160 L195 185 Q205 190 215 180 Z" 
                            fill={getIntensityColor(getMuscleById("External Obliques").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("External Obliques")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>External Obliques - {getLevelLabel(getMuscleById("External Obliques").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Quadriceps with individual heads */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M140 220 L165 220 L170 280 L160 290 L135 280 Z" 
                            fill={getIntensityColor(getMuscleById("Rectus Femoris").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Rectus Femoris")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rectus Femoris - {getLevelLabel(getMuscleById("Rectus Femoris").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M185 220 L210 220 L215 280 L190 290 L180 280 Z" 
                            fill={getIntensityColor(getMuscleById("Rectus Femoris").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Rectus Femoris")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rectus Femoris - {getLevelLabel(getMuscleById("Rectus Femoris").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Vastus Lateralis */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M125 235 L140 235 L145 275 L130 280 L120 270 Z" 
                            fill={getIntensityColor(getMuscleById("Vastus Lateralis").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Vastus Lateralis")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Vastus Lateralis - {getLevelLabel(getMuscleById("Vastus Lateralis").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M210 235 L225 235 L230 270 L220 280 L205 275 Z" 
                            fill={getIntensityColor(getMuscleById("Vastus Lateralis").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Vastus Lateralis")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Vastus Lateralis - {getLevelLabel(getMuscleById("Vastus Lateralis").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Vastus Medialis */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M165 235 L175 240 L180 275 L170 280 L160 275 Z" 
                            fill={getIntensityColor(getMuscleById("Vastus Medialis").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Vastus Medialis")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Vastus Medialis - {getLevelLabel(getMuscleById("Vastus Medialis").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M175 240 L185 235 L190 275 L180 280 L170 275 Z" 
                            fill={getIntensityColor(getMuscleById("Vastus Medialis").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Vastus Medialis")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Vastus Medialis - {getLevelLabel(getMuscleById("Vastus Medialis").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Shins */}
                      <ellipse cx="152" cy="330" rx="10" ry="30" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      <ellipse cx="198" cy="330" rx="10" ry="30" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      
                      {/* Calves */}
                      <ellipse cx="152" cy="370" rx="12" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      <ellipse cx="198" cy="370" rx="12" ry="25" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      
                      {/* Feet */}
                      <ellipse cx="152" cy="410" rx="10" ry="15" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      <ellipse cx="198" cy="410" rx="10" ry="15" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>

                {/* Enhanced Back View */}
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Target className="h-5 w-5 text-primary" />
                    <h4 className="text-xl font-semibold">Back View</h4>
                  </div>
                  <div className="relative aspect-[3/4] bg-gradient-to-b from-card/50 to-card rounded-3xl border-2 border-border/50 overflow-hidden p-6 shadow-inner">
                    <svg viewBox="0 0 350 450" className="w-full h-full">
                      {/* Head */}
                      <ellipse cx="175" cy="45" rx="22" ry="28" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
                      
                      {/* Neck */}
                      <rect x="162" y="70" width="26" height="18" rx="4" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      
                      {/* Enhanced Trapezius */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M145 85 L205 85 L210 110 L195 130 L155 130 L140 110 Z" 
                            fill={getIntensityColor(getMuscleById("Trapezius").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Trapezius")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Trapezius - {getLevelLabel(getMuscleById("Trapezius").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Posterior Deltoids */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M130 95 Q120 85 105 90 L95 105 Q95 125 110 130 L130 120 Z" 
                            fill={getIntensityColor(getMuscleById("Posterior Deltoid").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Posterior Deltoid")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Posterior Deltoid - {getLevelLabel(getMuscleById("Posterior Deltoid").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M220 95 Q230 85 245 90 L255 105 Q255 125 240 130 L220 120 Z" 
                            fill={getIntensityColor(getMuscleById("Posterior Deltoid").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Posterior Deltoid")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Posterior Deltoid - {getLevelLabel(getMuscleById("Posterior Deltoid").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Triceps */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="115" cy="150" rx="12" ry="25" 
                            fill={getIntensityColor(getMuscleById("Triceps Brachii").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Triceps Brachii")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Triceps Brachii - {getLevelLabel(getMuscleById("Triceps Brachii").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="235" cy="150" rx="12" ry="25" 
                            fill={getIntensityColor(getMuscleById("Triceps Brachii").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Triceps Brachii")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Triceps Brachii - {getLevelLabel(getMuscleById("Triceps Brachii").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Latissimus Dorsi */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M135 135 L155 140 L160 190 L145 200 L125 190 L130 155 Z" 
                            fill={getIntensityColor(getMuscleById("Latissimus Dorsi").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Latissimus Dorsi")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Latissimus Dorsi - {getLevelLabel(getMuscleById("Latissimus Dorsi").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M215 135 L195 140 L190 190 L205 200 L225 190 L220 155 Z" 
                            fill={getIntensityColor(getMuscleById("Latissimus Dorsi").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Latissimus Dorsi")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Latissimus Dorsi - {getLevelLabel(getMuscleById("Latissimus Dorsi").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Rhomboids */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M155 140 L195 140 L190 170 L160 170 Z" 
                            fill={getIntensityColor(getMuscleById("Rhomboids").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Rhomboids")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rhomboids - {getLevelLabel(getMuscleById("Rhomboids").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Erector Spinae */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M160 175 L190 175 L185 210 L165 210 Z" 
                            fill={getIntensityColor(getMuscleById("Erector Spinae").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Erector Spinae")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Erector Spinae - {getLevelLabel(getMuscleById("Erector Spinae").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Gluteus Maximus */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M140 215 L210 215 L215 250 L200 260 L150 260 L135 250 Z" 
                            fill={getIntensityColor(getMuscleById("Gluteus Maximus").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Gluteus Maximus")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gluteus Maximus - {getLevelLabel(getMuscleById("Gluteus Maximus").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Gluteus Medius */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="155" cy="230" rx="15" ry="10" 
                            fill={getIntensityColor(getMuscleById("Gluteus Medius").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Gluteus Medius")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gluteus Medius - {getLevelLabel(getMuscleById("Gluteus Medius").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="195" cy="230" rx="15" ry="10" 
                            fill={getIntensityColor(getMuscleById("Gluteus Medius").level)} 
                            stroke="#fff" strokeWidth="1"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Gluteus Medius")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gluteus Medius - {getLevelLabel(getMuscleById("Gluteus Medius").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Hamstrings */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M140 260 L165 260 L170 310 L160 320 L135 310 Z" 
                            fill={getIntensityColor(getMuscleById("Biceps Femoris").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Biceps Femoris")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Biceps Femoris - {getLevelLabel(getMuscleById("Biceps Femoris").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <path 
                            d="M185 260 L210 260 L215 310 L190 320 L180 310 Z" 
                            fill={getIntensityColor(getMuscleById("Biceps Femoris").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Biceps Femoris")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Biceps Femoris - {getLevelLabel(getMuscleById("Biceps Femoris").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Enhanced Calves */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="152" cy="350" rx="12" ry="30" 
                            fill={getIntensityColor(getMuscleById("Gastrocnemius").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Gastrocnemius")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gastrocnemius - {getLevelLabel(getMuscleById("Gastrocnemius").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ellipse 
                            cx="198" cy="350" rx="12" ry="30" 
                            fill={getIntensityColor(getMuscleById("Gastrocnemius").level)} 
                            stroke="#fff" strokeWidth="2"
                            className="muscle-interactive"
                            onClick={() => handleMuscleClick("Gastrocnemius")}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Gastrocnemius - {getLevelLabel(getMuscleById("Gastrocnemius").level)}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Feet */}
                      <ellipse cx="152" cy="410" rx="10" ry="15" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                      <ellipse cx="198" cy="410" rx="10" ry="15" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Panel */}
            <div className="xl:w-96 space-y-6">
              {/* Progress Legend */}
              <Card className="glass p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Progress Levels</h4>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4, 5].map(level => (
                    <div key={level} className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-white/20 progress-ring"
                        style={{ backgroundColor: getIntensityColor(level) }}
                      />
                      <span className="text-sm font-medium">{getLevelLabel(level)}</span>
                      <Progress 
                        value={(level / 5) * 100} 
                        className="flex-1 h-2"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Selected Muscle Details */}
              {selectedMuscle && (
                <Card className="glass p-6 border-primary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Muscle Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-primary">{selectedMuscle}</h5>
                      <p className="text-sm text-muted-foreground">
                        {getMuscleById(selectedMuscle).group} Group
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-xl bg-primary/10">
                        <div className="text-lg font-bold text-primary">
                          {getMuscleById(selectedMuscle).totalWorkouts}
                        </div>
                        <div className="text-xs text-muted-foreground">Workouts</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-purple-500/10">
                        <div className="text-lg font-bold text-purple-400">
                          {getMuscleById(selectedMuscle).level}
                        </div>
                        <div className="text-xs text-muted-foreground">Level</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="w-full justify-center py-2"
                      style={{ borderColor: getIntensityColor(getMuscleById(selectedMuscle).level) }}
                    >
                      {getLevelLabel(getMuscleById(selectedMuscle).level)}
                    </Badge>
                  </div>
                </Card>
              )}

              {/* Muscle Progress List */}
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Muscle Progress</h4>
                  </div>
                  <Badge variant="secondary">
                    {muscleData.filter(m => m.level > 0).length}/{muscleData.length}
                  </Badge>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {muscleData
                    .sort((a, b) => b.level - a.level)
                    .map(muscle => (
                      <div 
                        key={muscle.name} 
                        className={`p-3 rounded-xl transition-all cursor-pointer ${
                          selectedMuscle === muscle.name 
                            ? 'bg-primary/20 border border-primary/40' 
                            : 'bg-muted/20 hover:bg-muted/40'
                        }`}
                        onClick={() => handleMuscleClick(muscle.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full border border-white/20 progress-ring"
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
                              L{muscle.level}
                            </Badge>
                          </div>
                        </div>
                        {muscle.lastTrained && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Last: {new Date(muscle.lastTrained).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default BodyDiagram;
