import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize OpenAI client with the required v2 header
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
    const { goal, threadId } = await req.json();
    console.log('Received goal:', goal);

    if (!goal) {
      throw new Error('No goal provided');
    }

    // Use existing thread or create a new one
    const thread = threadId ? 
      { id: threadId } : 
      await openai.beta.threads.create();
    
    console.log('Thread ID:', thread.id);

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Help me make this goal SMART (Specific, Measurable, Achievable, Relevant, Time-bound): ${goal}`
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId!,
      instructions: "You are a SMART goal expert. Analyze the user's goal and provide specific guidance on making it SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Give clear, actionable feedback."
    });

    // Wait for the completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    // Poll for completion with timeout
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds timeout

    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      console.log('Run status:', runStatus.status);
      
      // Check for timeout
      if (Date.now() - startTime > timeout) {
        throw new Error("Assistant request timed out");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (runStatus.status === "failed") {
      console.error('Run failed:', runStatus.last_error);
      throw new Error(`Assistant run failed: ${runStatus.last_error?.message}`);
    }

    if (runStatus.status !== "completed") {
      throw new Error(`Unexpected run status: ${runStatus.status}`);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    if (!lastMessage || !lastMessage.content[0]?.text?.value) {
      throw new Error('No response received from assistant');
    }

    return new Response(
      JSON.stringify({
        response: lastMessage.content[0].text.value,
        threadId: thread.id,
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