import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const { goal } = await req.json();
    console.log('Received goal:', goal);

    if (!goal) {
      throw new Error('No goal provided');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openAIApiKey
    });

    console.log('Calling OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a SMART goal analysis assistant. Help users transform their goals into SMART goals by analyzing them across these dimensions:
          - Specific: What exactly needs to be accomplished?
          - Measurable: How will progress and success be measured?
          - Achievable: Is this realistic with available resources?
          - Relevant: Why is this goal important?
          - Time-bound: What's the deadline?
          
          Provide clear, actionable feedback for each dimension.`
        },
        {
          role: "user",
          content: `Help me make this goal SMART: ${goal}`
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('Generated response:', response);

    return new Response(
      JSON.stringify({ 
        response,
        threadId: null // We don't use threads anymore
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