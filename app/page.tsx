"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Calendar, 
  TrendingUp, 
  User, 
  Dumbbell,
  Target,
  Clock,
  Award
} from 'lucide-react'
import Dashboard from '@/components/app/Dashboard'
import PlanBuilder from '@/components/app/PlanBuilder'
import ProgressCharts from '@/components/app/ProgressCharts'
import BodyDiagram from '@/components/visual/BodyDiagram'
import MembersDashboard from '@/components/app/MembersDashboard'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen app-bg">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 nav-glass">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Dumbbell className="h-8 w-8 text-primary animate-pulse-glow" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    Gym Planner Pro
                  </h1>
                  <p className="text-xs text-muted-foreground">Track • Train • Transform</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <Badge variant="outline" className="animate-float">
                <Award className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="glass p-1 h-auto">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-primary/20"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="anatomy" 
                className="flex items-center gap-2 data-[state=active]:bg-primary/20"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Body Map</span>
              </TabsTrigger>
              <TabsTrigger 
                value="plan" 
                className="flex items-center gap-2 data-[state=active]:bg-primary/20"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Workout Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="flex items-center gap-2 data-[state=active]:bg-primary/20"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="glass">
                <Target className="h-4 w-4 mr-2" />
                Quick Log
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid gap-6">
              <MembersDashboard />
              <div className="grid lg:grid-cols-2 gap-6">
                <Dashboard />
                <Card className="glass p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-primary/10">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Workouts</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-green-500/10">
                      <div className="text-2xl font-bold text-green-500">5</div>
                      <div className="text-sm text-muted-foreground">Streak</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anatomy" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Interactive Body Map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track your muscle development with our detailed anatomical diagram. 
                Watch your progress transform from grey (untrained) to purple (legend) as you build strength.
              </p>
            </div>
            <BodyDiagram />
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Workout Planner
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Design your perfect weekly routine with our intelligent workout planner.
              </p>
            </div>
            <PlanBuilder />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Progress Analytics
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Visualize your fitness journey with detailed charts and progress tracking.
              </p>
            </div>
            <ProgressCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
