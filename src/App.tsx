import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Lazy load route components
const Index = lazy(() => import("./pages/Index"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TeacherReviews = lazy(() => import("./pages/TeacherReviews"));
const Challenge = lazy(() => import("./pages/Challenge"));
const SignIn = lazy(() => import("./components/SignIn"));
const UserHome = lazy(() => import("./pages/UserHome"));
const LessonPlanning = lazy(() => import("./pages/LessonPlanning"));
const EducatorChat = lazy(() => import("./pages/EducatorChat"));
const ToolsDashboard = lazy(() => import("./pages/ToolsDashboard"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-white p-8">
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
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Store the current path in localStorage when it changes
    localStorage.setItem('lastPath', location.pathname);
  }, [location]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(!!session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return <LoadingFallback />;
  }

  if (!session) {
    // Store the attempted path before redirecting
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const [initialPath, setInitialPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // On initial load, check if there's a stored path
    const storedPath = localStorage.getItem('lastPath');
    if (storedPath && location.pathname === '/') {
      setInitialPath(storedPath);
    }
  }, [location.pathname]);

  if (initialPath) {
    return <Navigate to={initialPath} replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/teacher-reviews" element={<TeacherReviews />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/tools"
        element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <ToolsDashboard />
            </SubscriptionGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <UserHome />
            </SubscriptionGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lesson-planning"
        element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <LessonPlanning />
            </SubscriptionGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/educator-chat"
        element={
          <ProtectedRoute>
            <SubscriptionGuard>
              <EducatorChat />
            </SubscriptionGuard>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;