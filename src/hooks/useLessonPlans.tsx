import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { LessonPlan } from '@/types/lessonPlan';
import { convertDBResponseToLessonPlan } from '@/utils/lessonPlanUtils';
import { toast } from 'sonner';

export const useLessonPlans = (session: Session | null) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchLessonPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('lesson_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching lesson plans:', error);
          toast.error('Failed to fetch lesson plans');
          return;
        }

        if (data) {
          const convertedPlans = data.map(convertDBResponseToLessonPlan);
          setLessonPlans(convertedPlans);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch lesson plans');
      }
    };

    fetchLessonPlans();

    // Set up real-time subscription
    const channel = supabase
      .channel('lesson-plans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_plans',
          filter: `user_id=eq.${session.user.id}`
        },
        async () => {
          await fetchLessonPlans();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user]);

  const saveLessonPlan = async (plan: Omit<LessonPlan, 'id'>) => {
    if (!session?.user) {
      toast.error('You must be logged in to save lesson plans');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert([{
          user_id: session.user.id,
          title: plan.title,
          content: plan.content,
          created_at: plan.created_at,
          plan_type: plan.plan_type || 'daily'
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newPlan = convertDBResponseToLessonPlan(data);
        setLessonPlans(prev => [newPlan, ...prev]);
        toast.success('Lesson plan saved successfully!');
        return newPlan;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save lesson plan');
      return null;
    }
  };

  return { lessonPlans, saveLessonPlan, setLessonPlans };
};