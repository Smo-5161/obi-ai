export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      brains: {
        Row: { id: string; name: string; owner: string; scope: string; description: string; reference_duties: Json; created_at: string };
        Insert: { id?: string; name: string; owner?: string; scope?: string; description?: string; reference_duties?: Json };
        Update: { [key: string]: never };
        Relationships: [];
      };
      recordings: {
        Row: { id: string; brain_id: string; title: string; status: string; created_at: string; duration_sec: number; action_logs: Json; transcript: Json; sops: Json; sensitive_masked: number };
        Insert: { id?: string; brain_id: string; title: string; status?: string; duration_sec?: number; action_logs?: Json; transcript?: Json; sops?: Json; sensitive_masked?: number };
        Update: { [key: string]: never };
        Relationships: [];
      };
      sops: {
        Row: { id: string; brain_id: string; recording_id: string | null; title: string; frequency: string; steps: Json; tools: Json; contacts: Json; source_excerpt: string | null; created_at: string };
        Insert: { id?: string; brain_id: string; title?: string; frequency?: string; steps?: Json; tools?: Json; contacts?: Json; source_excerpt?: string };
        Update: { [key: string]: never };
        Relationships: [];
      };
      chunks: {
        Row: { id: string; brain_id: string; sop_id: string | null; recording_id: string | null; kind: string; text: string; embedding: string; created_at: string };
        Insert: { id?: string; brain_id: string; sop_id?: string | null; recording_id?: string | null; kind?: string; text: string; embedding: string };
        Update: { [key: string]: never };
        Relationships: [];
      };
      messages: {
        Row: { id: string; brain_id: string; role: string; content: string; citations: Json; created_at: string };
        Insert: { id?: string; brain_id: string; role: string; content: string; citations?: Json };
        Update: { [key: string]: never };
        Relationships: [];
      };
      progress: {
        Row: { inboarder_name: string; brain_id: string; completed_sop_ids: Json; asked_questions: number; blocking_topics: Json };
        Insert: { inboarder_name: string; brain_id: string; completed_sop_ids?: Json; asked_questions?: number; blocking_topics?: Json };
        Update: { [key: string]: never };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_chunks: { Args: { query_embedding: string; match_brain_id: string; match_count?: number }; Returns: { id: string; brain_id: string; sop_id: string | null; recording_id: string | null; kind: string; text_content: string; similarity: number }[] };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
