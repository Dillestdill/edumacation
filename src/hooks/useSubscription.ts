import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionData {
  subscribed: boolean;
  isInTrial: boolean;
  trialEndsAt: number | null;
}

export const useSubscription = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase.functions.invoke<SubscriptionData>("check-subscription");
      
      if (error) {
        console.error("Subscription check error:", error);
        toast({
          title: "Error checking subscription",
          description: "Please try again later or contact support if the issue persists.",
          variant: "destructive",
        });
        throw error;
      }
      
      if (!data) {
        throw new Error("No subscription data returned");
      }
      
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};