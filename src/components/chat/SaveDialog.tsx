import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (title: string) => void;
  onSave: (date: Date) => void;
}

const SaveDialog = ({ isOpen, onClose, title, setTitle, onSave }: SaveDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleSave = () => {
    if (selectedDate) {
      onSave(selectedDate);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Lesson Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title for lesson plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Lesson Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;