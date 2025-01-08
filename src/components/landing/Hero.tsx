import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignupDialog } from "./SignupDialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Hero = () => {
  const { openSignupDialog } = useSignupDialog();
  const [goal, setGoal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyzeGoal = async () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      toast.success("Goal received! Join the waitlist to get personalized analysis.");
      openSignupDialog();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8" role="banner">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Transform Your Goals into{" "}
            <span className="text-sage-600">Achievements</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered accountability partner that helps you stay focused,
            track progress, and achieve your goals with precision and purpose.
          </p>
        </header>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your goal here..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex-1"
              aria-label="Enter your goal"
            />
            <Button
              onClick={handleAnalyzeGoal}
              disabled={isAnalyzing}
              className="bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
              aria-label="Analyze Goal"
            >
              Analyze
              {isAnalyzing ? (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Primary">
          <Button
            size="lg"
            className="bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
            onClick={openSignupDialog}
            aria-label="Get Started with Achievr"
          >
            Join the Waitlist
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-sage-500 text-sage-600 hover:bg-sage-50"
            onClick={scrollToFeatures}
            aria-label="Learn More about Achievr"
          >
            Learn More
          </Button>
        </nav>
      </div>
    </section>
  );
};