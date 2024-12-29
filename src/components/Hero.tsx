import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-24">
      {/* Optimized background pattern */}
      <div className="absolute inset-0 bg-[#F8FAFF] opacity-50 dot-pattern" />

      {/* Animated content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-[1200px] mx-auto px-6 text-center"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1] font-medium tracking-[-0.02em] text-[#141413] mb-8">
          Enjoy your time
          <br />
          off the clock!!
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-[600px] mx-auto mb-12"
        >
          <p className="text-lg sm:text-xl text-[#141413]/80">
            Built for teachers to teach their way!
            <br />
            One simple platform for all your classroom needs.
          </p>
        </motion.div>

        <motion.button 
          onClick={() => navigate("/signin")}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: 0.4, duration: 0.2 }}
          className="group inline-flex items-center gap-2 bg-[#F2FF44] text-[#141413] px-6 py-3 rounded-lg font-medium hover:bg-[#E6FF00] transition-all duration-300 mb-12"
        >
          Try it here!
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-[800px] mx-auto"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="/lovable-uploads/a3a566b1-d141-459c-a4c4-1e80718e3f7e.png" 
              alt="Teacher working at desk" 
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;