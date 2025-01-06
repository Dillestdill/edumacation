import { lazy } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "./ProtectedRoute";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Lazy load route components
const Index = lazy(() => import("@/pages/Index"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const TeacherReviews = lazy(() => import("@/pages/TeacherReviews"));
const Challenge = lazy(() => import("@/pages/Challenge"));
const SignIn = lazy(() => import("@/components/SignIn"));
const UserHome = lazy(() => import("@/pages/UserHome"));
const LessonPlanning = lazy(() => import("@/pages/LessonPlanning"));
const EducatorChat = lazy(() => import("@/pages/EducatorChat"));
const ToolsDashboard = lazy(() => import("@/pages/ToolsDashboard"));

const AppRoutes = () => {
  const [initialPath, setInitialPath] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSessionAndPath = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(!!session);
          if (session && location.pathname === '/') {
            const storedPath = localStorage.getItem('lastPath');
            if (storedPath) {
              setInitialPath(storedPath);
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setSession(false);
        }
      }
    };

    checkSessionAndPath();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(!!session);
        if (!session && !['/', '/signin', '/pricing', '/teacher-reviews', '/challenge'].includes(location.pathname)) {
          localStorage.setItem('lastPath', location.pathname);
          navigate('/signin');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  // Public routes that don't require authentication
  const publicRoutes = ['/pricing', '/teacher-reviews', '/challenge', '/signin'];

  // If we're on a protected route and there's no session, redirect to signin
  if (session === false && !publicRoutes.includes(location.pathname) && location.pathname !== '/') {
    return <Navigate to="/signin" replace />;
  }

  if (initialPath && session) {
    return <Navigate to={initialPath} replace />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/teacher-reviews" element={<TeacherReviews />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Protected routes - only accessible when authenticated */}
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;