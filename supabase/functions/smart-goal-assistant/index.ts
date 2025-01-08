import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize OpenAI client with beta header
const openai = new OpenAI({
  apiKey: openAIApiKey,
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    console.log('Received goal:', goal);

    if (!goal) {
      throw new Error('No goal provided');
    }

    if (!assistantId) {
      throw new Error('Assistant ID not configured');
    }

    // Create a thread
    const thread = await openai.beta.threads.create();
    console.log('Created thread:', thread.id);

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Help me make this goal SMART: ${goal}`
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      instructions: `Analyze the user's goal and provide specific guidance on making it SMART:
      1. Specific: What exactly needs to be accomplished?
      2. Measurable: How will progress and success be measured?
      3. Achievable: Is this realistic with available resources?
      4. Relevant: Why is this goal important?
      5. Time-bound: What's the deadline?
      
      Format your response with clear sections for each SMART component.`
    });

    // Poll for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 60; // Maximum number of attempts (60 seconds timeout)
    
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      if (attempts >= maxAttempts) {
        throw new Error('Request timeout: Assistant took too long to respond');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Run status:', runStatus.status);
      attempts++;
    }

    if (runStatus.status === "completed") {
      // Get the messages
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      const response = lastMessage.content[0].text.value;

      console.log('Generated response:', response);

      return new Response(
        JSON.stringify({ 
          response,
          threadId: thread.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error(`Run ended with status: ${runStatus.status}`);
    }

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