import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";

interface ChatMessageListProps {
  messages: any[];
  session: Session | null;
}

const ChatMessageList = ({ messages, session }: ChatMessageListProps) => {
  return (
    <ScrollArea className="h-[500px] mb-4 p-4 border rounded-lg">
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${
              msg.user_id === session?.user?.id
                ? 'ml-auto max-w-[80%]'
                : 'mr-auto max-w-[80%]'
            }`}
          >
            <div className="text-sm font-medium text-muted mb-2">
              {msg.display_name}
            </div>
            <div
              className={`p-4 rounded-lg whitespace-pre-wrap leading-relaxed ${
                msg.user_id === session?.user?.id
                  ? 'bg-highlight/10'
                  : 'bg-accent/10'
              }`}
            >
              {msg.message}
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;