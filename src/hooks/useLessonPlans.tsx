import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LessonPlan {
  id: string;
  title: string;
  content: {
    prompt: string;
    response: string;
  };
  plan_type: 'daily' | 'weekly';
  created_at: string;
}

export const useLessonPlans = (session: Session | null) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  const saveLessonPlan = async (
    title: string, 
    prompt: string, 
    response: string, 
    planType: 'daily' | 'weekly'
  ) => {
    if (!session?.user) {
      toast.error("You must be logged in to save lesson plans");
      return;
    }

    try {
      const { data: newPlan, error } = await supabase
        .from('lesson_plans')
        .insert([
          {
            user_id: session.user.id,
            title,
            content: { prompt, response },
            plan_type: planType
          }
        ])
        .select('*')
        .single();

      if (error) throw error;

      // Explicitly type the newPlan as LessonPlan
      const typedPlan: LessonPlan = {
        id: newPlan.id,
        title: newPlan.title,
        content: newPlan.content as { prompt: string; response: string },
        plan_type: newPlan.plan_type as 'daily' | 'weekly',
        created_at: newPlan.created_at
      };

      setLessonPlans(prev => [...prev, typedPlan]);
      toast.success("Lesson plan saved successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to save lesson plan");
    }
  };

  return { lessonPlans, saveLessonPlan };
};