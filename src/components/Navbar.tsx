import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import Logo from "./nav/Logo";
import AuthenticatedNav from "./nav/AuthenticatedNav";
import UnauthenticatedNav from "./nav/UnauthenticatedNav";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        <Logo />
        {session ? (
          <AuthenticatedNav handleSignOut={handleSignOut} />
        ) : (
          <UnauthenticatedNav handleFAQClick={handleFAQClick} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;