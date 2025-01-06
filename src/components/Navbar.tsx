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
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        if (!session && !location.pathname.startsWith('/signin')) {
          navigate('/signin');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFAQClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToFAQ: true } });
    } else {
      const faqSection = document.getElementById("faq");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    }
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