import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting smart-goal-assistant function');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    if (!assistantId) {
      throw new Error('OpenAI Assistant ID is not configured');
    }

    const { goal, step, previousAnswers, threadId } = await req.json();
    console.log('Received request:', { goal, step, threadId });

    // Initialize OpenAI client with v2 header
    const openai = new OpenAI({
      apiKey: openAIApiKey,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    let thread;
    if (!threadId) {
      // Create a new thread for the initial goal
      console.log('Creating new thread');
      thread = await openai.beta.threads.create();
      console.log('Thread created:', thread.id);

      // Add the initial message about the goal
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `I want to achieve this goal: "${goal}". Help me make it SMART (Specific, Measurable, Achievable, Relevant, Time-bound). For step 1, help me make it specific.`
      });
    } else {
      thread = { id: threadId };
      
      // For subsequent steps, add the user's previous answer and prepare for next step
      const stepMessages = {
        2: "Now, help me make this goal measurable.",
        3: "Next, help me make this goal achievable.",
        4: "Let's make this goal relevant.",
        5: "Finally, help me make this goal time-bound."
      };
      
      if (step > 1 && previousAnswers) {
        const prevAnswer = previousAnswers[step - 1];
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: `My answer for the previous step: "${prevAnswer}". ${stepMessages[step as keyof typeof stepMessages]}`
        });
      }
    }

    // Run the assistant
    console.log('Starting assistant run');
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: assistantId }
    );

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );

    while (runStatus.status !== 'completed') {
      console.log('Run status:', runStatus.status);
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
      if (runStatus.status === 'requires_action') {
        throw new Error('Assistant requires action - not supported');
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
    }

    // Get the latest message from the assistant
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );

    if (!messages.data || messages.data.length === 0) {
      throw new Error('No response received from assistant');
    }

    const lastMessage = messages.data[0];
    const response = lastMessage.content[0].text.value;
    console.log('Assistant response:', response);

    return new Response(
      JSON.stringify({ 
        response,
        threadId: thread.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in smart-goal-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});