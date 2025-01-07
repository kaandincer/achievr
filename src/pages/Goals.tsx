import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Goals = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // First, get AI analysis
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-goal', {
        body: { title, description },
      });

      if (analysisError) throw analysisError;
      setAnalysis(analysisData.analysis);

      // Then, save the goal
      const { error: saveError } = await supabase
        .from("goals")
        .insert([
          {
            user_id: user.id,
            title,
            description,
          },
        ]);

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "Goal created successfully!",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create goal. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-sage-900">Create a New Goal</CardTitle>
          <CardDescription className="text-sage-600">
            What would you like to achieve?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Goal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-sage-200 focus:border-sage-500"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] border-sage-200 focus:border-sage-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-sage-500 hover:bg-sage-600 text-white"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Goal...
                </>
              ) : (
                "Create Goal"
              )}
            </Button>
          </form>

          {analysis && (
            <Alert className="mt-4">
              <AlertTitle>AI Analysis</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {analysis}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;