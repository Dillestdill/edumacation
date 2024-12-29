import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
      <img 
        src="/lovable-uploads/a3717d44-b0f1-4e33-9bf3-c67453939fa8.png" 
        alt="Teacher writing at desk" 
        className="h-10 w-auto"
      />
      <span className="font-medium text-[#141413]">EduMaCation</span>
    </div>
  );
};

export default Logo;