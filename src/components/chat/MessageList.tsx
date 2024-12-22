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
          className={`mb-4 p-3 rounded-lg ${
            msg.role === 'user' 
              ? 'bg-highlight/10 ml-auto max-w-[80%]' 
              : 'bg-accent/10 mr-auto max-w-[80%]'
          }`}
        >
          {msg.content}
          {msg.role === 'assistant' && onSave && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
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