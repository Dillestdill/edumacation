import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";
import { convertDBResponseToLessonPlan } from "@/utils/lessonPlanUtils";
import { LessonPlanEditor } from "./LessonPlanEditor";

interface LessonPlanFormProps {
  selectedDate: Date | undefined;
  onPlanSaved: (plan: LessonPlan) => void;
  editingPlan: LessonPlan | null;
  onEditComplete: () => void;
}

export const LessonPlanForm = ({ 
  selectedDate, 
  onPlanSaved, 
  editingPlan,
  onEditComplete 
}: LessonPlanFormProps) => {
  const [lessonText, setLessonText] = useState("");

  // Update lessonText when editingPlan changes
  useEffect(() => {
    if (editingPlan) {
      setLessonText(editingPlan.content.prompt);
    } else {
      setLessonText("");
    }
  }, [editingPlan]);

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

      if (editingPlan) {
        const { data, error } = await supabase
          .from('lesson_plans')
          .update({
            content: {
              prompt: lessonText,
              response: editingPlan.content.response || ""
            }
          })
          .eq('id', editingPlan.id)
          .select('*')
          .single();

        if (error) throw error;

        const typedData = data as LessonPlanResponse;
        const convertedPlan = convertDBResponseToLessonPlan(typedData);
        onPlanSaved(convertedPlan);
        onEditComplete();
      } else {
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
        onPlanSaved(convertDBResponseToLessonPlan(typedData));
      }

      toast.success(editingPlan ? "Lesson plan updated successfully!" : "Lesson plan saved successfully!");
      setLessonText("");
    } catch (error) {
      console.error('Error:', error);
      toast.error(editingPlan ? "Failed to update lesson plan" : "Failed to save lesson plan");
    }
  };

  return (
    <LessonPlanEditor
      value={lessonText}
      onChange={setLessonText}
      onSave={handleSave}
    />
  );
};