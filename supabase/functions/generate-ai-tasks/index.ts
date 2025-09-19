import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Task {
  title: string;
  description_md: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'Governance' | 'Workers' | 'Community' | 'Environment' | 'Customers';
  effort: 'minimal' | 'moderate' | 'substantial';
  status: 'todo';
  anchor_quote: string;
  kb_refs: Array<{ kb_id: string; title: string; excerpt: string }>;
  rationale: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

    if (!OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY');
    }

    // Get auth context
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { businessId } = await req.json();
    if (!businessId) {
      throw new Error('Missing businessId');
    }
    console.log('Generating AI tasks for business:', businessId);

    // 1. Get current user for attribution
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    // 2. Fetch saved company description from database
    const { data: business, error: businessError } = await supabaseUser
      .from('businesses')
      .select('id, description, name, industry, country')
      .eq('id', businessId)
      .single();

    if (businessError || !business?.description?.trim()) {
      throw new Error('No saved company description found. Please save your company description first.');
    }

    const companyDescription = business.description.trim();
    console.log('Company description length:', companyDescription.length);

    // 3. Get existing tasks to avoid duplicates
    const { data: existingTasks } = await supabaseUser
      .from('todos')
      .select('title')
      .eq('business_id', businessId);

    const existingTitles = new Set(
      (existingTasks || []).map(task => normalizeTitle(task.title))
    );

    // 4. Generate embedding for company description
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: companyDescription,
      }),
    });

    const embeddingData = await embeddingResponse.json();
    if (!embeddingResponse.ok) {
      throw new Error(`Embedding failed: ${embeddingData.error?.message || 'Unknown error'}`);
    }

    const embedding = embeddingData.data[0].embedding;

    // 5. Search knowledge base for relevant B Corp standards
    const { data: kbResults, error: kbError } = await supabaseAdmin
      .rpc('match_knowledge_documents', {
        query_embedding: embedding,
        match_count: 8,
        similarity_threshold: 0.2
      });

    if (kbError) {
      console.warn('KB search failed, proceeding without context:', kbError);
    }

    const relevantKB = kbResults || [];
    console.log(`Found ${relevantKB.length} relevant KB documents`);

    // 6. Build context for AI prompt
    const kbContext = relevantKB.map((doc, i) => 
      `### KB Document ${i + 1}: ${doc.title}
Impact Area: ${doc.impact_area || 'General'}
Document Type: ${doc.document_type}
Content: ${doc.content.substring(0, 1200)}...
Similarity: ${doc.similarity?.toFixed(3) || 'N/A'}`
    ).join('\n\n');

    // 7. Create AI prompt with strict requirements
    const systemPrompt = `You are an expert B Corp consultant specializing in helping companies prepare for certification. Generate 8-12 specific, actionable tasks for this company based on their description and relevant B Corp standards.

CRITICAL REQUIREMENTS:
1. Every task MUST include an "anchor_quote" - a direct quote (10-100 words) from the company description
2. Every task MUST reference at least one knowledge base document with specific excerpts
3. Tasks must cover all 5 B Corp impact areas: Governance, Workers, Community, Environment, Customers
4. Focus on concrete, implementable actions, not generic advice
5. Each task should build towards B Corp certification readiness

AVOID these existing tasks: ${Array.from(existingTitles).join(', ')}

Company Context:
Name: ${business.name}
Industry: ${business.industry || 'Not specified'}
Country: ${business.country || 'Not specified'}

Description: "${companyDescription}"

Relevant B Corp Standards:
${kbContext}

Return ONLY a JSON object with this exact structure:
{
  "tasks": [
    {
      "title": "Specific task title (max 100 chars)",
      "description_md": "Detailed markdown description with steps and requirements",
      "priority": "low|medium|high",
      "impact": "Governance|Workers|Community|Environment|Customers", 
      "effort": "minimal|moderate|substantial",
      "anchor_quote": "Direct quote from company description",
      "kb_refs": [{"kb_id": "uuid", "title": "KB doc title", "excerpt": "relevant excerpt"}],
      "rationale": "Why this task is important for this specific company"
    }
  ]
}`;

    // 8. Call OpenAI API with structured output
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    const openaiData = await openaiResponse.json();
    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiData.error?.message || 'Unknown error'}`);
    }

    const content = openaiData.choices[0].message.content;
    console.log('Raw AI response length:', content.length);

    let aiResult;
    try {
      aiResult = JSON.parse(content);
    } catch (e) {
      throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
    }

    if (!aiResult.tasks || !Array.isArray(aiResult.tasks)) {
      throw new Error('AI response missing tasks array');
    }

    const tasks: Task[] = aiResult.tasks;
    console.log('Generated tasks:', tasks.length);

    // 9. Validate and filter tasks
    const validTasks = tasks.filter(task => {
      if (!task.title || !task.description_md || !task.anchor_quote) {
        console.log('Skipping invalid task:', task.title);
        return false;
      }
      
      const normalizedTitle = normalizeTitle(task.title);
      if (existingTitles.has(normalizedTitle)) {
        console.log('Skipping duplicate task:', task.title);
        return false;
      }
      
      return true;
    }).slice(0, 12); // Limit to 12 tasks max

    if (validTasks.length === 0) {
      throw new Error('No valid tasks generated');
    }

    // 10. Insert tasks into database
    const dbTasks = validTasks.map(task => ({
      business_id: businessId,
      user_id: user.id,
      title: task.title.substring(0, 180),
      description_md: task.description_md,
      priority: task.priority || 'medium',
      impact: task.impact,
      effort: task.effort || 'moderate',
      status: 'todo' as const,
      anchor_quote: task.anchor_quote.substring(0, 500),
      kb_refs: task.kb_refs || [],
      rationale: task.rationale?.substring(0, 1000) || ''
    }));

    const { data: insertedTasks, error: insertError } = await supabaseAdmin
      .from('todos')
      .insert(dbTasks)
      .select('id, title, impact, priority');

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to save tasks: ${insertError.message}`);
    }

    console.log(`Successfully inserted ${insertedTasks.length} tasks`);

    return new Response(JSON.stringify({
      success: true,
      generated: validTasks.length,
      inserted: insertedTasks.length,
      tasks: insertedTasks
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating AI tasks:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function normalizeTitle(title: string): string {
  return title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}