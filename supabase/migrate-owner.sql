-- Obi.ai — Migration : isolation des données par utilisateur (RLS par auth.uid())
-- À exécuter dans le SQL Editor de Supabase, après schema.sql.

-- 1. Colonne owner_id sur brains (référence l'utilisateur Supabase Auth)
alter table public.brains
  add column if not exists owner_id uuid references auth.users(id) on delete cascade;

-- 2. Rattacher les Brains existants à un compte : aucune donnée n'est visible
--    tant que owner_id est null, donc rien à faire pour les données de test,
--    sauf si tu veux les garder (voir note en bas de fichier).

-- 3. Politiques RLS par utilisateur : on remplace les policies permissives.
drop policy if exists "public_access" on public.brains;
drop policy if exists "public_access" on public.recordings;
drop policy if exists "public_access" on public.sops;
drop policy if exists "public_access" on public.chunks;
drop policy if exists "public_access" on public.messages;
drop policy if exists "public_access" on public.progress;

-- brains : lisibles/éditables par le propriétaire
create policy "brains_owner_select" on public.brains
  for select using (auth.uid() = owner_id);
create policy "brains_owner_all" on public.brains
  for insert with check (auth.uid() = owner_id);
create policy "brains_owner_update" on public.brains
  for update using (auth.uid() = owner_id);
create policy "brains_owner_delete" on public.brains
  for delete using (auth.uid() = owner_id);

-- tables filles : accessibles si l'utilisateur est propriétaire du brain parent
create policy "recordings_owner_select" on public.recordings
  for select using (
    exists (select 1 from public.brains b where b.id = recordings.brain_id and b.owner_id = auth.uid())
  );
create policy "recordings_owner_write" on public.recordings
  for insert with check (
    exists (select 1 from public.brains b where b.id = recordings.brain_id and b.owner_id = auth.uid())
  );
create policy "recordings_owner_update" on public.recordings
  for update using (
    exists (select 1 from public.brains b where b.id = recordings.brain_id and b.owner_id = auth.uid())
  );

create policy "sops_owner_select" on public.sops
  for select using (
    exists (select 1 from public.brains b where b.id = sops.brain_id and b.owner_id = auth.uid())
  );
create policy "sops_owner_write" on public.sops
  for insert with check (
    exists (select 1 from public.brains b where b.id = sops.brain_id and b.owner_id = auth.uid())
  );
create policy "sops_owner_update" on public.sops
  for update using (
    exists (select 1 from public.brains b where b.id = sops.brain_id and b.owner_id = auth.uid())
  );

create policy "chunks_owner_select" on public.chunks
  for select using (
    exists (select 1 from public.brains b where b.id = chunks.brain_id and b.owner_id = auth.uid())
  );
create policy "chunks_owner_write" on public.chunks
  for insert with check (
    exists (select 1 from public.brains b where b.id = chunks.brain_id and b.owner_id = auth.uid())
  );

create policy "messages_owner_select" on public.messages
  for select using (
    exists (select 1 from public.brains b where b.id = messages.brain_id and b.owner_id = auth.uid())
  );
create policy "messages_owner_write" on public.messages
  for insert with check (
    exists (select 1 from public.brains b where b.id = messages.brain_id and b.owner_id = auth.uid())
  );

create policy "progress_owner_select" on public.progress
  for select using (
    exists (select 1 from public.brains b where b.id = progress.brain_id and b.owner_id = auth.uid())
  );
create policy "progress_owner_write" on public.progress
  for insert with check (
    exists (select 1 from public.brains b where b.id = progress.brain_id and b.owner_id = auth.uid())
  );
create policy "progress_owner_update" on public.progress
  for update using (
    exists (select 1 from public.brains b where b.id = progress.brain_id and b.owner_id = auth.uid())
  );

-- 4. match_chunks : filtrer par propriété en plus du brain_id
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
    and b.owner_id = auth.uid()
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- Note : les Brains de test existants (owner_id null) deviennent invisibles pour
-- tous les comptes. C'est le comportement sûr par défaut. Si tu veux les conserver
-- pour ton propre compte, exécute après création de ton compte utilisateur :
--   update public.brains set owner_id = 'TON_USER_UUID'
--   where owner_id is null;
