-- Teste da T-05 (migrações 053 e 054). Rodar no SQL Editor do Supabase.
-- Nada é gravado: o bloco termina com um erro proposital ("RESULTADO T-05")
-- e o PostgreSQL desfaz tudo, inclusive o plano premium temporário dado a um
-- usuário free para simular um assinante. Leia o resultado na mensagem.
--
-- Esperado depois da 053 + 054 (P = protocolos premium publicados):
--   visitante: tabela premium=0, view premium=P, corpo premium na view=0, gratis na tabela>0, escrever na view=bloqueado
--   free:      tabela premium=0, view premium=P
--   assinante: tabela premium=P
--   admin:     tabela premium>=P (admin também vê rascunhos premium)
do $$
declare
  free_uid uuid;
  admin_uid uuid;
  premium_total int;
  n int;
  res text := '';
begin
  select count(*) into premium_total from public.protocols where status = 'published' and is_premium;
  res := 'P=' || premium_total || ' | ';

  select p.id into free_uid from public.profiles p
   where p.plan = 'free'
     and not exists (select 1 from public.admin_users a where a.user_id = p.id)
     and not public.user_has_active_premium(p.id)
   limit 1;
  select a.user_id into admin_uid from public.admin_users a limit 1;

  -- visitante (anon)
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  execute 'set local role anon';
  select count(*) into n from public.protocols where is_premium;
  res := res || 'visitante: tabela premium=' || n;
  select count(*) into n from public.protocols_public where is_premium;
  res := res || ', view premium=' || n;
  select count(*) into n from public.protocols_public
   where is_premium and (content <> '[]'::jsonb or steps <> '[]'::jsonb or benefits <> '[]'::jsonb);
  res := res || ', corpo premium na view=' || n;
  select count(*) into n from public.articles_public
   where is_premium and content <> '[]'::jsonb;
  res := res || ', corpo artigo premium na view=' || n;
  select count(*) into n from public.protocols where not is_premium;
  res := res || ', gratis na tabela=' || n;
  begin
    update public.protocols_public set title = title;
    res := res || ', escrever na view=PERMITIDO (vulneravel)';
  exception when insufficient_privilege or object_not_in_prerequisite_state or feature_not_supported then
    res := res || ', escrever na view=bloqueado';
  end;
  execute 'reset role';

  -- usuário free
  if free_uid is null then
    res := res || ' | free: sem usuario para testar';
  else
    perform set_config('request.jwt.claims', json_build_object('sub', free_uid, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    select count(*) into n from public.protocols where is_premium;
    res := res || ' | free: tabela premium=' || n;
    select count(*) into n from public.protocols_public where is_premium;
    res := res || ', view premium=' || n;
    execute 'reset role';

    -- o mesmo usuário como assinante (desfeito no fim)
    update public.profiles set plan = 'premium_annual' where id = free_uid;
    perform set_config('request.jwt.claims', json_build_object('sub', free_uid, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    select count(*) into n from public.protocols where is_premium;
    res := res || ' | assinante: tabela premium=' || n;
    execute 'reset role';
  end if;

  -- admin
  if admin_uid is null then
    res := res || ' | admin: sem usuario para testar';
  else
    perform set_config('request.jwt.claims', json_build_object('sub', admin_uid, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    select count(*) into n from public.protocols where is_premium;
    res := res || ' | admin: tabela premium=' || n;
    execute 'reset role';
  end if;

  raise exception 'RESULTADO T-05: %', res;
end $$;
