import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface LessonPlanEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export const LessonPlanEditor = ({ value, onChange, onSave }: LessonPlanEditorProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your lesson plan here..."
        className="min-h-[200px] w-full p-4"
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};