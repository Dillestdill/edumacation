import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { data: subscription, isLoading, error } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Session Expired",
          description: "Please sign in to access the tools.",
          variant: "destructive",
        });
        return;
      }
    };

    checkSession();
  }, [toast]);

  useEffect(() => {
    if (subscription?.isInTrial) {
      const trialEnd = new Date(subscription.trialEndsAt * 1000);
      toast({
        title: "Trial Period Active",
        description: `Your free trial ends on ${trialEnd.toLocaleDateString()}. Please subscribe to maintain access.`,
        duration: 5000,
      });
    }
  }, [subscription, toast]);

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

  if (error) {
    toast({
      title: "Error",
      description: "Failed to verify subscription status. Please try again.",
      variant: "destructive",
    });
    return <Navigate to="/pricing" replace />;
  }

  // Check if user has access (either subscribed or in trial)
  if (!subscription?.subscribed && !subscription?.isInTrial) {
    toast({
      title: "Access Restricted",
      description: "Please subscribe or start a trial to access these tools.",
      variant: "destructive",
    });
    return <Navigate to="/pricing" replace />;
  }

  // If this is the first time accessing with a trial/subscription, redirect to tools dashboard
  if (window.location.pathname === "/pricing" && (subscription?.subscribed || subscription?.isInTrial)) {
    return <Navigate to="/tools" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;