import { Json } from "@/integrations/supabase/types";

export interface LessonPlan {
  id: string;
  title: string;
  content: {
    prompt: string;
    response: string;
  };
  created_at: string;
  plan_type?: 'daily' | 'weekly';
}

export type LessonPlanResponse = {
  id: string;
  title: string;
  content: Json;
  created_at: string;
  plan_type: string;
  user_id: string;
}