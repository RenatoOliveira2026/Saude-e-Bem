-- Teste da T-02 (migração 052). Rodar no SQL Editor do Supabase.
-- Nada é gravado: o bloco termina com um erro proposital ("RESULTADO T-02")
-- e o PostgreSQL desfaz todas as alterações. Leia o resultado na mensagem.
--
-- Esperado depois da 052:
--   usuario->plan: bloqueado | usuario->tier: bloqueado | usuario->nome: permitido | sistema->plan: permitido
do $$
declare uid uuid; res text := ''; n int;
begin
  select p.id into uid from public.profiles p
   where p.plan = 'free' and not exists (select 1 from public.admin_users a where a.user_id = p.id)
   limit 1;
  if uid is null then raise exception 'RESULTADO T-02: nenhum usuario free para testar'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  begin
    update public.profiles set plan = 'premium_annual' where id = uid;
    get diagnostics n = row_count;
    res := res || 'usuario->plan: ' || case when n > 0 then 'PERMITIDO (vulneravel)' else 'sem efeito' end || ' | ';
  exception when insufficient_privilege then res := res || 'usuario->plan: bloqueado | ';
  end;
  begin
    update public.profiles set membership_tier = 'premium' where id = uid;
    get diagnostics n = row_count;
    res := res || 'usuario->tier: ' || case when n > 0 then 'PERMITIDO (vulneravel)' else 'sem efeito' end || ' | ';
  exception when insufficient_privilege then res := res || 'usuario->tier: bloqueado | ';
  end;
  begin
    update public.profiles set name = name where id = uid;
    get diagnostics n = row_count;
    res := res || 'usuario->nome: ' || case when n > 0 then 'permitido' else 'sem efeito' end || ' | ';
  exception when others then res := res || 'usuario->nome: ERRO ' || sqlerrm || ' | ';
  end;
  execute 'reset role';
  begin
    update public.profiles set plan = 'premium_annual' where id = uid;
    get diagnostics n = row_count;
    res := res || 'sistema->plan: ' || case when n > 0 then 'permitido' else 'sem efeito' end;
  exception when others then res := res || 'sistema->plan: ERRO ' || sqlerrm;
  end;
  raise exception 'RESULTADO T-02: %', res;
end $$;
