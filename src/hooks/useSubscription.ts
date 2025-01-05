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
        return {
          subscribed: false,
          isInTrial: false,
          trialEndsAt: null
        };
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
      
      return data;
    },
  });
};