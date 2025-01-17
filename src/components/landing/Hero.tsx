import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignupDialog } from "./SignupDialog";

export const Hero = () => {
  const { openSignupDialog } = useSignupDialog();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white" role="banner">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#27425e]">
            Make Recovery{" "}
            <span className="text-[#527fb8]">Fun & Rewarding</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#27425e] max-w-2xl mx-auto">
            The first mobile app that makes post-run stretching engaging and rewarding.
            Win real cash prizes while optimizing your recovery with AI-powered routines.
          </p>
        </header>
        <nav className="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Primary">
          <Button
            size="lg"
            className="gap-2 bg-[#527fb8] hover:bg-[#27425e] text-white"
            onClick={openSignupDialog}
            aria-label="Join Plio Waitlist"
          >
            <ArrowRight className="w-4 h-4" />
            Join the Waitlist
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#27425e] text-[#27425e] hover:bg-[#27425e] hover:text-white"
            onClick={scrollToFeatures}
            aria-label="Learn More about Plio"
          >
            Learn More
          </Button>
        </nav>
      </div>
    </section>
  );
};