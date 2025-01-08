import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");
  const goal = location.state?.goal;

  useEffect(() => {
    if (!goal) {
      navigate("/");
      return;
    }

    const analyzeGoal = async () => {
      try {
        const response = await fetch("/api/analyze-goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goal }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze goal");
        }

        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Error analyzing goal:", error);
        toast.error("Failed to analyze goal. Please try again.");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    analyzeGoal();
  }, [goal, navigate]);

  return (
    <div className="min-h-screen bg-white p-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Goal Analysis</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Goal</h2>
          <p className="text-gray-700">{goal}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-500"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <div className="prose max-w-none">
              {analysis.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;