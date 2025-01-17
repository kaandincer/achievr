import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSignupDialog } from "@/components/landing/SignupDialog";

export const Navbar = () => {
  const { openSignupDialog } = useSignupDialog();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-[#527fb8]">Plio</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              size="sm" 
              className="gap-2 bg-[#527fb8] hover:bg-[#27425e] text-white" 
              onClick={openSignupDialog}
            >
              <ArrowRight className="w-4 h-4" />
              Join the Waitlist
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};