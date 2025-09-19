-- Fix function search path security issue
CREATE OR REPLACE FUNCTION match_knowledge_documents(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  similarity_threshold float DEFAULT 0.3
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  document_type text,
  impact_area text,
  requirement_codes text[],
  similarity float
)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT 
    id,
    title,
    content,
    document_type,
    impact_area,
    requirement_codes,
    1 - (embedding <=> query_embedding) as similarity
  FROM knowledge_base_documents
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > similarity_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;