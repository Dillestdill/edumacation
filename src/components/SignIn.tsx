import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const redirectPath = localStorage.getItem('redirectPath');
        if (redirectPath) {
          localStorage.removeItem('redirectPath');
          navigate(redirectPath);
        } else {
          const lastPath = localStorage.getItem('lastPath');
          if (lastPath) {
            navigate(lastPath);
          } else {
            navigate('/tools');
          }
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const redirectPath = localStorage.getItem('redirectPath');
        if (redirectPath) {
          localStorage.removeItem('redirectPath');
          navigate(redirectPath);
        } else {
          const lastPath = localStorage.getItem('lastPath');
          if (lastPath) {
            navigate(lastPath);
          } else {
            navigate('/tools');
          }
        }
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-24 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;