import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";
import { convertDBResponseToLessonPlan } from "@/utils/lessonPlanUtils";
import { LessonPlanList } from "./lesson-plan/LessonPlanList";
import { LessonPlanEditor } from "./lesson-plan/LessonPlanEditor";

interface CalendarViewProps {
  lessonPlans: LessonPlan[];
}

const CalendarView = ({ lessonPlans: initialLessonPlans }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [lessonText, setLessonText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [localLessonPlans, setLocalLessonPlans] = useState<LessonPlan[]>(initialLessonPlans);

  const plansForSelectedDate = localLessonPlans.filter(plan => 
    selectedDate && format(new Date(plan.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleSave = async () => {
    if (!lessonText.trim()) {
      toast.error("Please enter some text for your lesson plan");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("You must be logged in to save lesson plans");
        return;
      }

      const { data, error } = await supabase
        .from('lesson_plans')
        .insert([{
          user_id: session.user.id,
          title: `Lesson Plan for ${format(selectedDate!, 'MMMM d, yyyy')}`,
          content: {
            prompt: lessonText,
            response: ""
          },
          plan_type: 'daily'
        }])
        .select('*')
        .single();

      if (error) throw error;

      const typedData = data as LessonPlanResponse;
      setLocalLessonPlans(prev => [...prev, convertDBResponseToLessonPlan(typedData)]);
      toast.success("Lesson plan saved successfully!");
      setLessonText("");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to save lesson plan");
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setLocalLessonPlans(prev => prev.filter(plan => plan.id !== planId));
      toast.success("Lesson plan deleted successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to delete lesson plan");
    }
  };

  const handleEdit = (plan: LessonPlan) => {
    setLessonText(plan.content.prompt);
    setIsEditing(true);
    setEditingPlanId(plan.id);
  };

  const handleUpdate = async () => {
    if (!editingPlanId) return;

    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .update({
          content: {
            prompt: lessonText,
            response: ""
          }
        })
        .eq('id', editingPlanId)
        .select('*')
        .single();

      if (error) throw error;

      const typedData = data as LessonPlanResponse;
      setLocalLessonPlans(prev => 
        prev.map(plan => plan.id === editingPlanId ? convertDBResponseToLessonPlan(typedData) : plan)
      );

      toast.success("Lesson plan updated successfully!");
      setLessonText("");
      setIsEditing(false);
      setEditingPlanId(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update lesson plan");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border bg-transparent"
        />
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Lesson Plans for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
          </h3>
          <LessonPlanEditor
            value={lessonText}
            onChange={setLessonText}
            onSave={isEditing ? handleUpdate : handleSave}
          />
          <LessonPlanList
            plans={plansForSelectedDate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;