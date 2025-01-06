import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-24 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-6">
            Sign in to access all features, or{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-primary hover:underline"
            >
              continue browsing
            </button>
          </p>
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
            redirectTo={`${window.location.origin}/tools`}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;