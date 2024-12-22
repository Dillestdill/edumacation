import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Session } from "@supabase/supabase-js";
import AIChatSection from "@/components/AIChatSection";
import ChatRoomsSection from "@/components/ChatRoomsSection";
import AIChatWidget from "@/components/AIChatWidget";

const UserHome = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

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

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AIChatSection session={session} />
          <ChatRoomsSection session={session} />
        </div>
      </div>
      <AIChatWidget />
    </div>
  );
};

export default UserHome;