import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AIChatSectionProps {
  session: Session | null;
  onSavePlan?: (title: string, prompt: string, response: string) => void;
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

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage }
      });

      if (error) {
        if (error.status === 429) {
          toast.error("The AI service is currently at capacity. Please try again in a few minutes.");
          // Remove the user's message since we couldn't get a response
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        throw error;
      }

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      // Save to chat history
      await supabase
        .from('chat_history')
        .insert([
          {
            user_id: session.user.id,
            prompt: userMessage,
            response: data.response
          }
        ]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response. Please try again later.');
      // Remove the user's message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (prompt: string, response: string) => {
    setSelectedMessage({ prompt, response });
  };

  const handleSaveConfirm = () => {
    if (selectedMessage && saveTitle && onSavePlan) {
      onSavePlan(saveTitle, selectedMessage.prompt, selectedMessage.response);
      setSaveTitle("");
      setSelectedMessage(null);
    }
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
            {msg.role === 'assistant' && onSavePlan && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => handleSave(messages[index - 1].content, msg.content)}
              >
                Save as Lesson Plan
              </Button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-accent/10 mr-auto max-w-[80%] p-3 rounded-lg">
            Thinking...
          </div>
        )}
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
          disabled={isLoading}
          className="px-6 py-2 bg-highlight text-primary rounded-lg hover:bg-highlight/90 transition-colors"
        >
          Send
        </button>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Lesson Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter title for lesson plan"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
            />
            <Button onClick={handleSaveConfirm}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIChatSection;