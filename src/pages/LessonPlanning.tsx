import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AIChatWidget from "@/components/AIChatWidget";
import { useLessonPlans } from "@/hooks/useLessonPlans";
import LoadingState from "@/components/lesson-plan/LoadingState";
import LessonPlanningTabs from "@/components/lesson-plan/LessonPlanningTabs";

const LessonPlanning = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const { lessonPlans, setLessonPlans } = useLessonPlans(session);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/signin");
        return;
      }
      setSession(session);
      fetchLessonPlans(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/signin");
        return;
      }
      setSession(session);
      fetchLessonPlans(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLessonPlans = async (currentSession: Session) => {
    if (!currentSession?.user) return;

    try {
      const { data: plans, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('user_id', currentSession.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lesson plans:', error);
        toast.error("Failed to fetch lesson plans");
        return;
      }

      if (plans) {
        setLessonPlans(plans);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch lesson plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (title: string, prompt: string, response: string, date: Date) => {
    if (!session?.user) {
      toast.error("You must be logged in to save lesson plans");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert([{
          user_id: session.user.id,
          title,
          content: { prompt, response },
          created_at: date.toISOString(),
          plan_type: 'daily'
        }])
        .select('*')
        .single();

      if (error) throw error;
      
      if (data) {
        setLessonPlans(prev => [data, ...prev]);
        toast.success("Lesson plan saved successfully!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to save lesson plan");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <LessonPlanningTabs 
          session={session}
          lessonPlans={lessonPlans}
          onSavePlan={handleSavePlan}
        />
      </div>
      <AIChatWidget />
    </div>
  );
};

export default LessonPlanning;