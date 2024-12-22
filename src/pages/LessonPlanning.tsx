import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AIChatSection from "@/components/AIChatSection";
import CalendarView from "@/components/CalendarView";
import AIChatWidget from "@/components/AIChatWidget";
import { useLessonPlans } from "@/hooks/useLessonPlans";
import { convertDBResponseToLessonPlan } from "@/utils/lessonPlanUtils";
import { LessonPlan } from "@/types/lessonPlan";

const LessonPlanning = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const { lessonPlans, saveLessonPlan, setLessonPlans } = useLessonPlans(session);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/signin");
        return;
      }
      setSession(session);
      fetchLessonPlans(session);
    });

    // Listen for auth changes
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
        const convertedPlans = plans.map(convertDBResponseToLessonPlan);
        setLessonPlans(convertedPlans);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch lesson plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user) return;

    // Subscribe to real-time changes
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
        async (payload) => {
          console.log('Real-time update received:', payload);
          await fetchLessonPlans(session);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user]);

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
        const newPlan = convertDBResponseToLessonPlan(data);
        setLessonPlans(prev => [newPlan, ...prev]);
        toast.success("Lesson plan saved successfully!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to save lesson plan");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6">
            <CalendarView lessonPlans={lessonPlans} />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <AIChatSection session={session} onSavePlan={handleSavePlan} />
          </TabsContent>
        </Tabs>
      </div>
      <AIChatWidget />
    </div>
  );
};

export default LessonPlanning;