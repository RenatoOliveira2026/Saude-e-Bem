/** E-mail do primeiro administrador da plataforma */
export const BOOTSTRAP_ADMIN_EMAIL = "renatoao2013@gmail.com";

/** SQL utilizado para conceder privilégios administrativos */
export const BOOTSTRAP_ADMIN_SQL = `-- Promover Super Admin (Saúde & Bem)
insert into public.admin_users (user_id, email, role)
select id, email, 'super_admin'::public.admin_role
from auth.users
where email = '${BOOTSTRAP_ADMIN_EMAIL}'
on conflict (user_id) do update
  set email = excluded.email,
      role = 'super_admin'::public.admin_role;`;
