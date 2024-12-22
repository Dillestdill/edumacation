import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";

interface ChatMessageListProps {
  messages: any[];
  session: Session | null;
}

const ChatMessageList = ({ messages, session }: ChatMessageListProps) => {
  return (
    <ScrollArea className="h-[500px] mb-4 p-4 border rounded-lg">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 p-3 rounded-lg ${
            msg.user_id === session?.user?.id
              ? 'bg-highlight/10 ml-auto max-w-[80%]'
              : 'bg-accent/10 mr-auto max-w-[80%]'
          }`}
        >
          <div className="text-sm text-muted mb-1">{msg.display_name}</div>
          {msg.message}
        </div>
      ))}
    </ScrollArea>
  );
};

export default ChatMessageList;