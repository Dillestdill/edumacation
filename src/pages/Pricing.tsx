import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Start with a 10-day free trial. No credit card required.
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
            <Button className="w-full bg-primary text-white" onClick={() => navigate("/signin")}>
              Start free trial
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
            <Button className="w-full bg-primary text-white" onClick={() => navigate("/signin")}>
              Start free trial
            </Button>
          </div>
        </div>

        <div className="text-center mt-16 text-secondary">
          <p>All plans include a 10-day free trial. No credit card required.</p>
          <p className="mt-2">Questions? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;