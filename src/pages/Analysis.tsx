import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { goal } = location.state || {};
  const [currentStep, setCurrentStep] = useState("");
  const [response, setResponse] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!goal) {
      navigate('/');
      return;
    }
    initializeConversation();
  }, [goal]);

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      // Create a new conversation without user_id
      const { data: conversation, error: conversationError } = await supabase
        .from('smart_goal_conversations')
        .insert([
          {
            original_goal: goal,
            current_step: 'S',
            conversation_history: []
          }
        ])
        .select()
        .single();

      if (conversationError) throw conversationError;

      setConversationId(conversation.id);
      
      // Get initial response from assistant
      const { data, error } = await supabase.functions.invoke('smart-goal-assistant', {
        body: { 
          conversationId: conversation.id,
          goal,
          step: 'S',
          userInput: null
        },
      });

      if (error) throw error;

      setResponse(data.response);
      setCurrentStep('S');
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start the conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please provide an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get next step based on current step
      const nextStep = {
        'S': 'M',
        'M': 'A',
        'A': 'R',
        'R': 'T',
        'T': 'complete'
      }[currentStep];

      // Update conversation in database
      const { error: updateError } = await supabase
        .from('smart_goal_conversations')
        .update({ 
          current_step: nextStep,
          conversation_history: supabase.sql`array_append(conversation_history, ${JSON.stringify({
            step: currentStep,
            userInput,
            assistantResponse: response
          })})`
        })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      if (nextStep === 'complete') {
        // Handle completion
        navigate('/goals');
        return;
      }

      // Get next response from assistant
      const { data, error } = await supabase.functions.invoke('smart-goal-assistant', {
        body: { 
          conversationId,
          step: nextStep,
          userInput
        },
      });

      if (error) throw error;

      setResponse(data.response);
      setCurrentStep(nextStep);
      setUserInput('');
    } catch (error) {
      console.error('Error processing next step:', error);
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!goal) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          ← Back to Goal Entry
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Make Your Goal SMART</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Your Original Goal</h3>
              <p className="mt-2 text-gray-600">{goal}</p>
            </div>
            
            {response && (
              <div className="space-y-4">
                <div className="prose prose-sage">
                  <p className="whitespace-pre-wrap text-gray-600">{response}</p>
                </div>
                
                <div className="space-y-4">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full"
                  />
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="w-full bg-sage-500 hover:bg-sage-600 text-white"
                  >
                    {isLoading ? "Processing..." : "Next"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;