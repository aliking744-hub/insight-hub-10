import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UploadPage } from "@/components/upload/UploadPage";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Employee } from "@/types/employee";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [data, setData] = useState<Employee[] | null>(null);

  const handleDataLoaded = (employees: Employee[]) => {
    setData(employees);
  };

  const handleLogout = () => {
    setData(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                data ? (
                  <Dashboard data={data} onLogout={handleLogout} />
                ) : (
                  <UploadPage onDataLoaded={handleDataLoaded} />
                )
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
