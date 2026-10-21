-- Omi.ai — Vérification de l'isolation par utilisateur (idempotent, sans erreur)
-- Exécuter dans le SQL Editor : affiche ce qui est appliqué, ne modifie rien.

-- 1. Colonne owner_id présente ?
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'brains' and column_name = 'owner_id';

-- 2. Policies actives par table
select tablename, policyname
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3. Anciennes policies permissives encore présentes ? (ne doit rien retourner)
select tablename, policyname
from pg_policies
where schemaname = 'public' and policyname = 'public_access';

-- 4. Brains et leurs propriétaires (les null sont invisibles pour tous les comptes)
select id, name, owner_id from public.brains;
