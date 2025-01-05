import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";
import { useSignupDialog } from "@/components/landing/SignupDialog";

export const Navbar = () => {
  const { openSignupDialog } = useSignupDialog();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-sage-600">Achievr</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Info className="w-4 h-4" />
              About
            </Button>
            <Button size="sm" className="gap-2" onClick={openSignupDialog}>
              <ArrowRight className="w-4 h-4" />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};