import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CalendarHeaderProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const CalendarHeader = ({ selectedDate, onDateSelect }: CalendarHeaderProps) => {
  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="rounded-md border bg-transparent"
      />
    </div>
  );
};