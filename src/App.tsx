
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WidgetLibrary from "./pages/WidgetLibrary";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./components/layouts/AdminLayout";
import { useState } from "react";
import TagManager from "./components/widget-builder/TagManager";

const queryClient = new QueryClient();

const App = () => {
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TagManager open={tagManagerOpen} onOpenChange={setTagManagerOpen} />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<Index onTagManagerOpen={() => setTagManagerOpen(true)} />} 
            />
            <Route 
              path="/library" 
              element={<WidgetLibrary onTagManagerOpen={() => setTagManagerOpen(true)} />} 
            />
            <Route 
              path="/admin/*" 
              element={
                <AdminAuthProvider>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/login" element={<AdminLogin />} />
                  </Routes>
                </AdminAuthProvider>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
