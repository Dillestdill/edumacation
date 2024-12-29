import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load route components
const Index = lazy(() => import("./pages/Index"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TeacherReviews = lazy(() => import("./pages/TeacherReviews"));
const Challenge = lazy(() => import("./pages/Challenge"));
const SignIn = lazy(() => import("./components/SignIn"));
const UserHome = lazy(() => import("./pages/UserHome"));
const LessonPlanning = lazy(() => import("./pages/LessonPlanning"));
const EducatorChat = lazy(() => import("./pages/EducatorChat"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-surface p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-12 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-2xl" />
        <Skeleton className="h-8 w-full max-w-xl" />
        <Skeleton className="h-8 w-full max-w-lg" />
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/teacher-reviews" element={<TeacherReviews />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/home" element={<UserHome />} />
            <Route path="/lesson-planning" element={<LessonPlanning />} />
            <Route path="/educator-chat" element={<EducatorChat />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;