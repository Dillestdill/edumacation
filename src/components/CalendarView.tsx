import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Save, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
              <Button variant="outline" size="icon">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default CalendarView;