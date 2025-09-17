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
      console.error('Missing required parameters:', { businessId: !!businessId, context: !!context });
      return new Response(
        JSON.stringify({ error: 'Missing businessId or context' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Verify the user token by getting user info
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

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

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no extra text. Start with { and end with }.

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

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert B Corp certification consultant. Always respond with clean JSON only, no markdown, no code blocks, no extra text.' 
          },
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
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('No content in OpenAI response:', data);
      throw new Error('No content received from OpenAI');
    }
    
    console.log('AI Response received, length:', aiResponse.length);

    // Parse the JSON response with improved error handling
    let tasksData;
    try {
      // Try to parse the response directly
      tasksData = JSON.parse(aiResponse.trim());
      console.log('JSON parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw AI response:', aiResponse);
      
      // Fallback 1: Remove markdown code blocks if present
      let cleanResponse = aiResponse.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      try {
        tasksData = JSON.parse(cleanResponse);
        console.log('JSON parsed after removing markdown');
      } catch (secondError) {
        // Fallback 2: Extract JSON object from response
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            tasksData = JSON.parse(jsonMatch[0]);
            console.log('JSON parsed from extracted object');
          } catch (thirdError) {
            console.error('All JSON parsing attempts failed');
            throw new Error(`Invalid JSON response from AI: ${thirdError.message}`);
          }
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }
    }

    // Validate the parsed data structure
    if (!tasksData || !tasksData.tasks || !Array.isArray(tasksData.tasks)) {
      throw new Error('Invalid response structure: expected {tasks: []}');
    }

    console.log('Successfully parsed', tasksData.tasks.length, 'tasks');

    // Normalize data to match UI expectations
    const normalizeImpactArea = (area: string): string => {
      const normalized = area.toLowerCase();
      const impactMap: Record<string, string> = {
        'governance': 'Governance',
        'workers': 'Workers', 
        'community': 'Community',
        'environment': 'Environment',
        'customers': 'Customers'
      };
      return impactMap[normalized] || 'Other';
    };

    const normalizePriority = (priority: string): string => {
      const normalized = priority.toLowerCase();
      const priorityMap: Record<string, string> = {
        'high': 'P1',
        'medium': 'P2', 
        'low': 'P3'
      };
      return priorityMap[normalized] || 'P2';
    };

    const normalizeEffort = (effort: string): string => {
      const normalized = effort.toLowerCase();
      const effortMap: Record<string, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
      };
      return effortMap[normalized] || 'Medium';
    };

    // Insert tasks into database with normalized values
    const tasksToInsert = tasksData.tasks.map((task: any) => ({
      title: task.title,
      description_md: task.description,
      impact: normalizeImpactArea(task.impact_area),
      priority: normalizePriority(task.priority),
      effort: normalizeEffort(task.effort),
      status: 'todo',
      business_id: businessId,
      user_id: user.id,
    }));

    console.log('Preparing to insert tasks:', tasksToInsert.length);

    const { data: insertedTasks, error: insertError } = await supabase
      .from('todos')
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw insertError;
    }

    console.log('Successfully inserted', insertedTasks?.length, 'new tasks for business:', businessId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tasksGenerated: insertedTasks?.length || 0,
        tasks: insertedTasks,
        businessId: businessId,
        message: `Successfully generated ${insertedTasks?.length || 0} B Corp tasks from company description analysis`
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