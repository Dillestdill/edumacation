import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AIChatSection from "@/components/AIChatSection";

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

    setLessonPlans(data);
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
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="plans">Saved Lesson Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-6">
            <AIChatSection session={session} onSavePlan={saveLessonPlan} />
          </TabsContent>
          
          <TabsContent value="plans" className="mt-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Saved Lesson Plans</h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {lessonPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium text-lg mb-2">{plan.title}</h3>
                      <div className="text-sm text-muted">
                        Created: {new Date(plan.created_at).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium">Prompt:</h4>
                        <p className="text-sm mt-1">{plan.content.prompt}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium">Response:</h4>
                        <p className="text-sm mt-1">{plan.content.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LessonPlanning;