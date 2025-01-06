import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { 
  MessageSquare, 
  BookOpen, 
  Users,
  ArrowRight,
  Loader2
} from "lucide-react";

const ToolsDashboard = () => {
  const navigate = useNavigate();
  const { data: subscription, isLoading, error } = useSubscription();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to access the tools");
        navigate("/signin");
        return;
      }
    };

    checkAccess();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-highlight" />
            <p className="text-muted-foreground">Loading your tools...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error("Error loading subscription status");
    navigate("/pricing");
    return null;
  }

  if (!subscription?.subscribed && !subscription?.isInTrial) {
    toast.error("Please subscribe to access the tools");
    navigate("/pricing");
    return null;
  }

  const tools = [
    {
      title: "AI Assistant",
      description: "Get instant help with lesson planning and teaching strategies",
      icon: MessageSquare,
      path: "/home"
    },
    {
      title: "Lesson Planning",
      description: "Create and manage your lesson plans with AI assistance",
      icon: BookOpen,
      path: "/lesson-planning"
    },
    {
      title: "Educator Chat",
      description: "Connect and collaborate with other educators",
      icon: Users,
      path: "/educator-chat"
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Your Teaching Tools</h1>
          
          {subscription?.isInTrial && (
            <div className="bg-highlight/10 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-2">Trial Access Active</h2>
              <p className="text-muted-foreground mb-4">
                Your trial ends on {new Date(subscription.trialEndsAt * 1000).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Button
                key={tool.path}
                variant="outline"
                className="h-auto p-6 flex flex-col items-start space-y-4 hover:bg-accent/5"
                onClick={() => navigate(tool.path)}
              >
                <tool.icon className="h-8 w-8 text-highlight" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
                  <div className="flex items-center text-highlight text-sm">
                    Launch tool <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsDashboard;