import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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

  const plansForSelectedDate = lessonPlans.filter(plan => 
    selectedDate && format(new Date(plan.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Lesson Plans for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
          </h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {plansForSelectedDate.map((plan) => (
                <div key={plan.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{plan.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {format(new Date(plan.created_at), 'h:mm a')}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">{plan.content.response}</p>
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
  );
};

export default CalendarView;