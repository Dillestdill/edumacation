import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Lazy load route components
const Index = lazy(() => import("@/pages/Index"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const TeacherReviews = lazy(() => import("@/pages/TeacherReviews"));
const Challenge = lazy(() => import("@/pages/Challenge"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const UserHome = lazy(() => import("@/pages/UserHome"));
const LessonPlanning = lazy(() => import("@/pages/LessonPlanning"));
const EducatorChat = lazy(() => import("@/pages/EducatorChat"));
const ToolsDashboard = lazy(() => import("@/pages/ToolsDashboard"));

const AppRoutes = () => {
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