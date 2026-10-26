import { getAdminSession } from "@/lib/admin/session";
import { getCurrentUser } from "@/lib/auth/session";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const user = await getCurrentUser();
  // Só quem está em admin_users vê o atalho para o painel.
  const isAdmin = user ? Boolean(await getAdminSession().catch(() => null)) : false;
  return <Header user={user} isAdmin={isAdmin} />;
}
