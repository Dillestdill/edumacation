import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        onClick={() => navigate("/")}
      >
        ← Back to Main Page
      </Button>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={`${window.location.origin}/home`}
        />
      </div>
    </div>
  );
};

export default SignIn;