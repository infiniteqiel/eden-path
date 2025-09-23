import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth-guard";
import EnhancedIndex from "./pages/Enhanced-Index";
import About from "./pages/About";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/Dashboard";
import CompanyProfile from "./pages/CompanyProfile";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";
import Progress from "./pages/Progress";
import Governance from "./pages/impact/Governance";
import Workers from "./pages/impact/Workers";
import Community from "./pages/impact/Community";
import Environment from "./pages/impact/Environment";
import Customers from "./pages/impact/Customers";
import Other from "./pages/impact/Other";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<EnhancedIndex />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signin" element={<SignIn />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/company-profile" element={<AuthGuard><CompanyProfile /></AuthGuard>} />
          <Route path="/documents" element={<AuthGuard><Documents /></AuthGuard>} />
          <Route path="/tasks" element={<AuthGuard><Tasks /></AuthGuard>} />
          <Route path="/progress" element={<AuthGuard><Progress /></AuthGuard>} />
          <Route path="/impact/governance" element={<AuthGuard><Governance /></AuthGuard>} />
          <Route path="/impact/workers" element={<AuthGuard><Workers /></AuthGuard>} />
          <Route path="/impact/community" element={<AuthGuard><Community /></AuthGuard>} />
          <Route path="/impact/environment" element={<AuthGuard><Environment /></AuthGuard>} />
          <Route path="/impact/customers" element={<AuthGuard><Customers /></AuthGuard>} />
          <Route path="/impact/other" element={<AuthGuard><Other /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
