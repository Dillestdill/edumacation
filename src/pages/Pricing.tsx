import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { Mail } from "lucide-react";

const Pricing = () => {
  const { toast } = useToast();
  const { data: subscription } = useSubscription();

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please sign in first",
          description: "You need to be signed in to subscribe",
          variant: "destructive",
        });
        return;
      }

      // Redirect to the appropriate Stripe payment link
      const paymentLinks = {
        monthly: 'https://buy.stripe.com/14k9CJ28l5yF82QaEE',
        yearly: 'https://buy.stripe.com/8wMeX3fZb2mt96UeUV'
      };

      window.location.href = paymentLinks[planType];
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
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-24">
        {subscription?.subscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              You have an active subscription!
            </h2>
            <p className="text-green-700 mb-4">
              Manage your subscription or cancel anytime through your Stripe account.
            </p>
            <a
              href="https://billing.stripe.com/p/login/test_28o5kQ8Qd2Xf3GE288"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-green-700 px-4 py-2 rounded-md border border-green-300 hover:bg-green-50 transition-colors"
            >
              Manage Subscription
            </a>
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Start with a 5-day free trial, then choose the plan that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-secondary">/month</span>
              </div>
              <p className="text-sm text-green-600 mt-2">Includes 5-day free trial</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited lesson plans</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 Support</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Cancel anytime</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-primary text-white" 
              onClick={() => handleSubscribe('monthly')}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-12 top-8 bg-highlight text-primary px-12 py-1 rotate-45">
              Save 17%
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Annual Plan</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$50</span>
                <span className="text-secondary">/year</span>
              </div>
              <p className="text-sm text-green-600 mt-2">Includes 5-day free trial</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Everything in Monthly</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>2 months free</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-primary text-white" 
              onClick={() => handleSubscribe('yearly')}
            >
              Start Free Trial
            </Button>
          </div>
        </div>

        <div className="text-center mt-16 text-secondary">
          <p className="mb-4">Questions? Contact our support team.</p>
          <a 
            href="mailto:LYEserviceshelp@gmail.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Mail className="h-4 w-4" />
            LYEserviceshelp@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pricing;