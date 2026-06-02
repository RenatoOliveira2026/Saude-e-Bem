-- Conceder acesso ao painel /admin (execute no SQL Editor do Supabase)
-- O usuário precisa já existir em auth.users (cadastro em /cadastro).

-- Super Admin (renatoao2013@gmail.com)
insert into public.admin_users (user_id, email, role)
select id, email, 'super_admin'::public.admin_role
from auth.users
where email = 'renatoao2013@gmail.com'
on conflict (user_id) do update
  set email = excluded.email,
      role = 'super_admin'::public.admin_role;

-- Admin comum (exemplo — substitua o e-mail)
-- insert into public.admin_users (user_id, email, role)
-- select id, email, 'admin'::public.admin_role
-- from auth.users
-- where email = 'outro@email.com'
-- on conflict (user_id) do update set email = excluded.email, role = excluded.role;
