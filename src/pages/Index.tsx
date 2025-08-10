import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/app/Dashboard";
import PlanBuilder from "@/components/app/PlanBuilder";
import ProgressCharts from "@/components/app/ProgressCharts";

const Index = () => {
  return (
    <div className="min-h-screen app-bg">
      <nav className="sticky top-0 z-10 nav-glass">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <a href="/" className="font-semibold">Gym Planner</a>
          <div className="hidden sm:flex gap-2">
            <a href="#dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
            <a href="#plan" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Plan</a>
            <a href="#progress" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Progress</a>
          </div>
        </div>
      </nav>
      <Tabs defaultValue="dashboard" className="container mx-auto py-6">
        <TabsList className="glass">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" id="dashboard"><Dashboard /></TabsContent>
        <TabsContent value="plan"><PlanBuilder /></TabsContent>
        <TabsContent value="progress" id="progress"><ProgressCharts /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
