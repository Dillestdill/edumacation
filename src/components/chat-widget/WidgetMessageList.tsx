import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useEffect } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WidgetMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const WidgetMessageList = ({ messages, isLoading }: WidgetMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-grow p-4">
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user'
                ? 'ml-auto bg-highlight/10'
                : 'bg-accent/10'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-accent/10 p-3 rounded-lg max-w-[80%]">
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default WidgetMessageList;