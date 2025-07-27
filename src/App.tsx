import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Homepage } from "@/pages/Homepage";
import { MovieDetail } from "@/pages/MovieDetail";
import { TVDetail } from "@/pages/TVDetail";
import { ActorPage } from "@/pages/ActorPage";
import { SearchResults } from "@/pages/SearchResults";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { Profile } from "@/pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <NavBar 
              isLoggedIn={isLoggedIn} 
              onLogin={handleLogin} 
              onLogout={handleLogout} 
            />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<TVDetail />} />
              <Route path="/actor/:id" element={<ActorPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
              <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login onLogin={handleLogin} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
