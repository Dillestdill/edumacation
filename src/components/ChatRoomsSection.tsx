import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatRoomsSectionProps {
  session: Session | null;
}

const ChatRoomsSection = ({ session }: ChatRoomsSectionProps) => {
  const [chatRoomMessages, setChatRoomMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [activeLevel, setActiveLevel] = useState("elementary");

  useEffect(() => {
    const channel = supabase
      .channel('public:chat_room_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_room_messages',
          filter: `education_level=eq.${activeLevel}`
        },
        (payload) => {
          setChatRoomMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    fetchChatRoomMessages(activeLevel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeLevel]);

  const fetchChatRoomMessages = async (level: string) => {
    const { data, error } = await supabase
      .from('chat_room_messages')
      .select('*')
      .eq('education_level', level)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } else {
      setChatRoomMessages(data || []);
    }
  };

  const handleSendChatRoomMessage = async () => {
    if (!newChatMessage.trim() || !session?.user) return;

    const { error } = await supabase
      .from('chat_room_messages')
      .insert([
        {
          user_id: session.user.id,
          display_name: session.user.email?.split('@')[0] || 'Anonymous',
          message: newChatMessage,
          education_level: activeLevel
        }
      ]);

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return;
    }

    setNewChatMessage("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Educator Chat Rooms</h2>
      
      <Select
        value={activeLevel}
        onValueChange={setActiveLevel}
      >
        <SelectTrigger className="w-full mb-4 bg-white border-accent/20">
          <SelectValue placeholder="Select education level" />
        </SelectTrigger>
        <SelectContent className="bg-white border-accent/20 shadow-lg">
          <SelectItem value="elementary" className="hover:bg-accent/10">Elementary School</SelectItem>
          <SelectItem value="middle" className="hover:bg-accent/10">Middle School</SelectItem>
          <SelectItem value="high" className="hover:bg-accent/10">High School</SelectItem>
          <SelectItem value="higher" className="hover:bg-accent/10">Higher Education</SelectItem>
        </SelectContent>
      </Select>

      <ScrollArea className="h-[500px] mb-4 p-4 border rounded-lg">
        {chatRoomMessages.map((msg, index) => (
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

      <div className="flex gap-2">
        <input
          type="text"
          value={newChatMessage}
          onChange={(e) => setNewChatMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendChatRoomMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:border-highlight"
        />
        <button
          onClick={handleSendChatRoomMessage}
          className="px-6 py-2 bg-highlight text-primary rounded-lg hover:bg-highlight/90 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoomsSection;