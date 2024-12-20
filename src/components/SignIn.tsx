import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        navigate("/signin");
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Email confirmed",
          description: "Your email has been confirmed. You can now sign in.",
        });
      }
    });

    // Check for email confirmation success
    const hash = window.location.hash;
    if (hash && hash.includes('error_description')) {
      const errorDescription = decodeURIComponent(hash.split('error_description=')[1]);
      toast({
        title: "Error",
        description: errorDescription,
        variant: "destructive",
      });
    } else if (hash && hash.includes('access_token')) {
      toast({
        title: "Success",
        description: "Email confirmed successfully. You can now sign in.",
      });
    }

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-[400px] w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Welcome Back</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#141413',
                  brandAccent: '#141413',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/signin`}
        />
      </div>
    </div>
  );
};

export default SignIn;