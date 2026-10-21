-- Omi.ai — Migration : Brain partagé par poste avec membres
-- À exécuter dans le SQL Editor Supabase, après migrate-owner.sql.

-- 1. Table des membres d'un Brain (qui appartient à quel poste)
create table if not exists public.brain_members (
  brain_id text not null references public.brains(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (brain_id, user_id)
);

-- 2. Le champ owner de brains devient le nom du poste (déjà le cas via name),
--    on garde owner_id pour l'auteur (premier membre).

-- 3. RLS sur brain_members : accès si membre du brain
alter table public.brain_members enable row level security;

create policy "brain_members_select" on public.brain_members
  for select using (
    exists (select 1 from public.brains b where b.id = brain_members.brain_id and b.owner_id = auth.uid())
    or user_id = auth.uid()
    or exists (
      select 1 from public.brain_members m2
      where m2.brain_id = brain_members.brain_id and m2.user_id = auth.uid()
    )
  );
create policy "brain_members_insert" on public.brain_members
  for insert with check (
    user_id = auth.uid()
  );

-- 4. Brains visibles par tous leurs membres (plus seulement le propriétaire)
drop policy if exists "brains_owner_select" on public.brains;
create policy "brains_members_or_owner_select" on public.brains
  for select using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.brain_members m
      where m.brain_id = brains.id and m.user_id = auth.uid()
    )
    -- un brain de poste reste découvrable pour rejoindre son poste :
    or scope = 'job'
  );
create policy "brains_owner_all" on public.brains
  for insert with check (auth.uid() = owner_id);
create policy "brains_owner_update" on public.brains
  for update using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.brain_members m
      where m.brain_id = brains.id and m.user_id = auth.uid()
    )
  );
create policy "brains_owner_delete" on public.brains
  for delete using (owner_id = auth.uid());

-- 5. Tables filles : accessible à tout membre du brain (pas seulement le propriétaire)
drop policy if exists "recordings_owner_select" on public.recordings;
create policy "recordings_members_select" on public.recordings
  for select using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = recordings.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
drop policy if exists "recordings_owner_write" on public.recordings;
create policy "recordings_members_write" on public.recordings
  for insert with check (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = recordings.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );

drop policy if exists "sops_owner_select" on public.sops;
create policy "sops_members_select" on public.sops
  for select using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = sops.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
drop policy if exists "sops_owner_write" on public.sops;
create policy "sops_members_write" on public.sops
  for insert with check (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = sops.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
create policy "sops_members_update" on public.sops
  for update using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = sops.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
create policy "sops_members_delete" on public.sops
  for delete using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = sops.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );

drop policy if exists "chunks_owner_select" on public.chunks;
create policy "chunks_members_select" on public.chunks
  for select using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = chunks.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
drop policy if exists "chunks_owner_write" on public.chunks;
create policy "chunks_members_write" on public.chunks
  for insert with check (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = chunks.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );

drop policy if exists "messages_owner_select" on public.messages;
create policy "messages_members_select" on public.messages
  for select using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = messages.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
drop policy if exists "messages_owner_write" on public.messages;
create policy "messages_members_write" on public.messages
  for insert with check (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = messages.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );

drop policy if exists "progress_owner_select" on public.progress;
create policy "progress_members_select" on public.progress
  for select using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = progress.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
drop policy if exists "progress_owner_write" on public.progress;
create policy "progress_members_write" on public.progress
  for insert with check (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = progress.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );
create policy "progress_members_update" on public.progress
  for update using (
    exists (
      select 1 from public.brains b
      left join public.brain_members m on m.brain_id = b.id and m.user_id = auth.uid()
      where b.id = progress.brain_id and (b.owner_id = auth.uid() or m.user_id = auth.uid())
    )
  );

-- 6. match_chunks : filtrer par appartenance (membre OU propriétaire)
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
