import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIChatSectionProps {
  session: Session | null;
}

const AIChatSection = ({ session }: AIChatSectionProps) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !session?.user) return;

    const { error } = await supabase
      .from('chat_history')
      .insert([
        {
          user_id: session.user.id,
          prompt: inputMessage,
          response: "AI response will be here"
        }
      ]);

    if (error) {
      console.error('Error saving message:', error);
      toast.error('Failed to send message');
      return;
    }

    setMessages([...messages, 
      { role: 'user', content: inputMessage },
      { role: 'assistant', content: 'This is a placeholder response. AI integration coming soon!' }
    ]);
    setInputMessage("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">AI Assistant</h2>
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
          </div>
        ))}
      </ScrollArea>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:border-highlight"
        />
        <button
          onClick={handleSendMessage}
          className="px-6 py-2 bg-highlight text-primary rounded-lg hover:bg-highlight/90 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatSection;