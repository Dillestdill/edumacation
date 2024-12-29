import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";

interface AIChatSectionProps {
  session: Session | null;
}

const AIChatSection = ({ session }: AIChatSectionProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const userMessage = {
        role: "user",
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: inputMessage },
      });

      if (error) throw error;

      // Add AI response to chat
      const aiMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);

      // Save to chat history if user is authenticated
      if (session?.user?.id) {
        const { error: dbError } = await supabase
          .from('chat_history')
          .insert([
            {
              user_id: session.user.id,
              prompt: inputMessage,
              response: data.response,
            },
          ]);

        if (dbError) {
          console.error('Error saving to chat history:', dbError);
          toast({
            title: "Error",
            description: "Failed to save chat history",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <MessageList messages={messages} />
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AIChatSection;