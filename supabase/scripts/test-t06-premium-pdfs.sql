-- Teste da T-06 (migração 055). Rodar no SQL Editor do Supabase.
-- Nada é gravado: cria um registro de arquivo fictício no bucket privado e um
-- plano premium temporário, confere quem enxerga o arquivo e termina com um
-- erro proposital ("RESULTADO T-06") que desfaz tudo.
--
-- Esperado depois da 055:
--   bucket privado=sim | cms-images aceita svg=nao | visitante ve=0 | free ve=0 | assinante ve=1 | admin ve=1 | free envia=bloqueado
do $$
declare
  free_uid uuid;
  admin_uid uuid;
  n int;
  res text := '';
begin
  select case when public then 'nao' else 'sim' end into res
    from storage.buckets where id = 'cms-pdfs-premium';
  res := 'bucket privado=' || coalesce(res, 'NAO EXISTE');
  select count(*) into n from storage.buckets
   where id = 'cms-images' and 'image/svg+xml' = any(allowed_mime_types);
  res := res || ' | cms-images aceita svg=' || case when n > 0 then 'SIM' else 'nao' end;

  select p.id into free_uid from public.profiles p
   where p.plan = 'free'
     and not exists (select 1 from public.admin_users a where a.user_id = p.id)
     and not public.user_has_active_premium(p.id)
   limit 1;
  select a.user_id into admin_uid from public.admin_users a limit 1;

  insert into storage.objects (bucket_id, name) values ('cms-pdfs-premium', 'teste-t06/arquivo.pdf');

  -- visitante
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  execute 'set local role anon';
  select count(*) into n from storage.objects where bucket_id = 'cms-pdfs-premium';
  res := res || ' | visitante ve=' || n;
  execute 'reset role';

  if free_uid is null then
    res := res || ' | free: sem usuario para testar';
  else
    perform set_config('request.jwt.claims', json_build_object('sub', free_uid, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    select count(*) into n from storage.objects where bucket_id = 'cms-pdfs-premium';
    res := res || ' | free ve=' || n;
    begin
      insert into storage.objects (bucket_id, name) values ('cms-pdfs-premium', 'teste-t06/intruso.pdf');
      res := res || ' | free envia=PERMITIDO (vulneravel)';
    exception when insufficient_privilege then
      res := res || ' | free envia=bloqueado';
    end;
    execute 'reset role';

    update public.profiles set plan = 'premium_annual' where id = free_uid;
    perform set_config('request.jwt.claims', json_build_object('sub', free_uid, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    select count(*) into n from storage.objects where bucket_id = 'cms-pdfs-premium';
    res := res || ' | assinante ve=' || n;
    execute 'reset role';
  end if;

  if admin_uid is null then
    res := res || ' | admin: sem usuario para testar';
  else
    perform set_config('request.jwt.claims', json_build_object('sub', admin_uid, 'role', 'authenticated')::text, true);
    execute 'set local role authenticated';
    select count(*) into n from storage.objects where bucket_id = 'cms-pdfs-premium';
    res := res || ' | admin ve=' || n;
    execute 'reset role';
  end if;

  raise exception 'RESULTADO T-06: %', res;
end $$;
