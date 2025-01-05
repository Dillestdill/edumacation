import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionData {
  subscribed: boolean;
  isInTrial: boolean;
  trialEndsAt: number | null;
}

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<SubscriptionData>("check-subscription");
      if (error) throw error;
      return data;
    },
  });
};