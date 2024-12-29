import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatMessageInput = ({ value, onChange, onSend }: ChatMessageInputProps) => {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }} 
      className="flex gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:border-highlight bg-white"
      />
      <Button
        type="submit"
        className="px-6 py-2 bg-highlight text-primary rounded-lg hover:bg-highlight/90 transition-colors"
      >
        <Send className="w-4 h-4 mr-2" />
        Send
      </Button>
    </form>
  );
};

export default ChatMessageInput;