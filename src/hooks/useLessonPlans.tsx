import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { LessonPlan } from '@/types/lessonPlan';
import { convertDBResponseToLessonPlan } from '@/utils/lessonPlanUtils';

export const useLessonPlans = (session: Session | null) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchLessonPlans = async () => {
      const { data } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('user_id', session.user.id);

      if (data) {
        setLessonPlans(data.map(convertDBResponseToLessonPlan));
      }
    };

    fetchLessonPlans();
  }, [session?.user]);

  const saveLessonPlan = async (plan: Omit<LessonPlan, 'id'>) => {
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert([{
        user_id: session?.user?.id,
        title: plan.title,
        content: plan.content,
        created_at: plan.created_at,
        plan_type: plan.plan_type || 'daily'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { lessonPlans, saveLessonPlan, setLessonPlans };
};