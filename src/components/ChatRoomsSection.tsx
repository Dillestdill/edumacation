import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ChatRoomHeader from "./chat/ChatRoomHeader";
import EducationLevelSelect from "./chat/EducationLevelSelect";
import ChatMessageList from "./chat/ChatMessageList";
import ChatMessageInput from "./chat/ChatMessageInput";

interface ChatRoomsSectionProps {
  session: Session | null;
}

interface UserPresence {
  user_id: string;
  education_level: string;
  last_seen: string;
}

const ChatRoomsSection = ({ session }: ChatRoomsSectionProps) => {
  const [chatRoomMessages, setChatRoomMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [activeLevel, setActiveLevel] = useState("elementary");
  const [activeUsers, setActiveUsers] = useState<Record<string, number>>({
    elementary: 0,
    middle: 0,
    high: 0,
    higher: 0,
  });

  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase.channel('presence-channel')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<UserPresence>();
        const userCounts: Record<string, number> = {
          elementary: 0,
          middle: 0,
          high: 0,
          higher: 0,
        };
        
        Object.values(state).flat().forEach((presence: UserPresence) => {
          if (presence.education_level) {
            userCounts[presence.education_level]++;
          }
        });
        
        setActiveUsers(userCounts);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: session.user.id,
            education_level: activeLevel,
            last_seen: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user, activeLevel]);

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
      <ChatRoomHeader activeUsers={activeUsers[activeLevel]} />
      
      <EducationLevelSelect
        activeLevel={activeLevel}
        activeUsers={activeUsers}
        onLevelChange={setActiveLevel}
      />

      <ChatMessageList
        messages={chatRoomMessages}
        session={session}
      />

      <ChatMessageInput
        value={newChatMessage}
        onChange={setNewChatMessage}
        onSend={handleSendChatRoomMessage}
      />
    </div>
  );
};

export default ChatRoomsSection;