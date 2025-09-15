import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId, context, analysisType } = await req.json();
    
    console.log('Starting AI analysis for business:', businessId, 'with context:', context);

    if (!businessId || !context) {
      return new Response(
        JSON.stringify({ error: 'Missing businessId or context' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set auth for subsequent requests
    supabase.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: ''
    });

    // Generate B Corp tasks using OpenAI
    const prompt = `You are a B Corp certification expert. Based on this company description, generate 5-8 specific, actionable tasks to help them prepare for B Corp certification.

Company Description: ${context}

For each task, provide:
1. A clear, specific title
2. Which B Corp impact area it addresses (Governance, Workers, Community, Environment, Customers)
3. Priority level (High, Medium, Low)
4. Effort level (Low, Medium, High)
5. A brief description of why this task is important for B Corp certification

Focus on the most important foundational tasks that every company needs for B Corp readiness.

Respond in JSON format:
{
  "tasks": [
    {
      "title": "Task title",
      "impact_area": "Governance|Workers|Community|Environment|Customers",
      "priority": "High|Medium|Low",
      "effort": "Low|Medium|High",
      "description": "Description of the task and its importance"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert B Corp certification consultant who helps companies prepare for certification by identifying specific, actionable tasks.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let tasksData;
    try {
      tasksData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: extract JSON from response if it's wrapped in text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tasksData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert tasks into database
    const tasksToInsert = tasksData.tasks.map((task: any) => ({
      title: task.title,
      description_md: task.description,
      impact: task.impact_area.toLowerCase(),
      priority: task.priority.toLowerCase(),
      effort: task.effort.toLowerCase(),
      status: 'not_started',
      business_id: businessId,
      user_id: user.id,
    }));

    const { data: insertedTasks, error: insertError } = await supabase
      .from('todos')
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw insertError;
    }

    console.log('Successfully inserted tasks:', insertedTasks?.length);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tasksGenerated: insertedTasks?.length || 0,
        tasks: insertedTasks 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-ai-tasks function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});