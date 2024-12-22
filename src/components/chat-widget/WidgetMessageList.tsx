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
      <div className="space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.role === 'user'
                ? 'ml-auto max-w-[80%]'
                : 'max-w-[80%]'
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
          </div>
        ))}
        {isLoading && (
          <div className="max-w-[80%]">
            <div className="text-sm font-medium mb-2">AI Assistant</div>
            <div className="bg-accent/10 p-4 rounded-lg">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default WidgetMessageList;