import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

const Navbar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const handleFAQClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const faqSection = document.getElementById("faq");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  
  return (
    <nav className="fixed w-full z-50 px-6 py-4 bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img 
            src="/lovable-uploads/a3717d44-b0f1-4e33-9bf3-c67453939fa8.png" 
            alt="Teacher writing at desk" 
            className="h-10 w-auto"
          />
          <span className="font-medium text-[#141413]">EduMaCation</span>
        </div>
        
        {session ? (
          <div className="flex items-center gap-8">
            <a 
              href="/home" 
              className={`text-[#141413] hover:text-[#141413]/80 transition-colors ${
                window.location.pathname === '/home' ? 'font-semibold' : ''
              }`}
            >
              AI Assistant
            </a>
            <a 
              href="/educator-chat" 
              className={`text-[#141413] hover:text-[#141413]/80 transition-colors ${
                window.location.pathname === '/educator-chat' ? 'font-semibold' : ''
              }`}
            >
              Educator Chat
            </a>
            <a 
              href="/lesson-planning" 
              className={`text-[#141413] hover:text-[#141413]/80 transition-colors ${
                window.location.pathname === '/lesson-planning' ? 'font-semibold' : ''
              }`}
            >
              Lesson Planning
            </a>
            <button 
              onClick={handleSignOut}
              className="text-[#141413] font-medium hover:text-[#141413]/80 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-8">
            <a href="/pricing" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Pricing</a>
            <a href="/teacher-reviews" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Teacher Reviews</a>
            <a href="/challenge" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Challenge</a>
            <a 
              href="#faq" 
              onClick={handleFAQClick}
              className="text-[#141413] hover:text-[#141413]/80 transition-colors"
            >
              FAQ
            </a>
            <button 
              onClick={() => navigate("/signin")}
              className="text-[#141413] font-medium hover:text-[#141413]/80 transition-colors"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;