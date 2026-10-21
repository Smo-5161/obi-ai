-- Omi.ai — Migration : Brain partagé par poste avec membres (idempotent, v2)
-- À exécuter dans le SQL Editor Supabase. Peut être relancé sans erreur.

-- 1. Table des membres
create table if not exists public.brain_members (
  brain_id text not null references public.brains(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (brain_id, user_id)
);


-- Fonction helper SECURITY DEFINER : casse la récursion policies (brains <-> brain_members)
create or replace function public.is_brain_member(check_brain_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.brain_members m
    where m.brain_id = check_brain_id and m.user_id = auth.uid()
  ) or exists (
    select 1 from public.brains b
    where b.id = check_brain_id and b.owner_id = auth.uid()
  );
$$;

revoke all on function public.is_brain_member(text) from public;


create or replace function public.is_brain_owner(check_brain_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.brains b
    where b.id = check_brain_id and b.owner_id = auth.uid()
  );
$$;

revoke all on function public.is_brain_owner(text) from public;

-- 2. RLS brain_members
alter table public.brain_members enable row level security;

drop policy if exists "brain_members_select" on public.brain_members;
create policy "brain_members_select" on public.brain_members
  for select using (
    user_id = auth.uid()
    or public.is_brain_owner(brain_members.brain_id)
  );

drop policy if exists "brain_members_insert" on public.brain_members;
create policy "brain_members_insert" on public.brain_members
  for insert with check (user_id = auth.uid());

-- 3. Brains : visibles par les membres + découvrables (scope job)
drop policy if exists "brains_owner_select" on public.brains;
drop policy if exists "brains_members_or_owner_select" on public.brains;
create policy "brains_members_or_owner_select" on public.brains
  for select using (
    public.is_brain_member(brains.id)
    or scope = 'job'
  );

drop policy if exists "brains_owner_all" on public.brains;
drop policy if exists "brains_insert" on public.brains;
create policy "brains_insert" on public.brains
  for insert with check (auth.uid() = owner_id);

drop policy if exists "brains_owner_update" on public.brains;
drop policy if exists "brains_update" on public.brains;
create policy "brains_update" on public.brains
  for update using (public.is_brain_member(brains.id));

drop policy if exists "brains_owner_delete" on public.brains;
drop policy if exists "brains_delete" on public.brains;
create policy "brains_delete" on public.brains
  for delete using (owner_id = auth.uid());

-- 4. Tables filles : membres OU propriétaire
drop policy if exists "recordings_owner_select" on public.recordings;
drop policy if exists "recordings_members_select" on public.recordings;
create policy "recordings_members_select" on public.recordings
  for select using (
    public.is_brain_member(recordings.brain_id)
  );
drop policy if exists "recordings_owner_write" on public.recordings;
drop policy if exists "recordings_members_write" on public.recordings;
create policy "recordings_members_write" on public.recordings
  for insert with check (
    public.is_brain_member(recordings.brain_id)
  );
drop policy if exists "recordings_owner_update" on public.recordings;
drop policy if exists "recordings_members_update" on public.recordings;
create policy "recordings_members_update" on public.recordings
  for update using (
    public.is_brain_member(recordings.brain_id)
  );

drop policy if exists "sops_owner_select" on public.sops;
drop policy if exists "sops_members_select" on public.sops;
create policy "sops_members_select" on public.sops
  for select using (
    public.is_brain_member(sops.brain_id)
  );
drop policy if exists "sops_owner_write" on public.sops;
drop policy if exists "sops_members_write" on public.sops;
create policy "sops_members_write" on public.sops
  for insert with check (
    public.is_brain_member(sops.brain_id)
  );
drop policy if exists "sops_owner_update" on public.sops;
drop policy if exists "sops_members_update" on public.sops;
create policy "sops_members_update" on public.sops
  for update using (
    public.is_brain_member(sops.brain_id)
  );
drop policy if exists "sops_members_delete" on public.sops;
create policy "sops_members_delete" on public.sops
  for delete using (
    public.is_brain_member(sops.brain_id)
  );

drop policy if exists "chunks_owner_select" on public.chunks;
drop policy if exists "chunks_members_select" on public.chunks;
create policy "chunks_members_select" on public.chunks
  for select using (
    public.is_brain_member(chunks.brain_id)
  );
drop policy if exists "chunks_owner_write" on public.chunks;
drop policy if exists "chunks_members_write" on public.chunks;
create policy "chunks_members_write" on public.chunks
  for insert with check (
    public.is_brain_member(chunks.brain_id)
  );

drop policy if exists "messages_owner_select" on public.messages;
drop policy if exists "messages_members_select" on public.messages;
create policy "messages_members_select" on public.messages
  for select using (
    public.is_brain_member(messages.brain_id)
  );
drop policy if exists "messages_owner_write" on public.messages;
drop policy if exists "messages_members_write" on public.messages;
create policy "messages_members_write" on public.messages
  for insert with check (
    public.is_brain_member(messages.brain_id)
  );

drop policy if exists "progress_owner_select" on public.progress;
drop policy if exists "progress_members_select" on public.progress;
create policy "progress_members_select" on public.progress
  for select using (
    public.is_brain_member(progress.brain_id)
  );
drop policy if exists "progress_owner_write" on public.progress;
drop policy if exists "progress_members_write" on public.progress;
create policy "progress_members_write" on public.progress
  for insert with check (
    public.is_brain_member(progress.brain_id)
  );
drop policy if exists "progress_owner_update" on public.progress;
drop policy if exists "progress_members_update" on public.progress;
create policy "progress_members_update" on public.progress
  for update using (
    public.is_brain_member(progress.brain_id)
  );

-- 5. match_chunks : filtrer par appartenance (membre OU propriétaire)
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
  join public.brains b on b.id = c.brain_id
  where c.brain_id = match_brain_id
    and (
      b.owner_id = auth.uid()
      or exists (
        select 1 from public.brain_members m
        where m.brain_id = c.brain_id and m.user_id = auth.uid()
      )
    )
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
