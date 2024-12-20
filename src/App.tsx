import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import TeacherReviews from "./pages/TeacherReviews";
import Challenge from "./pages/Challenge";
import SignIn from "./components/SignIn";
import UserHome from "./pages/UserHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/teacher-reviews" element={<TeacherReviews />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<UserHome />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;