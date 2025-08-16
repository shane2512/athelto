import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from "@/components/providers/providers"
import Index from './pages/Index'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Providers>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </Providers>
    </ThemeProvider>
  )
}

export default App