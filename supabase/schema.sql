-- Omi.ai — Schéma Supabase (Postgres + pgvector)
-- À exécuter dans le SQL Editor de Supabase.

-- 1. Extension vectorielle
create extension if not exists vector;

-- 2. Tables
create table if not exists public.brains (
  id text primary key,
  name text not null,
  owner text not null default '',
  scope text not null default 'job' check (scope in ('job', 'team', 'project')),
  description text not null default '',
  reference_duties jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.recordings (
  id text primary key,
  brain_id text not null references public.brains(id) on delete cascade,
  title text not null,
  status text not null default 'ready' check (status in ('uploading','transcribing','structuring','indexing','ready','failed')),
  created_at timestamptz not null default now(),
  duration_sec int not null default 0,
  action_logs jsonb not null default '[]',
  transcript jsonb not null default '[]',
  sops jsonb not null default '[]',
  sensitive_masked int not null default 0
);

create table if not exists public.sops (
  id text primary key,
  brain_id text not null references public.brains(id) on delete cascade,
  recording_id text references public.recordings(id) on delete set null,
  title text not null,
  frequency text not null default 'adhoc' check (frequency in ('daily','weekly','monthly','adhoc')),
  steps jsonb not null default '[]',
  tools jsonb not null default '[]',
  contacts jsonb not null default '[]',
  source_excerpt text,
  created_at timestamptz not null default now()
);

create table if not exists public.chunks (
  id text primary key,
  brain_id text not null references public.brains(id) on delete cascade,
  sop_id text,
  recording_id text,
  kind text not null default 'transcript' check (kind in ('transcript','sop','document')),
  text text not null,
  embedding vector(1024) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key,
  brain_id text not null references public.brains(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  citations jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  inboarder_name text not null,
  brain_id text not null references public.brains(id) on delete cascade,
  completed_sop_ids jsonb not null default '[]',
  asked_questions int not null default 0,
  blocking_topics jsonb not null default '{}',
  primary key (inboarder_name, brain_id)
);

-- 3. Index
create index if not exists idx_chunks_brain on public.chunks (brain_id);
create index if not exists idx_sops_brain on public.sops (brain_id);
create index if not exists idx_recordings_brain on public.recordings (brain_id);
create index if not exists idx_messages_brain on public.messages (brain_id);
create index if not exists idx_chunks_embedding on public.chunks
  using hnsw (embedding vector_cosine_ops);

-- 4. RLS (permissif pour l'instant : l'auth utilisateurs est la prochaine étape)
alter table public.brains enable row level security;
alter table public.recordings enable row level security;
alter table public.sops enable row level security;
alter table public.chunks enable row level security;
alter table public.messages enable row level security;
alter table public.progress enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'public_access' and tablename = 'brains') then
    create policy "public_access" on public.brains for all using (true) with check (true);
    create policy "public_access" on public.recordings for all using (true) with check (true);
    create policy "public_access" on public.sops for all using (true) with check (true);
    create policy "public_access" on public.chunks for all using (true) with check (true);
    create policy "public_access" on public.messages for all using (true) with check (true);
    create policy "public_access" on public.progress for all using (true) with check (true);
  end if;
end $$;

-- 5. Fonction de recherche vectorielle (RAG)
create or replace function match_chunks(
  query_embedding vector(1024),
  match_brain_id text,
  match_count int default 5
)
returns table (id text, brain_id text, sop_id text, recording_id text, kind text, text_content text, similarity float)
language sql stable
as $$
  select c.id, c.brain_id, c.sop_id, c.recording_id, c.kind, c.text,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  where c.brain_id = match_brain_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
