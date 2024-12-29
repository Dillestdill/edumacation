import { Suspense, lazy } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components that are below the fold
const Features = lazy(() => import("../components/Features"));
const Stats = lazy(() => import("../components/Stats"));
const FAQ = lazy(() => import("../components/FAQ"));
const Footer = lazy(() => import("../components/Footer"));

// Improved loading fallback component with better visual feedback
const SectionLoader = () => (
  <div className="w-full space-y-4 p-8">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-4 w-1/2 mx-auto" />
    <Skeleton className="h-4 w-2/3 mx-auto" />
  </div>
);

const Index = () => {
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