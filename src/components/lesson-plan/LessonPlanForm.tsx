import { LessonPlan } from "@/types/lessonPlan";
import { useLessonPlanForm } from "@/hooks/useLessonPlanForm";
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
  const {
    lessonText,
    setLessonText,
    handleSave,
  } = useLessonPlanForm({
    selectedDate,
    onPlanSaved,
    editingPlan,
    onEditComplete,
  });

  return (
    <LessonPlanEditor
      value={lessonText}
      onChange={setLessonText}
      onSave={handleSave}
    />
  );
};