export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Gym Planner Pro</h1>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome to Your Fitness Journey</h2>
            <p className="text-muted-foreground">Track your progress with our interactive body diagram</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-muted-foreground">View your daily progress and plans</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Body Map</h3>
              <p className="text-sm text-muted-foreground">Interactive anatomical progress tracking</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Workout Planner</h3>
              <p className="text-sm text-muted-foreground">Plan your weekly exercise routine</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-green-500 font-medium">✅ Application is running successfully!</p>
            <p className="text-sm text-muted-foreground mt-2">
              The Next.js app is now fully operational on port 3000
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
