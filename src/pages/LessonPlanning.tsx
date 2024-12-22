import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AIChatSection from "@/components/AIChatSection";
import CalendarView from "@/components/CalendarView";
import AIChatWidget from "@/components/AIChatWidget";

interface LessonPlan {
  id: string;
  title: string;
  content: {
    prompt: string;
    response: string;
  };
  created_at: string;
}

const LessonPlanning = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/signin");
      }
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      fetchLessonPlans();
    }
  }, [session]);

  const fetchLessonPlans = async () => {
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
    const { error } = await supabase
      .from('lesson_plans')
      .insert([
        {
          title,
          content: { prompt, response },
          user_id: session?.user.id
        }
      ]);

    if (error) {
      toast.error('Failed to save lesson plan');
      return;
    }

    toast.success('Lesson plan saved successfully');
    fetchLessonPlans();
  };

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
            <AIChatSection session={session} onSavePlan={saveLessonPlan} />
          </TabsContent>
        </Tabs>
      </div>
      <AIChatWidget />
    </div>
  );
};

export default LessonPlanning;