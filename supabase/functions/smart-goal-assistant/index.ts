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

    const { goal } = await req.json();
    console.log('Received goal:', goal);

    if (!goal) {
      throw new Error('No goal provided');
    }

    // Initialize OpenAI client with v2 beta header
    const openai = new OpenAI({
      apiKey: openAIApiKey,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    console.log('Creating thread...');
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);

    console.log('Adding message to thread...');
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Help me make this goal SMART: ${goal}`
    });

    console.log('Running assistant...');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    console.log('Waiting for assistant response...');
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of attempts (30 * 1 second = 30 seconds timeout)

    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;
      console.log(`Checking run status (${attempts}/${maxAttempts}):`, runStatus.status);

      if (runStatus.status === 'failed') {
        throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
      }
    }

    if (runStatus.status !== 'completed') {
      throw new Error('Assistant response timed out');
    }

    console.log('Retrieving messages...');
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    const response = assistantMessage.content[0].text.value;
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