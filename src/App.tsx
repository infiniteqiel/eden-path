import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnhancedIndex from "./pages/Enhanced-Index";
import About from "./pages/About";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";
import Progress from "./pages/Progress";
import Governance from "./pages/impact/Governance";
import Workers from "./pages/impact/Workers";
import Community from "./pages/impact/Community";
import Environment from "./pages/impact/Environment";
import Other from "./pages/impact/Other";
import Customers from "./pages/impact/Customers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EnhancedIndex />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/impact/governance" element={<Governance />} />
          <Route path="/impact/workers" element={<Workers />} />
          <Route path="/impact/community" element={<Community />} />
          <Route path="/impact/environment" element={<Environment />} />
          <Route path="/impact/other" element={<Other />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
