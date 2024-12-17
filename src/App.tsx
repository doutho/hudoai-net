import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import { type LanguageOption, languageOptions } from "./components/LanguageSelector";

const queryClient = new QueryClient();

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(languageOptions[0]);

  const handleLanguageChange = (option: LanguageOption) => {
    setCurrentLanguage(option);
  };

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/how-it-works" 
                element={
                  <HowItWorks 
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;