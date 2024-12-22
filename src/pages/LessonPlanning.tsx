import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import AIChatSection from "@/components/AIChatSection";
import CalendarView from "@/components/CalendarView";
import AIChatWidget from "@/components/AIChatWidget";
import { useLessonPlans } from "@/hooks/useLessonPlans";

const LessonPlanning = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

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

  const { lessonPlans, saveLessonPlan } = useLessonPlans(session);

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