import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KnowledgeDocument {
  title: string;
  content: string;
  document_type: string;
  impact_area?: string;
  requirement_codes?: string[];
  metadata?: Record<string, any>;
  is_master_document?: boolean;
  source_filename?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { documents, clearExisting } = await req.json();
    
    console.log('Processing knowledge base documents:', documents.length);

    // Clear existing knowledge base if requested
    if (clearExisting) {
      console.log('Clearing existing knowledge base documents...');
      const { error: deleteError } = await supabaseAdmin
        .from('knowledge_base_documents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteError) {
        console.error('Error clearing knowledge base:', deleteError);
      } else {
        console.log('Successfully cleared existing knowledge base');
      }
    }

    // Process each document
    const results = [];
    
    for (const doc of documents) {
      try {
        console.log('Processing document:', doc.title);
        
        const documentRecord = {
          title: doc.title,
          content: doc.content,
          document_type: doc.document_type,
          impact_area: doc.impact_area,
          requirement_codes: doc.requirement_codes,
          metadata: {
            ...(doc.metadata || {}),
            is_master_document: doc.is_master_document || false,
            source_filename: doc.source_filename,
            processed_at: new Date().toISOString()
          }
        };

        const { data, error } = await supabaseAdmin
          .from('knowledge_base_documents')
          .insert([documentRecord])
          .select()
          .single();

        if (error) {
          console.error('Error inserting document:', error);
          throw error;
        }

        results.push(data);
        console.log('Successfully processed:', doc.title);
        
      } catch (docError) {
        console.error('Error processing document:', doc.title, docError);
        throw docError;
      }
    }

    console.log('All documents processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        processed_count: results.length,
        documents: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Knowledge base processing error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});