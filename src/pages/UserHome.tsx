import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const UserHome = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatRoomMessages, setChatRoomMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [activeTab, setActiveTab] = useState("elementary");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/signin");
      }
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Subscribe to chat room messages for the active tab
    const channel = supabase
      .channel('public:chat_room_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_room_messages',
          filter: `education_level=eq.${activeTab}`
        },
        (payload) => {
          setChatRoomMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    // Fetch existing chat room messages for the active tab
    fetchChatRoomMessages(activeTab);

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [navigate, activeTab]);

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

  const handleSendChatRoomMessage = async () => {
    if (!newChatMessage.trim() || !session?.user) return;

    const { error } = await supabase
      .from('chat_room_messages')
      .insert([
        {
          user_id: session.user.id,
          display_name: session.user.email?.split('@')[0] || 'Anonymous',
          message: newChatMessage,
          education_level: activeTab
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
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Chat Section */}
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

          {/* Chat Rooms Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Educator Chat Rooms</h2>
            <Tabs defaultValue="elementary" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full mb-4">
                <TabsTrigger value="elementary">Elementary</TabsTrigger>
                <TabsTrigger value="middle">Middle School</TabsTrigger>
                <TabsTrigger value="high">High School</TabsTrigger>
                <TabsTrigger value="higher">Higher Ed</TabsTrigger>
              </TabsList>

              {["elementary", "middle", "high", "higher"].map((level) => (
                <TabsContent key={level} value={level} className="mt-0">
                  <ScrollArea className="h-[500px] mb-4 p-4">
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
                </TabsContent>
              ))}

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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;