import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingFallback } from "./LoadingFallback";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(!!session);
          if (session) {
            localStorage.setItem('lastPath', location.pathname);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setSession(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(!!session);
        if (session) {
          localStorage.setItem('lastPath', location.pathname);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [location]);

  if (session === null) {
    return <LoadingFallback />;
  }

  if (!session) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;