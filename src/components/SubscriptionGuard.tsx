import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { data: subscription, isLoading, error } = useSubscription();
  const { toast } = useToast();
  const hasShownTrialToast = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Session Expired",
          description: "Please sign in to access the tools.",
          variant: "destructive",
        });
      }
    };

    checkSession();
  }, [toast]);

  useEffect(() => {
    if (subscription?.isInTrial && !hasShownTrialToast.current) {
      const trialEnd = new Date(subscription.trialEndsAt * 1000);
      toast({
        title: "Trial Period Active",
        description: `Your free trial ends on ${trialEnd.toLocaleDateString()}. Please subscribe to maintain access.`,
        duration: 5000,
      });
      hasShownTrialToast.current = true;
    }
  }, [subscription, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to verify subscription status. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full max-w-2xl" />
            <Skeleton className="h-8 w-full max-w-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Check if user has access (either subscribed or in trial)
  if (!subscription?.subscribed && !subscription?.isInTrial) {
    return <Navigate to="/pricing" replace />;
  }

  // If this is the first time accessing with a trial/subscription, redirect to tools dashboard
  if (window.location.pathname === "/pricing" && (subscription?.subscribed || subscription?.isInTrial)) {
    return <Navigate to="/tools" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;