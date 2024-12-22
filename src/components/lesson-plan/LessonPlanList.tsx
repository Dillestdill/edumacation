import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { LessonPlan } from "@/types/lessonPlan";

interface LessonPlanListProps {
  plans: LessonPlan[];
  onEdit: (plan: LessonPlan) => void;
  onDelete: (planId: string) => void;
}

export const LessonPlanList = ({ plans, onEdit, onDelete }: LessonPlanListProps) => {
  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {plans.map((plan) => (
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
                onClick={() => onEdit(plan)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No lesson plans for this date
          </p>
        )}
      </div>
    </ScrollArea>
  );
};