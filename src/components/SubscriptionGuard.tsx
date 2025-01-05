import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { data: subscription, isLoading } = useSubscription();
  const { toast } = useToast();

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

  if (!subscription?.subscribed && !subscription?.isInTrial) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;