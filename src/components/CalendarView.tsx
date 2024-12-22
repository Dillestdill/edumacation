import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Save, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LessonPlan {
  id: string;
  title: string;
  content: {
    prompt: string;
    response: string;
  };
  created_at: string;
}

interface CalendarViewProps {
  lessonPlans: LessonPlan[];
}

const CalendarView = ({ lessonPlans }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [lessonText, setLessonText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const plansForSelectedDate = lessonPlans.filter(plan => 
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

      const newPlan = {
        user_id: session.user.id,
        title: `Lesson Plan for ${format(selectedDate!, 'MMMM d, yyyy')}`,
        content: {
          prompt: lessonText,
          response: ""
        },
        plan_type: 'daily'
      };

      const { error } = await supabase
        .from('lesson_plans')
        .insert([newPlan]);

      if (error) throw error;

      toast.success("Lesson plan saved successfully!");
      // Only clear the text after successful save
      setLessonText("");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to save lesson plan");
      // Don't clear the text if there's an error
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

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
      const { error } = await supabase
        .from('lesson_plans')
        .update({
          content: {
            prompt: lessonText,
            response: ""
          }
        })
        .eq('id', editingPlanId);

      if (error) throw error;

      toast.success("Lesson plan updated successfully!");
      // Only clear after successful update
      setLessonText("");
      setIsEditing(false);
      setEditingPlanId(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update lesson plan");
      // Don't clear if there's an error
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
          <div className="space-y-4">
            <Textarea
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              placeholder="Enter your lesson plan here..."
              className="min-h-[200px] w-full p-4"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={isEditing ? handleUpdate : handleSave}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {plansForSelectedDate.map((plan) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{plan.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {format(new Date(plan.created_at), 'h:mm a')}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">{plan.content.prompt}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {plansForSelectedDate.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No lesson plans for this date
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;