import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LessonPlan {
  id: string;
  title: string;
  content: {
    prompt: string;
    response: string;
  };
  created_at: string;
}

export const useLessonPlans = (session: Session | null) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  const fetchLessonPlans = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('lesson_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch lesson plans');
      return;
    }

    const transformedData: LessonPlan[] = data.map(plan => ({
      id: plan.id,
      title: plan.title,
      content: plan.content as { prompt: string; response: string },
      created_at: plan.created_at
    }));

    setLessonPlans(transformedData);
  };

  const saveLessonPlan = async (title: string, prompt: string, response: string) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('lesson_plans')
      .insert([
        {
          title,
          content: { prompt, response },
          user_id: session.user.id
        }
      ]);

    if (error) {
      toast.error('Failed to save lesson plan');
      return;
    }

    toast.success('Lesson plan saved successfully');
    fetchLessonPlans();
  };

  useEffect(() => {
    if (session?.user) {
      fetchLessonPlans();
    }
  }, [session]);

  return { lessonPlans, saveLessonPlan };
};