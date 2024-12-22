import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";
import { convertDBResponseToLessonPlan } from "@/utils/lessonPlanUtils";

interface UseLessonPlanFormProps {
  selectedDate: Date | undefined;
  onPlanSaved: (plan: LessonPlan) => void;
  editingPlan: LessonPlan | null;
  onEditComplete: () => void;
}

export const useLessonPlanForm = ({
  selectedDate,
  onPlanSaved,
  editingPlan,
  onEditComplete,
}: UseLessonPlanFormProps) => {
  const [lessonText, setLessonText] = useState("");

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

    if (!selectedDate) {
      toast.error("Please select a date for your lesson plan");
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
        await handleUpdate(session.user.id);
      } else {
        await handleCreate(session.user.id);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(editingPlan ? "Failed to update lesson plan" : "Failed to save lesson plan");
    }
  };

  const handleUpdate = async (userId: string) => {
    const { data, error } = await supabase
      .from('lesson_plans')
      .update({
        content: {
          prompt: lessonText,
          response: editingPlan!.content.response || ""
        },
        created_at: selectedDate?.toISOString()
      })
      .eq('id', editingPlan!.id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      toast.error("Lesson plan not found");
      onEditComplete();
      return;
    }

    const typedData = data as LessonPlanResponse;
    const convertedPlan = convertDBResponseToLessonPlan(typedData);
    onPlanSaved(convertedPlan);
    onEditComplete();
    toast.success("Lesson plan updated successfully!");
  };

  const handleCreate = async (userId: string) => {
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert([{
        user_id: userId,
        title: `Lesson Plan for ${selectedDate!.toLocaleDateString()}`,
        content: {
          prompt: lessonText,
          response: ""
        },
        created_at: selectedDate?.toISOString(),
        plan_type: 'daily'
      }])
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      toast.error("Failed to create lesson plan");
      return;
    }

    const typedData = data as LessonPlanResponse;
    const convertedPlan = convertDBResponseToLessonPlan(typedData);
    onPlanSaved(convertedPlan);
    setLessonText("");
    toast.success("Lesson plan saved successfully!");
  };

  return {
    lessonText,
    setLessonText,
    handleSave,
  };
};