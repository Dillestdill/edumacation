import { useState } from "react";
import { format } from "date-fns";
import { LessonPlan } from "@/types/lessonPlan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarHeader } from "./lesson-plan/CalendarHeader";
import { LessonPlanForm } from "./lesson-plan/LessonPlanForm";
import { LessonPlanList } from "./lesson-plan/LessonPlanList";

interface CalendarViewProps {
  lessonPlans: LessonPlan[];
}

const CalendarView = ({ lessonPlans: initialLessonPlans }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [localLessonPlans, setLocalLessonPlans] = useState<LessonPlan[]>(initialLessonPlans);

  const plansForSelectedDate = localLessonPlans.filter(plan => 
    selectedDate && format(new Date(plan.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

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
    setEditingPlan(plan);
  };

  const handlePlanSaved = (plan: LessonPlan) => {
    setLocalLessonPlans(prev => {
      if (editingPlan) {
        return prev.map(p => p.id === plan.id ? plan : p);
      }
      return [...prev, plan];
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CalendarHeader 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Lesson Plans for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
          </h3>
          <LessonPlanForm
            selectedDate={selectedDate}
            onPlanSaved={handlePlanSaved}
            editingPlan={editingPlan}
            onEditComplete={() => setEditingPlan(null)}
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