import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for email confirmation success
    const { hash } = window.location;
    if (hash && hash.includes('type=signup')) {
      toast({
        title: "Please check your email",
        description: "A confirmation link has been sent to your email address",
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/home");
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Email confirmed",
          description: "You can now sign in with your email",
        });
      } else if (event === 'SIGNED_OUT') {
        navigate("/signin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to subscribe",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: {},
      });

      if (response.error) throw response.error;
      if (!response.data.url) throw new Error('No checkout URL returned');

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          providers={["zoom"]}
          redirectTo={`${window.location.origin}/home`}
        />
        <div className="mt-6 text-center">
          <Button
            onClick={handleSubscribe}
            className="bg-[#F2FF44] text-[#141413] hover:bg-[#E6FF00]"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;