import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Message {
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
  onSave?: (prompt: string, response: string) => void;
}

const MessageList = ({ messages, onSave }: MessageListProps) => {
  return (
    <ScrollArea className="h-[500px] mb-4 p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-6 ${
            msg.role === 'user' 
              ? 'ml-auto max-w-[80%]' 
              : 'mr-auto max-w-[80%]'
          }`}
        >
          <div className="text-sm font-medium mb-2">
            {msg.role === 'user' ? 'You' : 'AI Assistant'}
          </div>
          <div
            className={`p-4 rounded-lg whitespace-pre-wrap leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-highlight/10' 
                : 'bg-accent/10'
            }`}
          >
            {msg.content}
          </div>
          {msg.role === 'assistant' && onSave && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3"
              onClick={() => onSave(messages[index - 1].content, msg.content)}
            >
              Save as Lesson Plan
            </Button>
          )}
        </div>
      ))}
    </ScrollArea>
  );
};

export default MessageList;