import UsersManager from "@/components/admin/UsersManager";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  return <UsersManager isAdmin={session?.role === "admin"} />;
}
