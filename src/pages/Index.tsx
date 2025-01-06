import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { Skeleton } from "@/components/ui/skeleton";

const Features = lazy(() => import("../components/Features"));
const Stats = lazy(() => import("../components/Stats"));
const FAQ = lazy(() => import("../components/FAQ"));
const Footer = lazy(() => import("../components/Footer"));

const SectionLoader = () => (
  <div className="w-full space-y-4 p-8">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-4 w-1/2 mx-auto" />
    <Skeleton className="h-4 w-2/3 mx-auto" />
  </div>
);

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToFAQ) {
      const faqSection = document.getElementById("faq");
      if (faqSection) {
        setTimeout(() => {
          faqSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />
      
      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;