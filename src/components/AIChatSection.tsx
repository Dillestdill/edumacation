import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import SaveDialog from "./chat/SaveDialog";

interface AIChatSectionProps {
  session: Session | null;
  onSavePlan?: (title: string, prompt: string, response: string, planType: 'daily' | 'weekly') => void;
}

const AIChatSection = ({ session, onSavePlan }: AIChatSectionProps) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<{ prompt: string; response: string } | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !session?.user) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage("");

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage }
      });

      if (error) {
        if (error.status === 429) {
          toast.error("The AI service is currently at capacity. Please try again in a few minutes.");
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        throw error;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      await supabase
        .from('chat_history')
        .insert([{
          user_id: session.user.id,
          prompt: userMessage,
          response: data.response
        }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response. Please try again later.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (prompt: string, response: string) => {
    setSelectedMessage({ prompt, response });
  };

  const handleSaveConfirm = (planType: 'daily' | 'weekly') => {
    if (selectedMessage && saveTitle && onSavePlan) {
      onSavePlan(saveTitle, selectedMessage.prompt, selectedMessage.response, planType);
      setSaveTitle("");
      setSelectedMessage(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">AI Assistant</h2>
      <MessageList messages={messages} onSave={onSavePlan ? handleSave : undefined} />
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
      <SaveDialog
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={saveTitle}
        setTitle={setSaveTitle}
        onSave={handleSaveConfirm}
      />
    </div>
  );
};

export default AIChatSection;