import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WidgetMessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const WidgetMessageInput = ({ input, setInput, onSend, isLoading }: WidgetMessageInputProps) => {
  return (
    <div className="p-4 border-t">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-highlight"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-highlight hover:bg-highlight/90"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default WidgetMessageInput;