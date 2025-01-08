import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const [goal, setGoal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const analyzeGoal = async () => {
    if (!goal.trim()) {
      toast({
        title: "Please enter a goal",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-goal-assistant', {
        body: { title: goal },
      });

      if (error) throw error;

      // Navigate to analysis page with the result
      navigate('/analysis', { 
        state: { 
          goal,
          analysis: data.analysis 
        } 
      });
    } catch (error) {
      console.error('Error analyzing goal:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to analyze your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8" role="banner">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-up">
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Transform Your Goals into{" "}
            <span className="text-sage-600">SMART Goals</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your goal below and let our AI help you make it Specific, Measurable, 
            Achievable, Relevant, and Time-bound.
          </p>
        </header>

        <div className="space-y-4">
          <Input
            placeholder="Enter your goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="text-lg"
          />
          <Button
            size="lg"
            className="w-full bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300"
            onClick={analyzeGoal}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Goal"}
          </Button>
        </div>
      </div>
    </section>
  );
};