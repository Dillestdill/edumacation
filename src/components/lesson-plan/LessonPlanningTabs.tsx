import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "@/components/CalendarView";
import AIChatSection from "@/components/AIChatSection";
import { Session } from "@supabase/supabase-js";
import { LessonPlan } from "@/types/lessonPlan";

interface LessonPlanningTabsProps {
  session: Session | null;
  lessonPlans: LessonPlan[];
  onSavePlan: (title: string, prompt: string, response: string, date: Date) => Promise<void>;
}

const LessonPlanningTabs = ({ session, lessonPlans, onSavePlan }: LessonPlanningTabsProps) => (
  <Tabs defaultValue="calendar" className="w-full">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="calendar">Calendar View</TabsTrigger>
      <TabsTrigger value="chat">AI Assistant</TabsTrigger>
    </TabsList>
    
    <TabsContent value="calendar" className="mt-6">
      <CalendarView lessonPlans={lessonPlans} />
    </TabsContent>
    
    <TabsContent value="chat" className="mt-6">
      <AIChatSection session={session} onSavePlan={onSavePlan} />
    </TabsContent>
  </Tabs>
);

export default LessonPlanningTabs;