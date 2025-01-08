import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignupDialog } from "./SignupDialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { openSignupDialog } = useSignupDialog();
  const [goal, setGoal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyzeGoal = async () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Navigate to the SMART goal page with the entered goal
      navigate("/smart-goal", { state: { goal: goal.trim() } });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16" role="banner">
      <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-up">
        <header className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Transform Your Goals into{" "}
            <span className="text-sage-600">Achievements</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered accountability partner that helps you stay focused,
            track progress, and achieve your goals with precision and purpose.
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter your goal here..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="text-lg h-14 px-6"
              aria-label="Enter your goal"
            />
            <Button
              onClick={handleAnalyzeGoal}
              disabled={isAnalyzing}
              className="w-full h-14 text-lg bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
              aria-label="Analyze Goal"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  Analyzing
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Analyze Goal
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};