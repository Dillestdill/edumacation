import { Button } from "@/components/ui/button";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const MessageInput = ({ inputMessage, setInputMessage, onSend, isLoading }: MessageInputProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder="Ask anything..."
        className="flex-1 px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:border-highlight"
      />
      <button
        onClick={onSend}
        disabled={isLoading}
        className="px-6 py-2 bg-highlight text-primary rounded-lg hover:bg-highlight/90 transition-colors"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;