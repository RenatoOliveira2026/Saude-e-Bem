import { getCurrentUser } from "@/lib/auth/session";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const user = await getCurrentUser();
  return <Header user={user} />;
}
