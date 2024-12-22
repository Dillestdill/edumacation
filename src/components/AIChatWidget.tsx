import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FloatingButton from './chat-widget/FloatingButton';
import WidgetMessageList from './chat-widget/WidgetMessageList';
import WidgetMessageInput from './chat-widget/WidgetMessageInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

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
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response. Please try again later.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FloatingButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-24 right-5 w-[400px] max-w-[90vw] h-[600px] max-h-[80vh] bg-white rounded-xl shadow-xl flex flex-col z-50">
          <div className="bg-primary text-white p-4 rounded-t-xl">
            <h3 className="text-lg font-semibold">Instructor Dan Lesson Builder</h3>
          </div>

          <WidgetMessageList messages={messages} isLoading={isLoading} />
          <WidgetMessageInput
            input={input}
            setInput={setInput}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
};

export default AIChatWidget;